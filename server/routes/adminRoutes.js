const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { 
  SystemSettings, Team, TeamLead, ProblemStatement, ProblemSelection, 
  Participant, Volunteer, Admin, ActiveSession, AuditLog, AttendanceSession, Attendance,
  Evaluation, EvaluationRound, Reviewer, RoundReviewerNormalization
} = require('../models/Schema');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRawScore, recalculateRoundReviewerNormalization, getLeaderboardData } = require('../services/normalizationService');

// 1. UPDATE TIMER SETTINGS & MODULE TOGGLES
router.post('/settings', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { 
      releaseDelayMinutes, selectionDelayMinutes, readingDurationMinutes, selectionDurationMinutes, 
      teamLeadAccessEnabled, volunteerAccessEnabled, problemSelectionEnabled, attendanceEnabled,
      problemStatementsReleased, selectionScheduledStart 
    } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    if (releaseDelayMinutes !== undefined) settings.releaseDelayMinutes = Number(releaseDelayMinutes);
    if (selectionDelayMinutes !== undefined) {
      settings.selectionDelayMinutes = Number(selectionDelayMinutes);
      settings.readingDurationMinutes = Number(selectionDelayMinutes);
    } else if (readingDurationMinutes !== undefined) {
      settings.readingDurationMinutes = Number(readingDurationMinutes);
      settings.selectionDelayMinutes = Number(readingDurationMinutes);
    }
    if (selectionDurationMinutes !== undefined) settings.selectionDurationMinutes = Number(selectionDurationMinutes);
    if (teamLeadAccessEnabled !== undefined) settings.teamLeadAccessEnabled = Boolean(teamLeadAccessEnabled);
    if (volunteerAccessEnabled !== undefined) settings.volunteerAccessEnabled = Boolean(volunteerAccessEnabled);
    if (problemSelectionEnabled !== undefined) settings.problemSelectionEnabled = Boolean(problemSelectionEnabled);
    if (attendanceEnabled !== undefined) settings.attendanceEnabled = Boolean(attendanceEnabled);
    if (problemStatementsReleased !== undefined) settings.problemStatementsReleased = Boolean(problemStatementsReleased);
    if (selectionScheduledStart !== undefined) {
      settings.selectionScheduledStart = selectionScheduledStart ? new Date(selectionScheduledStart) : null;
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

// 2. CONTROL SELECTION SESSION PHASE (Start Timed Round / Release / Schedule / Open Now / Close / Reset)
router.post('/session-control', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { action, scheduledTime, releaseDelayMinutes, selectionDelayMinutes, selectionDurationMinutes } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) settings = new SystemSettings();

    const now = new Date();

    if (action === 'START_ROUND') {
      const relDelay = Number(releaseDelayMinutes ?? settings.releaseDelayMinutes ?? 5);
      const selDelay = Number(selectionDelayMinutes ?? settings.selectionDelayMinutes ?? settings.readingDurationMinutes ?? 2);
      const selDur = Number(selectionDurationMinutes ?? settings.selectionDurationMinutes ?? 10);

      settings.releaseDelayMinutes = relDelay;
      settings.selectionDelayMinutes = selDelay;
      settings.selectionDurationMinutes = selDur;
      settings.readingDurationMinutes = selDelay;

      settings.roundStartedAt = now;
      settings.releaseScheduledAt = new Date(now.getTime() + relDelay * 60 * 1000);
      settings.selectionScheduledStart = new Date(settings.releaseScheduledAt.getTime() + selDelay * 60 * 1000);
      settings.selectionEndsAt = new Date(settings.selectionScheduledStart.getTime() + selDur * 60 * 1000);

      settings.roundStatus = 'ACTIVE';
      settings.problemStatementsReleased = false;
      settings.releaseManualState = 'NONE';
      settings.selectionManualState = 'NONE';
      settings.currentPhase = 'ROUND_STARTED_UNRELEASED';
    } else if (action === 'RELEASE_PROBLEMS' || action === 'RELEASE_NOW') {
      settings.releaseManualState = 'RELEASED';
      settings.problemStatementsReleased = true;
    } else if (action === 'UNRELEASE_PROBLEMS') {
      settings.releaseManualState = 'UNRELEASED';
      settings.problemStatementsReleased = false;
      settings.selectionManualState = 'NONE';
    } else if (action === 'SCHEDULE_SELECTION') {
      settings.releaseManualState = 'RELEASED';
      settings.problemStatementsReleased = true;
      settings.selectionScheduledStart = scheduledTime ? new Date(scheduledTime) : null;
      settings.selectionManualState = 'NONE';
      if (scheduledTime) {
        settings.selectionEndsAt = new Date(new Date(scheduledTime).getTime() + (settings.selectionDurationMinutes || 10) * 60 * 1000);
      }
    } else if (action === 'OPEN_NOW' || action === 'START_SELECTION') {
      settings.releaseManualState = 'RELEASED';
      settings.problemStatementsReleased = true;
      settings.selectionManualState = 'OPEN';
      settings.selectionStartedAt = now;
      settings.selectionEndsAt = new Date(now.getTime() + (settings.selectionDurationMinutes || 10) * 60 * 1000);
    } else if (action === 'CLOSE' || action === 'LOCK' || action === 'END_SESSION') {
      settings.selectionManualState = 'CLOSED';
    } else if (action === 'RESET') {
      settings.roundStatus = 'IDLE';
      settings.problemStatementsReleased = false;
      settings.releaseManualState = 'NONE';
      settings.selectionManualState = 'NONE';
      settings.currentPhase = 'NOT_RELEASED';
      settings.roundStartedAt = null;
      settings.releaseScheduledAt = null;
      settings.selectionScheduledStart = null;
      settings.selectionEndsAt = null;
      settings.readingStartedAt = null;
      settings.readingEndsAt = null;
      settings.selectionStartedAt = null;

      if (req.body.resetAllocations) {
        await ProblemSelection.deleteMany({});
        await ProblemStatement.updateMany({}, { $set: { selectedCount: 0 } });
        await Team.updateMany({}, { $set: { selectedProblemId: null, selectedProblemCode: null, selectionConfirmed: false, selectedAt: null } });
      }
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
    
    const teams = await Team.find();
    const teamLeads = await TeamLead.find();
    const activeSessions = await ActiveSession.find({ role: 'TEAM_LEAD' });
    const activeRegNums = new Set((activeSessions || []).map(s => s.userId || s.registrationNumber || s.regNum));
    const problemStatements = await ProblemStatement.find();

    let attendanceRecords = [];
    try {
      if (typeof Attendance !== 'undefined' && Attendance && typeof Attendance.find === 'function') {
        attendanceRecords = await Attendance.find();
      }
    } catch (e) {
      attendanceRecords = [];
    }

    const attendanceByTeam = {};
    (attendanceRecords || []).forEach(r => {
      if (r && r.teamName) {
        attendanceByTeam[r.teamName] = (attendanceByTeam[r.teamName] || 0) + 1;
      }
    });

    const config = require('../config/env');
    const appBaseUrl = config.FRONTEND_URL || 'http://localhost:5173';

    // Map ALL 60 teams from authorized dataset so no team is ever missing in Admin Portal
    const activity = authorizedTeams.map(item => {
      const dbTeam = teams.find(t => t.name === item.teamId || t.teamId === item.teamId || t.teamLeadRegNum === item.regNum || t.name === item.teamName);
      const dbLead = teamLeads.find(l => l.registrationNumber === item.regNum);
      const isOnline = activeRegNums.has(item.regNum);
      const members = (dbTeam?.members && dbTeam.members.length > 0) ? dbTeam.members : (item.members || []);

      let statusStr = '⚪ Not Started';
      if (dbTeam?.selectionConfirmed || dbTeam?.selectedProblemCode) {
        statusStr = '✅ Selection Completed';
      } else if (isOnline) {
        statusStr = (settings.currentPhase === 'SELECTION_OPEN' || settings.currentPhase === 'SELECTION') ? '🟠 Selecting' : '🟢 Viewing';
      }

      const probCode = dbTeam?.selectedProblemCode && dbTeam.selectedProblemCode !== 'null' ? dbTeam.selectedProblemCode : 'Not Selected';
      const matchedProblem = probCode !== 'Not Selected' ? problemStatements.find(p => p.problemId === probCode) : null;

      const teamQrToken = dbTeam?.teamQrToken || `TQ-${item.teamId}-${item.regNum.slice(-4)}`;
      const eventPassQrToken = dbTeam?.eventPassQrToken || `EP-${item.teamId}-${item.regNum.slice(-4)}`;

      return {
        _id: dbTeam?._id || item.teamId,
        teamId: item.teamId,
        teamCode: item.teamId,
        teamName: item.teamName || item.teamId, // Official Team Name (e.g. INNOVATES)
        teamLeadRegNum: item.regNum,
        teamLeadName: dbLead?.name || item.leadName || `Team Lead (${item.teamId})`, // Official Lead Name
        college: dbTeam?.college || 'KARE',
        department: dbTeam?.department || 'CSE',
        isOnline,
        statusStr,
        selectedProblemCode: probCode,
        selectedProblemTitle: matchedProblem?.title || '',
        selectedProblem: matchedProblem || null,
        selectionConfirmed: Boolean(dbTeam?.selectionConfirmed) || (probCode !== 'Not Selected'),
        selectedAt: dbTeam?.selectedAt || null,
        membersCount: members.length,
        members: members,
        teamQrToken: teamQrToken,
        publicQrUrl: `${appBaseUrl}/team/${teamQrToken}`,
        eventPassQrToken: eventPassQrToken,
        eventPassStatus: dbTeam?.eventPassStatus || 'ISSUED',
        registrationStatus: dbTeam?.registrationStatus || 'CONFIRMED',
        attendanceCount: attendanceByTeam[item.teamId] || attendanceByTeam[item.teamName] || 0
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

// 5b. GET ALL TEAMS FOR ADMIN MANAGEMENT (Alias Endpoint)
router.get('/teams', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const teams = await Team.find();
    const teamLeads = await TeamLead.find();
    let attendanceRecords = [];
    try {
      if (typeof Attendance !== 'undefined' && Attendance && typeof Attendance.find === 'function') {
        attendanceRecords = await Attendance.find();
      }
    } catch (e) {
      attendanceRecords = [];
    }

    const config = require('../config/env');
    const appBaseUrl = config.FRONTEND_URL || 'http://localhost:5173';
    const AUTHORIZED_TEAMS = require('../data/teamsData');

    const attendanceByTeam = {};
    (attendanceRecords || []).forEach(r => {
      if (r && r.teamName) {
        attendanceByTeam[r.teamName] = (attendanceByTeam[r.teamName] || 0) + 1;
      }
    });

    const detailedTeams = AUTHORIZED_TEAMS.map((item) => {
      const dbTeam = teams.find(t => t.name === item.teamId || t.teamId === item.teamId || t.teamLeadRegNum === item.regNum);
      const dbLead = teamLeads.find(l => l.registrationNumber === item.regNum);
      const members = (dbTeam?.members && dbTeam.members.length > 0) ? dbTeam.members : item.members;
      
      const teamQrToken = dbTeam?.teamQrToken || `TQ-${item.teamId}-${item.regNum.slice(-4)}`;
      const eventPassQrToken = dbTeam?.eventPassQrToken || `EP-${item.teamId}-${item.regNum.slice(-4)}`;

      return {
        _id: dbTeam?._id || item.teamId,
        teamId: item.teamId,
        teamName: item.teamName,
        teamLeadRegNum: item.regNum,
        teamLeadName: dbLead?.name || item.leadName || `Team Lead (${item.teamId})`,
        membersCount: members ? members.length : 0,
        members: members || [],
        college: dbTeam?.college || 'KARE',
        department: dbTeam?.department || 'CSE',
        selectedProblemCode: dbTeam?.selectedProblemCode || 'Not Selected',
        selectionConfirmed: Boolean(dbTeam?.selectionConfirmed),
        teamQrToken: teamQrToken,
        publicQrUrl: `${appBaseUrl}/team/${teamQrToken}`,
        eventPassQrToken: eventPassQrToken,
        eventPassStatus: dbTeam?.eventPassStatus || 'ISSUED',
        registrationStatus: dbTeam?.registrationStatus || 'CONFIRMED',
        attendanceCount: attendanceByTeam[item.teamId] || attendanceByTeam[item.teamName] || 0
      };
    });

    return res.json({ teams: detailedTeams });
  } catch (err) {
    console.error('Admin fetch teams error:', err);
    return res.status(500).json({ error: 'Failed to fetch team list.' });
  }
});

router.get('/all-teams', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  const teamsHandler = router.stack.find(r => r.route && r.route.path === '/teams')?.route?.stack[2]?.handle;
  if (teamsHandler) return teamsHandler(req, res);
  return res.redirect('/api/admin/teams');
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
        name: 'Event Volunteer',
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

    await Team.deleteMany({});
    await TeamLead.deleteMany({});
    await Participant.deleteMany({});

    for (const item of authorizedTeams) {
      let teamDoc = await Team.findOne({ $or: [{ name: item.teamId }, { teamId: item.teamId }, { teamLeadRegNum: item.regNum }] });

      const qrToken = `TQ-${item.teamId}-${item.regNum.slice(-4)}`;
      const passToken = `EP-${item.teamId}-${item.regNum.slice(-4)}`;

      if (!teamDoc) {
        teamDoc = await Team.create({
          name: item.teamId,
          teamId: item.teamId,
          teamName: item.teamName || item.teamId,
          teamLeadRegNum: item.regNum,
          college: 'KARE',
          department: 'CSE',
          members: item.members || [],
          teamQrToken: qrToken,
          eventPassQrToken: passToken,
          registrationStatus: 'CONFIRMED',
          eventPassStatus: 'ISSUED'
        });
      } else {
        teamDoc.name = item.teamId;
        teamDoc.teamId = item.teamId;
        teamDoc.teamName = item.teamName || item.teamId;
        teamDoc.teamLeadRegNum = item.regNum;
        teamDoc.members = item.members || teamDoc.members;
        if (!teamDoc.college) teamDoc.college = 'KARE';
        if (!teamDoc.teamQrToken) teamDoc.teamQrToken = qrToken;
        if (!teamDoc.eventPassQrToken) teamDoc.eventPassQrToken = passToken;
        await teamDoc.save();
      }

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
          name: item.leadName,
          teamId: teamDoc._id,
          phone: '9876543210',
          email: `${item.teamId.toLowerCase()}@hackathon.edu`
        });
      } else {
        leadDoc.teamId = teamDoc._id;
        leadDoc.name = item.leadName;
        await leadDoc.save();
      }

      if (item.members && Array.isArray(item.members)) {
        for (const m of item.members) {
          if (!m.registrationNumber) continue;
          let partDoc = await Participant.findOne({ registrationNumber: m.registrationNumber });
          if (!partDoc) {
            await Participant.create({
              registrationNumber: m.registrationNumber,
              name: m.name,
              teamName: item.teamName || item.teamId,
              college: 'KARE',
              department: 'CSE',
              isTeamLead: m.role === 'LEAD',
              qrCodeData: m.registrationNumber
            });
          } else {
            partDoc.teamName = item.teamName || item.teamId;
            partDoc.name = m.name;
            partDoc.isTeamLead = m.role === 'LEAD';
            await partDoc.save();
          }
        }
      }
    }

    return res.json({ message: 'Seed data generated successfully!' });
  } catch (err) {
    console.error('Seed error:', err);
    return res.status(500).json({ error: 'Failed to seed demo data.' });
  }
});

// 8. ADMIN: GET ALL REVIEWER EVALUATIONS, NORMALIZATION STATS & LEADERBOARD
router.get('/evaluations', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const [evaluations, rounds, reviewers, normalizationStats, leaderboard] = await Promise.all([
      Evaluation.find().sort({ roundNumber: 1, teamCode: 1 }),
      EvaluationRound.find().sort({ roundNumber: 1 }),
      Reviewer.find({}, { passwordHash: 0 }),
      RoundReviewerNormalization.find().sort({ roundNumber: 1, reviewerId: 1 }),
      getLeaderboardData()
    ]);
    const authorizedTeams = require('../data/teamsData');

    // Round Completion Statistics
    const round1Count = new Set(evaluations.filter(e => e.roundNumber === 1).map(e => e.teamCode)).size;
    const round2Count = new Set(evaluations.filter(e => e.roundNumber === 2).map(e => e.teamCode)).size;
    const round3Count = new Set(evaluations.filter(e => e.roundNumber === 3).map(e => e.teamCode)).size;
    const totalTeamsCount = authorizedTeams.length;

    const summary = {
      totalTeams: totalTeamsCount,
      totalEvaluations: evaluations.length,
      round1Completed: round1Count,
      round2Completed: round2Count,
      round3Completed: round3Count,
      round1Total: totalTeamsCount,
      round2Total: totalTeamsCount,
      round3Total: totalTeamsCount
    };

    return res.json({
      summary,
      evaluations,
      rounds,
      reviewers,
      normalizationStats,
      leaderboard
    });
  } catch (err) {
    console.error('Admin fetch evaluations error:', err);
    return res.status(500).json({ error: 'Failed to fetch reviewer evaluations.' });
  }
});

// 8b. ADMIN: GET NORMALIZATION BREAKDOWN FOR SPECIFIC ROUND & REVIEWER
router.get('/normalization/:roundNumber/:reviewerId', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const roundNum = Number(req.params.roundNumber);
    const revId = req.params.reviewerId;

    const revQueries = [{ reviewerId: revId }, { reviewerId: String(revId) }];
    if (mongoose.Types.ObjectId.isValid(revId)) {
      revQueries.push({ reviewerId: new mongoose.Types.ObjectId(revId) });
    }

    const [evaluations, normMeta] = await Promise.all([
      Evaluation.find({
        roundNumber: roundNum,
        $or: revQueries
      }).sort({ teamCode: 1 }),
      RoundReviewerNormalization.findOne({
        roundNumber: roundNum,
        $or: revQueries
      })
    ]);

    const validScores = evaluations.map(e => Number(e.rawScore)).filter(s => !isNaN(s) && s >= 0 && s <= 100);
    const minScore = validScores.length > 0 ? Math.min(...validScores) : 0;
    const maxScore = validScores.length > 0 ? Math.max(...validScores) : 0;

    return res.json({
      roundNumber: roundNum,
      reviewerId: revId,
      minimumScore: minScore,
      maximumScore: maxScore,
      totalEvaluated: evaluations.length,
      isFrozen: Boolean(normMeta?.isFrozen),
      evaluations
    });
  } catch (err) {
    console.error('Fetch normalization error:', err);
    return res.status(500).json({ error: 'Failed to fetch normalization details.' });
  }
});

// 8c. ADMIN: SCORE CORRECTION & MANUAL MARK OVERRIDE (Section 10 Requirement)
router.post('/evaluations', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { teamCode, teamId, roundNumber, reviewerId, rawScore, comments } = req.body;
    const rawTeam = teamCode || teamId;
    if (!rawTeam || !roundNumber || !reviewerId) {
      return res.status(400).json({ error: 'teamCode or teamId, roundNumber, and reviewerId are required.' });
    }

    const roundNum = Number(roundNumber);
    let cleanRawScore;
    try {
      cleanRawScore = validateRawScore(rawScore);
    } catch (e) {
      return res.status(400).json({ error: 'Marks must be between 0 and 100.' });
    }

    let matchedDbTeam = null;
    if (mongoose.Types.ObjectId.isValid(rawTeam)) {
      matchedDbTeam = await Team.findById(rawTeam);
    }
    if (!matchedDbTeam) {
      const cleanIdentifier = String(rawTeam).trim().toUpperCase();
      matchedDbTeam = await Team.findOne({ $or: [{ teamId: cleanIdentifier }, { name: cleanIdentifier }, { teamName: cleanIdentifier }] });
    }

    const cleanTeamCode = matchedDbTeam?.teamId || matchedDbTeam?.name || String(rawTeam).trim().toUpperCase();
    const authorizedTeams = require('../data/teamsData');
    const authTeam = authorizedTeams.find(t => t.teamId === cleanTeamCode || t.teamName?.toUpperCase() === cleanTeamCode);

    const matchedTeamId = matchedDbTeam?._id || teamId || cleanTeamCode;
    const matchedTeamName = authTeam?.teamName || matchedDbTeam?.teamName || matchedDbTeam?.name || cleanTeamCode;

    // Reviewer info
    const reviewer = await Reviewer.findById(reviewerId).catch(() => null) || await Reviewer.findOne({ username: reviewerId });
    const reviewerName = reviewer?.name || 'Reviewer';
    const reviewerUsername = reviewer?.username || String(reviewerId);
    const matchedRevId = reviewer?._id ? String(reviewer?._id) : String(reviewerId);

    const revMatch = [{ reviewerId: matchedRevId }, { reviewerId: reviewerId }];
    if (mongoose.Types.ObjectId.isValid(matchedRevId)) {
      revMatch.push({ reviewerId: new mongoose.Types.ObjectId(matchedRevId) });
    }

    let evaluationDoc = await Evaluation.findOne({
      roundNumber: roundNum,
      $or: revMatch,
      $and: [
        { $or: [{ teamCode: cleanTeamCode }, { teamId: matchedTeamId }] }
      ]
    });

    const oldRawScore = evaluationDoc?.rawScore;

    if (evaluationDoc) {
      evaluationDoc.rawScore = cleanRawScore;
      evaluationDoc.totalMarks = cleanRawScore;
      evaluationDoc.criteriaMarks = [{ criteriaKey: 'raw_score', name: 'Raw Marks', mark: cleanRawScore, maxMark: 100 }];
      if (comments !== undefined) evaluationDoc.comments = comments;
      evaluationDoc.status = 'SUBMITTED';
      evaluationDoc.submittedAt = new Date();
      await evaluationDoc.save();
    } else {
      evaluationDoc = await Evaluation.create({
        teamId: matchedTeamId,
        teamCode: cleanTeamCode,
        teamName: matchedTeamName,
        roundNumber: roundNum,
        reviewerId: matchedRevId,
        reviewerUsername: reviewerUsername,
        reviewerName: reviewerName,
        rawScore: cleanRawScore,
        totalMarks: cleanRawScore,
        criteriaMarks: [{ criteriaKey: 'raw_score', name: 'Raw Marks', mark: cleanRawScore, maxMark: 100 }],
        comments: comments || 'Admin Entered Marks',
        status: 'SUBMITTED',
        submittedAt: new Date()
      });
    }

    // Recalculate MIN, MAX, and all normalized scores for that round + reviewer
    const normResult = await recalculateRoundReviewerNormalization(roundNum, matchedRevId);

    // Section 10: Record audit log for score correction
    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'ADMIN_SCORE_CORRECTION',
      target: `Team ${cleanTeamCode} (Round ${roundNum}, Reviewer ${reviewerUsername})`,
      metadata: { oldRawScore, newRawScore: cleanRawScore, minScore: normResult.minScore, maxScore: normResult.maxScore }
    });

    const refreshedEv = await Evaluation.findById(evaluationDoc._id);
    return res.json({
      message: `Score for Team ${cleanTeamCode} updated and normalized successfully!`,
      evaluation: refreshedEv,
      normalization: normResult
    });
  } catch (err) {
    console.error('Admin score correction error:', err);
    return res.status(500).json({ error: 'Failed to update evaluation score.' });
  }
});

// 8d. ADMIN: UPDATE EVALUATION BY ID (Score Correction)
router.put('/evaluations/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { rawScore, comments, status } = req.body;
    const evaluationDoc = await Evaluation.findById(req.params.id);
    if (!evaluationDoc) {
      return res.status(404).json({ error: 'Evaluation record not found.' });
    }

    let cleanRawScore;
    try {
      cleanRawScore = validateRawScore(rawScore);
    } catch (e) {
      return res.status(400).json({ error: 'Marks must be between 0 and 100.' });
    }

    const oldScore = evaluationDoc.rawScore;
    evaluationDoc.rawScore = cleanRawScore;
    evaluationDoc.totalMarks = cleanRawScore;
    evaluationDoc.criteriaMarks = [{ criteriaKey: 'raw_score', name: 'Raw Marks', mark: cleanRawScore, maxMark: 100 }];
    if (comments !== undefined) evaluationDoc.comments = comments;
    if (status !== undefined) evaluationDoc.status = status;
    evaluationDoc.submittedAt = new Date();
    await evaluationDoc.save();

    const normResult = await recalculateRoundReviewerNormalization(evaluationDoc.roundNumber, evaluationDoc.reviewerId);

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'ADMIN_SCORE_CORRECTION',
      target: `Team ${evaluationDoc.teamCode} (Round ${evaluationDoc.roundNumber})`,
      metadata: { oldScore, newScore: cleanRawScore }
    });

    const refreshed = await Evaluation.findById(evaluationDoc._id);
    return res.json({
      message: 'Evaluation updated and recalculated successfully.',
      evaluation: refreshed,
      normalization: normResult
    });
  } catch (err) {
    console.error('Admin update evaluation error:', err);
    return res.status(500).json({ error: 'Failed to update evaluation.' });
  }
});

// 8d. ADMIN: CLEAR/RESET EVALUATIONS (FOR ADMIN MAINTENANCE AND TESTING)
router.delete('/evaluations/all', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    await Evaluation.deleteMany({});
    await RoundReviewerNormalization.deleteMany({});
    return res.json({ message: 'All evaluations and normalization data reset successfully.' });
  } catch (err) {
    console.error('Admin reset evaluations error:', err);
    return res.status(500).json({ error: 'Failed to reset evaluations.' });
  }
});

// 8e. ADMIN: CLOSE EVALUATION ROUND (Freeze normalization dataset, stop reviewer submissions)
router.post('/rounds/:roundNumber/close', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const roundNum = Number(req.params.roundNumber);
    let roundDoc = await EvaluationRound.findOne({ roundNumber: roundNum });
    if (!roundDoc) {
      return res.status(404).json({ error: `Evaluation Round ${roundNum} not found.` });
    }

    roundDoc.status = 'CLOSED';
    roundDoc.active = false;
    roundDoc.closedAt = new Date();
    await roundDoc.save();

    // Freeze normalization datasets for this round
    await RoundReviewerNormalization.updateMany({ roundNumber: roundNum }, { $set: { isFrozen: true } });

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'CLOSE_EVALUATION_ROUND',
      target: `Round ${roundNum}`,
      metadata: { closedAt: roundDoc.closedAt }
    });

    return res.json({ message: `Round ${roundNum} closed and frozen successfully. Reviewer submissions locked.`, round: roundDoc });
  } catch (err) {
    console.error('Close round error:', err);
    return res.status(500).json({ error: 'Failed to close evaluation round.' });
  }
});

// 8f. ADMIN: OPEN / REOPEN EVALUATION ROUND
router.post('/rounds/:roundNumber/open', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const roundNum = Number(req.params.roundNumber);
    let roundDoc = await EvaluationRound.findOne({ roundNumber: roundNum });
    if (!roundDoc) {
      return res.status(404).json({ error: `Evaluation Round ${roundNum} not found.` });
    }

    roundDoc.status = 'ACTIVE';
    roundDoc.active = true;
    roundDoc.closedAt = null;
    await roundDoc.save();

    await RoundReviewerNormalization.updateMany({ roundNumber: roundNum }, { $set: { isFrozen: false } });

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'REOPEN_EVALUATION_ROUND',
      target: `Round ${roundNum}`
    });

    return res.json({ message: `Round ${roundNum} reopened successfully. Reviewer submissions active.`, round: roundDoc });
  } catch (err) {
    console.error('Reopen round error:', err);
    return res.status(500).json({ error: 'Failed to reopen evaluation round.' });
  }
});

// 8g. ADMIN: GET AUTHORITATIVE LEADERBOARD
router.get('/leaderboard', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const leaderboard = await getLeaderboardData();
    return res.json({ leaderboard });
  } catch (err) {
    console.error('Leaderboard fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

// 9. ADMIN: GET EVALUATIONS BY ROUND
router.get('/evaluations/round/:roundNumber', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const roundNum = Number(req.params.roundNumber);
    const evaluations = await Evaluation.find({ roundNumber: roundNum }).sort({ teamCode: 1 });
    return res.json({ roundNumber: roundNum, evaluations });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch round evaluations.' });
  }
});

// 10. ADMIN: GET EVALUATIONS BY TEAM
router.get('/evaluations/team/:teamId', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const teamParam = req.params.teamId.toUpperCase();
    const evaluations = await Evaluation.find({
      $or: [
        { teamCode: teamParam },
        { teamName: teamParam },
        { teamId: req.params.teamId }
      ]
    }).sort({ roundNumber: 1 });
    return res.json({ teamId: req.params.teamId, evaluations });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch team evaluations.' });
  }
});

// 11. ADMIN: SYNC & SEPARATE TEAM 50 AND TEAM 61
router.all('/sync-teams-50-61', async (req, res) => {
  try {
    const team50Members = [
      { name: 'BOPADALA NAGA SANJAY', registrationNumber: '9824005012', role: 'LEAD' },
      { name: 'MORUMPALLI BHANUPRAKASH REDDY', registrationNumber: '9824005010', role: 'MEMBER' },
      { name: 'CHEMBETI VINAY HARSHA', registrationNumber: '9923005067', role: 'MEMBER' },
      { name: 'Y.PATHIV', registrationNumber: '9923005315', role: 'MEMBER' }
    ];

    const team61Members = [
      { name: 'VUTAKANTI SREEKANTH REDDY', registrationNumber: '9824005007', role: 'LEAD' },
      { name: 'RAAVULA VINAY', registrationNumber: '9923005124', role: 'MEMBER' },
      { name: 'KOLA ADARSH', registrationNumber: '9923005097', role: 'MEMBER' },
      { name: 'GORLA UPENDRA', registrationNumber: '9923005005', role: 'MEMBER' }
    ];

    // 1. Ensure Team 50 exists with correct details
    let t50 = await Team.findOne({ $or: [{ teamId: 'ALPHA-050' }, { name: 'ALPHA-050' }] });
    if (!t50) {
      t50 = await Team.create({
        name: 'ALPHA-050',
        teamId: 'ALPHA-050',
        teamName: 'STRANGER THINGS',
        teamLeadRegNum: '9824005012',
        college: 'KARE',
        department: 'CSE',
        members: team50Members,
        teamQrToken: 'TQ-ALPHA-050-5012',
        eventPassQrToken: 'EP-ALPHA-050-5012',
        registrationStatus: 'CONFIRMED',
        eventPassStatus: 'ISSUED'
      });
    } else {
      t50.name = 'ALPHA-050';
      t50.teamId = 'ALPHA-050';
      t50.teamName = 'STRANGER THINGS';
      t50.teamLeadRegNum = '9824005012';
      t50.members = team50Members;
      t50.teamQrToken = 'TQ-ALPHA-050-5012';
      t50.eventPassQrToken = 'EP-ALPHA-050-5012';
      await t50.save();
    }

    // 2. Ensure Team 61 exists with correct details (as a distinct document from Team 50)
    let t61 = await Team.findOne({ $or: [{ teamId: 'ALPHA-061' }, { name: 'ALPHA-061' }] });
    if (!t61 || t61._id.toString() === t50._id.toString()) {
      t61 = await Team.create({
        name: 'ALPHA-061',
        teamId: 'ALPHA-061',
        teamName: 'TEAM 61',
        teamLeadRegNum: '9824005007',
        college: 'KARE',
        department: 'CSE',
        members: team61Members,
        teamQrToken: 'TQ-ALPHA-061-5007',
        eventPassQrToken: 'EP-ALPHA-061-5007',
        registrationStatus: 'CONFIRMED',
        eventPassStatus: 'ISSUED'
      });
    } else {
      t61.name = 'ALPHA-061';
      t61.teamId = 'ALPHA-061';
      t61.teamName = 'TEAM 61';
      t61.teamLeadRegNum = '9824005007';
      t61.members = team61Members;
      t61.teamQrToken = 'TQ-ALPHA-061-5007';
      t61.eventPassQrToken = 'EP-ALPHA-061-5007';
      await t61.save();
    }

    // Update Team Leads
    await TeamLead.findOneAndUpdate(
      { registrationNumber: '9824005012' },
      { name: 'BOPADALA NAGA SANJAY', teamId: t50._id, registrationNumber: '9824005012', phone: '9876543210', email: 'alpha-050@hackathon.edu' },
      { upsert: true, new: true }
    );

    await TeamLead.findOneAndUpdate(
      { registrationNumber: '9824005007' },
      { name: 'VUTAKANTI SREEKANTH REDDY', teamId: t61._id, registrationNumber: '9824005007', phone: '9876543210', email: 'alpha-061@hackathon.edu' },
      { upsert: true, new: true }
    );

    return res.json({
      message: 'Successfully synchronized Team 50 and Team 61',
      team50: {
        id: t50._id,
        teamId: t50.teamId,
        teamName: t50.teamName,
        teamLeadRegNum: t50.teamLeadRegNum,
        members: t50.members
      },
      team61: {
        id: t61._id,
        teamId: t61.teamId,
        teamName: t61.teamName,
        teamLeadRegNum: t61.teamLeadRegNum,
        members: t61.members
      }
    });
  } catch (err) {
    console.error('Error syncing teams 50 and 61:', err);
    return res.status(500).json({ error: 'Failed to sync teams 50 and 61', details: err.message });
  }
});

module.exports = router;
