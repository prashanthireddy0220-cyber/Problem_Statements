import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Interactive3DBackground from './components/Interactive3DBackground';
import ClubLogoIntro from './components/ClubLogoIntro';

import TeamLeadLogin from './pages/TeamLeadLogin';
import TeamLeadDashboard from './pages/TeamLeadDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import VolunteerLogin from './pages/VolunteerLogin';
import VolunteerScanner from './pages/VolunteerScanner';
import ReviewerLogin from './pages/ReviewerLogin';
import ReviewerDashboard from './pages/ReviewerDashboard';
import PublicTeamPage from './pages/PublicTeamPage';
import LandingPage from './pages/LandingPage';
import { LogOut, ArrowLeft, ShieldAlert } from 'lucide-react';

// Helper to determine dashboard route based on user role
export const getDashboardRoute = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'REVIEWER':
      return '/reviewer';
    case 'VOLUNTEER':
      return '/volunteer/dashboard';
    case 'TEAM_LEAD':
    default:
      return '/team-lead/dashboard';
  }
};

// Smart Root Component: Renders LandingPage on root / route
const RootRedirect = () => {
  return <LandingPage />;
};

// Public Login Wrapper: If user is ALREADY logged in as this role, auto-redirect to dashboard
const PublicLoginRoute = ({ children, targetRole }) => {
  const { user, token } = useAuth();
  if (token && user && user.role === targetRole) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }
  return children;
};

// Protected Route Wrapper with User-Friendly Role Verification & Recovery
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  
  // Resolve role-aware active user and token to handle multi-tab login smoothly
  let activeUser = user;
  let activeToken = token;

  if (allowedRoles && allowedRoles.includes('ADMIN')) {
    const adminToken = localStorage.getItem('alpha_admin_token');
    const adminUserStr = localStorage.getItem('alpha_admin_user');
    if (adminToken && adminUserStr) {
      try {
        const parsed = JSON.parse(adminUserStr);
        if (parsed && (parsed.role === 'ADMIN' || parsed.role === 'SUPERADMIN' || parsed.role === 'ORGANIZER')) {
          activeUser = parsed;
          activeToken = adminToken;
        }
      } catch (e) {}
    }
  } else if (allowedRoles && allowedRoles.includes('REVIEWER')) {
    const revToken = localStorage.getItem('alpha_reviewer_token');
    const revUserStr = localStorage.getItem('alpha_reviewer_user');
    if (revToken && revUserStr) {
      try {
        const parsed = JSON.parse(revUserStr);
        if (parsed && parsed.role === 'REVIEWER') {
          activeUser = parsed;
          activeToken = revToken;
        }
      } catch (e) {}
    }
  } else if (allowedRoles && allowedRoles.includes('VOLUNTEER')) {
    const volToken = localStorage.getItem('alpha_volunteer_token');
    const volUserStr = localStorage.getItem('alpha_volunteer_user');
    if (volToken && volUserStr) {
      try {
        const parsed = JSON.parse(volUserStr);
        if (parsed && parsed.role === 'VOLUNTEER') {
          activeUser = parsed;
          activeToken = volToken;
        }
      } catch (e) {}
    }
  } else if (allowedRoles && allowedRoles.includes('TEAM_LEAD')) {
    const tlToken = localStorage.getItem('alpha_team_lead_token');
    const tlUserStr = localStorage.getItem('alpha_team_lead_user');
    if (tlToken && tlUserStr) {
      try {
        const parsed = JSON.parse(tlUserStr);
        if (parsed && parsed.role === 'TEAM_LEAD') {
          activeUser = parsed;
          activeToken = tlToken;
        }
      } catch (e) {}
    }
  }

  if (!activeToken || !activeUser) {
    const primaryRole = (allowedRoles && allowedRoles.length > 0) ? allowedRoles[0] : 'TEAM_LEAD';
    const loginRoute = primaryRole === 'REVIEWER' ? '/reviewer/login' : 
                       primaryRole === 'ADMIN' ? '/admin/login' : 
                       primaryRole === 'VOLUNTEER' ? '/volunteer/login' : '/team-lead/login';
    return <Navigate to={loginRoute} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(activeUser.role)) {
    const userDashboard = getDashboardRoute(activeUser.role);
    const targetPortal = allowedRoles.join(' / ');

    const handleSwitchAccount = async () => {
      await logout();
      const loginRoute = allowedRoles.includes('ADMIN') ? '/admin/login' : allowedRoles.includes('REVIEWER') ? '/reviewer/login' : allowedRoles.includes('VOLUNTEER') ? '/volunteer/login' : '/team-lead/login';
      navigate(loginRoute);
    };

    return (
      <div className="main-layout" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div className="glass-panel" style={{ padding: '3rem 2.5rem', maxWidth: '520px', margin: '0 auto', borderColor: '#FF4B4B', boxShadow: '0 0 30px rgba(255, 75, 75, 0.2)' }}>
          <div style={{ width: '65px', height: '65px', borderRadius: '50%', background: 'rgba(255, 75, 75, 0.15)', border: '2px solid #FF4B4B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <ShieldAlert size={34} color="#FF4B4B" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#FF4B4B', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '1px' }}>
            403 FORBIDDEN - ACCESS RESTRICTED
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
            You are logged in as <strong style={{ color: '#00F2FE' }}>{activeUser.name || activeUser.registrationNumber || activeUser.username}</strong> (<span style={{ color: '#FFD700' }}>{activeUser.role}</span>).
          </p>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '2rem' }}>
            You do not have authorization to access the <strong>{targetPortal}</strong> portal.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link to={userDashboard} className="btn-alpha-cyan" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}>
              <ArrowLeft size={18} /> Go to My {activeUser.role.replace('_', ' ')} Dashboard
            </Link>
            <button onClick={handleSwitchAccount} className="btn-alpha-outline" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.9rem', color: '#FF8585', borderColor: 'rgba(255,75,75,0.4)' }}>
              <LogOut size={16} /> Switch Account / Log in as {targetPortal}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('alpha_intro_shown')) return false;
      if (localStorage.getItem('alpha_token')) return false;
      if (window.location.pathname.includes('/dashboard') || window.location.pathname.includes('/reviewer')) return false;
    }
    return true;
  });

  const handleIntroComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('alpha_intro_shown', 'true');
    }
    setShowIntro(false);
  };

  return (
    <AuthProvider>
      {showIntro && <ClubLogoIntro onComplete={handleIntroComplete} />}
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          <Interactive3DBackground />
          <Header />
          <Routes>
            {/* Public & Root Routes */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<Navigate to="/team-lead/login" replace />} />
            <Route path="/team-lead" element={<Navigate to="/team-lead/login" replace />} />
            <Route path="/team/:tokenOrId" element={<PublicTeamPage />} />
            
            <Route path="/team-lead/login" element={
              <PublicLoginRoute targetRole="TEAM_LEAD">
                <TeamLeadLogin />
              </PublicLoginRoute>
            } />

            <Route path="/admin/login" element={
              <PublicLoginRoute targetRole="ADMIN">
                <AdminLogin />
              </PublicLoginRoute>
            } />

            <Route path="/volunteer/login" element={
              <PublicLoginRoute targetRole="VOLUNTEER">
                <VolunteerLogin />
              </PublicLoginRoute>
            } />

            <Route path="/reviewer/login" element={
              <PublicLoginRoute targetRole="REVIEWER">
                <ReviewerLogin />
              </PublicLoginRoute>
            } />

            <Route path="/reviewer" element={
              <ProtectedRoute allowedRoles={['REVIEWER', 'ADMIN']}>
                <ReviewerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/reviewer/dashboard" element={
              <ProtectedRoute allowedRoles={['REVIEWER', 'ADMIN']}>
                <ReviewerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/reviewer-login" element={<Navigate to="/reviewer/login" replace />} />

            <Route path="/team-lead/dashboard" element={
              <ProtectedRoute allowedRoles={['TEAM_LEAD']}>
                <TeamLeadDashboard />
              </ProtectedRoute>
            } />
            <Route path="/team-lead/selection" element={
              <ProtectedRoute allowedRoles={['TEAM_LEAD']}>
                <TeamLeadDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />

            <Route path="/volunteer/dashboard" element={
              <ProtectedRoute allowedRoles={['VOLUNTEER', 'ADMIN']}>
                <VolunteerScanner />
              </ProtectedRoute>
            } />
            <Route path="/volunteer" element={<Navigate to="/volunteer/login" replace />} />
            <Route path="/volunteer-login" element={<Navigate to="/volunteer/login" replace />} />

            {/* Catch-all Fallback */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
