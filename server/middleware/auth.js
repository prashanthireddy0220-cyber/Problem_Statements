const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { TeamLead, ActiveSession, SystemSettings } = require('../models/Schema');

const JWT_SECRET = config.JWT_SECRET;

// Middleware to authenticate JWT token and enforce single-device session lock
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required', code: 'NO_TOKEN' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, registrationNumber, username, role, sessionId }

    // Verify system module settings (e.g. if access is disabled by admin)
    const settings = await SystemSettings.findOne();
    if (settings) {
      if (decoded.role === 'TEAM_LEAD' && !settings.teamLeadAccessEnabled) {
        return res.status(403).json({ error: 'Team Lead access has been temporarily disabled by the administrator.', code: 'ACCESS_DISABLED' });
      }
      if (decoded.role === 'VOLUNTEER' && !settings.volunteerAccessEnabled) {
        return res.status(403).json({ error: 'Volunteer access has been temporarily disabled by the administrator.', code: 'ACCESS_DISABLED' });
      }
    }

    // STRICT SINGLE-DEVICE LOGIN VERIFICATION FOR TEAM LEADS
    if (decoded.role === 'TEAM_LEAD') {
      const teamLead = await TeamLead.findOne({ registrationNumber: decoded.registrationNumber });
      if (!teamLead) {
        return res.status(401).json({ error: 'Registered Team Lead account not found.', code: 'USER_NOT_FOUND' });
      }

      if (teamLead.revoked) {
        return res.status(403).json({ error: 'Your account access has been revoked by the administrator.', code: 'ACCOUNT_REVOKED' });
      }

      // Check if session ID matches active session ID in database
      if (teamLead.activeSessionId && teamLead.activeSessionId !== decoded.sessionId) {
        return res.status(401).json({
          error: 'Your account has been logged in from another device. You have been logged out from this device.',
          code: 'SINGLE_DEVICE_REVOKED'
        });
      }

      // Also check ActiveSession collection
      const sessionRecord = await ActiveSession.findOne({ sessionId: decoded.sessionId });
      if (!sessionRecord) {
        return res.status(401).json({
          error: 'Your session has expired or been terminated from another device.',
          code: 'SINGLE_DEVICE_REVOKED'
        });
      }
      req.teamLead = teamLead;
    } else {
      // Admin and Volunteer session check (auto-heal if session lost due to server restart)
      let sessionRecord = await ActiveSession.findOne({ sessionId: decoded.sessionId });
      if (!sessionRecord && decoded.sessionId) {
        try {
          sessionRecord = await ActiveSession.create({
            userId: decoded.id || decoded.username || 'admin-user',
            registrationNumber: decoded.username || 'ADMIN',
            role: decoded.role,
            sessionId: decoded.sessionId,
            deviceId: 'server-restored-session'
          });
        } catch (e) {
          // If creation fails due to race condition, check again
          sessionRecord = await ActiveSession.findOne({ sessionId: decoded.sessionId });
        }
      }
      if (!sessionRecord) {
        return res.status(401).json({
          error: 'Session invalid or revoked.',
          code: 'SESSION_INVALID'
        });
      }
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.', code: 'TOKEN_INVALID' });
  }
};

// Require specific role(s)
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource.', code: 'FORBIDDEN_ROLE' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  JWT_SECRET
};
