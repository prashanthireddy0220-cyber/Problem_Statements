import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, Clock, Users, BookOpen, ToggleLeft, ToggleRight, 
  Download, Plus, Edit, Trash2, RefreshCw, AlertTriangle, CheckCircle2, 
  PieChart as PieIcon, BarChart3, Activity, Lock, Unlock, Zap, Database,
  QrCode, Eye, Search, Printer, FileText, UserCheck, CheckCircle, Ticket
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import QRCode from 'qrcode';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('live'); // live, teams, problems, timers, attendance, analytics, audit
  
  // State for Live Activity
  const [liveData, setLiveData] = useState({ summary: {}, teams: [] });
  
  // State for Teams Management (All 60 Teams)
  const [allTeams, setAllTeams] = useState([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState('');
  const [selectedTeamDetail, setSelectedTeamDetail] = useState(null);
  const [qrModalTeam, setQrModalTeam] = useState(null);
  const [adminQrDataUrl, setAdminQrDataUrl] = useState('');

  // State for Problems
  const [problems, setProblems] = useState([]);
  const [showAddProblemModal, setShowAddProblemModal] = useState(false);
  const [newProblem, setNewProblem] = useState({
    problemId: '', title: '', description: '', background: '', expectedSolution: '',
    requirements: '', constraints: '', domain: 'IoT & Smart Energy', difficulty: 'Medium',
    technologies: 'React, Node.js', maxTeamCapacity: 2, status: 'PUBLISHED'
  });

  // State for Timers & Access Settings
  const [settings, setSettings] = useState({
    readingDurationMinutes: 30,
    selectionDurationMinutes: 5,
    teamLeadAccessEnabled: true,
    volunteerAccessEnabled: true,
    problemSelectionEnabled: true,
    attendanceEnabled: true
  });

  // State for Attendance
  const [attSessions, setAttSessions] = useState([]);
  const [attRecords, setAttRecords] = useState([]);
  const [attStats, setAttStats] = useState({});
  const [showCreateSessModal, setShowCreateSessModal] = useState(false);
  const [newSess, setNewSess] = useState({
    sessionName: 'Day 1 Morning Keynote',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    status: 'ACTIVE'
  });

  // State for Audit Logs
  const [auditLogs, setAuditLogs] = useState([]);
  const [actionMsg, setActionMsg] = useState('');

  // Auto-refresh interval
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 3000);
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    fetchSettings();
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/problems/timer-state');
      if (res.data.settings) {
        setSettings(prev => ({
          ...prev,
          ...res.data.settings
        }));
      }
    } catch (e) {}
  };

  const fetchAllData = async () => {
    try {
      if (activeTab === 'live') {
        const res = await axios.get('/api/admin/live-activity');
        setLiveData(res.data);
        if (res.data && res.data.teams && res.data.teams.length > 0 && allTeams.length === 0) {
          const mappedFromLive = res.data.teams.map(t => ({
            _id: t.teamId,
            teamId: t.teamCode || t.teamId,
            teamName: t.teamCode || t.teamId,
            teamLeadRegNum: t.teamLeadRegNum,
            teamLeadName: t.teamLeadName,
            membersCount: 4,
            members: [],
            college: t.college || 'KARE',
            department: 'CSE',
            selectedProblemCode: t.selectedProblemCode || 'Not Selected',
            selectionConfirmed: t.status.includes('Completed'),
            teamQrToken: `TQ-${t.teamCode}-${t.teamLeadRegNum.slice(-4)}`,
            publicQrUrl: `/team/TQ-${t.teamCode}-${t.teamLeadRegNum.slice(-4)}`,
            eventPassQrToken: `EP-${t.teamCode}-${t.teamLeadRegNum.slice(-4)}`,
            eventPassStatus: 'ISSUED',
            registrationStatus: 'CONFIRMED',
            attendanceCount: 0
          }));
          setAllTeams(mappedFromLive);
        }
      }
      
      if (activeTab === 'teams' || allTeams.length === 0) {
        try {
          const res = await axios.get('/api/teams/admin/all');
          if (res.data && res.data.teams && res.data.teams.length > 0) {
            setAllTeams(res.data.teams);
          } else {
            const fallbackRes = await axios.get('/api/admin/teams');
            if (fallbackRes.data && fallbackRes.data.teams && fallbackRes.data.teams.length > 0) {
              setAllTeams(fallbackRes.data.teams);
            }
          }
        } catch (tErr) {
          try {
            const fallbackRes = await axios.get('/api/admin/teams');
            if (fallbackRes.data && fallbackRes.data.teams && fallbackRes.data.teams.length > 0) {
              setAllTeams(fallbackRes.data.teams);
            }
          } catch (e2) {}
        }
      }

      if (activeTab === 'problems' || activeTab === 'live') {
        const res = await axios.get('/api/problems?domain=ALL&difficulty=ALL');
        setProblems(res.data.problems || []);
      }
      if (activeTab === 'attendance' || activeTab === 'analytics') {
        const sRes = await axios.get('/api/attendance/sessions');
        setAttSessions(sRes.data.sessions || []);
        const rRes = await axios.get('/api/attendance/admin/records');
        setAttRecords(rRes.data.records || []);
        setAttStats(rRes.data.stats || {});
      }
      if (activeTab === 'audit') {
        const lRes = await axios.get('/api/admin/audit-logs');
        setAuditLogs(lRes.data.logs || []);
      }
    } catch (e) {}
  };

  const [scheduledTimeInput, setScheduledTimeInput] = useState('');

  const handlePhaseAction = async (actionStr, extraData = {}) => {
    try {
      await axios.post('/api/admin/session-control', { action: actionStr, ...extraData });
      setActionMsg(`Session action '${actionStr}' applied successfully!`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
      fetchSettings();
    } catch (e) {
      alert('Failed to update session phase.');
    }
  };

  const handleScheduleSelection = async (e) => {
    e.preventDefault();
    if (!scheduledTimeInput) {
      alert('Please select a valid date and time to schedule selection.');
      return;
    }
    await handlePhaseAction('SCHEDULE_SELECTION', { scheduledTime: scheduledTimeInput });
  };

  const handleSeed = async () => {
    try {
      await axios.post('/api/admin/seed');
      setActionMsg('All 60 teams and demo data populated successfully!');
      setTimeout(() => setActionMsg(''), 4000);
      
      const tRes = await axios.get('/api/teams/admin/all').catch(() => axios.get('/api/admin/teams'));
      if (tRes && tRes.data && tRes.data.teams) {
        setAllTeams(tRes.data.teams);
      }
      fetchAllData();
      fetchSettings();
    } catch (e) {
      alert('Seed error.');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await axios.post('/api/admin/settings', settings);
      if (res.data.settings) {
        setSettings(res.data.settings);
      }
      setActionMsg('System settings saved successfully!');
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
    } catch (e) {
      alert('Failed to save settings.');
    }
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/problems/admin/create', newProblem);
      setShowAddProblemModal(false);
      setActionMsg(`Problem ${newProblem.problemId} created successfully!`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create problem.');
    }
  };

  const handleCreateSess = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/attendance/sessions/create', newSess);
      setShowCreateSessModal(false);
      setActionMsg(`Attendance session ${newSess.sessionName} created!`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create session.');
    }
  };

  const handleToggleSessStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/attendance/sessions/${id}/status`, { status: newStatus });
      setActionMsg(`Attendance session status updated to '${newStatus}'!`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
    } catch (err) {
      alert('Failed to update session status.');
    }
  };

  const handleRevokeSession = async (regNum) => {
    if (!window.confirm(`Are you sure you want to revoke single-device access for ${regNum}?`)) return;
    try {
      await axios.post(`/api/admin/team-leads/${regNum}/revoke`);
      setActionMsg(`Device session revoked for ${regNum}. User logged out.`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
    } catch (e) {
      alert('Failed to revoke session.');
    }
  };

  const handleResetTeamSelection = async (teamId, teamName) => {
    if (!window.confirm(`Reset problem selection for Team '${teamName}'?`)) return;
    try {
      await axios.post(`/api/admin/teams/${teamId}/reset-selection`);
      setActionMsg(`Selection reset for Team ${teamName}.`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
    } catch (e) {
      alert('Failed to reset selection.');
    }
  };

  // Regenerate Unique Team QR Token
  const handleRegenerateTeamQr = async (teamId, teamName) => {
    if (!window.confirm(`Regenerate unique Team QR Code for '${teamName}'? The existing QR URL will change.`)) return;
    try {
      const res = await axios.post(`/api/teams/admin/${teamId}/regenerate-qr`);
      setActionMsg(`Regenerated new Team QR Code for ${teamName}!`);
      setTimeout(() => setActionMsg(''), 3000);
      if (qrModalTeam && qrModalTeam._id === teamId) {
        setQrModalTeam({
          ...qrModalTeam,
          teamQrToken: res.data.teamQrToken,
          publicQrUrl: res.data.publicQrUrl
        });
      }
      fetchAllData();
    } catch (e) {
      alert('Failed to regenerate Team QR.');
    }
  };

  // Generate QR Data URL for Admin Modal Preview
  useEffect(() => {
    if (qrModalTeam?.teamQrToken) {
      const targetUrl = qrModalTeam.publicQrUrl || `${window.location.origin}/team/${qrModalTeam.teamQrToken}`;
      QRCode.toDataURL(targetUrl, { width: 300, margin: 2, color: { dark: '#00F2FE', light: '#0F172A' } })
        .then(setAdminQrDataUrl)
        .catch(() => {});
    }
  }, [qrModalTeam]);

  const handleExportCSV = () => {
    window.open('/api/attendance/admin/export', '_blank');
  };

  // Filtered Teams List (Falls back to liveData.teams if allTeams is empty)
  const teamsToDisplay = (allTeams && allTeams.length > 0)
    ? allTeams
    : ((liveData && liveData.teams && liveData.teams.length > 0) ? liveData.teams.map(t => ({
        _id: t._id || t.teamId || t.teamCode,
        teamId: t.teamCode || t.teamId,
        teamName: t.teamName || t.teamCode || t.teamId,
        teamLeadRegNum: t.teamLeadRegNum,
        teamLeadName: t.teamLeadName,
        membersCount: t.membersCount || (t.members ? t.members.length : 4),
        members: t.members || [],
        college: t.college || 'KARE',
        department: t.department || 'CSE',
        selectedProblemCode: t.selectedProblemCode || 'Not Selected',
        selectionConfirmed: Boolean(t.selectionConfirmed),
        teamQrToken: t.teamQrToken || `TQ-${t.teamCode || t.teamId}-${(t.teamLeadRegNum || '0000').slice(-4)}`,
        publicQrUrl: t.publicQrUrl || `/team/TQ-${t.teamCode || t.teamId}-${(t.teamLeadRegNum || '0000').slice(-4)}`,
        eventPassQrToken: t.eventPassQrToken || `EP-${t.teamCode || t.teamId}-${(t.teamLeadRegNum || '0000').slice(-4)}`,
        eventPassStatus: t.eventPassStatus || 'ISSUED',
        registrationStatus: t.registrationStatus || 'CONFIRMED',
        attendanceCount: t.attendanceCount || 0
      })) : []);

  const filteredTeams = teamsToDisplay.filter(t => {
    if (!teamSearchTerm) return true;
    const term = teamSearchTerm.toLowerCase();
    return (
      (t.teamId && t.teamId.toLowerCase().includes(term)) ||
      (t.teamName && t.teamName.toLowerCase().includes(term)) ||
      (t.teamLeadName && t.teamLeadName.toLowerCase().includes(term)) ||
      (t.teamLeadRegNum && t.teamLeadRegNum.toLowerCase().includes(term)) ||
      (t.selectedProblemCode && t.selectedProblemCode.toLowerCase().includes(term))
    );
  });

  const totalAttScans = (attStats.present || 0) + (attStats.absent || 0);
  const hasPieData = totalAttScans > 0;
  const pieData = hasPieData ? [
    { name: 'Present', value: attStats.present || 0, color: '#00E676' },
    { name: 'Absent', value: attStats.absent || 0, color: '#FF4B4B' }
  ] : [
    { name: 'No Scans Yet', value: 1, color: '#334155' }
  ];

  return (
    <div className="main-layout" style={{ maxWidth: '1450px' }}>
      
      {/* ADMIN TOP BANNER */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderColor: '#00F2FE' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldCheck color="#00F2FE" size={28} /> MASTER ADMIN CONTROL DASHBOARD
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
            Event ALPHA • Manage all 60 Teams, Team QR codes, problem selections, live monitoring & attendance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleSeed} className="btn-alpha-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
            <Database size={15} /> Populate All 60 Teams Data
          </button>
          <button onClick={handleExportCSV} className="btn-alpha-cyan" style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
            <Download size={15} /> Export Attendance CSV
          </button>
        </div>
      </div>

      {actionMsg && (
        <div style={{ background: 'rgba(0, 242, 254, 0.15)', border: '1px solid #00F2FE', color: '#00F2FE', padding: '0.85rem 1.25rem', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* ADMIN NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '0.5rem' }}>
        {[
          { id: 'live', label: 'Live Session Control', icon: Activity },
          { id: 'teams', label: 'Teams Management (60 Teams)', icon: Users },
          { id: 'problems', label: 'Problem Statements', icon: BookOpen },
          { id: 'timers', label: 'Timer & Access Controls', icon: Clock },
          { id: 'attendance', label: 'Attendance Manager', icon: Ticket },
          { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'audit', label: 'Audit Logs & Sessions', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn-alpha-outline"
              style={{
                padding: '0.65rem 1.15rem',
                fontSize: '0.85rem',
                borderRadius: '10px 10px 0 0',
                borderBottom: isActive ? '3px solid #00F2FE' : 'none',
                background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? '#00F2FE' : '#94A3B8'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE MONITORING & SESSION CONTROL */}
      {activeTab === 'live' && (
        <div>
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#FFD700', fontFamily: 'var(--font-heading)' }}>
                ⚡ PROBLEM STATEMENT SELECTION CONTROLLER
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Problem Statement Status:</span>
                <span style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  background: !liveData.summary?.problemStatementsReleased ? 'rgba(255,75,75,0.2)' :
                              (liveData.summary?.currentPhase === 'SELECTION_OPEN' || liveData.summary?.currentPhase === 'SELECTION' ? 'rgba(0,230,118,0.2)' :
                              (liveData.summary?.currentPhase === 'SELECTION_CLOSED' || liveData.summary?.currentPhase === 'CLOSED' ? 'rgba(255,75,75,0.2)' : 'rgba(255,215,0,0.2)')),
                  color: !liveData.summary?.problemStatementsReleased ? '#FF4B4B' :
                         (liveData.summary?.currentPhase === 'SELECTION_OPEN' || liveData.summary?.currentPhase === 'SELECTION' ? '#00E676' :
                         (liveData.summary?.currentPhase === 'SELECTION_CLOSED' || liveData.summary?.currentPhase === 'CLOSED' ? '#FF4B4B' : '#FFD700')),
                  border: `1px solid ${!liveData.summary?.problemStatementsReleased ? '#FF4B4B' :
                          (liveData.summary?.currentPhase === 'SELECTION_OPEN' || liveData.summary?.currentPhase === 'SELECTION' ? '#00E676' :
                          (liveData.summary?.currentPhase === 'SELECTION_CLOSED' || liveData.summary?.currentPhase === 'CLOSED' ? '#FF4B4B' : '#FFD700'))}`
                }}>
                  {!liveData.summary?.problemStatementsReleased ? '🔴 Not Released' :
                   (liveData.summary?.currentPhase === 'SELECTION_OPEN' || liveData.summary?.currentPhase === 'SELECTION' ? '🟢 Selection Open' :
                   (liveData.summary?.currentPhase === 'SELECTION_CLOSED' || liveData.summary?.currentPhase === 'CLOSED' ? '🔴 Selection Closed' : '🟡 Released / Selection Locked'))}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem', fontWeight: '700' }}>1. PUBLISH CONTROL</div>
                {liveData.summary?.problemStatementsReleased ? (
                  <button onClick={() => handlePhaseAction('UNRELEASE_PROBLEMS')} className="btn-alpha-outline" style={{ width: '100%', borderColor: '#FF4B4B', color: '#FF4B4B', justifyContent: 'center' }}>
                    <Lock size={16} /> Unrelease / Hide Problems
                  </button>
                ) : (
                  <button onClick={() => handlePhaseAction('RELEASE_PROBLEMS')} className="btn-alpha-cyan" style={{ width: '100%', justifyContent: 'center' }}>
                    <Unlock size={16} /> Release Problem Statements
                  </button>
                )}
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem', fontWeight: '700' }}>2. SCHEDULE SELECTION TIMER</div>
                <form onSubmit={handleScheduleSelection} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="datetime-local"
                    value={scheduledTimeInput}
                    onChange={(e) => setScheduledTimeInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      background: '#0F172A',
                      border: '1px solid var(--border-cyan)',
                      color: '#FFF',
                      borderRadius: '6px',
                      fontSize: '0.8rem'
                    }}
                  />
                  <button type="submit" className="btn-alpha-cyan" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
                    Schedule
                  </button>
                </form>
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem', fontWeight: '700' }}>3. IMMEDIATE OPEN</div>
                <button onClick={() => handlePhaseAction('OPEN_NOW')} className="btn-alpha-gold" style={{ width: '100%', justifyContent: 'center' }}>
                  <Zap size={16} /> Open Selection Now
                </button>
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem', fontWeight: '700' }}>4. CLOSE / LOCK</div>
                <button onClick={() => handlePhaseAction('CLOSE')} className="btn-alpha-outline" style={{ width: '100%', borderColor: '#FF4B4B', color: '#FF4B4B', justifyContent: 'center' }}>
                  <Lock size={16} /> Close Selection
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => handlePhaseAction('RESET')} className="btn-alpha-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                <RefreshCw size={14} /> Reset Session State
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: ADMIN TEAMS MANAGEMENT (ALL 60 TEAMS) */}
      {/* ==================================================== */}
      {activeTab === 'teams' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={24} color="#00F2FE" /> ALL REGISTERED TEAMS MANAGEMENT (Target: 60 Teams)
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                View, manage, inspect member details, and generate unique Team QR codes for Team 1 to Team 60.
              </p>
            </div>

            <div style={{ position: 'relative', minWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search Team ID, Name, Lead, Reg No..."
                value={teamSearchTerm}
                onChange={(e) => setTeamSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  background: '#0F172A',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.85rem'
                }}
              />
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#00F2FE', marginBottom: '1rem', fontWeight: '700' }}>
            Showing {filteredTeams.length} of {teamsToDisplay.length} Registered Teams
          </div>

          <div className="alpha-table-container">
            <table className="alpha-table">
              <thead>
                <tr>
                  <th>Team ID</th>
                  <th>Team Name</th>
                  <th>Team Lead</th>
                  <th>Members</th>
                  <th>Problem Statement</th>
                  <th>Team QR</th>
                  <th>Event Pass</th>
                  <th>Attendance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((t) => (
                  <tr key={t._id}>
                    <td style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE', fontWeight: '800' }}>{t.teamId}</td>
                    <td style={{ fontWeight: '700', color: '#F8FAFC' }}>{t.teamName}</td>
                    <td>
                      <div>{t.teamLeadName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'Orbitron, monospace' }}>{t.teamLeadRegNum}</div>
                    </td>
                    <td style={{ fontWeight: '700', color: '#00E676' }}>{t.membersCount} Members</td>
                    <td style={{ fontFamily: 'Orbitron, monospace', color: t.selectionConfirmed ? '#FFD700' : '#94A3B8' }}>
                      {t.selectedProblemCode}
                    </td>
                    <td>
                      <button
                        onClick={() => setQrModalTeam(t)}
                        className="btn-alpha-outline"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <QrCode size={14} color="#00F2FE" /> View Team QR
                      </button>
                    </td>
                    <td>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', background: 'rgba(0,230,118,0.15)', color: '#00E676' }}>
                        {t.eventPassStatus}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: '#00F2FE' }}>
                      {t.attendanceCount} Check-ins
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => setSelectedTeamDetail(t)}
                          className="btn-alpha-cyan"
                          style={{ padding: '0.3rem 0.61rem', fontSize: '0.72rem' }}
                          title="View complete team members list"
                        >
                          <Eye size={13} /> View Team
                        </button>

                        <button
                          onClick={() => handleRegenerateTeamQr(t._id, t.teamName)}
                          className="btn-alpha-outline"
                          style={{ padding: '0.3rem 0.61rem', fontSize: '0.72rem' }}
                          title="Regenerate Team QR Code Token"
                        >
                          <RefreshCw size={13} /> QR
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ADMIN TEAM DETAIL MODAL */}
          {selectedTeamDetail && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '700px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE', fontWeight: '800' }}>{selectedTeamDetail.teamId}</span>
                    <h2 style={{ color: '#F8FAFC', fontSize: '1.4rem', margin: '0.25rem 0' }}>{selectedTeamDetail.teamName}</h2>
                  </div>
                  <button onClick={() => setSelectedTeamDetail(null)} className="btn-alpha-outline" style={{ padding: '0.35rem 0.75rem' }}>✕</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>College</div>
                    <div style={{ fontWeight: '700', color: '#F8FAFC' }}>{selectedTeamDetail.college}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Department</div>
                    <div style={{ fontWeight: '700', color: '#F8FAFC' }}>{selectedTeamDetail.department}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Problem Selection</div>
                    <div style={{ fontWeight: '800', color: '#FFD700', fontFamily: 'Orbitron, monospace' }}>{selectedTeamDetail.selectedProblemCode}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', color: '#00E676', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} /> COMPLETE TEAM MEMBERS LIST ({selectedTeamDetail.members?.length || 0})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
                  {selectedTeamDetail.members?.map((m, idx) => (
                    <div key={idx} style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: m.role === 'LEAD' ? '3px solid #00E676' : '3px solid #00F2FE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#F8FAFC' }}>{m.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Role: <strong style={{ color: m.role === 'LEAD' ? '#00E676' : '#00F2FE' }}>{m.role}</strong> {m.phone ? `• ${m.phone}` : ''} {m.email ? `• ${m.email}` : ''}</div>
                      </div>
                      <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: '800', color: '#00F2FE', fontSize: '0.95rem' }}>
                        {m.registrationNumber}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button onClick={() => setSelectedTeamDetail(null)} className="btn-alpha-cyan">Close</button>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN TEAM QR CODE MODAL */}
          {qrModalTeam && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: '#00F2FE', fontSize: '1.2rem' }}>UNIQUE TEAM QR CODE</h3>
                  <button onClick={() => setQrModalTeam(null)} className="btn-alpha-outline" style={{ padding: '0.25rem 0.6rem' }}>✕</button>
                </div>

                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F8FAFC', marginBottom: '0.25rem' }}>
                  {qrModalTeam.teamName}
                </div>
                <div style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE', fontWeight: '800', marginBottom: '1.25rem' }}>
                  Team ID: {qrModalTeam.teamId}
                </div>

                <div style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '16px', border: '2px dashed #00F2FE', display: 'inline-block', marginBottom: '1.25rem' }}>
                  {adminQrDataUrl ? (
                    <img src={adminQrDataUrl} alt="Team QR" style={{ width: '200px', height: '200px', display: 'block' }} />
                  ) : (
                    <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>Loading QR...</div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.5rem', wordBreak: 'break-all' }}>
                    Token: {qrModalTeam.teamQrToken}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button onClick={() => handleRegenerateTeamQr(qrModalTeam._id, qrModalTeam.teamName)} className="btn-alpha-gold" style={{ fontSize: '0.8rem' }}>
                    <RefreshCw size={14} /> Regenerate QR Code
                  </button>
                  <button onClick={() => window.open(qrModalTeam.publicQrUrl || `/team/${qrModalTeam.teamQrToken}`, '_blank')} className="btn-alpha-cyan" style={{ fontSize: '0.8rem' }}>
                    <Eye size={14} /> Open Public Page
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: PROBLEM STATEMENTS MANAGER */}
      {activeTab === 'problems' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC' }}>PROBLEM STATEMENTS MANAGER</h2>
            <button onClick={() => setShowAddProblemModal(true)} className="btn-alpha-cyan">
              <Plus size={18} /> Add New Problem Statement
            </button>
          </div>

          <div className="alpha-table-container">
            <table className="alpha-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Problem Title</th>
                  <th>Domain</th>
                  <th>Difficulty</th>
                  <th>Capacity Limit</th>
                  <th>Selected Count</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE', fontWeight: '800' }}>{p.problemId}</td>
                    <td style={{ fontWeight: '700', color: '#F8FAFC' }}>{p.title}</td>
                    <td>{p.domain}</td>
                    <td>{p.difficulty}</td>
                    <td>{p.maxTeamCapacity} Teams</td>
                    <td style={{ color: p.selectedCount >= p.maxTeamCapacity ? '#FF4B4B' : '#00E676', fontWeight: '800' }}>
                      {p.selectedCount} / {p.maxTeamCapacity}
                    </td>
                    <td>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', background: 'rgba(0,242,254,0.15)', color: '#00F2FE' }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showAddProblemModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '650px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#00F2FE', marginBottom: '1rem' }}>ADD PROBLEM STATEMENT</h3>
                <form onSubmit={handleCreateProblem}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="text" placeholder="Problem ID (e.g. PS-006)"
                      value={newProblem.problemId} onChange={e => setNewProblem({ ...newProblem, problemId: e.target.value })}
                      required style={{ padding: '0.75rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                    />
                    <input
                      type="text" placeholder="Problem Title"
                      value={newProblem.title} onChange={e => setNewProblem({ ...newProblem, title: e.target.value })}
                      required style={{ padding: '0.75rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                    />
                  </div>

                  <textarea
                    placeholder="Full Problem Description" rows={3}
                    value={newProblem.description} onChange={e => setNewProblem({ ...newProblem, description: e.target.value })}
                    required style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px', marginBottom: '1rem' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Domain</label>
                      <input
                        type="text" value={newProblem.domain} onChange={e => setNewProblem({ ...newProblem, domain: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Max Team Capacity</label>
                      <input
                        type="number" value={newProblem.maxTeamCapacity} onChange={e => setNewProblem({ ...newProblem, maxTeamCapacity: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Difficulty</label>
                      <select
                        value={newProblem.difficulty} onChange={e => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowAddProblemModal(false)} className="btn-alpha-outline">Cancel</button>
                    <button type="submit" className="btn-alpha-cyan">Save Problem Statement</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TIMERS & ACCESS CONTROLS */}
      {activeTab === 'timers' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', marginBottom: '1.5rem' }}>TIMER & MODULE ACCESS CONTROLS</h2>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#FFD700', marginBottom: '1rem' }}>TIMER DURATION CONFIGURATION</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Problem Reading Duration (Minutes)</label>
                <input
                  type="number"
                  value={settings.readingDurationMinutes}
                  onChange={e => setSettings({ ...settings, readingDurationMinutes: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.85rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'Orbitron, monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Problem Selection Duration (Minutes)</label>
                <input
                  type="number"
                  value={settings.selectionDurationMinutes}
                  onChange={e => setSettings({ ...settings, selectionDurationMinutes: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.85rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'Orbitron, monospace' }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#00F2FE', marginBottom: '1rem' }}>MODULE MASTER TOGGLES</h3>
            
            {[
              { key: 'teamLeadAccessEnabled', label: 'Team Lead Access Portal' },
              { key: 'volunteerAccessEnabled', label: 'Volunteer Attendance Portal' },
              { key: 'problemSelectionEnabled', label: 'Problem Selection Submissions' },
              { key: 'attendanceEnabled', label: 'Attendance QR Scanning' }
            ].map((toggle) => (
              <div key={toggle.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#F8FAFC', fontSize: '0.95rem' }}>{toggle.label}</span>
                <button
                  onClick={() => setSettings({ ...settings, [toggle.key]: !settings[toggle.key] })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {settings[toggle.key] ? <ToggleRight size={36} color="#00E676" /> : <ToggleLeft size={36} color="#FF4B4B" />}
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleSaveSettings} className="btn-alpha-cyan" style={{ width: '100%', justifyContent: 'center' }}>
            Save Settings & Configuration
          </button>
        </div>
      )}

      {/* TAB 5: CENTRALIZED ATTENDANCE MANAGER */}
      {activeTab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC' }}>CENTRALIZED ATTENDANCE MANAGEMENT</h2>
            <button onClick={() => setShowCreateSessModal(true)} className="btn-alpha-gold">
              <Plus size={18} /> Create Attendance Session
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {attSessions.map((s) => (
              <div key={s._id} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'Orbitron, monospace', color: '#00F2FE' }}>{s.sessionId}</span>
                  <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '10px', background: s.status === 'ACTIVE' ? 'rgba(0,230,118,0.2)' : 'rgba(255,215,0,0.15)', color: s.status === 'ACTIVE' ? '#00E676' : '#FFD700' }}>
                    {s.status}
                  </span>
                </div>
                <h4 style={{ color: '#F8FAFC', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{s.sessionName}</h4>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{s.date} • {s.startTime} - {s.endTime}</div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
                  {s.status !== 'ACTIVE' && (
                    <button
                      onClick={() => handleToggleSessStatus(s._id, 'ACTIVE')}
                      className="btn-alpha-cyan"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)' }}
                    >
                      🟢 Start Session
                    </button>
                  )}
                  {s.status !== 'CLOSED' && (
                    <button
                      onClick={() => handleToggleSessStatus(s._id, 'CLOSED')}
                      className="btn-alpha-outline"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#FF4B4B', borderColor: '#FF4B4B' }}
                    >
                      🔴 Close Session
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.1rem', color: '#00F2FE', marginBottom: '1rem' }}>CENTRAL ATTENDANCE LOG MATRIX</h3>
          <div className="alpha-table-container">
            <table className="alpha-table">
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Student Name</th>
                  <th>Team</th>
                  <th>College</th>
                  <th>Session Name</th>
                  <th>Marked Time</th>
                  <th>Volunteer</th>
                </tr>
              </thead>
              <tbody>
                {attRecords.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE' }}>{r.participantRegNum}</td>
                    <td style={{ fontWeight: '700', color: '#F8FAFC' }}>{r.participantName}</td>
                    <td>{r.teamName}</td>
                    <td>{r.college}</td>
                    <td>{r.sessionName}</td>
                    <td>{new Date(r.markedAt).toLocaleTimeString()}</td>
                    <td>{r.markedByVolunteer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showCreateSessModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '500px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#FFD700', marginBottom: '1rem' }}>CREATE ATTENDANCE SESSION</h3>
                <form onSubmit={handleCreateSess}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Session Name</label>
                    <input
                      type="text" value={newSess.sessionName} onChange={e => setNewSess({ ...newSess, sessionName: e.target.value })}
                      required style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <input type="text" placeholder="Date" value={newSess.date} onChange={e => setNewSess({ ...newSess, date: e.target.value })} style={{ padding: '0.65rem', background: '#0F172A', color: '#FFF', borderRadius: '8px', border: '1px solid var(--border-cyan)' }} />
                    <input type="text" placeholder="Start Time" value={newSess.startTime} onChange={e => setNewSess({ ...newSess, startTime: e.target.value })} style={{ padding: '0.65rem', background: '#0F172A', color: '#FFF', borderRadius: '8px', border: '1px solid var(--border-cyan)' }} />
                    <input type="text" placeholder="End Time" value={newSess.endTime} onChange={e => setNewSess({ ...newSess, endTime: e.target.value })} style={{ padding: '0.65rem', background: '#0F172A', color: '#FFF', borderRadius: '8px', border: '1px solid var(--border-cyan)' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowCreateSessModal(false)} className="btn-alpha-outline">Cancel</button>
                    <button type="submit" className="btn-alpha-gold">Create Session</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: ANALYTICS & REPORTS */}
      {activeTab === 'analytics' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', marginBottom: '1.5rem' }}>VISUAL ANALYTICS & ATTENDANCE CHARTS</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: '#00F2FE', marginBottom: '1rem' }}>Present vs Absent Overview</h3>
              <div style={{ width: '100%', height: '260px', minHeight: '260px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={70} 
                      isAnimationActive={false}
                      minAngle={3}
                      label={hasPieData ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#00E676', marginTop: '0.5rem' }}>
                {attStats.percentage || 0}% Total Attendance Rate
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#FFD700', marginBottom: '1.5rem' }}>Attendance Metrics Breakdown</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '1.25rem', borderRadius: '12px', border: '1px solid #00E676' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Total Present Participants</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#00E676', fontFamily: 'Orbitron, monospace' }}>
                    {attStats.present || 0}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 75, 75, 0.1)', padding: '1.25rem', borderRadius: '12px', border: '1px solid #FF4B4B' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Total Absent Participants</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#FF4B4B', fontFamily: 'Orbitron, monospace' }}>
                    {attStats.absent || 0}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOGS & DEVICE SESSIONS */}
      {activeTab === 'audit' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', marginBottom: '1.5rem' }}>SYSTEM AUDIT LOG TRAIL</h2>

          <div className="alpha-table-container">
            <table className="alpha-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Target</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log._id}>
                    <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ fontWeight: '700', color: '#00F2FE' }}>{log.actor}</td>
                    <td>{log.role}</td>
                    <td style={{ fontWeight: '700', color: '#FFD700' }}>{log.action}</td>
                    <td>{log.target || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
