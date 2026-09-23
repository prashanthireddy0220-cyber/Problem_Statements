import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, Lock, AlertCircle, KeyRound } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter admin username and password.');
      return;
    }

    setError('');
    setLoading(true);

    const result = await loginAdmin(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', borderColor: '#00F2FE' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '65px', height: '65px', borderRadius: '50%', background: 'rgba(0, 242, 254, 0.15)', border: '2px solid #00F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 20px rgba(0,242,254,0.3)' }}>
            <ShieldCheck size={34} color="#00F2FE" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 800, color: '#F8FAFC' }}>
            ADMIN CONTROL PANEL
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Event ALPHA Master Platform Management
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
              Admin Username
            </label>
            <input
              type="text"
              placeholder="Enter Admin Username"
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
              Master Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
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
            className="btn-alpha-cyan"
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}
          >
            {loading ? 'Authenticating Admin...' : (
              <>
                <LogIn size={18} /> Enter Admin Control
              </>
            )}
          </button>
        </form>



      </div>
    </div>
  );
}
