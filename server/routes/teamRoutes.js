const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { Team, TeamLead, Participant, ProblemStatement, Attendance } = require('../models/Schema');
const { authenticateToken, requireRole } = require('../middleware/auth');
const config = require('../config/env');

const AUTHORIZED_TEAMS = require('../data/teamsData');

// Helper to ensure team has valid teamQrToken and eventPassQrToken
async function ensureTeamTokens(team) {
  if (!team) return null;
  let updated = false;
  const teamCode = team.teamId || team.name || 'ALPHA';
  const leadReg = team.teamLeadRegNum || 'LEAD';

  if (!team.teamQrToken) {
    team.teamQrToken = `TQ-${teamCode}-${leadReg.slice(-4)}`;
    updated = true;
  }
  if (!team.eventPassQrToken) {
    team.eventPassQrToken = `EP-${teamCode}-${leadReg.slice(-4)}`;
    updated = true;
  }
  if (updated) {
    await team.save().catch(err => console.error('Save tokens error:', err));
  }
  return team;
}

// Helper to populate default full team members if missing/incomplete
function sanitizeTeamMembers(team, authItem) {
  if (authItem && authItem.members && authItem.members.length > 0) {
    return authItem.members;
  }
  if (team && team.members && team.members.length > 0) {
    return team.members;
  }
  const leadReg = team?.teamLeadRegNum || authItem?.regNum || 'REG-LEAD';
  const teamCode = team?.teamId || team?.name || authItem?.teamId || 'ALPHA';
  return [
    { name: authItem?.leadName || `Team Lead (${teamCode})`, registrationNumber: leadReg, role: 'LEAD', phone: '9876543210', email: `${teamCode.toLowerCase()}@hackathon.edu` },
    { name: `Member 1 (${teamCode})`, registrationNumber: `${leadReg}-M1`, role: 'MEMBER', phone: '9876543211', email: `m1.${teamCode.toLowerCase()}@hackathon.edu` },
    { name: `Member 2 (${teamCode})`, registrationNumber: `${leadReg}-M2`, role: 'MEMBER', phone: '9876543212', email: `m2.${teamCode.toLowerCase()}@hackathon.edu` },
    { name: `Member 3 (${teamCode})`, registrationNumber: `${leadReg}-M3`, role: 'MEMBER', phone: '9876543213', email: `m3.${teamCode.toLowerCase()}@hackathon.edu` }
  ];
}

// 1. GET MY TEAM DASHBOARD DATA (Team Lead Only)
router.get('/my-team', authenticateToken, requireRole('TEAM_LEAD'), async (req, res) => {
  try {
    const cleanRegNum = (req.user.registrationNumber || '').trim().toUpperCase();
    const normalizeTeamCode = (raw) => {
      if (!raw) return '';
      const cleaned = String(raw).trim().toUpperCase().replace(/[\s\-_]+/g, '');
      const match = cleaned.match(/^(?:ALPHA)?(\d+)$/i);
      if (match) {
        return 'ALPHA-' + match[1].padStart(3, '0');
      }
      return cleaned;
    };
    const userTeamId = normalizeTeamCode(req.user.teamId || req.user.team?.teamId);

    // Find matching authorized team from data list
    // PRIORITY 1: Match by user's JWT teamId
    let authItem = null;
    if (userTeamId) {
      authItem = AUTHORIZED_TEAMS.find(t => normalizeTeamCode(t.teamId) === userTeamId);
    }
    // PRIORITY 2: Match by regNum if userTeamId match failed
    if (!authItem) {
      authItem = AUTHORIZED_TEAMS.find(t => t.regNum === cleanRegNum || (t.members && t.members.some(m => m.registrationNumber === cleanRegNum)));
    }

    if (!authItem && (cleanRegNum === '9824005012' || cleanRegNum === '9924005012' || userTeamId === 'ALPHA-050')) {
      authItem = {
        teamId: 'ALPHA-050',
        regNum: '9824005012',
        teamName: 'STRANGER THINGS',
        leadName: 'BOPADALA NAGA SANJAY',
        members: [
          { name: 'BOPADALA NAGA SANJAY', registrationNumber: '9824005012', role: 'LEAD' },
          { name: 'MORUMPALLI BHANUPRAKASH REDDY', registrationNumber: '9824005010', role: 'MEMBER' },
          { name: 'CHEMBETI VINAY HARSHA', registrationNumber: '9923005067', role: 'MEMBER' },
          { name: 'Y.PATHIV', registrationNumber: '9923005315', role: 'MEMBER' }
        ]
      };
    }

    if (!authItem && (cleanRegNum === '9824005007' || userTeamId === 'ALPHA-061')) {
      authItem = {
        teamId: 'ALPHA-061',
        regNum: '9824005007',
        teamName: 'TEAM 61',
        leadName: 'VUTAKANTI SREEKANTH REDDY',
        members: [
          { name: 'VUTAKANTI SREEKANTH REDDY', registrationNumber: '9824005007', role: 'LEAD' },
          { name: 'RAAVULA VINAY', registrationNumber: '9923005124', role: 'MEMBER' },
          { name: 'KOLA ADARSH', registrationNumber: '9923005097', role: 'MEMBER' },
          { name: 'GORLA UPENDRA', registrationNumber: '9923005005', role: 'MEMBER' }
        ]
      };
    }

    const targetTeamId = authItem?.teamId || userTeamId;

    // 1. Lookup Team Lead & Team concurrently
    let [team, teamLead] = await Promise.all([
      targetTeamId ? Team.findOne({
        $or: [
          { teamId: targetTeamId },
          { name: targetTeamId }
        ]
      }) : null,
      TeamLead.findOne({ registrationNumber: cleanRegNum })
    ]);

    if (!team && teamLead?.teamId) {
      team = await Team.findById(teamLead.teamId);
    }
    if (!teamLead && team) {
      teamLead = await TeamLead.findOne({ teamId: team._id });
    }
    if (!team && cleanRegNum) {
      team = await Team.findOne({ teamLeadRegNum: cleanRegNum });
    }

    // Auto-heal / Seed team if missing from DB
    if (!team && authItem) {
      const qrToken = `TQ-${authItem.teamId}-${cleanRegNum.slice(-4)}`;
      const passToken = `EP-${authItem.teamId}-${cleanRegNum.slice(-4)}`;

      team = await Team.create({
        name: authItem.teamId,
        teamId: authItem.teamId,
        teamName: authItem.teamName || authItem.teamId,
        teamLeadRegNum: cleanRegNum,
        college: 'KARE',
        department: 'CSE',
        members: authItem.members || [],
        teamQrToken: qrToken,
        eventPassQrToken: passToken,
        registrationStatus: 'CONFIRMED',
        eventPassStatus: 'ISSUED'
      });
    }

    // Ensure teamLead doc exists and links to team
    if (!teamLead) {
      teamLead = await TeamLead.create({
        registrationNumber: cleanRegNum,
        name: authItem?.leadName || req.user.name || `Team Lead (${team?.name || 'ALPHA'})`,
        teamId: team?._id,
        phone: '9876543210',
        email: `${cleanRegNum}@klu.ac.in`
      });
    } else if (team && (!teamLead.teamId || teamLead.teamId._id?.toString() !== team._id.toString())) {
      teamLead.teamId = team._id;
      await teamLead.save();
    }

    // Update team members from authItem if team members are empty or missing
    if (team && authItem && (!team.members || team.members.length === 0)) {
      team.members = authItem.members || [];
      if (!team.teamName) team.teamName = authItem.teamName;
      await team.save();
    }

    if (team) {
      await ensureTeamTokens(team);
    }

    const members = sanitizeTeamMembers(team, authItem);

    // Guarantee team always has their assigned fixed problem statement locked
    const fixedAssignment = authItem?.fixedProblemStatementId;
    if (team && fixedAssignment && (!team.selectionConfirmed || team.selectedProblemCode !== fixedAssignment)) {
      const pDoc = await ProblemStatement.findOne({ problemId: fixedAssignment });
      team.selectedProblemCode = fixedAssignment;
      if (pDoc) team.selectedProblemId = pDoc._id;
      team.selectionConfirmed = true;
      if (!team.selectedAt) team.selectedAt = new Date();
      await team.save().catch(e => console.warn('Team assignment save warning:', e.message));
    }

    const isSelectionConfirmed = Boolean(
      (team?.selectionConfirmed && team?.selectedProblemCode && team?.selectedProblemCode !== 'Not Selected') ||
      fixedAssignment
    );

    const activeProblemCode = team?.selectedProblemCode || fixedAssignment;

    // Fetch problem details if selected
    let selectedProblem = null;
    if (activeProblemCode && activeProblemCode !== 'Not Selected') {
      const searchOr = [{ problemId: activeProblemCode.trim().toUpperCase() }];
      if (team?.selectedProblemId) searchOr.push({ _id: team.selectedProblemId });
      selectedProblem = await ProblemStatement.findOne({ $or: searchOr });
      if (!selectedProblem) {
        const fallbackList = require('../data/problemStatements');
        selectedProblem = fallbackList.find(p => p.problemId === activeProblemCode.trim().toUpperCase()) || null;
      }
    }

    const teamCode = team?.teamId || team?.name || authItem?.teamId || 'ALPHA-000';
    const displayTeamName = team?.teamName || authItem?.teamName || team?.name || teamCode;
    const qrToken = team?.teamQrToken || `TQ-${teamCode}-${cleanRegNum.slice(-4)}`;
    const passToken = team?.eventPassQrToken || `EP-${teamCode}-${cleanRegNum.slice(-4)}`;

    const appBaseUrl = config.FRONTEND_URL || 'http://localhost:5173';
    const publicQrUrl = `${appBaseUrl}/team/${qrToken}`;

    return res.json({
      team: {
        id: team?._id || null,
        teamId: teamCode,
        name: displayTeamName,
        college: team?.college || 'KARE',
        department: team?.department || 'CSE',
        registrationStatus: team?.registrationStatus || 'CONFIRMED',
        eventPassStatus: team?.eventPassStatus || 'ISSUED',
        teamQrToken: qrToken,
        publicQrUrl,
        eventPassQrToken: passToken,
        selectedProblemCode: activeProblemCode || 'Not Selected',
        selectionConfirmed: isSelectionConfirmed,
        selectedAt: team?.selectedAt || new Date(),
        selectedProblem: selectedProblem
      },
      teamLead: {
        name: teamLead?.name || authItem?.leadName || req.user.name || 'Team Lead',
        registrationNumber: cleanRegNum,
        email: `${cleanRegNum}@klu.ac.in`
      },
      members
    });
  } catch (err) {
    console.error('Fetch my-team error:', err);
    return res.status(500).json({ error: 'Failed to fetch team details.' });
  }
});

// 2. GET PUBLIC TEAM INFORMATION PAGE (Public Endpoint - QR Code Scanning)
router.get('/public/:tokenOrId', async (req, res) => {
  try {
    const rawParam = req.params.tokenOrId ? req.params.tokenOrId.trim() : '';
    if (!rawParam) {
      return res.status(400).json({ error: 'Team token or ID required.' });
    }

    // Try finding team by teamQrToken, name, or teamId
    let team = await Team.findOne({
      $or: [
        { teamQrToken: rawParam },
        { name: rawParam.toUpperCase() },
        { teamId: rawParam.toUpperCase() }
      ]
    });

    if (!team) {
      return res.status(404).json({ error: `Team with ID / QR Token '${rawParam}' not found.` });
    }

    await ensureTeamTokens(team);
    const members = sanitizeTeamMembers(team);

    // Lookup Team Lead details
    const teamLeadDoc = await TeamLead.findOne({ registrationNumber: team.teamLeadRegNum });
    const leadName = teamLeadDoc ? teamLeadDoc.name : (members[0] ? members[0].name : `Team Lead (${team.name})`);

    const isSelectionConfirmed = Boolean(
      team.selectionConfirmed &&
      team.selectedProblemCode &&
      team.selectedProblemCode !== 'Not Selected'
    );

    // Fetch problem title if selected
    let selectedProblemTitle = null;
    if (isSelectionConfirmed) {
      const ps = await ProblemStatement.findOne({ problemId: team.selectedProblemCode });
      if (ps) selectedProblemTitle = ps.title;
    }

    // Expose only non-sensitive public details for verification
    const publicTeamInfo = {
      teamId: team.name || team.teamId,
      teamName: team.name,
      college: team.college || 'KARE',
      department: team.department || 'CSE',
      registrationStatus: team.registrationStatus || 'CONFIRMED',
      eventPassStatus: team.eventPassStatus || 'ACTIVE',
      teamLead: {
        name: leadName,
        registrationNumber: team.teamLeadRegNum
      },
      members: members.map((m, idx) => ({
        index: idx + 1,
        name: m.name,
        registrationNumber: m.registrationNumber,
        role: m.role || (idx === 0 ? 'LEAD' : 'MEMBER')
      })),
      selectedProblemCode: isSelectionConfirmed ? team.selectedProblemCode : null,
      selectedProblemTitle: isSelectionConfirmed ? selectedProblemTitle : null,
      selectionConfirmed: isSelectionConfirmed
    };

    return res.json({ team: publicTeamInfo });
  } catch (err) {
    console.error('Public team info error:', err);
    return res.status(500).json({ error: 'Failed to retrieve public team information.' });
  }
});

// 3. GET ALL TEAMS FOR ADMIN MANAGEMENT (Admin Only)
router.get('/admin/all', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const teams = await Team.find();
    const teamLeads = await TeamLead.find();
    const attendanceRecords = await Attendance.find();
    const appBaseUrl = config.FRONTEND_URL || 'http://localhost:5173';

    // Map attendance count per team
    const attendanceByTeam = {};
    attendanceRecords.forEach(r => {
      if (r.teamName) {
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
        teamName: item.teamName, // Official Team Name (e.g. INNOVATES)
        teamLeadRegNum: item.regNum,
        teamLeadName: dbLead?.name || item.leadName || `Team Lead (${item.teamId})`,
        membersCount: members.length,
        members: members,
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
    console.error('Admin fetch all teams error:', err);
    return res.status(500).json({ error: 'Failed to fetch team list.' });
  }
});

// 4. ADMIN: REGENERATE TEAM QR CODE TOKEN
router.post('/admin/:id/regenerate-qr', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    const newToken = `TQ-${team.name || 'ALPHA'}-${uuidv4().substring(0, 8).toUpperCase()}`;
    team.teamQrToken = newToken;
    await team.save();

    const appBaseUrl = config.FRONTEND_URL || 'http://localhost:5173';
    const newQrUrl = `${appBaseUrl}/team/${newToken}`;

    return res.json({
      message: `New unique Team QR generated for ${team.name}!`,
      teamQrToken: newToken,
      publicQrUrl: newQrUrl
    });
  } catch (err) {
    console.error('Regenerate QR error:', err);
    return res.status(500).json({ error: 'Failed to regenerate Team QR code.' });
  }
});

// 5. GET TEAM QR IMAGE ENDPOINT (Renders PNG Image directly)
router.get('/qr-image/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const appBaseUrl = config.FRONTEND_URL || 'http://localhost:5173';
    const targetUrl = `${appBaseUrl}/team/${token}`;

    const qrPngBuffer = await QRCode.toBuffer(targetUrl, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#00F2FE',
        light: '#0F172A'
      }
    });

    res.setHeader('Content-Type', 'image/png');
    return res.send(qrPngBuffer);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate QR image.' });
  }
});

module.exports = router;
