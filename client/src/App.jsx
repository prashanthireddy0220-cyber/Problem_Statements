import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Interactive3DBackground from './components/Interactive3DBackground';

import TeamLeadLogin from './pages/TeamLeadLogin';
import TeamLeadDashboard from './pages/TeamLeadDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import VolunteerLogin from './pages/VolunteerLogin';
import VolunteerScanner from './pages/VolunteerScanner';
import { LogOut, ArrowLeft, ShieldAlert } from 'lucide-react';

// Helper to determine dashboard route based on user role
export const getDashboardRoute = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'VOLUNTEER':
      return '/volunteer/dashboard';
    case 'TEAM_LEAD':
    default:
      return '/team-lead/dashboard';
  }
};

// Smart Root Redirect Component
const RootRedirect = () => {
  const { user, token } = useAuth();
  if (token && user) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }
  return <Navigate to="/team-lead/login" replace />;
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
  
  if (!token || !user) {
    return <Navigate to="/team-lead/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const userDashboard = getDashboardRoute(user.role);
    const targetPortal = allowedRoles.join(' / ');

    const handleSwitchAccount = async () => {
      await logout();
      const loginRoute = allowedRoles.includes('ADMIN') ? '/admin/login' : allowedRoles.includes('VOLUNTEER') ? '/volunteer/login' : '/team-lead/login';
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
            You are logged in as <strong style={{ color: '#00F2FE' }}>{user.name || user.registrationNumber || user.username}</strong> (<span style={{ color: '#FFD700' }}>{user.role}</span>).
          </p>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '2rem' }}>
            You do not have authorization to access the <strong>{targetPortal}</strong> portal.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link to={userDashboard} className="btn-alpha-cyan" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}>
              <ArrowLeft size={18} /> Go to My {user.role.replace('_', ' ')} Dashboard
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
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          <Interactive3DBackground />
          <Header />
          <Routes>
            {/* Public & Root Routes */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Navigate to="/team-lead/login" replace />} />
            <Route path="/team-lead" element={<Navigate to="/team-lead/login" replace />} />
            
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

            {/* Protected Role Routes */}
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
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="/volunteer/dashboard" element={
              <ProtectedRoute allowedRoles={['VOLUNTEER', 'ADMIN']}>
                <VolunteerScanner />
              </ProtectedRoute>
            } />
            <Route path="/volunteer" element={<Navigate to="/volunteer/dashboard" replace />} />

            {/* Catch-all Fallback */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
