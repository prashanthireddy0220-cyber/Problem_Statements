const express = require('express');
const router = express.Router();
const { json2csv } = require('json2csv');
const { AttendanceSession, Attendance, Participant, Team, AuditLog } = require('../models/Schema');
const { authenticateToken, requireRole } = require('../middleware/auth');

// 1. GET ALL ATTENDANCE SESSIONS (For Volunteers and Admin)
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const sessions = await AttendanceSession.find(filter).sort({ createdAt: -1 });
    return res.json({ sessions });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch attendance sessions.' });
  }
});

// 2. ADMIN: CREATE ATTENDANCE SESSION
router.post('/sessions/create', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { sessionName, date, startTime, endTime, status } = req.body;
    if (!sessionName || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Session name, date, start time, and end time are required.' });
    }

    const sessionId = `SESS-${Date.now().toString().slice(-6)}`;
    const newSession = await AttendanceSession.create({
      sessionId,
      sessionName,
      date,
      startTime,
      endTime,
      status: status || 'ACTIVE',
      createdBy: req.user.username || 'Admin'
    });

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'CREATE_ATTENDANCE_SESSION',
      target: sessionName
    });

    return res.status(201).json({ message: 'Attendance session created successfully.', session: newSession });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create attendance session.' });
  }
});

// 3. ADMIN: UPDATE ATTENDANCE SESSION STATUS (Start / Close / Reopen)
router.put('/sessions/:id/status', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['UPCOMING', 'ACTIVE', 'CLOSED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid session status.' });
    }

    const session = await AttendanceSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Attendance session not found.' });
    }

    session.status = status;
    await session.save();

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'UPDATE_SESSION_STATUS',
      target: `${session.sessionName} -> ${status}`
    });

    return res.json({ message: `Session status updated to ${status}.`, session });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update session status.' });
  }
});

// 4. ADMIN: DELETE ATTENDANCE SESSION
router.delete('/sessions/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const session = await AttendanceSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    await AttendanceSession.findByIdAndDelete(req.params.id);
    await Attendance.deleteMany({ sessionId: session.sessionId });

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'DELETE_SESSION',
      target: session.sessionName
    });

    return res.json({ message: 'Attendance session deleted.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete session.' });
  }
});

const AUTHORIZED_TEAMS = require('../data/teamsData');

// Helper to extract registration number or Team ID from raw QR payloads / URLs
function extractCleanId(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return '';
  let str = rawInput.trim();

  // 1. Handle ATTENDANCE:sessionId:regNum:teamId payload
  if (str.startsWith('ATTENDANCE:')) {
    const parts = str.split(':');
    if (parts.length >= 3 && parts[2]) {
      str = parts[2].trim();
    }
  }

  // 2. Handle URL payload (e.g. https://domain.app/team/TQ-ALPHA-008-0811)
  if (str.includes('/') || str.toLowerCase().startsWith('http')) {
    try {
      const parts = str.split('/').filter(p => p.trim().length > 0);
      if (parts.length > 0) {
        str = parts[parts.length - 1];
      }
    } catch (e) {}
  }

  str = str.split('?')[0].split('#')[0].trim().toUpperCase();

  // 3. Match Registration Number directly (numeric string e.g. 99240040811)
  if (/^\d{8,12}$/.test(str)) {
    return str;
  }

  // 4. Extract ALPHA team code if present (e.g. TQ-ALPHA-008-0811, EP-ALPHA-008-0811, ALPHA-008, ALPHA-8)
  const alphaMatch = str.match(/ALPHA-?(\d+)/i);
  if (alphaMatch) {
    const formattedTeamId = `ALPHA-${alphaMatch[1].padStart(3, '0')}`;
    const authByCode = AUTHORIZED_TEAMS.find(t => t.teamId === formattedTeamId);
    if (authByCode) {
      return authByCode.regNum; // Return lead registration number for team resolution
    }
    return formattedTeamId;
  }

  return str;
}

// Helper to resolve participant by regNum, teamId, teamName, qrCodeData, or Team document lookup
async function resolveParticipant(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return null;
  const str = rawInput.trim();
  const cleanId = extractCleanId(rawInput);
  const upperStr = str.toUpperCase();

  // Extract candidate team ID format (e.g. ALPHA-008, ALPHA-8)
  const alphaMatch = str.match(/ALPHA-?(\d+)/i);
  const candidateTeamId = alphaMatch ? `ALPHA-${alphaMatch[1].padStart(3, '0')}` : null;

  // Search in official AUTHORIZED_TEAMS first by ALL criteria
  const authItem = AUTHORIZED_TEAMS.find(t => 
    t.regNum === cleanId || 
    t.regNum === upperStr ||
    t.teamId === cleanId || 
    t.teamId === upperStr ||
    (candidateTeamId && t.teamId === candidateTeamId) ||
    (t.teamName && t.teamName.toUpperCase() === upperStr) ||
    (t.members && t.members.some(m => m.registrationNumber === cleanId || m.registrationNumber === upperStr))
  );

  if (authItem) {
    const matchedMember = authItem.members.find(m => m.registrationNumber === cleanId || m.registrationNumber === upperStr);
    return {
      registrationNumber: matchedMember ? matchedMember.registrationNumber : authItem.regNum,
      name: matchedMember ? matchedMember.name : authItem.leadName,
      teamName: authItem.teamName,
      teamId: authItem.teamId,
      leadName: authItem.leadName,
      leadRegNum: authItem.regNum,
      college: 'KARE',
      department: 'CSE',
      isTeamLead: !matchedMember || matchedMember.registrationNumber === authItem.regNum,
      members: authItem.members
    };
  }

  // Fallback 1: Database Team model
  const dbTeam = await Team.findOne({
    $or: [
      { teamId: cleanId },
      { teamId: upperStr },
      ...(candidateTeamId ? [{ teamId: candidateTeamId }, { name: candidateTeamId }] : []),
      { name: upperStr },
      { teamName: upperStr },
      { teamLeadRegNum: cleanId },
      { teamLeadRegNum: upperStr }
    ]
  });

  if (dbTeam) {
    return {
      registrationNumber: dbTeam.teamLeadRegNum || 'LEAD',
      name: dbTeam.teamName || dbTeam.name,
      teamName: dbTeam.teamName || dbTeam.name,
      teamId: dbTeam.teamId || dbTeam.name,
      leadName: dbTeam.teamName || dbTeam.name,
      leadRegNum: dbTeam.teamLeadRegNum || 'LEAD',
      college: 'KARE',
      department: 'CSE',
      isTeamLead: true,
      members: dbTeam.members || []
    };
  }

  // Fallback 2: Database Participant model
  let participant = await Participant.findOne({
    $or: [
      { registrationNumber: cleanId },
      { registrationNumber: upperStr },
      { qrCodeData: cleanId },
      { qrCodeData: upperStr },
      { teamName: upperStr }
    ]
  });

  if (participant) {
    const teamDoc = await Team.findOne({ name: participant.teamName });
    return {
      registrationNumber: participant.registrationNumber,
      name: participant.name,
      teamName: teamDoc?.teamName || participant.teamName,
      teamId: teamDoc?.teamId || 'ALPHA',
      leadName: participant.name,
      leadRegNum: participant.registrationNumber,
      college: participant.college || 'KARE',
      department: participant.department || 'CSE',
      isTeamLead: participant.isTeamLead,
      members: teamDoc?.members || []
    };
  }

  return null;
}

// 5. VOLUNTEER / ADMIN: LOOKUP PARTICIPANT BY REGISTRATION NUMBER OR QR DATA
router.get('/participant/lookup', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query required.' });
    }

    const participant = await resolveParticipant(query);

    if (!participant) {
      const cleanId = extractCleanId(query);
      return res.status(404).json({ error: `Participant / Team with registration ID '${cleanId}' not found in database.` });
    }

    return res.json({ participant });
  } catch (err) {
    console.error('Participant lookup error:', err);
    return res.status(500).json({ error: 'Participant lookup error.' });
  }
});

// 5B. GET LOGGED-IN TEAM LEAD'S ATTENDANCE STATUS FOR ALL SESSIONS
router.get('/my-attendance', authenticateToken, requireRole('TEAM_LEAD'), async (req, res) => {
  try {
    const cleanRegNum = (req.user.registrationNumber || '').trim().toUpperCase();
    const teamIdFromUser = req.user.team?.teamId || req.user.team?.name || req.user.teamId;

    const formatKey = (raw) => {
      if (!raw) return '';
      const str = String(raw).trim().toUpperCase();
      const m = str.match(/ALPHA-?(\d+)/i);
      if (m) return `ALPHA-${m[1].padStart(3, '0')}`;
      return str;
    };

    const teamKey = formatKey(teamIdFromUser || cleanRegNum);
    const authItem = AUTHORIZED_TEAMS.find(t => 
      (t.teamId && formatKey(t.teamId) === teamKey) ||
      (t.regNum && t.regNum === cleanRegNum) ||
      (t.members && t.members.some(m => m.registrationNumber === cleanRegNum))
    );

    const searchCriteria = [{ participantRegNum: cleanRegNum }];
    if (authItem) {
      if (authItem.regNum) searchCriteria.push({ participantRegNum: authItem.regNum });
      if (authItem.teamId) searchCriteria.push({ participantRegNum: authItem.teamId });
      if (authItem.teamName) searchCriteria.push({ teamName: authItem.teamName });
      if (authItem.members) {
        authItem.members.forEach(m => {
          if (m.registrationNumber) searchCriteria.push({ participantRegNum: m.registrationNumber });
        });
      }
    }
    if (teamIdFromUser) {
      searchCriteria.push({ participantRegNum: teamIdFromUser });
    }

    const records = await Attendance.find({ $or: searchCriteria });
    const markedSessions = {};
    records.forEach(r => {
      markedSessions[r.sessionId] = {
        markedAt: r.markedAt,
        markedByVolunteer: r.markedByVolunteer,
        sessionName: r.sessionName
      };
    });
    return res.json({ markedSessions });
  } catch (err) {
    console.error('Fetch my-attendance error:', err);
    return res.status(500).json({ error: 'Failed to fetch my attendance.' });
  }
});

// 6. VOLUNTEER: MARK ATTENDANCE (Strict Validation + Duplicate Check)
router.post('/scan', authenticateToken, requireRole('VOLUNTEER', 'ADMIN'), async (req, res) => {
  try {
    const { sessionId, participantRegNum } = req.body;

    if (!sessionId || !participantRegNum) {
      return res.status(400).json({ error: 'Session ID and Participant Registration Number are required.' });
    }

    // A. Validate Attendance Session Existence and ACTIVE status
    const session = await AttendanceSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Attendance session not found.' });
    }

    if (session.status !== 'ACTIVE') {
      return res.status(400).json({
        error: `Cannot mark attendance. Session '${session.sessionName}' is currently ${session.status}.`,
        code: 'SESSION_INACTIVE'
      });
    }

    // B. Validate Participant Existence in DB
    const participant = await resolveParticipant(participantRegNum);

    if (!participant) {
      const cleanId = extractCleanId(participantRegNum);
      return res.status(404).json({
        error: `Participant '${cleanId}' is not registered in the system.`,
        code: 'PARTICIPANT_NOT_FOUND'
      });
    }

    // C. Check Duplicate Attendance in Same Session
    const existingRecord = await Attendance.findOne({
      sessionId: session.sessionId,
      participantRegNum: participant.registrationNumber
    });

    if (existingRecord) {
      const timeStr = new Date(existingRecord.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return res.status(400).json({
        error: `Already Marked! ${participant.name} has already been marked present for '${session.sessionName}'.`,
        code: 'DUPLICATE_ATTENDANCE',
        alreadyMarked: true,
        participantName: participant.name,
        markedAtTime: timeStr,
        record: existingRecord
      });
    }

    // D. Mark Attendance Record
    const attendanceRecord = await Attendance.create({
      sessionId: session.sessionId,
      sessionName: session.sessionName,
      participantRegNum: participant.registrationNumber,
      participantName: participant.name,
      teamName: participant.teamName,
      college: participant.college || 'KARE',
      markedByVolunteer: req.user.username || req.user.name || 'Volunteer',
      markedAt: new Date()
    });

    // Audit Log
    await AuditLog.create({
      actor: req.user.username || req.user.name || 'Volunteer',
      role: req.user.role,
      action: 'MARK_ATTENDANCE',
      target: `${participant.name} (${participant.registrationNumber})`,
      metadata: { session: session.sessionName }
    });

    const formattedTime = new Date(attendanceRecord.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return res.json({
      message: 'Attendance Recorded Successfully ✅',
      record: {
        registrationNumber: participant.registrationNumber,
        name: participant.name,
        teamName: participant.teamName,
        college: participant.college,
        sessionName: session.sessionName,
        markedAt: formattedTime
      }
    });
  } catch (err) {
    if (err.code === 11000) { // MongoDB Unique constraint duplicate error
      return res.status(400).json({
        error: 'Already Marked! Attendance record already exists for this participant in this session.',
        code: 'DUPLICATE_ATTENDANCE'
      });
    }
    console.error('Mark attendance error:', err);
    return res.status(500).json({ error: 'Server error while marking attendance.' });
  }
});

// 6B. VOLUNTEER: GET SESSION ROSTER AND STATS FOR SELECTED ATTENDANCE SESSION
router.get('/session-roster', authenticateToken, async (req, res) => {
  try {
    const { sessionId, search } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required.' });
    }

    let filter = { sessionId };
    if (search) {
      filter.$or = [
        { participantName: { $regex: search, $options: 'i' } },
        { participantRegNum: { $regex: search, $options: 'i' } },
        { teamName: { $regex: search, $options: 'i' } }
      ];
    }

    const records = await Attendance.find(filter).sort({ markedAt: -1 });
    const totalRegistered = await Participant.countDocuments();

    return res.json({
      sessionId,
      records,
      markedCount: records.length,
      totalRegistered
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch session roster.' });
  }
});

// 7. ADMIN: CENTRALIZED ATTENDANCE DATA TABLE WITH FILTERS & SUMMARY
router.get('/admin/records', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { sessionId, teamName, search } = req.query;
    let attendanceFilter = {};

    if (sessionId && sessionId !== 'ALL') {
      attendanceFilter.sessionId = sessionId;
    }
    if (teamName && teamName !== 'ALL') {
      attendanceFilter.teamName = teamName;
    }
    if (search) {
      attendanceFilter.$or = [
        { participantName: { $regex: search, $options: 'i' } },
        { participantRegNum: { $regex: search, $options: 'i' } },
        { teamName: { $regex: search, $options: 'i' } }
      ];
    }

    const attendanceRecords = await Attendance.find(attendanceFilter).sort({ markedAt: -1 });

    // Fetch total registered participants
    const totalRegistered = await Participant.countDocuments();
    const totalPresentCount = attendanceRecords.length;
    const totalAbsentCount = Math.max(0, totalRegistered - totalPresentCount);
    const attendancePercentage = totalRegistered > 0 ? ((totalPresentCount / totalRegistered) * 100).toFixed(1) : 0;

    return res.json({
      records: attendanceRecords,
      stats: {
        totalRegistered,
        present: totalPresentCount,
        absent: totalAbsentCount,
        percentage: Number(attendancePercentage)
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch attendance records.' });
  }
});

// 8. ADMIN: EXPORT ATTENDANCE TO CSV
router.get('/admin/export', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { sessionId } = req.query;
    let filter = {};
    if (sessionId && sessionId !== 'ALL') filter.sessionId = sessionId;

    const records = await Attendance.find(filter).sort({ markedAt: -1 });
    const participants = await Participant.find();

    // Map combined present and absent participant list for complete hackathon report
    const presentRegNums = new Set(records.map(r => r.participantRegNum));

    const exportRows = participants.map(p => {
      const match = records.find(r => r.participantRegNum === p.registrationNumber);
      return {
        'Registration Number': p.registrationNumber,
        'Student Name': p.name,
        'Team Name': p.teamName,
        'College': p.college || 'KARE',
        'Department': p.department || 'CSE',
        'Session': match ? match.sessionName : (sessionId !== 'ALL' ? sessionId : 'N/A'),
        'Attendance Status': match ? 'Present' : 'Absent',
        'Marked Time': match ? new Date(match.markedAt).toLocaleString() : '—',
        'Marked By Volunteer': match ? match.markedByVolunteer : '—'
      };
    });

    const csvData = json2csv(exportRows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=Hackathon_Attendance_Report_${Date.now()}.csv`);
    return res.status(200).send(csvData);
  } catch (err) {
    console.error('Export error:', err);
    return res.status(500).json({ error: 'Failed to export attendance data.' });
  }
});

module.exports = router;
