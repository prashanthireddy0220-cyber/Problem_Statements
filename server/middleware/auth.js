const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { TeamLead, ActiveSession, SystemSettings } = require('../models/Schema');

const JWT_SECRET = config.JWT_SECRET;

// Lightweight in-memory cache for SystemSettings to avoid hitting MongoDB on every single request
let cachedSettings = null;
let cachedSettingsTime = 0;
const SETTINGS_CACHE_TTL = 10000; // 10 seconds

const getCachedSettings = async () => {
  const now = Date.now();
  if (cachedSettings && (now - cachedSettingsTime < SETTINGS_CACHE_TTL)) {
    return cachedSettings;
  }
  try {
    cachedSettings = await SystemSettings.findOne().lean();
    cachedSettingsTime = now;
  } catch (err) {
    if (cachedSettings) return cachedSettings;
  }
  return cachedSettings;
};

const invalidateSettingsCache = () => {
  cachedSettings = null;
  cachedSettingsTime = 0;
};

// Middleware to authenticate JWT token and enforce single-device session lock
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required', code: 'NO_TOKEN' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, registrationNumber, username, role, sessionId }

    // Fast cached check of system module settings
    const settings = await getCachedSettings();
    if (settings) {
      if (decoded.role === 'TEAM_LEAD' && !settings.teamLeadAccessEnabled) {
        return res.status(403).json({ error: 'Team Lead access has been temporarily disabled by the administrator.', code: 'ACCESS_DISABLED' });
      }
      if (decoded.role === 'VOLUNTEER' && !settings.volunteerAccessEnabled) {
        return res.status(403).json({ error: 'Volunteer access has been temporarily disabled by the administrator.', code: 'ACCESS_DISABLED' });
      }
    }

    // STRICT SINGLE-DEVICE LOGIN VERIFICATION FOR TEAM LEADS (Queried concurrently)
    if (decoded.role === 'TEAM_LEAD') {
      const [teamLead, sessionRecord] = await Promise.all([
        TeamLead.findOne({ registrationNumber: decoded.registrationNumber }),
        ActiveSession.findOne({ sessionId: decoded.sessionId }).lean()
      ]);

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

// Require specific role(s) (case-insensitive check)
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = (req.user?.role || '').trim().toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => (r || '').trim().toUpperCase());
    if (normalizedAllowed.includes('ADMIN')) {
      normalizedAllowed.push('SUPERADMIN', 'ADMINISTRATOR', 'ORGANIZER', 'HEAD_ORGANIZER');
    }
    const isAllowed = normalizedAllowed.includes(userRole);
    if (!req.user || !isAllowed) {
      return res.status(403).json({
        error: 'Forbidden: You do not have permission to access this resource.',
        code: 'FORBIDDEN_ROLE',
        currentRole: userRole,
        requiredRole: allowedRoles.join('/')
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  JWT_SECRET,
  invalidateSettingsCache
};
