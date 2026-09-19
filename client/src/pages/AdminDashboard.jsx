import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, Clock, Users, BookOpen, ToggleLeft, ToggleRight, 
  Download, Plus, Edit, Trash2, RefreshCw, AlertTriangle, CheckCircle2, 
  PieChart as PieIcon, BarChart3, Activity, Lock, Unlock, Zap, Database
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('live'); // live, problems, timers, attendance, analytics, audit
  
  // State for Live Activity
  const [liveData, setLiveData] = useState({ summary: {}, teams: [] });
  
  // State for Problems
  const [problems, setProblems] = useState([]);
  const [showAddProblemModal, setShowAddProblemModal] = useState(false);
  const [newProblem, setNewProblem] = useState({
    problemId: '', title: '', description: '', background: '', expectedSolution: '',
    requirements: '', constraints: '', domain: 'IoT & Smart Energy', difficulty: 'Medium',
    technologies: 'React, Node.js', maxTeamCapacity: 5, status: 'PUBLISHED'
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

  // Load timer settings when switching to timers tab or initially
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
    } catch (e) {
      // ignore
    }
  };

  const fetchAllData = async () => {
    try {
      if (activeTab === 'live') {
        const res = await axios.get('/api/admin/live-activity');
        setLiveData(res.data);
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
    } catch (e) {
      // ignore
    }
  };

  // Phase transition handler
  const handlePhaseAction = async (actionStr) => {
    try {
      const res = await axios.post('/api/admin/session-control', { action: actionStr });
      setActionMsg(`Session transition: ${actionStr} successful!`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
      fetchSettings();
    } catch (e) {
      alert('Failed to update session phase.');
    }
  };

  // Seed Initial Demo Data
  const handleSeed = async () => {
    try {
      await axios.post('/api/admin/seed');
      setActionMsg('Seed dataset populated successfully!');
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
      fetchSettings();
    } catch (e) {
      alert('Seed error.');
    }
  };

  // Save Timer & Access Settings
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

  // Add Problem Statement
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

  // Create Attendance Session
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

  // Toggle Attendance Session Status (Start / Close)
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

  // Revoke Team Lead Device Session
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

  // Reset Team Selection
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

  // Export Attendance CSV
  const handleExportCSV = () => {
    window.open('/api/attendance/admin/export', '_blank');
  };

  // Data for Charts
  const pieData = [
    { name: 'Present', value: attStats.present || 0, color: '#00E676' },
    { name: 'Absent', value: attStats.absent || 0, color: '#FF4B4B' }
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
            Event ALPHA • Real-time selection timer control, live team activity, attendance analytics & single-device security.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleSeed} className="btn-alpha-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
            <Database size={15} /> Populate Demo Seed Data
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
          { id: 'live', label: 'Live Monitoring & Session Control', icon: Activity },
          { id: 'problems', label: 'Problem Statements', icon: BookOpen },
          { id: 'timers', label: 'Timer & Access Controls', icon: Clock },
          { id: 'attendance', label: 'Attendance Manager', icon: Users },
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
          {/* SESSION PHASE CONTROLLER CARDS */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#FFD700', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              ⚡ HACKATHON SELECTION SESSION PHASE CONTROL
            </h3>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={() => handlePhaseAction('START_READING')} className="btn-alpha-cyan" style={{ padding: '0.75rem 1.25rem' }}>
                <Clock size={18} /> Start {settings.readingDurationMinutes || 30}-Min Reading Phase
              </button>
              <button onClick={() => handlePhaseAction('START_SELECTION')} className="btn-alpha-gold" style={{ padding: '0.75rem 1.25rem' }}>
                <Zap size={18} /> Start {settings.selectionDurationMinutes || 5}-Min Selection Phase
              </button>
              <button onClick={() => handlePhaseAction('LOCK')} className="btn-alpha-outline" style={{ borderColor: '#FF4B4B', color: '#FF4B4B', padding: '0.75rem 1.25rem' }}>
                <Lock size={18} /> Lock & Close Selection
              </button>
              <button onClick={() => handlePhaseAction('RESET')} className="btn-alpha-outline" style={{ padding: '0.75rem 1.25rem' }}>
                <RefreshCw size={18} /> Reset Session State
              </button>
            </div>
          </div>

          {/* METRIC SUMMARY CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Total Registered Teams</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>
                {liveData.summary?.totalTeams || 0}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Active Online Sessions</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#00E676', fontFamily: 'Orbitron, monospace' }}>
                {liveData.summary?.teamsLoggedIn || 0}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Teams Reading</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>
                {liveData.summary?.teamsReading || 0}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Selections Completed</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#FFD700', fontFamily: 'Orbitron, monospace' }}>
                {liveData.summary?.selectionsCompleted || 0}
              </div>
            </div>
          </div>

          {/* LIVE TEAM ACTIVITY TABLE */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', marginBottom: '1rem' }}>LIVE TEAM ACTIVITY MONITOR</h3>

            <div className="alpha-table-container">
              <table className="alpha-table">
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Team Lead Reg No</th>
                    <th>Lead Name</th>
                    <th>College</th>
                    <th>Current Activity</th>
                    <th>Selected Problem</th>
                    <th>Single-Device Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(liveData.teams || []).map((t) => (
                    <tr key={t.teamId}>
                      <td style={{ fontWeight: '700', color: '#F8FAFC' }}>{t.teamName}</td>
                      <td style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE' }}>{t.teamLeadRegNum}</td>
                      <td>{t.teamLeadName}</td>
                      <td>{t.college}</td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '700',
                          background: t.selectionConfirmed ? 'rgba(0,230,118,0.2)' : 'rgba(0,242,254,0.15)',
                          color: t.selectionConfirmed ? '#00E676' : '#00F2FE'
                        }}>
                          {t.statusStr}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'Orbitron, monospace', color: '#FFD700' }}>
                        {t.selectedProblemCode || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleRevokeSession(t.teamLeadRegNum)}
                            className="btn-alpha-outline"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', color: '#FF4B4B', borderColor: '#FF4B4B' }}
                            title="Revoke session instantly"
                          >
                            Revoke Device Session
                          </button>
                          {t.selectionConfirmed && (
                            <button
                              onClick={() => handleResetTeamSelection(t.teamId, t.teamName)}
                              className="btn-alpha-outline"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
                            >
                              Reset Selection
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROBLEM STATEMENTS MANAGER */}
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

          {/* ADD PROBLEM MODAL */}
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

      {/* TAB 3: TIMERS & ACCESS CONTROLS */}
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

      {/* TAB 4: CENTRALIZED ATTENDANCE MANAGER */}
      {activeTab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC' }}>CENTRALIZED ATTENDANCE MANAGEMENT</h2>
            <button onClick={() => setShowCreateSessModal(true)} className="btn-alpha-gold">
              <Plus size={18} /> Create Attendance Session
            </button>
          </div>

          {/* SESSIONS GRID */}
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

          {/* ATTENDANCE RECORDS TABLE */}
          <h3 style={{ fontSize: '1.1rem', color: '#00F2FE', marginBottom: '1rem' }}>CENTRAL ATTENDANCE LOG Matrix</h3>
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

          {/* CREATE SESSION MODAL */}
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

      {/* TAB 5: ANALYTICS & REPORTS */}
      {activeTab === 'analytics' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', marginBottom: '1.5rem' }}>VISUAL ANALYTICS & ATTENDANCE CHARTS</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            
            {/* Pie Chart */}
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: '#00F2FE', marginBottom: '1rem' }}>Present vs Absent Overview</h3>
              <div style={{ width: '100%', height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
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

            {/* Metrics Breakdown Card */}
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

      {/* TAB 6: AUDIT LOGS & DEVICE SESSIONS */}
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
