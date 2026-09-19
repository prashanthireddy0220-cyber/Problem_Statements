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
    const { readingDurationMinutes, selectionDurationMinutes, teamLeadAccessEnabled, volunteerAccessEnabled, problemSelectionEnabled, attendanceEnabled } = req.body;

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

    // If a phase is actively running, dynamically update active end time
    if (settings.currentPhase === 'READING' && settings.readingStartedAt && readingDurationMinutes !== undefined) {
      settings.readingEndsAt = new Date(new Date(settings.readingStartedAt).getTime() + Number(readingDurationMinutes) * 60 * 1000);
    }
    if (settings.currentPhase === 'SELECTION' && settings.selectionStartedAt && selectionDurationMinutes !== undefined) {
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

// 2. CONTROL SELECTION SESSION PHASE (Start Reading / Start Selection / Lock / Reset)
router.post('/session-control', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { action } = req.body; // 'START_READING', 'START_SELECTION', 'LOCK', 'RESET'

    let settings = await SystemSettings.findOne();
    if (!settings) settings = new SystemSettings();

    const now = new Date();

    if (action === 'START_READING') {
      const readingEnd = new Date(now.getTime() + settings.readingDurationMinutes * 60 * 1000);
      settings.currentPhase = 'READING';
      settings.readingStartedAt = now;
      settings.readingEndsAt = readingEnd;
      settings.selectionStartedAt = null;
      settings.selectionEndsAt = null;
    } else if (action === 'START_SELECTION') {
      const selectionEnd = new Date(now.getTime() + settings.selectionDurationMinutes * 60 * 1000);
      settings.currentPhase = 'SELECTION';
      settings.selectionStartedAt = now;
      settings.selectionEndsAt = selectionEnd;
    } else if (action === 'LOCK' || action === 'END_SESSION') {
      settings.currentPhase = 'CLOSED';
    } else if (action === 'RESET') {
      settings.currentPhase = 'NOT_STARTED';
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
      target: settings.currentPhase
    });

    return res.json({ message: `Session transition '${action}' applied successfully.`, settings });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update session state.' });
  }
});

// 3. GET LIVE MONITORING & TEAM SELECTION STATUSES
router.get('/live-activity', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const settings = await SystemSettings.findOne() || {};
    const teams = await Team.find().sort({ name: 1 });
    const teamLeads = await TeamLead.find();
    const activeSessions = await ActiveSession.find({ role: 'TEAM_LEAD' });

    const activeRegNums = new Set(activeSessions.map(s => s.registrationNumber));

    const activity = teams.map(team => {
      const lead = teamLeads.find(l => l.registrationNumber === team.teamLeadRegNum);
      const isOnline = lead && activeRegNums.has(lead.registrationNumber);

      let statusStr = '⚪ Not Started';
      if (team.selectionConfirmed) {
        statusStr = '✅ Selection Completed';
      } else if (isOnline) {
        statusStr = settings.currentPhase === 'SELECTION' ? '🟠 Selecting' : '🟢 Reading';
      }

      return {
        teamId: team._id,
        teamName: team.name,
        teamLeadRegNum: team.teamLeadRegNum,
        teamLeadName: lead ? lead.name : 'Unknown',
        college: team.college,
        isOnline,
        statusStr,
        selectedProblemCode: team.selectedProblemCode,
        selectionConfirmed: team.selectionConfirmed,
        selectedAt: team.selectedAt
      };
    });

    const summary = {
      totalTeams: teams.length,
      teamsLoggedIn: activeSessions.length,
      teamsReading: activity.filter(a => a.statusStr.includes('Reading')).length,
      teamsSelecting: activity.filter(a => a.statusStr.includes('Selecting')).length,
      selectionsCompleted: activity.filter(a => a.selectionConfirmed).length,
      currentPhase: settings.currentPhase || 'NOT_STARTED'
    };

    return res.json({ summary, teams: activity });
  } catch (err) {
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

    // E. Seed Sample Teams & Registered Team Leads
    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      const sampleTeams = [
        { regNum: 'HACK2026-001', leadName: 'Alex Rivera', teamName: 'ALPHA', college: 'KARE' },
        { regNum: 'HACK2026-002', leadName: 'Priya Sharma', teamName: 'CYBER_DRAGONS', college: 'KARE' },
        { regNum: 'HACK2026-003', leadName: 'David Chen', teamName: 'NEURAL_NINJAS', college: 'IIT Madras' },
        { regNum: 'HACK2026-004', leadName: 'Ananya Reddy', teamName: 'QUANTUM_LEAP', college: 'KARE' },
        { regNum: 'HACK2026-005', leadName: 'Marcus Vance', teamName: 'BYTE_CODERS', college: 'NIT Trichy' }
      ];

      for (const item of sampleTeams) {
        const teamDoc = await Team.create({
          name: item.teamName,
          teamLeadRegNum: item.regNum,
          college: item.college,
          department: 'CSE',
          members: [
            { name: item.leadName, registrationNumber: item.regNum, role: 'LEAD', phone: '9876543210' },
            { name: `Member 1 (${item.teamName})`, registrationNumber: `${item.regNum}-M1`, role: 'MEMBER', phone: '9876543211' },
            { name: `Member 2 (${item.teamName})`, registrationNumber: `${item.regNum}-M2`, role: 'MEMBER', phone: '9876543212' }
          ]
        });

        await TeamLead.create({
          registrationNumber: item.regNum,
          name: item.leadName,
          teamId: teamDoc._id,
          phone: '9876543210',
          email: `${item.regNum.toLowerCase()}@hackathon.edu`
        });

        // Add Participants for attendance QR
        await Participant.create({
          registrationNumber: item.regNum,
          name: item.leadName,
          teamName: item.teamName,
          college: item.college,
          department: 'CSE',
          isTeamLead: true,
          qrCodeData: item.regNum
        });

        await Participant.create({
          registrationNumber: `${item.regNum}-M1`,
          name: `Member 1 (${item.teamName})`,
          teamName: item.teamName,
          college: item.college,
          department: 'CSE',
          isTeamLead: false,
          qrCodeData: `${item.regNum}-M1`
        });
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
