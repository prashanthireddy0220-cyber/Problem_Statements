import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardRoute } from '../App';
import { 
  ShieldCheck, QrCode, Users, BookOpen, Clock, CheckCircle2, 
  Sparkles, ArrowRight, ShieldAlert, Award, ChevronRight, Zap, RefreshCw
} from 'lucide-react';

export default function LandingPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const userDashboard = user ? getDashboardRoute(user.role) : '/team-lead/login';

  return (
    <div className="main-layout" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* 1. HERO BANNER */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '3.5rem 2.5rem', 
          marginBottom: '2.5rem', 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
          boxShadow: '0 0 50px rgba(0, 242, 254, 0.15)'
        }}
      >
        {/* Background Glow Overlay */}
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Top Event Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 1.1rem', borderRadius: '30px', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', color: '#00F2FE', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          <Sparkles size={16} color="#00F2FE" />
          <span>EVENT ALPHA 2026 • KARE IEEE EDUCATION SOCIETY</span>
        </div>

        {/* Main Title */}
        <h1 
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', 
            fontWeight: '900', 
            color: '#F8FAFC', 
            letterSpacing: '1px', 
            lineHeight: '1.2', 
            marginBottom: '1.25rem' 
          }}
        >
          COLLEGE HACKATHON & <br />
          <span style={{ background: 'linear-gradient(135deg, #00F2FE 0%, #00E676 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CENTRALIZED ATTENDANCE PLATFORM
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{ color: '#CBD5E1', fontSize: '1.1rem', maxWidth: '820px', margin: '0 auto 2.25rem', lineHeight: '1.6' }}>
          State-of-the-art hackathon management engine equipped with <strong>Single-Device Team Security</strong>, live <strong>Problem Statement Selection</strong> with capacity locks, dynamic <strong>QR Attendance Sessions</strong>, and an <strong>Admin Analytics Matrix</strong>.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {token && user ? (
            <Link 
              to={userDashboard} 
              className="btn-alpha-cyan" 
              style={{ padding: '0.95rem 2.2rem', fontSize: '1.05rem', fontWeight: '800', borderRadius: '14px', boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)' }}
            >
              <Zap size={20} /> Go to My {user.role.replace('_', ' ')} Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/team-lead/login" 
                className="btn-alpha-cyan" 
                style={{ padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: '800', borderRadius: '12px', boxShadow: '0 0 25px rgba(0, 242, 254, 0.3)' }}
              >
                Team Lead Login <ArrowRight size={18} />
              </Link>
              
              <Link 
                to="/volunteer/login" 
                className="btn-alpha-gold" 
                style={{ padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: '800', borderRadius: '12px' }}
              >
                <QrCode size={18} /> Volunteer Scanner
              </Link>

              <Link 
                to="/admin/login" 
                className="btn-alpha-outline" 
                style={{ padding: '0.9rem 1.75rem', fontSize: '1rem', borderRadius: '12px' }}
              >
                Admin Control
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 2. EVENT METRICS COUNTERS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {[
          { number: '60', label: 'Authorized Teams', desc: 'ALPHA-001 to ALPHA-060', color: '#00F2FE', icon: Users },
          { number: '240', label: 'Hackathon Participants', desc: 'Registered College Students', color: '#00E676', icon: CheckCircle2 },
          { number: '43', label: 'Problem Statements', desc: '2-Team Max Capacity Limit', color: '#FFD700', icon: BookOpen },
          { number: '100%', label: 'QR Attendance Security', desc: 'Strict Volunteer-Only Scanning', color: '#FF8585', icon: QrCode }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: '1.75rem 1.5rem', textAlign: 'center', borderTop: `3px solid ${item.color}` }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem' }}>
                <Icon size={22} color={item.color} />
              </div>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '2.2rem', fontWeight: '900', color: item.color }}>
                {item.number}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#F8FAFC', marginTop: '0.25rem' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. THREE PORTAL HUBS SECTION */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#F8FAFC' }}>
            HACKATHON PORTAL HUBS
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Choose your role to access event dashboards and tools.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          
          {/* CARD 1: TEAM LEAD PORTAL */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #00F2FE', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(0, 242, 254, 0.15)', border: '1px solid var(--border-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Users size={26} color="#00F2FE" />
              </div>
              
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                Team Lead Portal
              </h3>
              
              <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Access single-device protected dashboard using Team ID & Lead Reg Number. View problem statements, lock selection, and generate dynamic session Attendance QR codes.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#00F2FE" /> Single-Device Active Session Protection
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#00F2FE" /> Live Synchronized Countdown Timer
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#00F2FE" /> Real-time Member Attendance Status View
                </li>
              </ul>
            </div>

            <Link to="/team-lead/login" className="btn-alpha-cyan" style={{ justifyContent: 'center', padding: '0.8rem', fontSize: '0.92rem' }}>
              Team Lead Login <ChevronRight size={18} />
            </Link>
          </div>

          {/* CARD 2: VOLUNTEER ATTENDANCE SCANNER */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #FFD700', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255, 215, 0, 0.15)', border: '1px solid rgba(255, 215, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <QrCode size={26} color="#FFD700" />
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                Volunteer Attendance Portal
              </h3>

              <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Authorized volunteer scanner app. Scan session QR codes, view team members, and toggle individual participant Present/Absent statuses.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#FFD700" /> Rapid HTML5 Camera Scanner
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#FFD700" /> Interactive Present/Absent Toggles per Member
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#FFD700" /> Google Lens Unauthorized Scan Shield
                </li>
              </ul>
            </div>

            <Link to="/volunteer/login" className="btn-alpha-gold" style={{ justifyContent: 'center', padding: '0.8rem', fontSize: '0.92rem' }}>
              Volunteer Scanner Login <ChevronRight size={18} />
            </Link>
          </div>

          {/* CARD 3: ADMIN CONTROL CENTER */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #00E676', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(0, 230, 118, 0.15)', border: '1px solid rgba(0, 230, 118, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={26} color="#00E676" />
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                Admin Master Dashboard
              </h3>

              <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Central command panel for event organizers. Monitor all 60 teams, release problem statements, manage attendance sessions, and export CSV reports.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#00E676" /> Live Team Monitoring & Audit Log Matrix
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#00E676" /> Central Attendance Session Controller
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#00E676" /> Individual Student Attendance Export (CSV)
                </li>
              </ul>
            </div>

            <Link to="/admin/login" className="btn-alpha-outline" style={{ justifyContent: 'center', padding: '0.8rem', fontSize: '0.92rem' }}>
              Admin Portal Login <ChevronRight size={18} />
            </Link>
          </div>

        </div>
      </div>

      {/* 4. PLATFORM ARCHITECTURE FEATURES */}
      <div className="glass-panel" style={{ padding: '2.5rem', borderColor: 'rgba(0, 242, 254, 0.2)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#00F2FE', marginBottom: '1.5rem', textAlign: 'center' }}>
          PLATFORM ARCHITECTURE & SECURITY
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <ShieldAlert color="#FF8585" size={20} />
              <h4 style={{ color: '#F8FAFC', fontSize: '1.05rem' }}>Single-Device Access Enforcer</h4>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Strict session tracking ensures a Team Lead cannot log in on multiple phones or browser tabs simultaneously during problem selection.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <BookOpen color="#FFD700" size={20} />
              <h4 style={{ color: '#F8FAFC', fontSize: '1.05rem' }}>Fair 2-Team Capacity Limit</h4>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Each problem statement automatically locks after receiving selections from 2 teams, guaranteeing competitive problem distribution.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <QrCode color="#00E676" size={20} />
              <h4 style={{ color: '#F8FAFC', fontSize: '1.05rem' }}>Volunteer-Only QR Scanning</h4>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Non-URL dynamic QR payloads prevent unauthorized check-ins from Google Lens or external cameras. Attendance is recorded strictly by authenticated volunteers.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', marginTop: '3rem' }}>
        Event ALPHA 2026 • College Hackathon Platform • KARE IEEE Education Society
      </div>

    </div>
  );
}
