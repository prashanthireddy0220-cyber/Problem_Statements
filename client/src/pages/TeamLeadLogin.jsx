import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, KeyRound, AlertCircle, Laptop, Users, Building2 } from 'lucide-react';

export default function TeamLeadLogin() {
  const [teamId, setTeamId] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginTeamLead } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!teamId.trim() || !registrationNumber.trim()) {
      setError('Please enter both Team ID and Team Lead Registration Number.');
      return;
    }

    setError('');
    setLoading(true);

    const deviceId = `browser-device-${Math.random().toString(36).substring(2, 9)}`;
    const result = await loginTeamLead(teamId, registrationNumber, deviceId);

    setLoading(false);
    if (result.success) {
      navigate('/team-lead/dashboard');
    } else {
      setError(result.error || 'Invalid Team ID or Team Lead Registration Number');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem' }}>
        
        {/* Header Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', borderRadius: '50%', background: '#ffffff', padding: '4px', border: '2px solid var(--cyan-primary)', boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)', marginBottom: '1rem' }}>
            <img src="/kare_ieee_logo.jpg" alt="KARE IEEE" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '1px' }}>
            TEAM LEAD PORTAL
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Event ALPHA Problem Statement Reading & Selection System
          </p>
        </div>

        {/* Single Device Warning Notice */}
        <div style={{ background: 'rgba(0, 242, 254, 0.06)', border: '1px solid var(--border-cyan)', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Laptop size={20} color="#00F2FE" style={{ shrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.45' }}>
            <strong style={{ color: '#00F2FE' }}>Single-Device Access Enforced:</strong> Logging in from a new browser or device will automatically log out any active session on other devices.
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: 'rgba(255, 75, 75, 0.15)', border: '1px solid rgba(255, 75, 75, 0.4)', color: '#FF4B4B', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{typeof error === 'string' ? error : (error?.message || error?.error || String(error))}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Field 1: Team ID */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Team ID
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Enter Team ID"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '1rem',
                  letterSpacing: '1px',
                  outline: 'none'
                }}
              />
              <Building2 size={18} color="#00F2FE" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Field 2: Registration Number */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Team Lead Registration Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Enter Registration Number"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '1rem',
                  letterSpacing: '1px',
                  outline: 'none'
                }}
              />
              <KeyRound size={18} color="#00F2FE" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-alpha-cyan"
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}
          >
            {loading ? 'Verifying Credentials...' : (
              <>
                <LogIn size={18} /> Login to Selection Portal
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
