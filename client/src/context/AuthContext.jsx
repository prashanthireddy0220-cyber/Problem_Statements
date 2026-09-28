import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const extractErrorMessage = (err, fallback) => {
  if (!err) return fallback;
  const isHtml = (str) => typeof str === 'string' && (str.includes('<html') || str.includes('<!DOCTYPE') || str.includes('<body') || str.includes('<pre>') || str.includes('Cannot POST') || str.includes('Cannot GET'));

  if (typeof err === 'string') return isHtml(err) ? fallback : err;
  const data = err.response?.data;
  if (typeof data === 'string') return isHtml(data) ? fallback : data;
  if (data && typeof data.error === 'string') return isHtml(data.error) ? fallback : data.error;
  if (data && typeof data.message === 'string') return isHtml(data.message) ? fallback : data.message;
  if (data && typeof data.error === 'object' && data.error !== null) {
    const msg = data.error.message || data.error.error || JSON.stringify(data.error);
    return isHtml(msg) ? fallback : msg;
  }
  if (err.message && typeof err.message === 'string') return isHtml(err.message) ? fallback : err.message;
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('alpha_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('alpha_token') || null);
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

  // Axios Request Interceptor: Ensure Authorization header is ALWAYS present on outgoing requests
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem('alpha_token');
      if (storedToken) {
        config.headers['Authorization'] = `Bearer ${storedToken}`;
      }
      return config;
    }, (error) => Promise.reject(error));

    return () => axios.interceptors.request.eject(reqInterceptor);
  }, [token]);

  useEffect(() => {
    const verifySessionOnMount = async () => {
      const savedToken = localStorage.getItem('alpha_token');
      if (savedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        try {
          const res = await axios.get('/api/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('alpha_user', JSON.stringify(res.data.user));
          } else {
            logout(false);
          }
        } catch (err) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            logout(false);
          }
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

  const loginTeamLead = async (teamId, registrationNumber, deviceId) => {
    try {
      const res = await axios.post('/api/auth/team-lead/login', { teamId, registrationNumber, deviceId });
      const { token, user, sessionId } = res.data;
      
      localStorage.setItem('alpha_token', token);
      localStorage.setItem('alpha_user', JSON.stringify(user));
      localStorage.setItem('alpha_session_id', sessionId);
      
      setToken(token);
      setUser(user);
      setSessionId(sessionId);
      setRevokedMessage(null);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: extractErrorMessage(err, 'Team lead login failed.') };
    }
  };

  const loginAdmin = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/admin/login', { username, password });
      const { token, user, sessionId } = res.data;
      
      localStorage.setItem('alpha_token', token);
      localStorage.setItem('alpha_user', JSON.stringify(user));
      localStorage.setItem('alpha_session_id', sessionId);
      
      setToken(token);
      setUser(user);
      setSessionId(sessionId);
      setRevokedMessage(null);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: extractErrorMessage(err, 'Admin login failed.') };
    }
  };

  const loginVolunteer = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/volunteer/login', { username, password });
      const { token, user, sessionId } = res.data;
      
      localStorage.setItem('alpha_token', token);
      localStorage.setItem('alpha_user', JSON.stringify(user));
      localStorage.setItem('alpha_session_id', sessionId);
      
      setToken(token);
      setUser(user);
      setSessionId(sessionId);
      setRevokedMessage(null);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: extractErrorMessage(err, 'Volunteer login failed.') };
    }
  };

  const loginReviewer = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/reviewer/login', { username, password });
      const { token, user, sessionId } = res.data;
      
      localStorage.setItem('alpha_token', token);
      localStorage.setItem('alpha_user', JSON.stringify(user));
      localStorage.setItem('alpha_session_id', sessionId);
      
      setToken(token);
      setUser(user);
      setSessionId(sessionId);
      setRevokedMessage(null);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: extractErrorMessage(err, 'Reviewer login failed.') };
    }
  };

  // Instant synchronous logout (0ms turnaround time)
  const logout = (callApi = true) => {
    const currentToken = token || localStorage.getItem('alpha_token');

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
