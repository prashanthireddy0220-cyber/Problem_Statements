const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { 
  SystemSettings, Team, TeamLead, ProblemStatement, ProblemSelection, 
  Participant, Volunteer, Admin, ActiveSession, AuditLog, AttendanceSession 
} = require('../models/Schema');
const { authenticateToken, requireRole } = require('../middleware/auth');

// 1. UPDATE TIMER SETTINGS & MODULE TOGGLES
router.post('/settings', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { 
      readingDurationMinutes, selectionDurationMinutes, 
      teamLeadAccessEnabled, volunteerAccessEnabled, problemSelectionEnabled, attendanceEnabled,
      problemStatementsReleased, selectionScheduledStart 
    } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    if (readingDurationMinutes !== undefined) settings.readingDurationMinutes = Number(readingDurationMinutes);
    if (selectionDurationMinutes !== undefined) settings.selectionDurationMinutes = Number(selectionDurationMinutes);
    if (teamLeadAccessEnabled !== undefined) settings.teamLeadAccessEnabled = Boolean(teamLeadAccessEnabled);
    if (volunteerAccessEnabled !== undefined) settings.volunteerAccessEnabled = Boolean(volunteerAccessEnabled);
    if (problemSelectionEnabled !== undefined) settings.problemSelectionEnabled = Boolean(problemSelectionEnabled);
    if (attendanceEnabled !== undefined) settings.attendanceEnabled = Boolean(attendanceEnabled);
    if (problemStatementsReleased !== undefined) settings.problemStatementsReleased = Boolean(problemStatementsReleased);
    if (selectionScheduledStart !== undefined) {
      settings.selectionScheduledStart = selectionScheduledStart ? new Date(selectionScheduledStart) : null;
    }

    // If a phase is actively running, dynamically update active end time
    if (settings.currentPhase === 'READING' && settings.readingStartedAt && readingDurationMinutes !== undefined) {
      settings.readingEndsAt = new Date(new Date(settings.readingStartedAt).getTime() + Number(readingDurationMinutes) * 60 * 1000);
    }
    if ((settings.currentPhase === 'SELECTION' || settings.currentPhase === 'SELECTION_OPEN') && settings.selectionStartedAt && selectionDurationMinutes !== undefined) {
      settings.selectionEndsAt = new Date(new Date(settings.selectionStartedAt).getTime() + Number(selectionDurationMinutes) * 60 * 1000);
    }

    await settings.save();

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'UPDATE_SYSTEM_SETTINGS',
      metadata: req.body
    });

    return res.json({ message: 'System settings updated successfully.', settings });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update system settings.' });
  }
});

// 2. CONTROL SELECTION SESSION PHASE (Release / Schedule / Open Now / Close / Reset)
router.post('/session-control', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { action, scheduledTime } = req.body; // 'RELEASE_PROBLEMS', 'UNRELEASE_PROBLEMS', 'SCHEDULE_SELECTION', 'OPEN_NOW', 'CLOSE', 'RESET'

    let settings = await SystemSettings.findOne();
    if (!settings) settings = new SystemSettings();

    const now = new Date();

    if (action === 'RELEASE_PROBLEMS') {
      settings.problemStatementsReleased = true;
    } else if (action === 'UNRELEASE_PROBLEMS') {
      settings.problemStatementsReleased = false;
      settings.selectionManualState = 'NONE';
    } else if (action === 'SCHEDULE_SELECTION') {
      settings.problemStatementsReleased = true;
      settings.selectionScheduledStart = scheduledTime ? new Date(scheduledTime) : null;
      settings.selectionManualState = 'NONE';
      if (scheduledTime) {
        settings.selectionEndsAt = new Date(new Date(scheduledTime).getTime() + (settings.selectionDurationMinutes || 5) * 60 * 1000);
      }
    } else if (action === 'OPEN_NOW' || action === 'START_SELECTION') {
      settings.problemStatementsReleased = true;
      settings.selectionManualState = 'OPEN';
      settings.selectionStartedAt = now;
      settings.selectionEndsAt = new Date(now.getTime() + (settings.selectionDurationMinutes || 5) * 60 * 1000);
    } else if (action === 'CLOSE' || action === 'LOCK' || action === 'END_SESSION') {
      settings.selectionManualState = 'CLOSED';
    } else if (action === 'START_READING') {
      settings.problemStatementsReleased = true;
      settings.selectionManualState = 'NONE';
      const readingEnd = new Date(now.getTime() + settings.readingDurationMinutes * 60 * 1000);
      settings.readingStartedAt = now;
      settings.readingEndsAt = readingEnd;
      settings.selectionScheduledStart = readingEnd;
    } else if (action === 'RESET') {
      settings.problemStatementsReleased = false;
      settings.selectionScheduledStart = null;
      settings.selectionManualState = 'NONE';
      settings.currentPhase = 'NOT_RELEASED';
      settings.readingStartedAt = null;
      settings.readingEndsAt = null;
      settings.selectionStartedAt = null;
      settings.selectionEndsAt = null;
    } else {
      return res.status(400).json({ error: 'Invalid session control action.' });
    }

    await settings.save();

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: `SESSION_${action}`,
      target: settings.currentPhase || action
    });

    return res.json({ message: `Session transition '${action}' applied successfully.`, settings });
  } catch (err) {
    console.error('Session control error:', err);
    return res.status(500).json({ error: 'Failed to update session state.' });
  }
});

router.get('/live-activity', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const settings = await SystemSettings.findOne() || {};
    const authorizedTeams = require('../data/teamsData');
    const validTeamIds = authorizedTeams.map(t => t.teamId);
    const validRegNums = authorizedTeams.map(t => t.regNum);

    // Auto-purge any legacy/invalid/unknown teams from MongoDB immediately on fetch
    await Team.deleteMany({
      $or: [
        { name: { $nin: validTeamIds } },
        { teamLeadRegNum: { $nin: validRegNums } },
        { teamLeadRegNum: { $exists: false } },
        { teamLeadRegNum: null },
        { teamLeadRegNum: '' }
      ]
    });

    const teams = await Team.find({ name: { $in: validTeamIds } }).sort({ name: 1 });
    const teamLeads = await TeamLead.find({ registrationNumber: { $in: validRegNums } });
    const activeSessions = await ActiveSession.find({ role: 'TEAM_LEAD' });
    const problemStatements = await ProblemStatement.find();

    const activeRegNums = new Set(activeSessions.map(s => s.registrationNumber));

    const activity = teams
      .filter(team => team.name && team.name.startsWith('ALPHA-') && team.teamLeadRegNum)
      .map(team => {
        const lead = teamLeads.find(l => l.registrationNumber === team.teamLeadRegNum);
        const isOnline = lead && activeRegNums.has(lead.registrationNumber);

        let statusStr = '⚪ Not Started';
        if (team.selectionConfirmed) {
          statusStr = '✅ Selection Completed';
        } else if (isOnline) {
          statusStr = (settings.currentPhase === 'SELECTION_OPEN' || settings.currentPhase === 'SELECTION') ? '🟠 Selecting' : '🟢 Viewing';
        }

        return {
          teamId: team._id,
          teamName: team.name,
          teamLeadRegNum: team.teamLeadRegNum,
          teamLeadName: lead ? lead.name : `Team Lead (${team.name})`,
          college: team.college || 'KARE',
          isOnline,
          statusStr,
          selectedProblemCode: team.selectedProblemCode,
          selectionConfirmed: team.selectionConfirmed,
          selectedAt: team.selectedAt
        };
      });

    const totalProblems = problemStatements.length;
    const fullProblemsCount = problemStatements.filter(p => p.selectedCount >= (p.maxTeamCapacity || 2)).length;

    const summary = {
      totalTeams: activity.length,
      teamsLoggedIn: activeSessions.length,
      teamsReading: activity.filter(a => a.statusStr.includes('Viewing')).length,
      teamsSelecting: activity.filter(a => a.statusStr.includes('Selecting')).length,
      selectionsCompleted: activity.filter(a => a.selectionConfirmed).length,
      totalProblems,
      fullProblemsCount,
      problemStatementsReleased: Boolean(settings.problemStatementsReleased),
      selectionScheduledStart: settings.selectionScheduledStart,
      selectionManualState: settings.selectionManualState || 'NONE',
      currentPhase: settings.currentPhase || 'NOT_RELEASED'
    };

    return res.json({ summary, teams: activity, problemStatements });
  } catch (err) {
    console.error('Live activity error:', err);
    return res.status(500).json({ error: 'Failed to fetch live activity data.' });
  }
});

// 4. ADMIN: RESET TEAM PROBLEM SELECTION
router.post('/teams/:teamId/reset-selection', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    if (team.selectedProblemId) {
      // Decrement selected count on problem statement
      await ProblemStatement.findByIdAndUpdate(team.selectedProblemId, { $inc: { selectedCount: -1 } });
    }

    team.selectedProblemId = null;
    team.selectedProblemCode = null;
    team.selectionConfirmed = false;
    team.selectedAt = null;
    await team.save();

    await ProblemSelection.deleteMany({ teamId: team._id });

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'RESET_TEAM_SELECTION',
      target: team.name
    });

    return res.json({ message: `Selection reset for team ${team.name}.` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset team selection.' });
  }
});

// 5. ADMIN: REVOKE TEAM LEAD SINGLE-DEVICE SESSION
router.post('/team-leads/:regNum/revoke', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const cleanRegNum = req.params.regNum.trim().toUpperCase();
    const teamLead = await TeamLead.findOne({ registrationNumber: cleanRegNum });
    if (!teamLead) {
      return res.status(404).json({ error: 'Team lead not found.' });
    }

    teamLead.activeSessionId = null;
    await teamLead.save();

    await ActiveSession.deleteMany({ registrationNumber: cleanRegNum });

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'REVOKE_TEAM_LEAD_SESSION',
      target: cleanRegNum
    });

    return res.json({ message: `Active session revoked for Team Lead ${cleanRegNum}. User logged out immediately.` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to revoke team lead session.' });
  }
});

// 6. ADMIN: GET AUDIT LOGS
router.get('/audit-logs', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    return res.json({ logs });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});

// 7. SEED INITIAL DEMO DATASET
router.post('/seed', async (req, res) => {
  try {
    // A. Seed Admin
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const passHash = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        passwordHash: passHash,
        name: 'Head Organizer (Admin)',
        role: 'ADMIN'
      });
    }

    // B. Seed Volunteer
    const volExists = await Volunteer.findOne({ username: 'volunteer1' });
    if (!volExists) {
      const volPassHash = await bcrypt.hash('vol123', 10);
      await Volunteer.create({
        username: 'volunteer1',
        passwordHash: volPassHash,
        name: 'Sarah Connor (Volunteer)',
        phone: '+91 9876543210'
      });
    }

    // C. Seed System Settings
    let settings = await SystemSettings.findOne();
    if (!settings) {
      await SystemSettings.create({
        readingDurationMinutes: 30,
        selectionDurationMinutes: 5,
        currentPhase: 'NOT_STARTED',
        teamLeadAccessEnabled: true,
        volunteerAccessEnabled: true,
        problemSelectionEnabled: true,
        attendanceEnabled: true
      });
    }

    // D. Seed Problem Statements (All 43 Problem Statements)
    const psCount = await ProblemStatement.countDocuments();
    if (psCount === 0) {
      const problemStatementsData = require('../data/problemStatements');
      await ProblemStatement.insertMany(problemStatementsData);
    }

    // E. Seed Authorized Teams & Registered Team Leads (ALPHA-001 to ALPHA-060)
    try {
      const indexes = await Team.collection.indexes();
      for (const idx of indexes) {
        if (idx.name !== '_id_' && idx.name !== 'name_1') {
          await Team.collection.dropIndex(idx.name).catch(() => {});
        }
      }
    } catch (e) {}

    const authorizedTeams = require('../data/teamsData');
    const validTeamIds = authorizedTeams.map(t => t.teamId);
    const validRegNums = authorizedTeams.map(t => t.regNum);

    // 1. Delete Team documents where name is NOT in validTeamIds OR teamLeadRegNum is NOT in validRegNums OR teamLeadRegNum is missing
    await Team.deleteMany({
      $or: [
        { name: { $nin: validTeamIds } },
        { teamLeadRegNum: { $nin: validRegNums } },
        { teamLeadRegNum: { $exists: false } },
        { teamLeadRegNum: null },
        { teamLeadRegNum: '' }
      ]
    });

    // 2. Delete TeamLead documents where registrationNumber is NOT in validRegNums OR missing
    await TeamLead.deleteMany({
      $or: [
        { registrationNumber: { $nin: validRegNums } },
        { registrationNumber: { $exists: false } },
        { registrationNumber: null },
        { registrationNumber: '' }
      ]
    });

    // 3. Delete Participant documents where registrationNumber is NOT in validRegNums
    await Participant.deleteMany({
      $or: [
        { registrationNumber: { $nin: validRegNums } },
        { registrationNumber: { $exists: false } },
        { registrationNumber: null }
      ]
    });

    for (const item of authorizedTeams) {
      // Deduplicate teams with duplicate names if any exist
      const teamDocs = await Team.find({ name: item.teamId });
      let teamDoc = null;
      if (teamDocs.length > 0) {
        teamDoc = teamDocs.find(t => t.selectionConfirmed) || teamDocs[0];
        for (const doc of teamDocs) {
          if (doc._id.toString() !== teamDoc._id.toString()) {
            await Team.findByIdAndDelete(doc._id);
          }
        }
      }

      if (!teamDoc) {
        teamDoc = await Team.create({
          name: item.teamId,
          teamId: item.teamId,
          teamLeadRegNum: item.regNum,
          college: 'KARE',
          department: 'CSE',
          members: [
            { name: `Team Lead (${item.teamId})`, registrationNumber: item.regNum, role: 'LEAD', phone: '9876543210' },
            { name: `Member 1 (${item.teamId})`, registrationNumber: `${item.regNum}-M1`, role: 'MEMBER', phone: '9876543211' }
          ]
        });
      } else {
        teamDoc.teamId = item.teamId;
        teamDoc.teamLeadRegNum = item.regNum;
        if (!teamDoc.college) teamDoc.college = 'KARE';
        await teamDoc.save();
      }

      // Deduplicate TeamLeads for regNum
      const leadDocs = await TeamLead.find({ registrationNumber: item.regNum });
      let leadDoc = null;
      if (leadDocs.length > 0) {
        leadDoc = leadDocs[0];
        for (const doc of leadDocs) {
          if (doc._id.toString() !== leadDoc._id.toString()) {
            await TeamLead.findByIdAndDelete(doc._id);
          }
        }
      }

      if (!leadDoc) {
        leadDoc = await TeamLead.create({
          registrationNumber: item.regNum,
          name: `Team Lead (${item.teamId})`,
          teamId: teamDoc._id,
          phone: '9876543210',
          email: `${item.teamId.toLowerCase()}@hackathon.edu`
        });
      } else {
        leadDoc.teamId = teamDoc._id;
        leadDoc.name = `Team Lead (${item.teamId})`;
        await leadDoc.save();
      }

      // Ensure Participant doc exists
      let partDoc = await Participant.findOne({ registrationNumber: item.regNum });
      if (!partDoc) {
        await Participant.create({
          registrationNumber: item.regNum,
          name: `Team Lead (${item.teamId})`,
          teamName: item.teamId,
          college: 'KARE',
          department: 'CSE',
          isTeamLead: true,
          qrCodeData: item.regNum
        });
      } else {
        partDoc.teamName = item.teamId;
        partDoc.name = `Team Lead (${item.teamId})`;
        await partDoc.save();
      }
    }

    // F. Seed Sample Attendance Session
    const sessCount = await AttendanceSession.countDocuments();
    if (sessCount === 0) {
      await AttendanceSession.create({
        sessionId: 'SESS-101',
        sessionName: 'Day 1 Morning Keynote',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00 AM',
        endTime: '10:30 AM',
        status: 'ACTIVE',
        createdBy: 'admin'
      });
    }

    return res.json({ message: 'Seed data generated successfully!' });
  } catch (err) {
    console.error('Seed error:', err);
    return res.status(500).json({ error: 'Failed to seed demo data.' });
  }
});

module.exports = router;
