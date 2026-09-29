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

// 4B. ADMIN: CLEAR ALL ATTENDANCE SESSIONS & RECORDS
router.delete('/clear-all', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    await AttendanceSession.deleteMany({});
    await Attendance.deleteMany({});

    await AuditLog.create({
      actor: req.user.username || 'admin',
      role: 'ADMIN',
      action: 'CLEAR_ALL_ATTENDANCE',
      target: 'All Attendance Sessions & Marked Records'
    });

    return res.json({ message: 'All attendance sessions and marked records deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to clear attendance data.' });
  }
});

const AUTHORIZED_TEAMS = require('../data/teamsData');

// Helper to look up official student name from AUTHORIZED_TEAMS dataset by registration number
function getRealStudentName(regNum, fallbackName = '') {
  if (!regNum) return fallbackName || 'Participant';
  const cleanReg = String(regNum).trim().toUpperCase();

  for (const team of AUTHORIZED_TEAMS) {
    if (team.regNum === cleanReg && team.leadName) {
      return team.leadName;
    }
    if (team.members && Array.isArray(team.members)) {
      const match = team.members.find(m => String(m.registrationNumber || '').trim().toUpperCase() === cleanReg);
      if (match && match.name) {
        return match.name;
      }
    }
  }
  return fallbackName || cleanReg;
}

// Helper to resolve real student name, official teamId, and official teamName from any combination of input fields
function resolveParticipantDetails(rawRegNum, rawName, rawTeamId, rawTeamName) {
  const cleanReg = String(rawRegNum || '').trim().toUpperCase();
  const cleanName = String(rawName || '').trim();
  const cleanTeamId = String(rawTeamId || '').trim().toUpperCase();
  const cleanTeamName = String(rawTeamName || '').trim();

  // Extract ALPHA team code if present (e.g. ALPHA-004, ALPHA-4, TQ-ALPHA-004)
  const extractAlphaTeamId = (str) => {
    if (!str) return null;
    const m = String(str).match(/ALPHA-?(\d+)/i);
    return m ? `ALPHA-${m[1].padStart(3, '0')}` : null;
  };

  const targetTeamId = extractAlphaTeamId(cleanTeamId) || extractAlphaTeamId(cleanReg) || extractAlphaTeamId(cleanTeamName) || extractAlphaTeamId(cleanName);

  let foundTeam = null;
  let foundMember = null;

  for (const t of AUTHORIZED_TEAMS) {
    if (targetTeamId && t.teamId === targetTeamId) {
      foundTeam = t;
    } else if (cleanReg && (t.regNum === cleanReg || t.teamId === cleanReg)) {
      foundTeam = t;
    } else if (t.members && t.members.some(m => String(m.registrationNumber).trim().toUpperCase() === cleanReg)) {
      foundTeam = t;
    }

    if (foundTeam) {
      if (t.members && Array.isArray(t.members)) {
        foundMember = t.members.find(m => String(m.registrationNumber).trim().toUpperCase() === cleanReg);
      }
      break;
    }
  }

  if (foundTeam) {
    const finalRegNum = foundMember ? foundMember.registrationNumber : (foundTeam.regNum || cleanReg);
    const finalName = foundMember ? foundMember.name : foundTeam.leadName;
    const finalTeamId = foundTeam.teamId;
    const finalTeamName = foundTeam.teamName;

    return {
      registrationNumber: finalRegNum,
      name: finalName,
      teamId: finalTeamId,
      teamName: finalTeamName
    };
  }

  let fallbackName = cleanName;
  if (!fallbackName || fallbackName.includes('Team Lead (') || fallbackName === 'Student') {
    fallbackName = cleanReg;
  }

  return {
    registrationNumber: cleanReg,
    name: fallbackName,
    teamId: cleanTeamId || 'ALPHA-001',
    teamName: cleanTeamName || cleanTeamId || 'Team'
  };
}

// Helper to extract registration number or Team ID from raw QR payloads / URLs
function extractCleanId(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return '';
  let str = rawInput.trim();

  // 1. Handle ALPHA-SESSION-ATTENDANCE-QR or ATTENDANCE payloads
  if (str.startsWith('ALPHA-SESSION-ATTENDANCE-QR:') || str.startsWith('ATTENDANCE:')) {
    const parts = str.split(':');
    if (parts.length >= 3 && parts[2]) {
      str = parts[2].trim();
    } else if (parts.length >= 2 && parts[1]) {
      str = parts[1].trim();
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
    const leadRealName = getRealStudentName(dbTeam.teamLeadRegNum, dbTeam.teamName || dbTeam.name);
    return {
      registrationNumber: dbTeam.teamLeadRegNum || 'LEAD',
      name: leadRealName,
      teamName: dbTeam.teamName || dbTeam.name,
      teamId: dbTeam.teamId || dbTeam.name,
      leadName: leadRealName,
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
    const pRealName = getRealStudentName(participant.registrationNumber, participant.name);
    return {
      registrationNumber: participant.registrationNumber,
      name: pRealName,
      teamName: teamDoc?.teamName || participant.teamName,
      teamId: teamDoc?.teamId || 'ALPHA',
      leadName: pRealName,
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

// 5B. GET LOGGED-IN TEAM LEAD'S TEAM ATTENDANCE STATUS FOR ALL SESSIONS
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
      (t.members && t.members.some(m => String(m.registrationNumber).trim().toUpperCase() === cleanRegNum))
    );

    const teamId = authItem?.teamId || teamKey || 'ALPHA-001';
    const teamName = authItem?.teamName || 'Team';
    const members = authItem?.members || [
      { name: getRealStudentName(cleanRegNum, req.user.name), registrationNumber: cleanRegNum, role: 'LEAD' }
    ];

    const allSessions = await AttendanceSession.find().sort({ createdAt: -1 });
    const markedSessions = {};
    const sessionDetailsList = [];

    const memberRegNums = members.map(m => String(m.registrationNumber).trim().toUpperCase());

    for (const sess of allSessions) {
      const records = await Attendance.find({
        sessionId: sess.sessionId,
        $or: [
          { teamId: teamId },
          { teamName: teamName },
          { participantRegNum: { $in: memberRegNums } }
        ]
      });

      const memberStatusMap = {};
      records.forEach(r => {
        const cleanKey = (r.participantRegNum || '').trim().toUpperCase();
        if (cleanKey) {
          memberStatusMap[cleanKey] = {
            status: r.status || 'PRESENT',
            markedAt: r.markedAt,
            markedByVolunteer: r.markedByVolunteer,
            participantName: getRealStudentName(cleanKey, r.participantName)
          };
        }
      });

      let presentCount = 0;
      let absentCount = 0;
      let notMarkedCount = 0;

      const memberDetails = members.map(m => {
        const cleanReg = String(m.registrationNumber).trim().toUpperCase();
        const rec = memberStatusMap[cleanReg];
        let status = 'NOT_MARKED';
        if (rec) {
          status = rec.status;
          if (status === 'PRESENT') presentCount++;
          else if (status === 'ABSENT') absentCount++;
        } else {
          notMarkedCount++;
        }
        return {
          name: getRealStudentName(cleanReg, m.name),
          registrationNumber: m.registrationNumber,
          role: m.role || 'MEMBER',
          status,
          markedAt: rec?.markedAt || null,
          markedByVolunteer: rec?.markedByVolunteer || null
        };
      });

      let overallStatus = 'NOT_MARKED';
      if (presentCount + absentCount > 0) {
        if (presentCount === members.length) {
          overallStatus = 'ALL_PRESENT';
        } else if (absentCount === members.length) {
          overallStatus = 'ALL_ABSENT';
        } else {
          overallStatus = 'SOME_ABSENT';
        }
        markedSessions[sess.sessionId] = {
          markedAt: records[0]?.markedAt || new Date(),
          markedByVolunteer: records[0]?.markedByVolunteer || 'Volunteer',
          sessionName: sess.sessionName,
          overallStatus,
          presentCount,
          absentCount,
          notMarkedCount,
          totalMembers: members.length
        };
      }

      sessionDetailsList.push({
        sessionId: sess.sessionId,
        sessionName: sess.sessionName,
        date: sess.date,
        startTime: sess.startTime,
        endTime: sess.endTime,
        status: sess.status,
        overallStatus,
        presentCount,
        absentCount,
        notMarkedCount,
        totalMembers: members.length,
        members: memberDetails
      });
    }

    return res.json({
      team: {
        teamId,
        teamName,
        leadName: authItem?.leadName || getRealStudentName(cleanRegNum, req.user.name),
        leadRegNum: authItem?.regNum || cleanRegNum,
        members
      },
      markedSessions,
      sessionDetailsList
    });
  } catch (err) {
    console.error('Fetch my-attendance error:', err);
    return res.status(500).json({ error: 'Failed to fetch my attendance.' });
  }
});

// 6. VOLUNTEER: MARK SINGLE OR BULK TEAM ATTENDANCE (With Present/Absent Toggles)
router.post('/mark-team-attendance', authenticateToken, requireRole('VOLUNTEER', 'ADMIN'), async (req, res) => {
  try {
    const { sessionId, teamId, attendanceList } = req.body;

    if (!sessionId || !attendanceList || !Array.isArray(attendanceList) || attendanceList.length === 0) {
      return res.status(400).json({ error: 'Session ID and attendance list of team members are required.' });
    }

    const session = await AttendanceSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Attendance session not found.' });
    }

    if (session.status !== 'ACTIVE') {
      return res.status(400).json({
        error: `Cannot submit attendance. Session '${session.sessionName}' is currently ${session.status}.`,
        code: 'SESSION_INACTIVE'
      });
    }

    const firstMember = attendanceList[0];
    const resolvedInfo = await resolveParticipant(firstMember.registrationNumber || teamId || '');
    const teamName = resolvedInfo?.teamName || firstMember.teamName || 'Team';
    const cleanTeamId = resolvedInfo?.teamId || teamId || 'ALPHA-001';

    const volunteerName = req.user.username || req.user.name || 'Volunteer';
    const savedRecords = [];

    for (const item of attendanceList) {
      const regNum = (item.registrationNumber || '').trim().toUpperCase();
      const status = item.status === 'ABSENT' ? 'ABSENT' : 'PRESENT';
      const realName = getRealStudentName(regNum, item.name);

      const rec = await Attendance.findOneAndUpdate(
        { sessionId: session.sessionId, participantRegNum: regNum },
        {
          sessionId: session.sessionId,
          sessionName: session.sessionName,
          participantRegNum: regNum,
          participantName: realName,
          teamName: teamName,
          teamId: cleanTeamId,
          status: status,
          markedByVolunteer: volunteerName,
          markedAt: new Date()
        },
        { upsert: true, new: true }
      );
      savedRecords.push(rec);
    }

    await AuditLog.create({
      actor: volunteerName,
      role: req.user.role,
      action: 'MARK_TEAM_ATTENDANCE',
      target: `Team ${teamName} (${cleanTeamId}) - ${savedRecords.length} members`,
      metadata: { session: session.sessionName }
    });

    return res.json({
      message: `Attendance for Team ${teamName} recorded successfully! ✅`,
      sessionName: session.sessionName,
      records: savedRecords
    });
  } catch (err) {
    console.error('Mark team attendance error:', err);
    return res.status(500).json({ error: 'Server error while submitting team attendance.' });
  }
});

// Single scan fallback route
router.post('/scan', authenticateToken, requireRole('VOLUNTEER', 'ADMIN'), async (req, res) => {
  try {
    const { sessionId, participantRegNum, status } = req.body;

    if (!sessionId || !participantRegNum) {
      return res.status(400).json({ error: 'Session ID and Participant Registration Number are required.' });
    }

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

    const participant = await resolveParticipant(participantRegNum);
    if (!participant) {
      const cleanId = extractCleanId(participantRegNum);
      return res.status(404).json({
        error: `Participant '${cleanId}' is not registered in the system.`,
        code: 'PARTICIPANT_NOT_FOUND'
      });
    }

    const attendanceStatus = status === 'ABSENT' ? 'ABSENT' : 'PRESENT';
    const volunteerName = req.user.username || req.user.name || 'Volunteer';
    const realName = getRealStudentName(participant.registrationNumber, participant.name);

    const attendanceRecord = await Attendance.findOneAndUpdate(
      { sessionId: session.sessionId, participantRegNum: participant.registrationNumber },
      {
        sessionId: session.sessionId,
        sessionName: session.sessionName,
        participantRegNum: participant.registrationNumber,
        participantName: realName,
        teamName: participant.teamName,
        teamId: participant.teamId,
        college: participant.college || 'KARE',
        status: attendanceStatus,
        markedByVolunteer: volunteerName,
        markedAt: new Date()
      },
      { upsert: true, new: true }
    );

    await AuditLog.create({
      actor: volunteerName,
      role: req.user.role,
      action: 'MARK_ATTENDANCE',
      target: `${realName} (${participant.registrationNumber}) -> ${attendanceStatus}`,
      metadata: { session: session.sessionName }
    });

    const formattedTime = new Date(attendanceRecord.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return res.json({
      message: `Attendance marked as ${attendanceStatus} ✅`,
      record: {
        registrationNumber: participant.registrationNumber,
        name: realName,
        teamName: participant.teamName,
        status: attendanceStatus,
        sessionName: session.sessionName,
        markedAt: formattedTime
      }
    });
  } catch (err) {
    console.error('Mark attendance error:', err);
    return res.status(500).json({ error: 'Server error while marking attendance.' });
  }
});

// 6B. VOLUNTEER: GET SESSION ROSTER AND STATS FOR SELECTED ATTENDANCE SESSION
router.get('/session-roster', authenticateToken, async (req, res) => {
  try {
    const { sessionId, search, status } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required.' });
    }

    let filter = { sessionId };
    const attRecords = await Attendance.find(filter).sort({ markedAt: -1 });

    const recordsMap = {};
    attRecords.forEach(r => {
      const cleanKey = (r.participantRegNum || '').trim().toUpperCase();
      if (cleanKey) recordsMap[cleanKey] = r;
    });

    // Build complete individual roster for all 240 members across 60 teams
    let fullRoster = [];
    AUTHORIZED_TEAMS.forEach(t => {
      if (t.members && Array.isArray(t.members)) {
        t.members.forEach(m => {
          const cleanReg = (m.registrationNumber || '').trim().toUpperCase();
          const att = recordsMap[cleanReg];
          const details = resolveParticipantDetails(m.registrationNumber, m.name, t.teamId, t.teamName);
          fullRoster.push({
            _id: att?._id || `temp-${m.registrationNumber}`,
            participantRegNum: details.registrationNumber,
            participantName: details.name,
            teamId: details.teamId,
            teamName: details.teamName,
            role: m.role || 'MEMBER',
            status: att ? att.status : 'NOT_MARKED',
            markedByVolunteer: att ? att.markedByVolunteer : '—',
            markedAt: att ? att.markedAt : null
          });
        });
      }
    });

    // Apply Filter by Status if provided
    if (status && status !== 'ALL') {
      fullRoster = fullRoster.filter(r => r.status === status);
    }

    // Apply Search Filter
    if (search) {
      const q = search.toLowerCase();
      fullRoster = fullRoster.filter(r => 
        (r.participantName && r.participantName.toLowerCase().includes(q)) ||
        (r.participantRegNum && r.participantRegNum.toLowerCase().includes(q)) ||
        (r.teamName && r.teamName.toLowerCase().includes(q)) ||
        (r.teamId && r.teamId.toLowerCase().includes(q))
      );
    }

    const presentCount = attRecords.filter(r => r.status === 'PRESENT').length;
    const absentCount = attRecords.filter(r => r.status === 'ABSENT').length;
    const totalRegistered = AUTHORIZED_TEAMS.reduce((acc, t) => acc + (t.members ? t.members.length : 4), 0);

    return res.json({
      sessionId,
      records: fullRoster,
      markedCount: attRecords.length,
      presentCount,
      absentCount,
      totalRegistered
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch session roster.' });
  }
});

// 7. ADMIN: CENTRALIZED INDIVIDUAL ATTENDANCE DATA TABLE WITH FILTERS & SUMMARY
router.get('/admin/records', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { sessionId, teamName, status, search } = req.query;

    // Collect all 240 individual participants from AUTHORIZED_TEAMS or Participant model
    let allParticipants = [];
    AUTHORIZED_TEAMS.forEach(t => {
      if (t.members && Array.isArray(t.members)) {
        t.members.forEach(m => {
          allParticipants.push({
            registrationNumber: m.registrationNumber,
            name: m.name,
            teamName: t.teamName,
            teamId: t.teamId,
            role: m.role || 'MEMBER',
            college: 'KARE'
          });
        });
      }
    });

    if (allParticipants.length === 0) {
      const dbParts = await Participant.find();
      allParticipants = dbParts.map(p => {
        const details = resolveParticipantDetails(p.registrationNumber, p.name, 'ALPHA', p.teamName);
        return {
          registrationNumber: details.registrationNumber,
          name: details.name,
          teamName: details.teamName,
          teamId: details.teamId,
          role: p.isTeamLead ? 'LEAD' : 'MEMBER',
          college: p.college || 'KARE'
        };
      });
    }

    let attendanceFilter = {};
    if (sessionId && sessionId !== 'ALL') {
      attendanceFilter.sessionId = sessionId;
    }
    if (teamName && teamName !== 'ALL') {
      attendanceFilter.teamName = teamName;
    }

    const attRecords = await Attendance.find(attendanceFilter).sort({ markedAt: -1 });
    const recordsMap = {};
    attRecords.forEach(r => {
      const cleanKey = (r.participantRegNum || '').trim().toUpperCase();
      if (cleanKey) recordsMap[cleanKey] = r;
    });

    // Build individual attendance rows for requested view
    let resultRows = [];
    if (sessionId && sessionId !== 'ALL') {
      const sessionDoc = await AttendanceSession.findOne({ sessionId });
      const sName = sessionDoc ? sessionDoc.sessionName : sessionId;

      resultRows = allParticipants.map(p => {
        const cleanReg = (p.registrationNumber || '').trim().toUpperCase();
        const att = recordsMap[cleanReg];
        const details = resolveParticipantDetails(p.registrationNumber, p.name, p.teamId, p.teamName);
        return {
          _id: att?._id || `temp-${p.registrationNumber}`,
          participantRegNum: details.registrationNumber,
          participantName: details.name,
          teamName: details.teamName,
          teamId: details.teamId,
          sessionName: sName,
          sessionId: sessionId,
          status: att ? att.status : 'ABSENT',
          markedByVolunteer: att ? att.markedByVolunteer : '—',
          markedAt: att ? att.markedAt : null
        };
      });
    } else {
      // If ALL sessions selected, map existing attendance logs or expand
      if (attRecords.length > 0) {
        resultRows = attRecords.map(r => {
          const details = resolveParticipantDetails(r.participantRegNum, r.participantName, r.teamId, r.teamName);
          return {
            _id: r._id,
            participantRegNum: details.registrationNumber,
            participantName: details.name,
            teamName: details.teamName,
            teamId: details.teamId,
            sessionName: r.sessionName,
            sessionId: r.sessionId,
            status: r.status || 'PRESENT',
            markedByVolunteer: r.markedByVolunteer,
            markedAt: r.markedAt
          };
        });
      } else {
        resultRows = allParticipants.map(p => {
          const details = resolveParticipantDetails(p.registrationNumber, p.name, p.teamId, p.teamName);
          return {
            _id: `temp-${p.registrationNumber}`,
            participantRegNum: details.registrationNumber,
            participantName: details.name,
            teamName: details.teamName,
            teamId: details.teamId,
            sessionName: 'No Session Selected',
            sessionId: 'N/A',
            status: 'ABSENT',
            markedByVolunteer: '—',
            markedAt: null
          };
        });
      }
    }

    // Apply Filter by Team Name
    if (teamName && teamName !== 'ALL') {
      resultRows = resultRows.filter(r => r.teamName === teamName || r.teamId === teamName);
    }

    // Apply Filter by Individual Status (PRESENT / ABSENT)
    if (status && status !== 'ALL') {
      resultRows = resultRows.filter(r => r.status === status);
    }

    // Apply Search Filter
    if (search) {
      const q = search.toLowerCase();
      resultRows = resultRows.filter(r => 
        (r.participantName && r.participantName.toLowerCase().includes(q)) ||
        (r.participantRegNum && r.participantRegNum.toLowerCase().includes(q)) ||
        (r.teamName && r.teamName.toLowerCase().includes(q)) ||
        (r.teamId && r.teamId.toLowerCase().includes(q))
      );
    }

    // Always ensure participantName, teamId, and teamName are fully resolved
    resultRows = resultRows.map(r => {
      const details = resolveParticipantDetails(r.participantRegNum, r.participantName, r.teamId, r.teamName);
      return {
        ...r,
        participantRegNum: details.registrationNumber,
        participantName: details.name,
        teamId: details.teamId,
        teamName: details.teamName
      };
    });

    const totalRegistered = allParticipants.length;
    const totalPresentCount = resultRows.filter(r => r.status === 'PRESENT').length;
    const totalAbsentCount = resultRows.filter(r => r.status === 'ABSENT').length;
    const attendancePercentage = totalRegistered > 0 ? ((totalPresentCount / totalRegistered) * 100).toFixed(1) : 0;

    return res.json({
      records: resultRows,
      stats: {
        totalRegistered,
        present: totalPresentCount,
        absent: totalAbsentCount,
        percentage: Number(attendancePercentage)
      }
    });
  } catch (err) {
    console.error('Fetch admin records error:', err);
    return res.status(500).json({ error: 'Failed to fetch individual attendance records.' });
  }
});

// 8. ADMIN: EXPORT INDIVIDUAL ATTENDANCE TO CSV
router.get('/admin/export', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { sessionId, status } = req.query;
    let filter = {};
    if (sessionId && sessionId !== 'ALL') filter.sessionId = sessionId;
    if (status && status !== 'ALL') filter.status = status;

    const records = await Attendance.find(filter).sort({ markedAt: -1 });

    let allParticipants = [];
    AUTHORIZED_TEAMS.forEach(t => {
      if (t.members && Array.isArray(t.members)) {
        t.members.forEach(m => {
          allParticipants.push({
            registrationNumber: m.registrationNumber,
            name: m.name,
            teamName: t.teamName,
            teamId: t.teamId,
            role: m.role || 'MEMBER'
          });
        });
      }
    });

    if (allParticipants.length === 0) {
      const dbParts = await Participant.find();
      allParticipants = dbParts.map(p => {
        const details = resolveParticipantDetails(p.registrationNumber, p.name, 'ALPHA', p.teamName);
        return {
          registrationNumber: details.registrationNumber,
          name: details.name,
          teamName: details.teamName,
          teamId: details.teamId,
          role: p.isTeamLead ? 'LEAD' : 'MEMBER'
        };
      });
    }

    const recordsMap = {};
    records.forEach(r => {
      const cleanKey = (r.participantRegNum || '').trim().toUpperCase();
      if (cleanKey) recordsMap[cleanKey] = r;
    });

    const exportRows = allParticipants.map(p => {
      const cleanReg = (p.registrationNumber || '').trim().toUpperCase();
      const match = recordsMap[cleanReg];
      const details = resolveParticipantDetails(
        match?.participantRegNum || p.registrationNumber,
        match?.participantName || p.name,
        match?.teamId || p.teamId,
        match?.teamName || p.teamName
      );
      return {
        'Registration Number': details.registrationNumber,
        'Student Name': details.name,
        'Team ID': details.teamId,
        'Team Name': details.teamName,
        'Role': p.role,
        'College': 'KARE',
        'Session': match ? match.sessionName : (sessionId && sessionId !== 'ALL' ? sessionId : 'N/A'),
        'Attendance Status': match ? match.status : 'ABSENT',
        'Marked Time': match?.markedAt ? new Date(match.markedAt).toLocaleString() : '—',
        'Marked By Volunteer': match ? match.markedByVolunteer : '—'
      };
    });

    const csvData = json2csv(exportRows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=Hackathon_Individual_Attendance_Report_${Date.now()}.csv`);
    return res.status(200).send(csvData);
  } catch (err) {
    console.error('Export error:', err);
    return res.status(500).json({ error: 'Failed to export attendance data.' });
  }
});

module.exports = router;


