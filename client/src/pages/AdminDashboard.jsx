import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, Clock, Users, BookOpen, ToggleLeft, ToggleRight, 
  Download, Plus, Edit, Trash2, RefreshCw, AlertTriangle, CheckCircle2, 
  PieChart as PieIcon, BarChart3, Activity, Lock, Unlock, Zap, Database,
  QrCode, Eye, Search, Printer, FileText, UserCheck, CheckCircle, Ticket, Award
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import QRCode from 'qrcode';
import AUTHORIZED_TEAMS from '../data/teamsData';

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
  const [attSessionFilter, setAttSessionFilter] = useState('ALL');
  const [attStatusFilter, setAttStatusFilter] = useState('ALL');
  const [attSearchFilter, setAttSearchFilter] = useState('');
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

  // State for Reviewer Evaluations (Admin View & Edit)
  const [evalData, setEvalData] = useState({ summary: {}, evaluations: [], rounds: [], reviewers: [] });
  const [evalSearchTerm, setEvalSearchTerm] = useState('');
  const [evalRoundFilter, setEvalRoundFilter] = useState('ALL');
  const [evalViewMode, setEvalViewMode] = useState('team'); // 'team' or 'reviewer'
  
  // Admin Evaluation Edit & Problem Statement Edit Modal State
  const [adminEditEvModal, setAdminEditEvModal] = useState(null);
  const [adminCriteriaInputs, setAdminCriteriaInputs] = useState({});
  const [adminCommentsInput, setAdminCommentsInput] = useState('');
  const [adminSubmittingEv, setAdminSubmittingEv] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  const ADMIN_ROUNDS_CONFIG = {
    1: [
      { key: 'innovation', name: 'Innovation & Originality', maxMarks: 20 },
      { key: 'tech_approach', name: 'Technical Approach & Architecture', maxMarks: 20 },
      { key: 'problem_understanding', name: 'Problem Understanding', maxMarks: 20 },
      { key: 'feasibility', name: 'Feasibility & Practicality', maxMarks: 15 },
      { key: 'presentation', name: 'Presentation & Defense', maxMarks: 15 },
      { key: 'overall_impact', name: 'Overall Impact & Scalability', maxMarks: 10 }
    ],
    2: [
      { key: 'code_quality', name: 'Code Quality & Structure', maxMarks: 25 },
      { key: 'tech_complexity', name: 'Technical Complexity & Depth', maxMarks: 25 },
      { key: 'functionality', name: 'Functionality & Working Demo', maxMarks: 25 },
      { key: 'ui_ux', name: 'UI/UX & User Interface', maxMarks: 25 }
    ],
    3: [
      { key: 'completeness', name: 'Project Completeness & Stability', maxMarks: 35 },
      { key: 'business_value', name: 'Business Value & Viability', maxMarks: 35 },
      { key: 'final_pitch', name: 'Final Presentation & Q/A Defense', maxMarks: 30 }
    ]
  };

  const openAdminEditEv = (ev, teamObj, roundNum) => {
    const rNum = roundNum || ev?.roundNumber || 1;
    const roundCriteria = ADMIN_ROUNDS_CONFIG[rNum] || ADMIN_ROUNDS_CONFIG[1];
    const initialInputs = {};
    
    roundCriteria.forEach(crit => {
      const found = ev?.criteriaMarks?.find(c => c.criteriaKey === crit.key || c.name === crit.name);
      initialInputs[crit.key] = (found !== undefined && found !== null) ? found.mark : '';
    });

    setAdminCriteriaInputs(initialInputs);
    setAdminCommentsInput(ev?.comments || '');
    setAdminEditEvModal({
      evDoc: ev || null,
      teamCode: teamObj?.teamId || ev?.teamCode,
      teamName: teamObj?.teamName || ev?.teamName,
      teamId: teamObj?._id || ev?.teamId,
      roundNumber: rNum
    });
  };

  const handleAdminSaveEv = async (e) => {
    e.preventDefault();
    if (!adminEditEvModal) return;

    const roundNum = adminEditEvModal.roundNumber;
    const roundCriteria = ADMIN_ROUNDS_CONFIG[roundNum] || ADMIN_ROUNDS_CONFIG[1];
    const formattedMarks = [];

    for (const crit of roundCriteria) {
      const val = adminCriteriaInputs[crit.key];
      if (val === '' || val === undefined || val === null) {
        alert(`Please enter a valid mark for '${crit.name}'.`);
        return;
      }
      formattedMarks.push({
        criteriaKey: crit.key,
        name: crit.name,
        mark: Number(val),
        maxMark: crit.maxMarks
      });
    }

    setAdminSubmittingEv(true);
    try {
      const payload = {
        teamId: adminEditEvModal.teamId,
        teamCode: adminEditEvModal.teamCode,
        teamName: adminEditEvModal.teamName,
        roundNumber: roundNum,
        criteriaMarks: formattedMarks,
        comments: adminCommentsInput,
        status: 'SUBMITTED'
      };

      if (adminEditEvModal.evDoc?._id) {
        await axios.put(`/api/reviewer/evaluations/${adminEditEvModal.evDoc._id}`, payload);
      } else {
        await axios.post('/api/reviewer/evaluations', payload);
      }

      setActionMsg(`Marks saved/updated successfully for Team ${adminEditEvModal.teamCode} (Round ${roundNum})!`);
      setTimeout(() => setActionMsg(''), 4000);

      setAdminEditEvModal(null);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save evaluation marks.');
    } finally {
      setAdminSubmittingEv(false);
    }
  };

  // Auto-refresh interval
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 3000);
    return () => clearInterval(interval);
  }, [activeTab, attSessionFilter, attStatusFilter, attSearchFilter]);

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
      if (activeTab === 'live' || activeTab === 'teams' || activeTab === 'evaluations') {
        const res = await axios.get('/api/admin/live-activity');
        if (res.data) {
          setLiveData(res.data);
          if (res.data.teams && res.data.teams.length > 0) {
            setAllTeams(res.data.teams);
          }
        }
      }

      if (activeTab === 'evaluations' || activeTab === 'live' || activeTab === 'teams') {
        const evalRes = await axios.get('/api/admin/evaluations').catch(() => null);
        if (evalRes && evalRes.data) {
          setEvalData(evalRes.data);
        }
      }

      if (activeTab === 'problems' || activeTab === 'live') {
        const res = await axios.get('/api/problems?domain=ALL&difficulty=ALL');
        setProblems(res.data.problems || []);
      }
      if (activeTab === 'attendance' || activeTab === 'analytics') {
        const sRes = await axios.get('/api/attendance/sessions');
        setAttSessions(sRes.data.sessions || []);
        const rRes = await axios.get('/api/attendance/admin/records', {
          params: {
            sessionId: attSessionFilter,
            status: attStatusFilter,
            search: attSearchFilter
          }
        });
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

  const handleUpdateProblem = async (e) => {
    e.preventDefault();
    if (!editingProblem || !editingProblem._id) return;
    try {
      await axios.put(`/api/problems/admin/${editingProblem._id}`, editingProblem);
      setEditingProblem(null);
      setActionMsg(`Problem statement '${editingProblem.problemId}' updated successfully!`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update problem statement.');
    }
  };

  const handleDeleteProblem = async (id, problemId) => {
    if (!window.confirm(`Are you sure you want to delete problem statement '${problemId}'?`)) return;
    try {
      await axios.delete(`/api/problems/admin/${id}`);
      setActionMsg(`Problem statement '${problemId}' deleted!`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete problem statement.');
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

  // Exact 60 Authorized Teams List (Sanitized & Deduplicated against official table)
  const teamsToDisplay = React.useMemo(() => {
    const rawList = (allTeams && allTeams.length > 0) ? allTeams : (liveData?.teams || []);
    
    // Build map of DB/live state for each team by clean teamId, regNum, or teamName
    const dbMap = new Map();
    rawList.forEach(t => {
      if (!t) return;
      const keys = [t.teamId, t.teamCode, t.name, t.teamLeadRegNum];
      keys.forEach(k => {
        if (k) {
          const cleanK = String(k).trim().toUpperCase();
          if (!dbMap.has(cleanK)) {
            dbMap.set(cleanK, t);
          }
        }
      });
    });

    // Map over AUTHORIZED_TEAMS (always exactly 60 teams)
    return AUTHORIZED_TEAMS.map(authItem => {
      const existing = dbMap.get(authItem.teamId) || dbMap.get(authItem.regNum);
      const members = (existing?.members && existing.members.length > 0) ? existing.members : authItem.members;
      const teamQrToken = existing?.teamQrToken || `TQ-${authItem.teamId}-${authItem.regNum.slice(-4)}`;
      const eventPassQrToken = existing?.eventPassQrToken || `EP-${authItem.teamId}-${authItem.regNum.slice(-4)}`;

      const probCode = existing?.selectedProblemCode && existing.selectedProblemCode !== 'null' ? existing.selectedProblemCode : 'Not Selected';
      const matchedProblem = problems.find(p => p.problemId === probCode) || existing?.selectedProblem;
      const probTitle = matchedProblem?.title || existing?.selectedProblemTitle || '';

      return {
        _id: existing?._id || authItem.teamId,
        teamId: authItem.teamId,
        teamName: authItem.teamName, // Official Team Name (e.g. INNOVATES)
        teamLeadRegNum: authItem.regNum, // Official Reg Number (e.g. 9924008110)
        teamLeadName: authItem.leadName, // Official Team Lead Name (e.g. POLANKI VYSHNAVI)
        membersCount: members ? members.length : 4,
        members: members,
        college: existing?.college || 'KARE',
        department: existing?.department || 'CSE',
        selectedProblemCode: probCode,
        selectedProblemTitle: probTitle,
        selectionConfirmed: Boolean(existing?.selectionConfirmed) || (probCode !== 'Not Selected'),
        teamQrToken: teamQrToken,
        publicQrUrl: existing?.publicQrUrl || `/team/${teamQrToken}`,
        eventPassQrToken: eventPassQrToken,
        eventPassStatus: existing?.eventPassStatus || 'ISSUED',
        registrationStatus: existing?.registrationStatus || 'CONFIRMED',
        attendanceCount: existing?.attendanceCount || 0
      };
    });
  }, [allTeams, liveData, problems]);

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
            Event ALPHA • Manage all {teamsToDisplay.length} Teams, Team QR codes, problem selections, live monitoring & attendance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleSeed} className="btn-alpha-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
            <Database size={15} /> Populate All {AUTHORIZED_TEAMS.length} Teams Data
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
          { id: 'teams', label: `Teams Management (${teamsToDisplay.length} Teams)`, icon: Users },
          { id: 'evaluations', label: 'Reviewer Evaluations', icon: Award },
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.15rem', borderLeft: '4px solid #00F2FE' }}>
                <div style={{ fontSize: '0.8rem', color: '#00F2FE', marginBottom: '0.5rem', fontWeight: '800' }}>1. 🚀 START TIMED ROUND</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block', marginBottom: '0.2rem', fontWeight: '700' }}>Release (m)</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.releaseDelayMinutes ?? 5}
                      onChange={(e) => setSettings({ ...settings, releaseDelayMinutes: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.35rem 0.45rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#00F2FE', borderRadius: '6px', fontSize: '0.88rem', fontWeight: '800', fontFamily: 'Orbitron, monospace', textAlign: 'center' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block', marginBottom: '0.2rem', fontWeight: '700' }}>Read-Only (m)</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.selectionDelayMinutes ?? settings.readingDurationMinutes ?? 2}
                      onChange={(e) => setSettings({ ...settings, selectionDelayMinutes: Number(e.target.value), readingDurationMinutes: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.35rem 0.45rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFD700', borderRadius: '6px', fontSize: '0.88rem', fontWeight: '800', fontFamily: 'Orbitron, monospace', textAlign: 'center' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block', marginBottom: '0.2rem', fontWeight: '700' }}>Select (m)</label>
                    <input
                      type="number"
                      min="1"
                      value={settings.selectionDurationMinutes ?? 10}
                      onChange={(e) => setSettings({ ...settings, selectionDurationMinutes: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.35rem 0.45rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#00E676', borderRadius: '6px', fontSize: '0.88rem', fontWeight: '800', fontFamily: 'Orbitron, monospace', textAlign: 'center' }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handlePhaseAction('START_ROUND', {
                    releaseDelayMinutes: settings.releaseDelayMinutes ?? 5,
                    selectionDelayMinutes: settings.selectionDelayMinutes ?? 2,
                    selectionDurationMinutes: settings.selectionDurationMinutes ?? 10
                  })}
                  className="btn-alpha-cyan"
                  style={{ width: '100%', justifyContent: 'center', fontWeight: '800', padding: '0.55rem' }}
                >
                  <Clock size={16} /> Start Timed Round
                </button>
              </div>

              <div className="glass-card" style={{ padding: '1.15rem', borderLeft: '4px solid #FFD700' }}>
                <div style={{ fontSize: '0.8rem', color: '#FFD700', marginBottom: '0.5rem', fontWeight: '800' }}>2. 🔓 MANUAL RELEASE</div>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                  Override timer and immediately release/hide problem statements to all Team Leads.
                </p>
                {liveData.summary?.problemStatementsReleased ? (
                  <button onClick={() => handlePhaseAction('UNRELEASE_PROBLEMS')} className="btn-alpha-outline" style={{ width: '100%', borderColor: '#FF4B4B', color: '#FF4B4B', justifyContent: 'center' }}>
                    <Lock size={16} /> Unrelease / Hide Problems
                  </button>
                ) : (
                  <button onClick={() => handlePhaseAction('RELEASE_PROBLEMS')} className="btn-alpha-gold" style={{ width: '100%', justifyContent: 'center' }}>
                    <Unlock size={16} /> Release Problems Now
                  </button>
                )}
              </div>

              <div className="glass-card" style={{ padding: '1.15rem', borderLeft: '4px solid #00E676' }}>
                <div style={{ fontSize: '0.8rem', color: '#00E676', marginBottom: '0.5rem', fontWeight: '800' }}>3. ⚡ ENABLE SELECTION</div>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                  Bypass selection delay and immediately enable "Select Problem Statement" button.
                </p>
                <button onClick={() => handlePhaseAction('OPEN_NOW')} className="btn-alpha-cyan" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)', color: '#0F172A', fontWeight: '900' }}>
                  <Zap size={16} /> Enable Selection Now
                </button>
              </div>

              <div className="glass-card" style={{ padding: '1.15rem', borderLeft: '4px solid #FF4B4B' }}>
                <div style={{ fontSize: '0.8rem', color: '#FF4B4B', marginBottom: '0.5rem', fontWeight: '800' }}>4. 🔒 LOCK & RESET</div>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                  Close selection or reset system timer state back to unreleased.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handlePhaseAction('CLOSE')} className="btn-alpha-outline" style={{ flex: 1, borderColor: '#FF4B4B', color: '#FF4B4B', justifyContent: 'center', padding: '0.45rem' }}>
                    <Lock size={14} /> Close
                  </button>
                  <button onClick={() => handlePhaseAction('RESET')} className="btn-alpha-outline" style={{ flex: 1, justifyContent: 'center', padding: '0.45rem' }}>
                    <RefreshCw size={14} /> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADMIN TEAMS MANAGEMENT */}
      {/* ==================================================== */}
      {activeTab === 'teams' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={24} color="#00F2FE" /> ALL REGISTERED TEAMS MANAGEMENT ({teamsToDisplay.length} Teams)
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                View, manage, inspect member details, and generate unique Team QR codes for all registered teams.
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
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((t) => (
                  <tr key={t._id} onClick={() => setSelectedTeamDetail(t)} style={{ cursor: 'pointer' }} title="Click to view full team members list">
                    <td style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE', fontWeight: '800' }}>{t.teamId}</td>
                    <td style={{ fontWeight: '700', color: '#F8FAFC' }}>{t.teamName}</td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#F8FAFC' }}>{t.teamLeadName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'Orbitron, monospace' }}>{t.teamLeadRegNum}</div>
                    </td>
                    <td style={{ fontWeight: '700', color: '#00E676' }}>{t.membersCount} Members</td>
                    <td style={{ fontFamily: 'Orbitron, monospace', color: (t.selectedProblemCode && t.selectedProblemCode !== 'Not Selected') ? '#FFD700' : '#94A3B8', fontWeight: (t.selectedProblemCode && t.selectedProblemCode !== 'Not Selected') ? '700' : '400' }}>
                      {t.selectedProblemCode && t.selectedProblemCode !== 'Not Selected' ? (
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: '800' }}>{t.selectedProblemCode}</div>
                          {t.selectedProblemTitle && (
                            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'Inter, sans-serif', fontWeight: 'normal', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={t.selectedProblemTitle}>
                              {t.selectedProblemTitle}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Not Selected</span>
                      )}
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

      {/* TAB: REVIEWER EVALUATIONS DASHBOARD (VIEW-ONLY FOR ADMIN) */}
      {activeTab === 'evaluations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Round Progress Statistics Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            
            {/* Round 1 Stats */}
            <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(0, 242, 254, 0.35)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)' }}>
              <div style={{ fontSize: '0.75rem', color: '#00F2FE', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Round 1 Evaluation
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F8FAFC', margin: '0.3rem 0', fontFamily: 'var(--font-heading)' }}>
                {evalData.summary?.round1Completed || 0} / {evalData.summary?.totalTeams || 60} <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>Completed</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                <div style={{ width: `${Math.round(((evalData.summary?.round1Completed || 0) / (evalData.summary?.totalTeams || 60)) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #00F2FE, #4FACFE)' }} />
              </div>
            </div>

            {/* Round 2 Stats */}
            <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(255, 215, 0, 0.35)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)' }}>
              <div style={{ fontSize: '0.75rem', color: '#FFD700', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Round 2 Evaluation
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F8FAFC', margin: '0.3rem 0', fontFamily: 'var(--font-heading)' }}>
                {evalData.summary?.round2Completed || 0} / {evalData.summary?.totalTeams || 60} <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>Completed</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                <div style={{ width: `${Math.round(((evalData.summary?.round2Completed || 0) / (evalData.summary?.totalTeams || 60)) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #FFD700, #FFA500)' }} />
              </div>
            </div>

            {/* Round 3 Stats */}
            <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.35)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)' }}>
              <div style={{ fontSize: '0.75rem', color: '#10B981', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Round 3 Evaluation
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F8FAFC', margin: '0.3rem 0', fontFamily: 'var(--font-heading)' }}>
                {evalData.summary?.round3Completed || 0} / {evalData.summary?.totalTeams || 60} <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>Completed</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                <div style={{ width: `${Math.round(((evalData.summary?.round3Completed || 0) / (evalData.summary?.totalTeams || 60)) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
              </div>
            </div>

          </div>

          {/* Controls Bar & View Switcher */}
          <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setEvalViewMode('team')}
                className={evalViewMode === 'team' ? 'btn-alpha-cyan' : 'btn-alpha-outline'}
                style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
              >
                Team-wise Leaderboard
              </button>
              <button
                onClick={() => setEvalViewMode('reviewer')}
                className={evalViewMode === 'reviewer' ? 'btn-alpha-cyan' : 'btn-alpha-outline'}
                style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
              >
                Reviewer Submissions Log
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search Team ID / Name..."
                  value={evalSearchTerm}
                  onChange={(e) => setEvalSearchTerm(e.target.value)}
                  style={{
                    padding: '0.45rem 0.85rem 0.45rem 2.25rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-cyan)',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '0.82rem',
                    outline: 'none',
                    width: '210px'
                  }}
                />
              </div>

              {evalViewMode === 'reviewer' && (
                <select
                  value={evalRoundFilter}
                  onChange={(e) => setEvalRoundFilter(e.target.value)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-cyan)',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Rounds</option>
                  <option value="1">Round 1</option>
                  <option value="2">Round 2</option>
                  <option value="3">Round 3</option>
                </select>
              )}
            </div>
          </div>

          {/* VIEW 1: TEAM-WISE LEADERBOARD / MATRIX */}
          {evalViewMode === 'team' ? (
            <div className="glass-panel" style={{ borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#00F2FE', fontFamily: 'var(--font-heading)', margin: 0 }}>
                  ALL 60 TEAMS EVALUATION MATRIX
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#FFD700', background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Admin Edit Privileges
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="alpha-table" style={{ width: '100%', fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>Team ID</th>
                      <th>Team Name</th>
                      <th style={{ textAlign: 'center' }}>Round 1 (Max 100)</th>
                      <th style={{ textAlign: 'center' }}>Round 2 (Max 100)</th>
                      <th style={{ textAlign: 'center' }}>Round 3 (Max 100)</th>
                      <th style={{ textAlign: 'center' }}>Combined Total (Max 300)</th>
                      <th style={{ textAlign: 'center' }}>Admin Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamsToDisplay
                      .filter(t => !evalSearchTerm || t.teamId.toLowerCase().includes(evalSearchTerm.toLowerCase()) || t.teamName.toLowerCase().includes(evalSearchTerm.toLowerCase()))
                      .map((t) => {
                        const evs = (evalData.evaluations || []).filter(e => 
                          (e.teamCode && t.teamId && e.teamCode.trim().toUpperCase() === t.teamId.trim().toUpperCase()) ||
                          (e.teamId && t._id && String(e.teamId) === String(t._id)) ||
                          (e.teamCode && t.teamName && e.teamCode.trim().toUpperCase() === t.teamName.trim().toUpperCase())
                        );
                        const r1Ev = evs.find(e => e.roundNumber === 1);
                        const r2Ev = evs.find(e => e.roundNumber === 2);
                        const r3Ev = evs.find(e => e.roundNumber === 3);

                        const r1Score = r1Ev ? r1Ev.totalMarks : null;
                        const r2Score = r2Ev ? r2Ev.totalMarks : null;
                        const r3Score = r3Ev ? r3Ev.totalMarks : null;

                        let totalCombined = 0;
                        if (r1Score !== null) totalCombined += r1Score;
                        if (r2Score !== null) totalCombined += r2Score;
                        if (r3Score !== null) totalCombined += r3Score;

                        return (
                          <tr key={t.teamId}>
                            <td style={{ fontWeight: '700', color: '#00F2FE', fontFamily: 'var(--font-heading)' }}>{t.teamId}</td>
                            <td style={{ fontWeight: '600', color: '#F8FAFC' }}>{t.teamName}</td>
                            
                            {/* Round 1 */}
                            <td style={{ textAlign: 'center' }}>
                              {r1Ev ? (
                                <button 
                                  onClick={() => openAdminEditEv(r1Ev, t, 1)}
                                  style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  title="Click to Edit Round 1 Marks"
                                >
                                  {r1Score} / 100 <Edit size={12} />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => openAdminEditEv(null, t, 1)}
                                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}
                                  title="Click to Enter Round 1 Marks as Admin"
                                >
                                  + Enter R1
                                </button>
                              )}
                            </td>

                            {/* Round 2 */}
                            <td style={{ textAlign: 'center' }}>
                              {r2Ev ? (
                                <button 
                                  onClick={() => openAdminEditEv(r2Ev, t, 2)}
                                  style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  title="Click to Edit Round 2 Marks"
                                >
                                  {r2Score} / 100 <Edit size={12} />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => openAdminEditEv(null, t, 2)}
                                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}
                                  title="Click to Enter Round 2 Marks as Admin"
                                >
                                  + Enter R2
                                </button>
                              )}
                            </td>

                            {/* Round 3 */}
                            <td style={{ textAlign: 'center' }}>
                              {r3Ev ? (
                                <button 
                                  onClick={() => openAdminEditEv(r3Ev, t, 3)}
                                  style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  title="Click to Edit Round 3 Marks"
                                >
                                  {r3Score} / 100 <Edit size={12} />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => openAdminEditEv(null, t, 3)}
                                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}
                                  title="Click to Enter Round 3 Marks as Admin"
                                >
                                  + Enter R3
                                </button>
                              )}
                            </td>

                            {/* Combined Total */}
                            <td style={{ textAlign: 'center', fontWeight: '800', color: '#FFD700', fontSize: '0.95rem' }}>
                              {totalCombined > 0 ? `${totalCombined} Marks` : '--'}
                            </td>

                            {/* Admin Quick Action */}
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                onClick={() => openAdminEditEv(r1Ev || r2Ev || r3Ev, t, r1Ev ? 1 : (r2Ev ? 2 : 3))}
                                className="btn-alpha-cyan"
                                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Edit size={13} /> Edit Marks
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* VIEW 2: REVIEWER SUBMISSION LOGS */
            <div className="glass-panel" style={{ borderRadius: '12px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#FFD700', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                INDIVIDUAL REVIEWER SUBMISSION LOGS
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="alpha-table" style={{ width: '100%', fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>Team ID</th>
                      <th>Team Name</th>
                      <th>Round</th>
                      <th>Reviewer</th>
                      <th style={{ textAlign: 'center' }}>Total Score</th>
                      <th>Status</th>
                      <th>Submitted At</th>
                      <th style={{ textAlign: 'center' }}>Admin Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(evalData.evaluations || [])
                      .filter(ev => {
                        if (evalRoundFilter !== 'ALL' && ev.roundNumber !== Number(evalRoundFilter)) return false;
                        if (evalSearchTerm && !ev.teamCode.toLowerCase().includes(evalSearchTerm.toLowerCase()) && !ev.teamName.toLowerCase().includes(evalSearchTerm.toLowerCase())) return false;
                        return true;
                      })
                      .map(ev => (
                        <tr key={ev._id}>
                          <td style={{ fontWeight: '700', color: '#00F2FE' }}>{ev.teamCode}</td>
                          <td style={{ fontWeight: '600', color: '#F8FAFC' }}>{ev.teamName}</td>
                          <td style={{ color: '#FFD700', fontWeight: '700' }}>Round {ev.roundNumber}</td>
                          <td style={{ color: '#E2E8F0' }}>{ev.reviewerName} (<span style={{ color: '#94A3B8' }}>{ev.reviewerUsername}</span>)</td>
                          <td style={{ textAlign: 'center', fontWeight: '800', color: '#10B981' }}>{ev.totalMarks} Marks</td>
                          <td>
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                              {ev.status || 'SUBMITTED'}
                            </span>
                          </td>
                          <td style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{new Date(ev.submittedAt || ev.createdAt).toLocaleString()}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              onClick={() => openAdminEditEv(ev, { teamId: ev.teamCode, teamName: ev.teamName, _id: ev.teamId }, ev.roundNumber)}
                              className="btn-alpha-cyan"
                              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Edit size={13} /> Edit Marks
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADMIN EVALUATION EDIT MODAL */}
          {adminEditEvModal && (() => {
            const roundNum = adminEditEvModal.roundNumber;
            const roundCriteria = ADMIN_ROUNDS_CONFIG[roundNum] || ADMIN_ROUNDS_CONFIG[1];

            const calculatedScore = Object.values(adminCriteriaInputs).reduce((acc, curr) => {
              const val = Number(curr);
              return acc + (isNaN(val) ? 0 : val);
            }, 0);

            return (
              <div className="modal-overlay">
                <div className="modal-content" style={{ maxWidth: '640px', padding: '2rem', border: '1px solid #FFD700', boxShadow: '0 0 30px rgba(255, 215, 0, 0.25)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#FFD700', textTransform: 'uppercase', fontWeight: 700 }}>
                        Admin Override Edit • Round {roundNum}
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', margin: '2px 0 0' }}>
                        {adminEditEvModal.teamCode} — {adminEditEvModal.teamName}
                      </h2>
                    </div>
                    <button 
                      onClick={() => setAdminEditEvModal(null)} 
                      style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.3rem' }}
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAdminSaveEv}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '360px', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
                      {roundCriteria.map((crit) => {
                        const val = adminCriteriaInputs[crit.key] ?? '';
                        return (
                          <div 
                            key={crit.key} 
                            style={{ 
                              background: 'rgba(15, 23, 42, 0.8)', 
                              padding: '0.9rem 1.1rem', 
                              borderRadius: '10px', 
                              border: '1px solid rgba(255,255,255,0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justify: 'space-between',
                              gap: '1rem'
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.9rem' }}>
                                {crit.name}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <input
                                type="number"
                                min="0"
                                max={crit.maxMarks}
                                step="1"
                                placeholder="0"
                                value={val}
                                onChange={(e) => {
                                  const inputVal = e.target.value;
                                  if (inputVal === '') {
                                    setAdminCriteriaInputs(prev => ({ ...prev, [crit.key]: '' }));
                                    return;
                                  }
                                  const n = Number(inputVal);
                                  if (!isNaN(n) && n >= 0 && n <= crit.maxMarks) {
                                    setAdminCriteriaInputs(prev => ({ ...prev, [crit.key]: n }));
                                  }
                                }}
                                style={{
                                  width: '75px',
                                  padding: '0.5rem',
                                  textAlign: 'center',
                                  background: 'rgba(30, 41, 59, 0.9)',
                                  border: '1px solid #FFD700',
                                  borderRadius: '8px',
                                  color: '#FFD700',
                                  fontWeight: 800,
                                  fontSize: '1rem',
                                  outline: 'none'
                                }}
                              />
                              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
                                / {crit.maxMarks}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                        Admin Notes / Remarks
                      </label>
                      <textarea
                        rows="2"
                        placeholder="Add admin notes or reason for mark modification..."
                        value={adminCommentsInput}
                        onChange={(e) => setAdminCommentsInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.85rem',
                          outline: 'none',
                          resize: 'none'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 215, 0, 0.08)', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 215, 0, 0.2)', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Total Score</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFD700', fontFamily: 'var(--font-heading)' }}>
                          {calculatedScore} / 100 Marks
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#FFD700', fontWeight: 600 }}>
                        ⚡ Admin Edit Mode
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setAdminEditEvModal(null)}
                        className="btn-alpha-outline"
                        style={{ padding: '0.7rem 1.25rem', fontSize: '0.88rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={adminSubmittingEv}
                        className="btn-alpha-gold"
                        style={{ padding: '0.7rem 1.5rem', fontSize: '0.88rem' }}
                      >
                        {adminSubmittingEv ? 'Saving...' : 'Save & Override Marks'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            );
          })()}

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
                  <th style={{ textAlign: 'center' }}>Actions</th>
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
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => setEditingProblem(p)}
                          className="btn-alpha-cyan"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProblem(p._id, p.problemId)}
                          className="btn-alpha-outline"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px', borderColor: '#FF4B4B', color: '#FF4B4B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingProblem && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '650px', border: '1px solid #00F2FE', boxShadow: '0 0 30px rgba(0, 242, 254, 0.25)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#00F2FE', marginBottom: '1rem' }}>
                  EDIT PROBLEM STATEMENT ({editingProblem.problemId})
                </h3>
                <form onSubmit={handleUpdateProblem}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginBottom: '0.2rem' }}>Problem ID</label>
                      <input
                        type="text"
                        value={editingProblem.problemId}
                        onChange={e => setEditingProblem({ ...editingProblem, problemId: e.target.value })}
                        required
                        style={{ width: '100%', padding: '0.65rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#00F2FE', borderRadius: '8px', fontFamily: 'Orbitron, monospace', fontWeight: '800' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginBottom: '0.2rem' }}>Problem Title</label>
                      <input
                        type="text"
                        value={editingProblem.title}
                        onChange={e => setEditingProblem({ ...editingProblem, title: e.target.value })}
                        required
                        style={{ width: '100%', padding: '0.65rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginBottom: '0.2rem' }}>Description</label>
                    <textarea
                      rows={4}
                      value={editingProblem.description}
                      onChange={e => setEditingProblem({ ...editingProblem, description: e.target.value })}
                      required
                      style={{ width: '100%', padding: '0.65rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Domain</label>
                      <input
                        type="text"
                        value={editingProblem.domain}
                        onChange={e => setEditingProblem({ ...editingProblem, domain: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Max Team Capacity</label>
                      <input
                        type="number"
                        min="1"
                        value={editingProblem.maxTeamCapacity}
                        onChange={e => setEditingProblem({ ...editingProblem, maxTeamCapacity: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.65rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Difficulty</label>
                      <select
                        value={editingProblem.difficulty}
                        onChange={e => setEditingProblem({ ...editingProblem, difficulty: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px' }}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setEditingProblem(null)} className="btn-alpha-outline">Cancel</button>
                    <button type="submit" className="btn-alpha-cyan">Update Problem Statement</button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '700' }}>1. Release Delay (Minutes)</label>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.35rem' }}>Delay before problem statements become visible</div>
                <input
                  type="number"
                  min="0"
                  value={settings.releaseDelayMinutes ?? 5}
                  onChange={e => setSettings({ ...settings, releaseDelayMinutes: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'Orbitron, monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '700' }}>2. Selection Delay (Minutes)</label>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.35rem' }}>Read-only view mode duration after release</div>
                <input
                  type="number"
                  min="0"
                  value={settings.selectionDelayMinutes ?? settings.readingDurationMinutes ?? 2}
                  onChange={e => setSettings({ ...settings, selectionDelayMinutes: Number(e.target.value), readingDurationMinutes: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'Orbitron, monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '700' }}>3. Selection Open Duration (Minutes)</label>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.35rem' }}>Active selection period duration</div>
                <input
                  type="number"
                  min="1"
                  value={settings.selectionDurationMinutes ?? 10}
                  onChange={e => setSettings({ ...settings, selectionDurationMinutes: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0F172A', border: '1px solid var(--border-cyan)', color: '#FFF', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'Orbitron, monospace' }}
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

      {/* TAB 5: CENTRALIZED ATTENDANCE MANAGER (INDIVIDUAL ATTENDANCE MATRIX) */}
      {activeTab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC' }}>INDIVIDUAL ATTENDANCE MANAGEMENT</h2>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                View and manage individual participant attendance records (Present / Absent) across all event sessions.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => window.open(`/api/attendance/admin/export?sessionId=${attSessionFilter}&status=${attStatusFilter}`, '_blank')}
                className="btn-alpha-cyan"
                style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={15} /> Export Attendance CSV
              </button>
              
              <button onClick={() => setShowCreateSessModal(true)} className="btn-alpha-gold" style={{ fontSize: '0.85rem' }}>
                <Plus size={18} /> Create Attendance Session
              </button>
            </div>
          </div>

          {/* SESSIONS STATUS LIST */}
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

          {/* INDIVIDUAL ATTENDANCE CONTROLS & STATS SUMMARY */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-cyan)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              
              {/* Session Selector */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#00F2FE', textTransform: 'uppercase', fontWeight: '700' }}>Filter by Session:</label>
                <select
                  value={attSessionFilter}
                  onChange={(e) => setAttSessionFilter(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: '#0F172A', border: '1px solid var(--border-cyan)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', marginTop: '0.25rem' }}
                >
                  <option value="ALL">All Sessions (Global Matrix)</option>
                  {attSessions.map(s => (
                    <option key={s._id} value={s.sessionId}>{s.sessionName} ({s.sessionId})</option>
                  ))}
                </select>
              </div>

              {/* Status Selector */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#00F2FE', textTransform: 'uppercase', fontWeight: '700' }}>Filter Individual Status:</label>
                <select
                  value={attStatusFilter}
                  onChange={(e) => setAttStatusFilter(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: '#0F172A', border: '1px solid var(--border-cyan)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', marginTop: '0.25rem' }}
                >
                  <option value="ALL">All Statuses (Present & Absent)</option>
                  <option value="PRESENT">🟢 Present Only</option>
                  <option value="ABSENT">🔴 Absent Only</option>
                </select>
              </div>

              {/* Search Bar */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#00F2FE', textTransform: 'uppercase', fontWeight: '700' }}>Search Participant:</label>
                <input
                  type="text"
                  placeholder="Search Name, Reg No, Team..."
                  value={attSearchFilter}
                  onChange={(e) => setAttSearchFilter(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: '#0F172A', border: '1px solid var(--border-cyan)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', marginTop: '0.25rem' }}
                />
              </div>

            </div>

            {/* Quick Summary Badges */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                Total Participants: <strong style={{ color: '#00F2FE' }}>{attStats.totalRegistered || 240}</strong>
              </span>
              <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                Individual Present: <strong style={{ color: '#00E676' }}>{attStats.present || 0}</strong>
              </span>
              <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                Individual Absent: <strong style={{ color: '#FF4B4B' }}>{attStats.absent || 0}</strong>
              </span>
              <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                Attendance Rate: <strong style={{ color: '#FFD700' }}>{attStats.percentage || 0}%</strong>
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', color: '#00F2FE', marginBottom: '1rem' }}>INDIVIDUAL PARTICIPANT ATTENDANCE MATRIX</h3>
          <div className="alpha-table-container">
            <table className="alpha-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>Reg No</th>
                  <th>Student Name</th>
                  <th>Team ID & Name</th>
                  <th>Session Name</th>
                  <th>Individual Status</th>
                  <th>Marked Time</th>
                  <th>Volunteer</th>
                </tr>
              </thead>
              <tbody>
                {attRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                      No individual attendance records found for selected filters.
                    </td>
                  </tr>
                ) : (
                  attRecords.map((r, idx) => {
                    const extractAlphaCode = (str) => {
                      if (!str) return null;
                      const m = String(str).match(/ALPHA-?(\d+)/i);
                      return m ? `ALPHA-${m[1].padStart(3, '0')}` : null;
                    };

                    const cleanReg = String(r.participantRegNum || '').trim().toUpperCase();
                    const targetTeamCode = extractAlphaCode(r.teamId) || extractAlphaCode(cleanReg) || extractAlphaCode(r.teamName) || extractAlphaCode(r.participantName);

                    let authTeam = AUTHORIZED_TEAMS.find(t => t.teamId === targetTeamCode || t.regNum === cleanReg);
                    if (!authTeam && cleanReg) {
                      authTeam = AUTHORIZED_TEAMS.find(t => t.members && t.members.some(m => String(m.registrationNumber).trim().toUpperCase() === cleanReg));
                    }

                    const authMember = authTeam?.members?.find(m => String(m.registrationNumber).trim().toUpperCase() === cleanReg);

                    const displayName = authMember?.name || (authTeam && (!r.participantName || r.participantName.includes('Team Lead ('))) ? authTeam.leadName : r.participantName;
                    const displayTeamId = authTeam?.teamId || r.teamId || 'ALPHA';
                    const displayTeamName = authTeam?.teamName || r.teamName || 'Team';
                    const displayRegNum = authMember?.registrationNumber || (authTeam ? authTeam.regNum : r.participantRegNum);

                    return (
                      <tr key={r._id || idx}>
                        <td style={{ color: '#94A3B8', fontWeight: '700' }}>{idx + 1}</td>
                        <td style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE' }}>{displayRegNum}</td>
                        <td style={{ fontWeight: '700', color: '#F8FAFC' }}>{displayName}</td>
                        <td><span style={{ color: '#FFD700', fontWeight: '600' }}>{displayTeamId}</span> ({displayTeamName})</td>
                        <td>{r.sessionName}</td>
                        <td>
                          {r.status === 'PRESENT' ? (
                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(0,230,118,0.2)', color: '#00E676', border: '1px solid rgba(0,230,118,0.4)' }}>
                              🟢 PRESENT
                            </span>
                          ) : (
                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(255,75,75,0.2)', color: '#FF4B4B', border: '1px solid rgba(255,75,75,0.4)' }}>
                              🔴 ABSENT
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                          {r.markedAt ? new Date(r.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{r.markedByVolunteer || '—'}</td>
                      </tr>
                    );
                  })
                )}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC' }}>VISUAL ANALYTICS & ATTENDANCE CHARTS</h2>
            <button
              onClick={() => window.open('/api/attendance/admin/export?sessionId=ALL', '_blank')}
              className="btn-alpha-cyan"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Download size={15} /> Export Attendance Report (CSV)
            </button>
          </div>

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
