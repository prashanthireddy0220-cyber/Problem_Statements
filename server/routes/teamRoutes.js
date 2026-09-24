const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { Team, TeamLead, Participant, ProblemStatement, Attendance } = require('../models/Schema');
const { authenticateToken, requireRole } = require('../middleware/auth');
const config = require('../config/env');

// Helper to ensure team has valid teamQrToken and eventPassQrToken
async function ensureTeamTokens(team) {
  let updated = false;
  if (!team.teamQrToken) {
    team.teamQrToken = `TQ-${team.name || team.teamId || 'ALPHA'}-${uuidv4().substring(0, 8).toUpperCase()}`;
    updated = true;
  }
  if (!team.eventPassQrToken) {
    team.eventPassQrToken = `EP-${team.name || team.teamId || 'ALPHA'}-${uuidv4().substring(0, 8).toUpperCase()}`;
    updated = true;
  }
  if (updated) {
    await team.save();
  }
  return team;
}

// Helper to populate default full team members if missing/incomplete
function sanitizeTeamMembers(team) {
  if (!team.members || team.members.length === 0) {
    const leadReg = team.teamLeadRegNum || 'REG-LEAD';
    return [
      { name: `Team Lead (${team.name})`, registrationNumber: leadReg, role: 'LEAD', phone: '9876543210', email: `${team.name.toLowerCase()}@hackathon.edu` },
      { name: `Member 1 (${team.name})`, registrationNumber: `${leadReg}-M1`, role: 'MEMBER', phone: '9876543211', email: `m1.${team.name.toLowerCase()}@hackathon.edu` },
      { name: `Member 2 (${team.name})`, registrationNumber: `${leadReg}-M2`, role: 'MEMBER', phone: '9876543212', email: `m2.${team.name.toLowerCase()}@hackathon.edu` },
      { name: `Member 3 (${team.name})`, registrationNumber: `${leadReg}-M3`, role: 'MEMBER', phone: '9876543213', email: `m3.${team.name.toLowerCase()}@hackathon.edu` }
    ];
  }
  return team.members;
}

// 1. GET MY TEAM DASHBOARD DATA (Team Lead Only)
router.get('/my-team', authenticateToken, requireRole('TEAM_LEAD'), async (req, res) => {
  try {
    const cleanRegNum = req.user.registrationNumber;
    let teamLead = await TeamLead.findOne({ registrationNumber: cleanRegNum }).populate('teamId');
    
    if (!teamLead || !teamLead.teamId) {
      // Lookup team directly by teamLeadRegNum
      const teamDoc = await Team.findOne({ teamLeadRegNum: cleanRegNum });
      if (!teamDoc) {
        return res.status(404).json({ error: 'Team details not found for this account.' });
      }
      if (!teamLead) {
        teamLead = await TeamLead.create({
          registrationNumber: cleanRegNum,
          name: req.user.name || `Team Lead (${teamDoc.name})`,
          teamId: teamDoc._id,
          phone: '9876543210',
          email: `${teamDoc.name.toLowerCase()}@hackathon.edu`
        });
      } else {
        teamLead.teamId = teamDoc._id;
        await teamLead.save();
      }
      teamLead.teamId = teamDoc;
    }

    const team = await ensureTeamTokens(teamLead.teamId);
    const members = sanitizeTeamMembers(team);

    // Fetch problem details if selected
    let selectedProblem = null;
    if (team.selectedProblemCode) {
      selectedProblem = await ProblemStatement.findOne({ problemId: team.selectedProblemCode });
    }

    const appBaseUrl = config.FRONTEND_URL || 'http://localhost:5173';
    const publicQrUrl = `${appBaseUrl}/team/${team.teamQrToken}`;

    return res.json({
      team: {
        id: team._id,
        teamId: team.name || team.teamId,
        name: team.name,
        college: team.college || 'KARE',
        department: team.department || 'CSE',
        registrationStatus: team.registrationStatus || 'CONFIRMED',
        eventPassStatus: team.eventPassStatus || 'ISSUED',
        teamQrToken: team.teamQrToken,
        publicQrUrl,
        eventPassQrToken: team.eventPassQrToken,
        selectedProblemCode: team.selectedProblemCode,
        selectionConfirmed: team.selectionConfirmed,
        selectedAt: team.selectedAt,
        selectedProblem
      },
      teamLead: {
        name: teamLead.name,
        registrationNumber: teamLead.registrationNumber,
        email: teamLead.email || `${team.name.toLowerCase()}@hackathon.edu`,
        phone: teamLead.phone || '9876543210'
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

    // Fetch problem title if selected
    let selectedProblemTitle = null;
    if (team.selectedProblemCode) {
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
      selectedProblemCode: team.selectedProblemCode || null,
      selectedProblemTitle: selectedProblemTitle || null,
      selectionConfirmed: Boolean(team.selectionConfirmed)
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
    const teams = await Team.find().sort({ name: 1 });
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

    const detailedTeams = await Promise.all(teams.map(async (t) => {
      await ensureTeamTokens(t);
      const members = sanitizeTeamMembers(t);
      const lead = teamLeads.find(l => l.registrationNumber === t.teamLeadRegNum);

      return {
        _id: t._id,
        teamId: t.name || t.teamId,
        teamName: t.name,
        teamLeadRegNum: t.teamLeadRegNum,
        teamLeadName: lead ? lead.name : (members[0] ? members[0].name : `Team Lead (${t.name})`),
        membersCount: members.length,
        members: members,
        college: t.college || 'KARE',
        department: t.department || 'CSE',
        selectedProblemCode: t.selectedProblemCode || 'Not Selected',
        selectionConfirmed: t.selectionConfirmed,
        teamQrToken: t.teamQrToken,
        publicQrUrl: `${appBaseUrl}/team/${t.teamQrToken}`,
        eventPassStatus: t.eventPassStatus || 'ISSUED',
        registrationStatus: t.registrationStatus || 'CONFIRMED',
        attendanceCount: attendanceByTeam[t.name] || 0
      };
    }));

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
