const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { TeamLead, Admin, Volunteer, ActiveSession, Team, AuditLog } = require('../models/Schema');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');
const AUTHORIZED_TEAMS = require('../data/teamsData');

// 1. TEAM LEAD LOGIN (Strict 2-Field Authentication & Single-Device Access)
const handleTeamLeadLogin = async (req, res) => {
  try {
    const { teamId, registrationNumber, deviceId } = req.body;

    if (!teamId || typeof teamId !== 'string' || !registrationNumber || typeof registrationNumber !== 'string') {
      return res.status(400).json({ error: 'Invalid Team ID or Team Lead Registration Number' });
    }

    const cleanTeamId = teamId.trim().toUpperCase();
    const cleanRegNum = registrationNumber.trim().toUpperCase();

    // 1. Check if Team ID + Registration Number combination exists in authorized list
    const isAuthorized = AUTHORIZED_TEAMS.some(t => t.teamId === cleanTeamId && t.regNum === cleanRegNum);
    if (!isAuthorized) {
      return res.status(401).json({
        error: 'Invalid Team ID or Team Lead Registration Number',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // 2. Lookup Team Lead & Team in Database
    let teamLead = await TeamLead.findOne({ registrationNumber: cleanRegNum }).populate('teamId');

    // Auto-heal / Seed on the fly if DB record is missing for this authorized pair
    if (!teamLead) {
      let team = await Team.findOne({ name: cleanTeamId });
      if (!team) {
        team = await Team.create({
          name: cleanTeamId,
          teamId: cleanTeamId,
          teamLeadRegNum: cleanRegNum,
          college: 'KARE',
          department: 'CSE',
          members: [
            { name: `Team Lead (${cleanTeamId})`, registrationNumber: cleanRegNum, role: 'LEAD', phone: '9876543210' }
          ]
        });
      }
      teamLead = await TeamLead.create({
        registrationNumber: cleanRegNum,
        name: `Team Lead (${cleanTeamId})`,
        teamId: team._id,
        phone: '9876543210',
        email: `${cleanTeamId.toLowerCase()}@hackathon.edu`
      });
      teamLead.teamId = team;
    }

    // 3. Ensure Team Lead's associated Team ID matches the submitted Team ID exactly
    if (!teamLead.teamId || teamLead.teamId.name !== cleanTeamId) {
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

    return res.json({
      message: 'Login successful',
      token,
      sessionId: newSessionId,
      user: {
        id: teamLead._id,
        registrationNumber: cleanRegNum,
        name: teamLead.name,
        role: 'TEAM_LEAD',
        team: teamLead.teamId ? {
          id: teamLead.teamId._id,
          name: teamLead.teamId.name,
          college: teamLead.teamId.college,
          selectionConfirmed: teamLead.teamId.selectionConfirmed,
          selectedProblemCode: teamLead.teamId.selectedProblemCode
        } : null
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

// 4. VERIFY ACTIVE SESSION / ME ENDPOINT
router.get('/me', authenticateToken, async (req, res) => {
  try {
    let userData = { ...req.user };
    if (req.user.role === 'TEAM_LEAD') {
      const teamLead = await TeamLead.findOne({ registrationNumber: req.user.registrationNumber }).populate('teamId');
      if (teamLead) {
        userData.team = teamLead.teamId ? {
          id: teamLead.teamId._id,
          name: teamLead.teamId.name,
          college: teamLead.teamId.college,
          selectionConfirmed: teamLead.teamId.selectionConfirmed,
          selectedProblemCode: teamLead.teamId.selectedProblemCode
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
