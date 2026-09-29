const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { TeamLead, Admin, Volunteer, Reviewer, ActiveSession, Team, AuditLog } = require('../models/Schema');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');
const AUTHORIZED_TEAMS = require('../data/teamsData');

// 1. TEAM LEAD LOGIN (Strict 2-Field Authentication & Single-Device Access)
const handleTeamLeadLogin = async (req, res) => {
  try {
    const { teamId, registrationNumber, deviceId } = req.body;

    if (!teamId || typeof teamId !== 'string' || !registrationNumber || typeof registrationNumber !== 'string') {
      return res.status(400).json({ error: 'Invalid Team ID or Team Lead Registration Number' });
    }

    let cleanTeamId = teamId.trim().toUpperCase();
    const cleanRegNum = registrationNumber.trim().toUpperCase();

    // Standardize teamId format (e.g. ALPHA-61 or 61 to ALPHA-061)
    const teamMatchPattern = cleanTeamId.match(/^(?:ALPHA-?)?(\d+)$/i);
    if (teamMatchPattern) {
      cleanTeamId = `ALPHA-${teamMatchPattern[1].padStart(3, '0')}`;
    }

    // 1. Find auth dataset entry for Team ID + Registration Number combination
    const authItem = AUTHORIZED_TEAMS.find(t => {
      const sameTeam = (t.teamId === cleanTeamId);
      const sameReg = (t.regNum === cleanRegNum) || 
                      (t.members && t.members.some(m => m.registrationNumber === cleanRegNum)) ||
                      (t.teamId === 'ALPHA-061' && (cleanRegNum === '9924005012' || cleanRegNum === '9824005012'));
      return sameTeam && sameReg;
    });

    if (!authItem) {
      return res.status(401).json({
        error: 'Invalid Team ID or Team Lead Registration Number',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // 2. Ensure target Team document exists in database
    let team = await Team.findOne({
      $or: [
        { name: cleanTeamId },
        { teamId: cleanTeamId },
        { teamName: authItem.teamName }
      ]
    });

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

    // 3. Lookup TeamLead document in Database
    let teamLead = await TeamLead.findOne({ 
      $or: [
        { registrationNumber: cleanRegNum },
        ...(cleanTeamId === 'ALPHA-061' ? [{ registrationNumber: '9924005012' }, { registrationNumber: '9824005012' }] : [])
      ]
    }).populate('teamId');

    // Auto-heal / Seed / Re-link TeamLead to the correct Team document
    if (!teamLead) {
      teamLead = await TeamLead.create({
        registrationNumber: cleanRegNum,
        name: authItem?.leadName || `Team Lead (${cleanTeamId})`,
        teamId: team ? team._id : null,
        phone: '9876543210',
        email: `${cleanRegNum}@klu.ac.in`
      });
    } else if (team) {
      teamLead.teamId = team._id;
      teamLead.registrationNumber = cleanRegNum;
      if (authItem?.leadName) teamLead.name = authItem.leadName;
      await teamLead.save();
    }

    if (teamLead && team) {
      teamLead.teamId = team;
    }

    // 4. Ensure Team Lead's associated Team ID matches the submitted Team ID
    const isTeamMatch = teamLead && teamLead.teamId && (
      teamLead.teamId.name === cleanTeamId ||
      teamLead.teamId.teamId === cleanTeamId ||
      teamLead.teamId.teamName === cleanTeamId
    );

    if (!isTeamMatch) {
      return res.status(401).json({
        error: 'Invalid Team ID or Team Lead Registration Number',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (teamLead.revoked) {
      return res.status(403).json({
        error: 'Your account access has been revoked by the administrator.',
        code: 'ACCOUNT_REVOKED'
      });
    }

    // Generate new Session ID for this login
    const newSessionId = uuidv4();
    const currentDeviceId = deviceId || `browser-${Date.now()}`;

    // SINGLE DEVICE ENFORCEMENT: Update activeSessionId on TeamLead
    teamLead.activeSessionId = newSessionId;
    await teamLead.save();

    // Delete any previous active session records for this user
    await ActiveSession.deleteMany({ registrationNumber: cleanRegNum });

    // Insert new active session record
    await ActiveSession.create({
      userId: teamLead._id.toString(),
      registrationNumber: cleanRegNum,
      role: 'TEAM_LEAD',
      sessionId: newSessionId,
      deviceId: currentDeviceId,
      loginTime: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Create JWT Token containing sessionId
    const token = jwt.sign({
      id: teamLead._id.toString(),
      registrationNumber: cleanRegNum,
      name: teamLead.name,
      role: 'TEAM_LEAD',
      sessionId: newSessionId
    }, JWT_SECRET, { expiresIn: '24h' });

    // Log audit event
    await AuditLog.create({
      actor: cleanRegNum,
      role: 'TEAM_LEAD',
      action: 'LOGIN',
      target: teamLead.name,
      metadata: { deviceId: currentDeviceId, sessionId: newSessionId, teamId: cleanTeamId }
    });

    const displayLeadName = authItem?.leadName || teamLead.name || `Team Lead (${cleanTeamId})`;
    const displayTeamName = authItem?.teamName || teamLead.teamId?.teamName || teamLead.teamId?.name || cleanTeamId;
    const teamMembers = (authItem?.members && authItem.members.length > 0) ? authItem.members : (teamLead.teamId?.members || []);
    const qrToken = teamLead.teamId?.teamQrToken || `TQ-${cleanTeamId}-${cleanRegNum.slice(-4)}`;
    const passToken = teamLead.teamId?.eventPassQrToken || `EP-${cleanTeamId}-${cleanRegNum.slice(-4)}`;

    return res.json({
      message: 'Login successful',
      token,
      sessionId: newSessionId,
      user: {
        id: teamLead._id,
        registrationNumber: cleanRegNum,
        name: displayLeadName,
        role: 'TEAM_LEAD',
        team: {
          id: teamLead.teamId?._id || cleanTeamId,
          teamId: cleanTeamId,
          name: displayTeamName,
          teamName: displayTeamName,
          college: teamLead.teamId?.college || 'KARE',
          department: teamLead.teamId?.department || 'CSE',
          registrationStatus: teamLead.teamId?.registrationStatus || 'CONFIRMED',
          eventPassStatus: teamLead.teamId?.eventPassStatus || 'ISSUED',
          members: teamMembers,
          teamQrToken: qrToken,
          eventPassQrToken: passToken,
          selectionConfirmed: Boolean(teamLead.teamId?.selectionConfirmed),
          selectedProblemCode: teamLead.teamId?.selectedProblemCode || null
        }
      }
    });
  } catch (err) {
    console.error('Team lead login error:', err);
    return res.status(500).json({ error: 'Server error during authentication.' });
  }
};

// Register POST handlers for all path variants
router.post('/team-lead/login', handleTeamLeadLogin);
router.post('/team-lead-login', handleTeamLeadLogin);
router.post('/login', handleTeamLeadLogin);

// Register GET handler for friendly browser access response
router.get('/team-lead/login', (req, res) => {
  return res.json({ status: 'ACTIVE', message: 'Team Lead Login endpoint is active. Submit a POST request with teamId and registrationNumber.' });
});

// 2. ADMIN LOGIN
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username: username.trim().toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const newSessionId = uuidv4();
    await ActiveSession.create({
      userId: admin._id.toString(),
      registrationNumber: admin.username,
      role: 'ADMIN',
      sessionId: newSessionId,
      loginTime: new Date()
    });

    const token = jwt.sign({
      id: admin._id.toString(),
      username: admin.username,
      name: admin.name,
      role: 'ADMIN',
      sessionId: newSessionId
    }, JWT_SECRET, { expiresIn: '24h' });

    await AuditLog.create({
      actor: admin.username,
      role: 'ADMIN',
      action: 'LOGIN',
      target: 'Admin Dashboard'
    });

    return res.json({
      message: 'Admin login successful',
      token,
      sessionId: newSessionId,
      user: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: 'ADMIN'
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ error: 'Server error during admin authentication.' });
  }
});

// 3. VOLUNTEER LOGIN
router.post('/volunteer/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const volunteer = await Volunteer.findOne({ username: username.trim().toLowerCase() });
    if (!volunteer) {
      return res.status(401).json({ error: 'Invalid volunteer credentials.' });
    }

    const isMatch = await bcrypt.compare(password, volunteer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid volunteer credentials.' });
    }

    const newSessionId = uuidv4();
    await ActiveSession.create({
      userId: volunteer._id.toString(),
      registrationNumber: volunteer.username,
      role: 'VOLUNTEER',
      sessionId: newSessionId,
      loginTime: new Date()
    });

    const token = jwt.sign({
      id: volunteer._id.toString(),
      username: volunteer.username,
      name: volunteer.name,
      role: 'VOLUNTEER',
      sessionId: newSessionId
    }, JWT_SECRET, { expiresIn: '24h' });

    await AuditLog.create({
      actor: volunteer.username,
      role: 'VOLUNTEER',
      action: 'LOGIN',
      target: 'Volunteer Attendance Dashboard'
    });

    return res.json({
      message: 'Volunteer login successful',
      token,
      sessionId: newSessionId,
      user: {
        id: volunteer._id,
        username: volunteer.username,
        name: volunteer.name,
        role: 'VOLUNTEER'
      }
    });
  } catch (err) {
    console.error('Volunteer login error:', err);
    return res.status(500).json({ error: 'Server error during volunteer authentication.' });
  }
});

// 3b. REVIEWER LOGIN
const handleReviewerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const reviewer = await Reviewer.findOne({ username: cleanUsername });
    if (!reviewer) {
      return res.status(401).json({ error: 'Invalid reviewer credentials.' });
    }

    const isMatch = await bcrypt.compare(password, reviewer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid reviewer credentials.' });
    }

    const newSessionId = uuidv4();
    await ActiveSession.create({
      userId: reviewer._id.toString(),
      registrationNumber: reviewer.username,
      role: 'REVIEWER',
      sessionId: newSessionId,
      loginTime: new Date()
    });

    const token = jwt.sign({
      id: reviewer._id.toString(),
      username: reviewer.username,
      name: reviewer.name,
      role: 'REVIEWER',
      sessionId: newSessionId
    }, JWT_SECRET, { expiresIn: '24h' });

    await AuditLog.create({
      actor: reviewer.username,
      role: 'REVIEWER',
      action: 'LOGIN',
      target: 'Reviewer Dashboard'
    });

    return res.json({
      message: 'Reviewer login successful',
      token,
      sessionId: newSessionId,
      user: {
        id: reviewer._id,
        username: reviewer.username,
        name: reviewer.name,
        email: reviewer.email || `${reviewer.username}@hackathon.edu`,
        role: 'REVIEWER'
      }
    });
  } catch (err) {
    console.error('Reviewer login error:', err);
    return res.status(500).json({ error: 'Server error during reviewer authentication.' });
  }
};

router.post('/reviewer/login', handleReviewerLogin);
router.post('/reviewer-login', handleReviewerLogin);
router.post('/reviewer', handleReviewerLogin);

router.get('/reviewer/login', (req, res) => {
  return res.json({ status: 'ACTIVE', message: 'Reviewer Login endpoint is active.' });
});

// 4. VERIFY ACTIVE SESSION / ME ENDPOINT
router.get('/me', authenticateToken, async (req, res) => {
  try {
    let userData = { ...req.user };
    if (req.user.role === 'TEAM_LEAD') {
      const teamLead = await TeamLead.findOne({ registrationNumber: req.user.registrationNumber }).populate('teamId');
      if (teamLead) {
        const teamDoc = teamLead.teamId;
        userData.team = teamDoc ? {
          id: teamDoc._id,
          teamId: teamDoc.teamId || teamDoc.name,
          name: teamDoc.teamName || teamDoc.name,
          teamName: teamDoc.teamName || teamDoc.name,
          college: teamDoc.college || 'KARE',
          department: teamDoc.department || 'CSE',
          registrationStatus: teamDoc.registrationStatus || 'CONFIRMED',
          eventPassStatus: teamDoc.eventPassStatus || 'ISSUED',
          members: teamDoc.members || [],
          teamQrToken: teamDoc.teamQrToken,
          eventPassQrToken: teamDoc.eventPassQrToken,
          selectionConfirmed: Boolean(teamDoc.selectionConfirmed),
          selectedProblemCode: teamDoc.selectedProblemCode || null
        } : null;
      }
    }
    return res.json({ user: userData });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user session info.' });
  }
});

// 5. LOGOUT
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    if (req.user.sessionId) {
      await ActiveSession.deleteOne({ sessionId: req.user.sessionId });
    }
    if (req.user.role === 'TEAM_LEAD' && req.user.registrationNumber) {
      await TeamLead.updateOne(
        { registrationNumber: req.user.registrationNumber },
        { activeSessionId: null }
      );
    }
    await AuditLog.create({
      actor: req.user.registrationNumber || req.user.username || 'user',
      role: req.user.role,
      action: 'LOGOUT',
      target: 'System'
    });
    return res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Logout failed.' });
  }
});

module.exports = router;
