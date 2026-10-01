import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const extractErrorMessage = (err, fallback) => {
  if (!err) return fallback;
  const isHtml = (str) => typeof str === 'string' && (str.includes('<html') || str.includes('<!DOCTYPE') || str.includes('<body') || str.includes('<pre>') || str.includes('Cannot POST') || str.includes('Cannot GET') || str.includes('502 Bad Gateway'));

  if (typeof err === 'string') return isHtml(err) ? fallback : err;
  const data = err.response?.data;
  if (typeof data === 'string') return isHtml(data) ? fallback : data;
  if (data && typeof data.error === 'string') return isHtml(data.error) ? fallback : data.error;
  if (data && typeof data.message === 'string') return isHtml(data.message) ? fallback : data.message;
  if (data && typeof data.error === 'object' && data.error !== null) {
    const msg = data.error.message || data.error.error || JSON.stringify(data.error);
    return isHtml(msg) ? fallback : msg;
  }
  if (err.message && typeof err.message === 'string') {
    if (err.message.toLowerCase().includes('network error') || err.message.toLowerCase().includes('timeout')) {
      return 'Server is waking up or reconnecting. Please wait a few seconds and try again.';
    }
    return isHtml(err.message) ? fallback : err.message;
  }
  return fallback;
};

const getCleanBaseUrl = (rawUrl) => {
  if (!rawUrl) return '';
  let cleaned = rawUrl.trim();
  while (cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  if (cleaned.endsWith('/api')) {
    cleaned = cleaned.slice(0, -4);
  }
  return cleaned;
};

import AUTHORIZED_TEAMS from '../data/teamsData.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    let roleKey = 'alpha_user';
    if (currentPath.startsWith('/admin') && localStorage.getItem('alpha_admin_user')) {
      roleKey = 'alpha_admin_user';
    } else if (currentPath.startsWith('/reviewer') && localStorage.getItem('alpha_reviewer_user')) {
      roleKey = 'alpha_reviewer_user';
    } else if (currentPath.startsWith('/volunteer') && localStorage.getItem('alpha_volunteer_user')) {
      roleKey = 'alpha_volunteer_user';
    } else if (currentPath.startsWith('/team-lead') && localStorage.getItem('alpha_team_lead_user')) {
      roleKey = 'alpha_team_lead_user';
    }
    const saved = localStorage.getItem(roleKey) || localStorage.getItem('alpha_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.role === 'TEAM_LEAD' && parsed?.team) {
        const authItem = AUTHORIZED_TEAMS.find(t => 
          (t.teamId && t.teamId.toUpperCase() === String(parsed.team.teamId || parsed.team.name).trim().toUpperCase()) ||
          (t.regNum && t.regNum.toUpperCase() === String(parsed.registrationNumber).trim().toUpperCase())
        );
        if (authItem?.fixedProblemStatementId) {
          if (!parsed.team.selectedProblemCode || parsed.team.selectedProblemCode === 'Not Selected') {
            parsed.team.selectedProblemCode = authItem.fixedProblemStatementId;
            parsed.team.selectionConfirmed = true;
          }
        }
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    let roleKey = 'alpha_token';
    if (currentPath.startsWith('/admin') && localStorage.getItem('alpha_admin_token')) {
      roleKey = 'alpha_admin_token';
    } else if (currentPath.startsWith('/reviewer') && localStorage.getItem('alpha_reviewer_token')) {
      roleKey = 'alpha_reviewer_token';
    } else if (currentPath.startsWith('/volunteer') && localStorage.getItem('alpha_volunteer_token')) {
      roleKey = 'alpha_volunteer_token';
    } else if (currentPath.startsWith('/team-lead') && localStorage.getItem('alpha_team_lead_token')) {
      roleKey = 'alpha_team_lead_token';
    }
    return localStorage.getItem(roleKey) || localStorage.getItem('alpha_token') || null;
  });

  const [sessionId, setSessionId] = useState(() => localStorage.getItem('alpha_session_id') || null);
  const [revokedMessage, setRevokedMessage] = useState(null);

  const resolveBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return '';
      }
    }
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      const clean = getCleanBaseUrl(envUrl);
      if (!clean.includes('localhost') && !clean.includes('127.0.0.1')) {
        return clean;
      }
    }
    return 'https://problem-statements-w7wq.onrender.com';
  };

  // Configure Axios Base URL dynamically
  useEffect(() => {
    axios.defaults.baseURL = resolveBaseUrl();
  }, []);
  
  axios.defaults.baseURL = resolveBaseUrl();

  // Axios Request Interceptor: Dynamically resolve appropriate role-scoped token to prevent cross-tab permission collision
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      let activeToken = null;
      const url = config.url || '';
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

      if (url.includes('/api/admin') || url.includes('/api/problems/admin') || url.includes('/api/attendance/admin') || currentPath.startsWith('/admin')) {
        activeToken = localStorage.getItem('alpha_admin_token') || localStorage.getItem('alpha_token');
      } else if (url.includes('/api/reviewer') || currentPath.startsWith('/reviewer')) {
        activeToken = localStorage.getItem('alpha_reviewer_token') || localStorage.getItem('alpha_token');
      } else if (url.includes('/api/volunteer') || currentPath.startsWith('/volunteer')) {
        activeToken = localStorage.getItem('alpha_volunteer_token') || localStorage.getItem('alpha_token');
      } else if (url.includes('/api/team-lead') || url.includes('/api/team') || currentPath.startsWith('/team-lead')) {
        activeToken = localStorage.getItem('alpha_team_lead_token') || localStorage.getItem('alpha_token');
      } else {
        activeToken = localStorage.getItem('alpha_token') || 
                      localStorage.getItem('alpha_admin_token') || 
                      localStorage.getItem('alpha_reviewer_token') || 
                      localStorage.getItem('alpha_volunteer_token') || 
                      localStorage.getItem('alpha_team_lead_token');
      }

      if (activeToken) {
        config.headers['Authorization'] = `Bearer ${activeToken}`;
      }
      return config;
    }, (error) => Promise.reject(error));

    return () => axios.interceptors.request.eject(reqInterceptor);
  }, [token]);

  // Proactively wake up backend cloud instance on site load and keep alive
  useEffect(() => {
    const warmBackend = () => {
      axios.get('/api/health').catch(() => {});
    };
    warmBackend();
    const keepAliveTimer = setInterval(warmBackend, 4 * 60 * 1000); // Ping every 4 minutes to avoid Render sleep
    return () => clearInterval(keepAliveTimer);
  }, []);

  useEffect(() => {
    const verifySessionOnMount = async () => {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      let roleToken = null;
      if (currentPath.startsWith('/admin')) {
        roleToken = localStorage.getItem('alpha_admin_token');
      } else if (currentPath.startsWith('/reviewer')) {
        roleToken = localStorage.getItem('alpha_reviewer_token');
      } else if (currentPath.startsWith('/volunteer')) {
        roleToken = localStorage.getItem('alpha_volunteer_token');
      } else if (currentPath.startsWith('/team-lead')) {
        roleToken = localStorage.getItem('alpha_team_lead_token');
      }
      const savedToken = roleToken || localStorage.getItem('alpha_token');
      if (savedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        try {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          if (res.data && res.data.user) {
            setUser(res.data.user);
            setToken(savedToken);
            localStorage.setItem('alpha_user', JSON.stringify(res.data.user));
            if (res.data.user.role === 'TEAM_LEAD') {
              localStorage.setItem('alpha_team_lead_user', JSON.stringify(res.data.user));
            }
          }
        } catch (err) {
          // If token verification fails on mount, do not force logout if other role sessions exist
        }
      }
    };
    verifySessionOnMount();
  }, []);

  // Global Axios Interceptor for Single-Device Lockout Detection
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          const data = error.response.data;
          if (data && (data.code === 'SINGLE_DEVICE_REVOKED' || data.code === 'ACCOUNT_REVOKED')) {
            setRevokedMessage(data.error || 'Your account has been logged in from another device. You have been logged out from this device.');
            logout(false); // Clear session without redirecting immediately so modal shows
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const performAuthPost = async (endpoint, data) => {
    let lastErr = null;
    const directBase = 'https://problem-statements-w7wq.onrender.com';
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

    // Ordered targets to ensure highest delivery success across cloud & mobile networks
    const candidateEndpoints = [
      endpoint,
      `${directBase}${endpoint}`
    ];
    if (isVercel) {
      candidateEndpoints.unshift(endpoint); // Vercel edge rewrite
    }
    const uniqueCandidates = [...new Set(candidateEndpoints)];

    for (let attempt = 0; attempt < 3; attempt++) {
      for (const target of uniqueCandidates) {
        try {
          const res = await axios.post(target, data, { timeout: 15000 });
          if (res.data && (res.data.token || res.data.sessionId || res.data.user)) {
            return res.data;
          }
        } catch (err) {
          lastErr = err;
          // If server returned 400, 401, or 403 (e.g. wrong credentials, revoked), do not retry!
          if (err.response && err.response.status >= 400 && err.response.status < 500) {
            throw err;
          }
        }
      }
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, 1200));
      }
    }
    throw lastErr;
  };

  const loginTeamLead = async (teamId, registrationNumber, deviceId) => {
    try {
      const data = await performAuthPost('/api/auth/team-lead/login', { teamId, registrationNumber, deviceId });
      const { token, user, sessionId } = data;

      // Guarantee user.team has their assigned fixed problem statement locked
      const authItem = AUTHORIZED_TEAMS.find(t => 
        (t.teamId && t.teamId.toUpperCase() === String(teamId).trim().toUpperCase()) ||
        (t.regNum && t.regNum.toUpperCase() === String(registrationNumber).trim().toUpperCase())
      );
      if (authItem?.fixedProblemStatementId && user?.team) {
        if (!user.team.selectedProblemCode || user.team.selectedProblemCode === 'Not Selected') {
          user.team.selectedProblemCode = authItem.fixedProblemStatementId;
          user.team.selectionConfirmed = true;
        }
      }
      
      localStorage.setItem('alpha_team_lead_token', token);
      localStorage.setItem('alpha_team_lead_user', JSON.stringify(user));
      localStorage.setItem('alpha_token', token);
      localStorage.setItem('alpha_user', JSON.stringify(user));
      localStorage.setItem('alpha_session_id', sessionId);
      
      setToken(token);
      setUser(user);
      setSessionId(sessionId);
      setRevokedMessage(null);
      return { success: true, user, team: data.team };
    } catch (err) {
      return { success: false, error: extractErrorMessage(err, 'Invalid credentials.') };
    }
  };

  const loginAdmin = async (username, password) => {
    try {
      const data = await performAuthPost('/api/auth/admin/login', { username, password });
      const { token, user, sessionId } = data;
      
      localStorage.setItem('alpha_admin_token', token);
      localStorage.setItem('alpha_admin_user', JSON.stringify(user));
      localStorage.setItem('alpha_token', token);
      localStorage.setItem('alpha_user', JSON.stringify(user));
      localStorage.setItem('alpha_session_id', sessionId);
      
      setToken(token);
      setUser(user);
      setSessionId(sessionId);
      setRevokedMessage(null);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: extractErrorMessage(err, 'Invalid admin credentials.') };
    }
  };

  const loginVolunteer = async (username, password) => {
    try {
      const data = await performAuthPost('/api/auth/volunteer/login', { username, password });
      const { token, user, sessionId } = data;
      
      localStorage.setItem('alpha_volunteer_token', token);
      localStorage.setItem('alpha_volunteer_user', JSON.stringify(user));
      localStorage.setItem('alpha_token', token);
      localStorage.setItem('alpha_user', JSON.stringify(user));
      localStorage.setItem('alpha_session_id', sessionId);
      
      setToken(token);
      setUser(user);
      setSessionId(sessionId);
      setRevokedMessage(null);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: extractErrorMessage(err, 'Invalid volunteer credentials.') };
    }
  };

  const loginReviewer = async (username, password) => {
    try {
      let data;
      try {
        data = await performAuthPost('/api/auth/reviewer/login', { username, password });
      } catch (firstErr) {
        if (firstErr.response?.status === 404) {
          try {
            data = await performAuthPost('/api/reviewer/login', { username, password });
          } catch (secondErr) {
            if (secondErr.response?.status === 404) {
              data = await performAuthPost('/api/auth/reviewer-login', { username, password });
            } else {
              throw secondErr;
            }
          }
        } else {
          throw firstErr;
        }
      }
      const { token, user, sessionId } = data;
      
      localStorage.setItem('alpha_reviewer_token', token);
      localStorage.setItem('alpha_reviewer_user', JSON.stringify(user));
      localStorage.setItem('alpha_token', token);
      localStorage.setItem('alpha_user', JSON.stringify(user));
      localStorage.setItem('alpha_session_id', sessionId);
      
      setToken(token);
      setUser(user);
      setSessionId(sessionId);
      setRevokedMessage(null);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: extractErrorMessage(err, 'Invalid reviewer credentials.') };
    }
  };

  // Instant synchronous logout (0ms turnaround time)
  const logout = (callApi = true) => {
    const currentToken = token || localStorage.getItem('alpha_token') || localStorage.getItem('alpha_admin_token');
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    if (currentPath.startsWith('/admin')) {
      localStorage.removeItem('alpha_admin_token');
      localStorage.removeItem('alpha_admin_user');
    } else if (currentPath.startsWith('/reviewer')) {
      localStorage.removeItem('alpha_reviewer_token');
      localStorage.removeItem('alpha_reviewer_user');
    } else if (currentPath.startsWith('/volunteer')) {
      localStorage.removeItem('alpha_volunteer_token');
      localStorage.removeItem('alpha_volunteer_user');
    } else if (currentPath.startsWith('/team-lead')) {
      localStorage.removeItem('alpha_team_lead_token');
      localStorage.removeItem('alpha_team_lead_user');
    }

    localStorage.removeItem('alpha_token');
    localStorage.removeItem('alpha_user');
    localStorage.removeItem('alpha_session_id');
    setToken(null);
    setUser(null);
    setSessionId(null);
    delete axios.defaults.headers.common['Authorization'];

    if (callApi && currentToken) {
      axios.post('/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${currentToken}` }
      }).catch(() => {});
    }
  };

  const refreshUserSession = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('alpha_user', JSON.stringify(res.data.user));
        if (res.data.user.role === 'TEAM_LEAD') {
          localStorage.setItem('alpha_team_lead_user', JSON.stringify(res.data.user));
        }
      }
    } catch (err) {
      // Interceptor will handle single device error
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      sessionId,
      revokedMessage,
      setRevokedMessage,
      loginTeamLead,
      loginAdmin,
      loginVolunteer,
      loginReviewer,
      logout,
      refreshUserSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
