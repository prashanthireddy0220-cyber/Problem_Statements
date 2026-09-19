import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrCode, LogIn, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

export default function VolunteerLogin() {
  const [username, setUsername] = useState('volunteer1');
  const [password, setPassword] = useState('vol123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginVolunteer } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter volunteer username and password.');
      return;
    }

    setError('');
    setLoading(true);

    const result = await loginVolunteer(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/volunteer/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '65px', height: '65px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.15)', border: '2px solid #FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
            <QrCode size={32} color="#FFD700" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 800, color: '#F8FAFC' }}>
            VOLUNTEER PORTAL
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Event ALPHA Centralized Attendance Management System
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 75, 75, 0.15)', border: '1px solid rgba(255, 75, 75, 0.4)', color: '#FF4B4B', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Volunteer Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-cyan)',
                borderRadius: '10px',
                color: '#FFFFFF',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-cyan)',
                borderRadius: '10px',
                color: '#FFFFFF',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-alpha-gold"
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} /> Login to Scanner
              </>
            )}
          </button>
        </form>



      </div>
    </div>
  );
}
