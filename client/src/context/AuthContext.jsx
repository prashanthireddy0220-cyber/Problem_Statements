import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('alpha_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('alpha_token') || null);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('alpha_session_id') || null);
  const [revokedMessage, setRevokedMessage] = useState(null);

  // Configure Axios Base URL from environment variable VITE_API_URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';
  
  useEffect(() => {
    if (API_BASE_URL && !API_BASE_URL.startsWith('/')) {
      axios.defaults.baseURL = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    }
  }, [API_BASE_URL]);

  // Set default authorization header on axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

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

  const loginTeamLead = async (registrationNumber, deviceId) => {
    try {
      const res = await axios.post('/api/auth/team-lead/login', { registrationNumber, deviceId });
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
      return { success: false, error: err.response?.data?.error || 'Team lead login failed.' };
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
      return { success: false, error: err.response?.data?.error || 'Admin login failed.' };
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
      return { success: false, error: err.response?.data?.error || 'Volunteer login failed.' };
    }
  };

  const logout = async (callApi = true) => {
    if (callApi && token) {
      try {
        await axios.post('/api/auth/logout');
      } catch (e) {
        // ignore logout errors
      }
    }
    localStorage.removeItem('alpha_token');
    localStorage.removeItem('alpha_user');
    localStorage.removeItem('alpha_session_id');
    setToken(null);
    setUser(null);
    setSessionId(null);
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
      logout,
      refreshUserSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
