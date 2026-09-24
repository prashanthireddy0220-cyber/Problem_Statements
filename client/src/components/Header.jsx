import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, UserCheck, AlertTriangle, LayoutDashboard } from 'lucide-react';
import { getDashboardRoute } from '../App';
import AUTHORIZED_TEAMS from '../data/teamsData.js';

export default function Header() {
  const { user, logout, revokedMessage, setRevokedMessage } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/team-lead/login');
  };

  const userDashboard = user ? getDashboardRoute(user.role) : '/team-lead/login';

  const formatTeamKey = (raw) => {
    if (!raw) return '';
    const str = String(raw).trim().toUpperCase();
    const m = str.match(/ALPHA-?(\d+)/i);
    if (m) return `ALPHA-${m[1].padStart(3, '0')}`;
    return str;
  };

  const teamKey = user ? formatTeamKey(user.team?.teamId || user.team?.name || user.teamId || user.registrationNumber) : '';
  const authItem = user ? AUTHORIZED_TEAMS.find(t => 
    (t.teamId && formatTeamKey(t.teamId) === teamKey) ||
    (t.regNum && t.regNum === user.registrationNumber) ||
    (t.members && t.members.some(m => m.registrationNumber === user.registrationNumber))
  ) : null;

  const isVolunteer = user?.role === 'VOLUNTEER';
  const headerLeadName = isVolunteer 
    ? (user?.name && !user.name.includes('Sarah') ? user.name : 'Event Volunteer')
    : (authItem?.leadName || (user?.name && !user.name.includes('Team Lead') ? user.name : null) || user?.registrationNumber || user?.name || 'User');
  const headerTeamDisplay = isVolunteer ? 'ALPHA Volunteer' : (authItem ? `${authItem.teamId} (${authItem.teamName})` : (user?.team?.name || user?.teamId || ''));

  return (
    <>
      <header className="alpha-header">
        {/* Header Left: Branding with KARE IEEE Education Society Logo */}
        <div className="brand-section">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="club-logo-container">
              <img src="/kare_ieee_logo.jpg" alt="KARE IEEE Education Society" className="club-logo" />
            </div>
            <div>
              <div className="event-title-badge">
                ALPHA <span style={{ fontSize: '0.85rem', background: 'rgba(0,242,254,0.15)', color: '#00F2FE', padding: '2px 8px', borderRadius: '6px' }}>2026</span>
              </div>
              <div className="event-subtitle">KARE IEEE Education Society</div>
            </div>
          </Link>
        </div>

        {/* Header Right: User Session & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to={userDashboard}
                className="btn-alpha-outline"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
              >
                <LayoutDashboard size={14} color="#00F2FE" />
                <span>Dashboard</span>
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.85rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <UserCheck size={16} color="#00F2FE" />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#F8FAFC' }}>
                    {headerLeadName}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#00F2FE', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {user.role} {headerTeamDisplay ? `• ${headerTeamDisplay}` : ''}
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-alpha-outline" style={{ padding: '0.35rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem' }} title="Logout">
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/team-lead/login" className="btn-alpha-cyan" style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
                Team Lead Portal
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* SINGLE-DEVICE LOGOUT WARNING OVERLAY MODAL */}
      {revokedMessage && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', borderColor: '#FF4B4B' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,75,75,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <AlertTriangle size={32} color="#FF4B4B" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#FF4B4B', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              ACCOUNT LOGGED OUT
            </h3>
            <p style={{ color: '#F8FAFC', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {revokedMessage}
            </p>
            <button
              onClick={() => {
                setRevokedMessage(null);
                navigate('/team-lead/login');
              }}
              className="btn-alpha-cyan"
              style={{ background: 'linear-gradient(135deg, #FF4B4B 0%, #FF8585 100%)', width: '100%', justifyContent: 'center' }}
            >
              Return to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}
