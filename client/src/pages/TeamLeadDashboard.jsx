import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, CheckCircle2, Clock, Search, Filter, Lock, 
  Sparkles, AlertCircle, FileText, Check, Award, ArrowRight, ShieldAlert,
  Users, UserCheck, QrCode, Download, Printer, Ticket, Calendar, ShieldCheck, CheckCircle,
  MessageCircle, Instagram
} from 'lucide-react';
import axios from 'axios';
import QRCode from 'qrcode';
import AUTHORIZED_TEAMS from '../data/teamsData.js';

export default function TeamLeadDashboard() {
  const { user, refreshUserSession } = useAuth();

  // Participant Navigation: 'dashboard', 'problems', 'attendance'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Team Details Data State (Instantly seeded from login session if available)
  const [myTeamData, setMyTeamData] = useState(() => {
    return user?.team ? { team: user.team, members: user.team.members || [] } : null;
  });
  const [loadingTeam, setLoadingTeam] = useState(!user?.team);
  const [teamQrDataUrl, setTeamQrDataUrl] = useState('');
  const [eventPassQrDataUrl, setEventPassQrDataUrl] = useState('');

  // Fallback calculations using local AUTHORIZED_TEAMS dataset to guarantee 100% display
  const formatTeamKey = (raw) => {
    if (!raw) return '';
    const str = String(raw).trim().toUpperCase();
    const m = str.match(/ALPHA-?(\d+)/i);
    if (m) return `ALPHA-${m[1].padStart(3, '0')}`;
    return str;
  };

  const currentSearchKey = formatTeamKey(
    myTeamData?.team?.teamId || user?.team?.teamId || user?.team?.name || user?.teamId || user?.registrationNumber
  );

  const authItem = AUTHORIZED_TEAMS.find(t => 
    (t.teamId && formatTeamKey(t.teamId) === currentSearchKey) ||
    (t.regNum && t.regNum === user?.registrationNumber) ||
    (t.regNum && myTeamData?.teamLead?.registrationNumber && t.regNum === myTeamData.teamLead.registrationNumber) ||
    (t.members && t.members.some(m => m.registrationNumber === user?.registrationNumber))
  );

  const displayTeamId = myTeamData?.team?.teamId || authItem?.teamId || user?.team?.teamId || user?.team?.name || 'ALPHA';
  const displayTeamName = authItem?.teamName || myTeamData?.team?.name || user?.team?.teamName || (user?.team?.name !== displayTeamId ? user?.team?.name : null) || displayTeamId;
  const displayLeadName = authItem?.leadName || myTeamData?.teamLead?.name || (user?.name && !user.name.includes('Team Lead') ? user.name : null) || `Team Lead (${displayTeamId})`;
  const displayLeadRegNum = authItem?.regNum || myTeamData?.teamLead?.registrationNumber || user?.registrationNumber || 'N/A';
  const displayCollege = myTeamData?.team?.college || user?.team?.college || 'KARE';
  const displayDepartment = myTeamData?.team?.department || user?.team?.department || 'CSE';
  const displayRegStatus = myTeamData?.team?.registrationStatus || user?.team?.registrationStatus || 'CONFIRMED';
  
  const displayMembers = (myTeamData?.members && myTeamData.members.length > 0) 
    ? myTeamData.members 
    : ((authItem?.members && authItem.members.length > 0) 
      ? authItem.members 
      : ((user?.team?.members && user.team.members.length > 0) 
        ? user.team.members 
        : [
          { name: displayLeadName, registrationNumber: displayLeadRegNum, role: 'LEAD' }
        ]));

  const qrTokenToUse = myTeamData?.team?.teamQrToken || user?.team?.teamQrToken || (authItem ? `TQ-${authItem.teamId}-${authItem.regNum.slice(-4)}` : `TQ-${displayTeamId}`);
  const passTokenToUse = myTeamData?.team?.eventPassQrToken || user?.team?.eventPassQrToken || (authItem ? `EP-${authItem.teamId}-${authItem.regNum.slice(-4)}` : `EP-${displayTeamId}`);

  // Problem Statements State
  const [problems, setProblems] = useState([]);
  const [timerState, setTimerState] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [activeModalProblem, setActiveModalProblem] = useState(null);
  const [confirmingProblem, setConfirmingProblem] = useState(null);
  const [selectingLoading, setSelectingLoading] = useState(false);
  const [selectionError, setSelectionError] = useState('');
  const [confirmedData, setConfirmedData] = useState(null);

  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Attendance Sessions State
  const [attSessions, setAttSessions] = useState([]);
  const [selectedAttSession, setSelectedAttSession] = useState(null);
  const [attQrDataUrl, setAttQrDataUrl] = useState('');
  const [myAttendanceRecords, setMyAttendanceRecords] = useState({});
  const [myAttendanceFullData, setMyAttendanceFullData] = useState(null);

  // 1. Fetch My Team Details
  const fetchMyTeam = async () => {
    try {
      if (!myTeamData) setLoadingTeam(true);
      const res = await axios.get('/api/teams/my-team');
      if (res.data) {
        setMyTeamData(res.data);
        if (res.data.team?.selectionConfirmed) {
          setConfirmedData(prev => ({
            ...prev,
            teamName: res.data.team.name || res.data.team.teamName,
            problemId: res.data.team.selectedProblemCode,
            problemCode: res.data.team.selectedProblemCode,
            problemTitle: res.data.team.selectedProblem?.title || prev?.problemTitle,
            domain: res.data.team.selectedProblem?.domain || prev?.domain,
            description: res.data.team.selectedProblem?.description || prev?.description,
            requirements: res.data.team.selectedProblem?.requirements || prev?.requirements,
            expectedSolution: res.data.team.selectedProblem?.expectedSolution || prev?.expectedSolution,
            technologies: res.data.team.selectedProblem?.technologies || prev?.technologies,
            selectedProblem: res.data.team.selectedProblem || prev?.selectedProblem,
            selectedAt: res.data.team.selectedAt || prev?.selectedAt,
            status: 'CONFIRMED'
          }));
        }
      }
    } catch (err) {
      console.error('Error loading team details:', err);
    } finally {
      setLoadingTeam(false);
    }
  };

  useEffect(() => {
    fetchMyTeam();
  }, [user]);

  // Generate Team QR Data URL
  useEffect(() => {
    if (qrTokenToUse) {
      const publicUrl = `${window.location.origin}/team/${qrTokenToUse}`;
      QRCode.toDataURL(publicUrl, {
        width: 320,
        margin: 2,
        color: { dark: '#00F2FE', light: '#0F172A' }
      }).then(setTeamQrDataUrl).catch(console.error);
    }
  }, [qrTokenToUse]);

  // Generate Event Pass QR Data URL
  useEffect(() => {
    if (passTokenToUse) {
      const passUrl = `EVENT-PASS-${passTokenToUse}`;
      QRCode.toDataURL(passUrl, {
        width: 320,
        margin: 2,
        color: { dark: '#00E676', light: '#0F172A' }
      }).then(setEventPassQrDataUrl).catch(console.error);
    }
  }, [passTokenToUse]);

  // 2. Poll Problem Statements & Timer State
  useEffect(() => {
    let isMounted = true;
    const loadProblems = async () => {
      try {
        const res = await axios.get('/api/problems', {
          params: {
            domain: selectedDomain,
            difficulty: selectedDifficulty,
            search: searchTerm
          }
        });

        if (isMounted && res.data) {
          setProblems(res.data.problems || []);
          setTimerState(res.data.timerState);
        }
      } catch (e) {}
    };

    loadProblems();
    const interval = setInterval(loadProblems, 1500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedDomain, selectedDifficulty, searchTerm]);

  // 3. Poll Attendance Sessions & My Attendance Status
  useEffect(() => {
    const fetchAttendanceSessions = async () => {
      try {
        const res = await axios.get('/api/attendance/sessions');
        if (res.data?.sessions) {
          const list = res.data.sessions || [];
          setAttSessions(list);
          if (list.length > 0) {
            if (!selectedAttSession || !list.some(s => s.sessionId === selectedAttSession.sessionId)) {
              const active = list.find(s => s.status === 'ACTIVE') || list[0];
              setSelectedAttSession(active);
            } else {
              const current = list.find(s => s.sessionId === selectedAttSession.sessionId);
              setSelectedAttSession(current || null);
            }
          } else {
            setSelectedAttSession(null);
          }
        }

        const myAttRes = await axios.get('/api/attendance/my-attendance');
        if (myAttRes.data) {
          setMyAttendanceRecords(myAttRes.data.markedSessions || {});
          setMyAttendanceFullData(myAttRes.data);
        }
      } catch (e) {}
    };

    fetchAttendanceSessions();
    const interval = setInterval(fetchAttendanceSessions, 3000);
    return () => clearInterval(interval);
  }, []);

  // Generate Attendance Session QR Data URL
  useEffect(() => {
    if (selectedAttSession && (user?.registrationNumber || displayTeamId)) {
      const attPayload = `ALPHA-SESSION-ATTENDANCE-QR:${selectedAttSession.sessionId}:${displayTeamId}:${displayLeadRegNum}`;
      QRCode.toDataURL(attPayload, {
        width: 320,
        margin: 2,
        color: { dark: '#FFD700', light: '#0F172A' }
      }).then(setAttQrDataUrl).catch(console.error);
    }
  }, [selectedAttSession, user, displayTeamId, displayLeadRegNum]);

  // Server-synchronized 1-second countdown ticker
  useEffect(() => {
    const updateCountdown = () => {
      if (!timerState || !timerState.serverTime) return;

      const serverNow = new Date(timerState.serverTime).getTime();
      const clientNow = Date.now();
      const serverOffset = clientNow - serverNow;

      let targetEnd = null;

      if (timerState.currentPhase === 'RELEASED_LOCKED' || timerState.currentPhase === 'READING') {
        targetEnd = timerState.selectionScheduledStart || timerState.readingEndsAt;
      } else if (timerState.currentPhase === 'SELECTION_OPEN' || timerState.currentPhase === 'SELECTION') {
        targetEnd = timerState.selectionEndsAt;
      }

      if (targetEnd) {
        const adjustedClientNow = Date.now() - serverOffset;
        const remaining = Math.max(0, Math.floor((new Date(targetEnd).getTime() - adjustedClientNow) / 1000));
        setSecondsRemaining(remaining);
      } else {
        setSecondsRemaining(0);
      }
    };

    updateCountdown();
    const ticker = setInterval(updateCountdown, 1000);
    return () => clearInterval(ticker);
  }, [timerState]);

  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return '00:00:00';
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check confirmed problem selection from user session
  useEffect(() => {
    if (user?.team?.selectionConfirmed) {
      setConfirmedData(prev => prev || {
        teamName: user.team.name || user.team.teamName,
        problemId: user.team.selectedProblemCode,
        problemCode: user.team.selectedProblemCode,
        status: 'CONFIRMED'
      });
    }
  }, [user]);

  const handleSelectProblem = async (problem) => {
    setSelectionError('');
    setSelectingLoading(true);
    try {
      const res = await axios.post('/api/problems/select', { problemId: problem._id });
      setSelectingLoading(false);
      setConfirmingProblem(null);
      setConfirmedData(res.data.selection);
      await refreshUserSession();
      await fetchMyTeam();
    } catch (err) {
      setSelectingLoading(false);
      setSelectionError(err.response?.data?.error || 'Failed to select problem statement.');
    }
  };

  // Download Team QR Code Image
  const handleDownloadQr = () => {
    if (!teamQrDataUrl) return;
    const link = document.createElement('a');
    link.href = teamQrDataUrl;
    link.download = `Team-${myTeamData?.team?.teamId || 'QR'}-Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isRoundStartedUnreleased = timerState?.currentPhase === 'ROUND_STARTED_UNRELEASED';
  const isReleasedLocked = timerState?.problemStatementsReleased && (timerState?.currentPhase === 'RELEASED_LOCKED' || timerState?.currentPhase === 'READING' || timerState?.currentPhase === 'NOT_STARTED');
  const isSelectionOpen = timerState?.currentPhase === 'SELECTION_OPEN' || timerState?.currentPhase === 'SELECTION';
  const isSelectionClosed = timerState?.currentPhase === 'SELECTION_CLOSED' || timerState?.currentPhase === 'CLOSED';
  const isUnreleased = !timerState?.problemStatementsReleased && !isRoundStartedUnreleased;

  const domains = ['ALL', 'IoT & Smart Energy', 'AI & Cybersecurity', 'Web3 & Blockchain', 'Smart Cities & AI', 'Healthcare & NLP'];

  return (
    <div className="main-layout" style={{ maxWidth: '1350px' }}>
      
      {/* PARTICIPANT PORTAL NAVIGATION BAR */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderColor: '#00F2FE' }}>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'problems', label: 'Problem Statements', icon: BookOpen },
            { id: 'attendance', label: 'Attendance Sessions', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn-alpha-outline"
                style={{
                  padding: '0.6rem 1.1rem',
                  fontSize: '0.88rem',
                  borderRadius: '12px',
                  border: isActive ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.08)',
                  background: isActive ? 'linear-gradient(135deg, rgba(0,242,254,0.2) 0%, rgba(79,172,254,0.2) 100%)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#00F2FE' : '#94A3B8',
                  fontWeight: isActive ? '700' : '500',
                  boxShadow: isActive ? '0 0 15px rgba(0, 242, 254, 0.2)' : 'none'
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TOP STATUS BADGE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Logged in as:</span>
          <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.88rem', fontWeight: '800', color: '#00F2FE', background: 'rgba(0, 242, 254, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
            {displayTeamId} • {displayTeamName}
          </span>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: PARTICIPANT TEAM DASHBOARD */}
      {/* ==================================================== */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>

            {/* CARD 1: TEAM DETAILS & INSTITUTION */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid #00F2FE' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#00F2FE', fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#00F2FE" /> TEAM INFORMATION
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Team ID</span>
                  <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: '800', color: '#00F2FE', fontSize: '1.05rem' }}>
                    {displayTeamId}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Team Name</span>
                  <span style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '1.05rem' }}>
                    {displayTeamName}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Department</span>
                  <span style={{ fontWeight: '600', color: '#F8FAFC', fontSize: '0.92rem' }}>
                    {displayDepartment}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(0,230,118,0.05)', borderRadius: '10px', border: '1px solid rgba(0,230,118,0.2)' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Registration Status</span>
                  <span style={{ fontWeight: '800', color: '#00E676', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={15} /> {displayRegStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: TEAM LEAD DETAILS */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid #00E676' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#00E676', fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={20} color="#00E676" /> TEAM LEAD
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,230,118,0.05)', borderRadius: '10px', border: '1px solid rgba(0,230,118,0.15)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Full Name</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F8FAFC', marginTop: '0.2rem' }}>
                    {displayLeadName}
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Registration Number / ID</div>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.05rem', fontWeight: '800', color: '#00F2FE', marginTop: '0.2rem' }}>
                    {displayLeadRegNum}
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Email Address</div>
                  <div style={{ fontSize: '0.92rem', color: '#CBD5E1', marginTop: '0.2rem' }}>
                    {displayLeadRegNum && displayLeadRegNum !== 'N/A' ? `${displayLeadRegNum}@klu.ac.in` : (myTeamData?.teamLead?.email || 'N/A')}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: UNIQUE TEAM QR CODE */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid #FFD700', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#FFD700', fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <QrCode size={20} color="#FFD700" /> TEAM QR CODE
              </h3>

              <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                Scan to view public team member verification pass
              </p>

              {/* QR CODE PREVIEW */}
              <div style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '16px', border: '2px dashed #00F2FE', display: 'inline-block', marginBottom: '1rem', boxShadow: '0 0 25px rgba(0,242,254,0.15)' }}>
                {teamQrDataUrl ? (
                  <img src={teamQrDataUrl} alt="Team QR Code" style={{ width: '180px', height: '180px', display: 'block', borderRadius: '8px' }} />
                ) : (
                  <div style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>Generating QR...</div>
                )}
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.05rem', fontWeight: '900', color: '#00F2FE', marginTop: '0.75rem', letterSpacing: '1px' }}>
                  Team ID: {displayTeamId}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={handleDownloadQr} className="btn-alpha-cyan" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                  <Download size={15} /> Download QR
                </button>
                <button onClick={() => window.print()} className="btn-alpha-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                  <Printer size={15} /> Print QR
                </button>
              </div>
            </div>

            {/* CARD 4: ALL TEAM MEMBERS LIST */}
            <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '1.75rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#F8FAFC', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={22} color="#00F2FE" /> TEAM MEMBERS ({displayMembers.length})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {displayMembers.map((mem, idx) => (
                  <div key={idx} className="glass-card" style={{
                    padding: '1.25rem',
                    borderLeft: mem.role === 'LEAD' ? '4px solid #00E676' : '4px solid #00F2FE',
                    background: mem.role === 'LEAD' ? 'rgba(0,230,118,0.05)' : 'rgba(255,255,255,0.02)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Member #{idx + 1}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F8FAFC' }}>{mem.name}</div>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        background: mem.role === 'LEAD' ? 'rgba(0,230,118,0.2)' : 'rgba(0,242,254,0.15)',
                        color: mem.role === 'LEAD' ? '#00E676' : '#00F2FE'
                      }}>
                        {mem.role || (idx === 0 ? 'LEAD' : 'MEMBER')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#94A3B8', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem', marginTop: '0.5rem' }}>
                      <div>
                        Registration No: <strong style={{ color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>{mem.registrationNumber}</strong>
                      </div>
                      {mem.email && <div>Email: <span style={{ color: '#CBD5E1' }}>{mem.email}</span></div>}
                      {mem.phone && <div>Phone: <span style={{ color: '#CBD5E1' }}>{mem.phone}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

              {/* CARD 5: SELECTED PROBLEM STATEMENT (DASHBOARD HIGHLIGHT) */}
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '1.75rem', borderLeft: '4px solid #FFD700' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: '#FFD700', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={22} color="#FFD700" /> SELECTED PROBLEM STATEMENT
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Problem statement assigned to your team for Hackathon Event ALPHA
                    </p>
                  </div>

                  {(myTeamData?.team?.selectionConfirmed || user?.team?.selectionConfirmed || confirmedData) ? (
                    <div style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid #00E676', padding: '0.4rem 0.85rem', borderRadius: '20px', color: '#00E676', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={16} /> SELECTION CONFIRMED
                    </div>
                  ) : (
                    <button onClick={() => setActiveTab('problems')} className="btn-alpha-gold" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      Browse & Select Problem Statement <ArrowRight size={16} />
                    </button>
                  )}
                </div>

                {(myTeamData?.team?.selectionConfirmed || user?.team?.selectionConfirmed || confirmedData) ? (
                  (() => {
                    const selCode = myTeamData?.team?.selectedProblemCode || user?.team?.selectedProblemCode || confirmedData?.problemCode || confirmedData?.problemId;
                    const selObj = myTeamData?.team?.selectedProblem || problems.find(p => p.problemId === selCode) || confirmedData?.selectedProblem || {};
                    const selTitle = selObj.title || confirmedData?.problemTitle;
                    const selDesc = selObj.description || confirmedData?.description;

                    return (
                      <div className="glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem', background: 'rgba(15,23,42,0.8)' }}>
                        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.25rem', fontWeight: '900', color: '#FFD700', marginBottom: '0.35rem' }}>
                          {selCode}
                        </div>
                        {selTitle && (
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                            {selTitle}
                          </div>
                        )}
                        {selDesc && (
                          <div style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: '1.5' }}>
                            {selDesc}
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div style={{ padding: '1.25rem', marginTop: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
                    No Problem Statement selected yet. Click the button above or visit the <strong>Problem Statements</strong> tab to select one during the selection phase.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      {/* ==================================================== */}
      {/* TAB 2: PROBLEM STATEMENTS SELECTION PORTAL */}
      {/* ==================================================== */}
      {activeTab === 'problems' && (
        <div>
          {confirmedData || (user?.team?.selectionConfirmed) || (myTeamData?.team?.selectionConfirmed) ? (
            (() => {
              const activeSelectedCode = confirmedData?.problemId || confirmedData?.problemCode || myTeamData?.team?.selectedProblemCode || user?.team?.selectedProblemCode;
              const selectedProblemObj = myTeamData?.team?.selectedProblem || problems.find(p => p.problemId === activeSelectedCode) || confirmedData?.selectedProblem || {};
              const activeProblemTitle = selectedProblemObj?.title || confirmedData?.problemTitle || 'Selected Problem Statement';
              const activeProblemDomain = selectedProblemObj?.domain || confirmedData?.domain || '';
              const activeProblemDesc = selectedProblemObj?.description || confirmedData?.description || 'Your selected problem statement has been confirmed and locked in the database.';
              const activeProblemRequirements = selectedProblemObj?.requirements || confirmedData?.requirements || [];
              const activeProblemExpectedSolution = selectedProblemObj?.expectedSolution || confirmedData?.expectedSolution || '';
              const activeProblemTech = selectedProblemObj?.technologies || confirmedData?.technologies || [];

              return (
                <div className="glass-panel" style={{ maxWidth: '950px', margin: '2rem auto', padding: '2.5rem 2rem', textAlign: 'center', borderColor: '#00E676', boxShadow: '0 0 40px rgba(0, 230, 118, 0.2)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 230, 118, 0.15)', border: '2px solid #00E676', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 0 25px rgba(0,230,118,0.4)' }}>
                    <Award size={44} color="#00E676" />
                  </div>
                  
                  <h1 style={{ fontFamily: 'var(--font-heading)', color: '#F8FAFC', fontSize: '2rem', marginBottom: '0.4rem' }}>
                    🎉 PROBLEM STATEMENT CONFIRMED
                  </h1>
                  <p style={{ color: '#00E676', fontSize: '1.1rem', fontWeight: '700', marginBottom: '2rem', letterSpacing: '1px' }}>
                    Your selection is locked in the database. ✅
                  </p>

                  {/* SUMMARY CARDS GRID */}
                  <div className="glass-card" style={{ padding: '1.5rem 2rem', textAlign: 'left', marginBottom: '1.5rem', borderLeft: '4px solid #00E676' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Team ID & Name</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F8FAFC' }}>
                          <span style={{ color: '#00F2FE', fontFamily: 'Orbitron, monospace', marginRight: '0.5rem' }}>{displayTeamId}</span>
                          <span>{displayTeamName}</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Team Lead</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F8FAFC' }}>{displayLeadName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>{displayLeadRegNum}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Selected Problem Code</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFD700', fontFamily: 'Orbitron, monospace' }}>
                          {activeSelectedCode}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FULL SELECTED PROBLEM STATEMENT DETAILS DISPLAY */}
                  <div className="glass-card" style={{ padding: '2rem', textAlign: 'left', marginBottom: '2rem', border: '1px solid rgba(0, 242, 254, 0.3)', background: 'rgba(15, 23, 42, 0.9)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ background: 'rgba(0,242,254,0.15)', border: '1px solid #00F2FE', color: '#00F2FE', fontSize: '0.8rem', fontWeight: '800', padding: '0.25rem 0.75rem', borderRadius: '20px', fontFamily: 'Orbitron, monospace' }}>
                          {activeSelectedCode}
                        </span>
                        <span style={{ marginLeft: '0.75rem', background: 'rgba(255,215,0,0.15)', border: '1px solid #FFD700', color: '#FFD700', fontSize: '0.8rem', fontWeight: '700', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                          {activeProblemDomain}
                        </span>
                      </div>
                      <span style={{ color: '#00E676', fontSize: '0.82rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ShieldCheck size={16} /> VERIFIED SELECTION
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-heading)', color: '#F8FAFC', fontSize: '1.4rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                      {activeProblemTitle}
                    </h2>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.85rem', color: '#00F2FE', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                        Problem Description
                      </h4>
                      <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                        {activeProblemDesc}
                      </p>
                    </div>

                    {activeProblemExpectedSolution && (
                      <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.25rem', borderRadius: '10px', borderLeft: '3px solid #00F2FE' }}>
                        <h4 style={{ fontSize: '0.85rem', color: '#00F2FE', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: '700' }}>
                          Expected Solution / Deliverables
                        </h4>
                        <p style={{ color: '#E2E8F0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                          {activeProblemExpectedSolution}
                        </p>
                      </div>
                    )}

                    {activeProblemRequirements && activeProblemRequirements.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.85rem', color: '#FFD700', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>
                          Key Requirements
                        </h4>
                        <ul style={{ paddingLeft: '1.25rem', color: '#CBD5E1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                          {activeProblemRequirements.map((reqStr, idx) => (
                            <li key={idx} style={{ marginBottom: '0.25rem' }}>{reqStr}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeProblemTech && activeProblemTech.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '0.85rem', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>
                          Target Technologies
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {activeProblemTech.map((tech, idx) => (
                            <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#F8FAFC', fontSize: '0.78rem', padding: '0.2rem 0.65rem', borderRadius: '6px' }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TEAM MEMBERS LIST */}
                  <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#00F2FE', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={18} /> REGISTERED TEAM MEMBERS ({displayMembers.length})
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      {displayMembers.map((m, idx) => (
                        <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '0.9rem' }}>{m.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>{m.registrationNumber}</div>
                          <div style={{ fontSize: '0.72rem', color: m.role === 'LEAD' ? '#FFD700' : '#94A3B8', fontWeight: '700', marginTop: '0.25rem' }}>
                            {m.role === 'LEAD' ? '👑 TEAM LEAD' : 'MEMBER'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PRINT & ACTION BUTTONS */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn-alpha-cyan" onClick={() => window.print()} style={{ padding: '0.85rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Printer size={20} /> Print Official Selection Certificate
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <>
              {/* PROMINENT LIVE SESSION TIMER BANNER */}
              <div className="glass-panel" style={{
                padding: '1.75rem 2rem',
                marginBottom: '2rem',
                borderColor: isSelectionOpen ? '#00E676' : (isReleasedLocked ? '#FFD700' : (isRoundStartedUnreleased ? '#00F2FE' : 'rgba(255,255,255,0.1)')),
                boxShadow: isSelectionOpen ? '0 0 35px rgba(0, 230, 118, 0.25)' : (isReleasedLocked ? '0 0 35px rgba(255, 215, 0, 0.25)' : (isRoundStartedUnreleased ? '0 0 35px rgba(0, 242, 254, 0.25)' : 'none'))
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                      {isUnreleased && <span className="phase-pill closed" style={{ background: 'rgba(255,75,75,0.15)', color: '#FF4B4B' }}>🔴 NOT RELEASED</span>}
                      {isRoundStartedUnreleased && <span className="phase-pill reading" style={{ background: 'rgba(0,242,254,0.15)', color: '#00F2FE' }}>⏳ ROUND STARTED — RELEASING SOON</span>}
                      {isReleasedLocked && <span className="phase-pill reading" style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}>🟡 PROBLEM STATEMENTS RELEASED (READ-ONLY)</span>}
                      {isSelectionOpen && <span className="phase-pill selection" style={{ background: 'rgba(0,230,118,0.2)', color: '#00E676' }}>🟢 SELECTION IS OPEN</span>}
                      {isSelectionClosed && <span className="phase-pill closed">🔴 SELECTION CLOSED</span>}
                    </div>
                    
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#F8FAFC', letterSpacing: '0.5px' }}>
                      {isUnreleased && 'Problem Statements have not been released yet.'}
                      {isRoundStartedUnreleased && 'Problem Statements will be released soon'}
                      {isReleasedLocked && 'Problem Statements Released — View / Read Only Mode'}
                      {isSelectionOpen && 'Selection is OPEN'}
                      {isSelectionClosed && 'Problem Selection Period Ended'}
                    </h2>

                    <p style={{ color: '#CBD5E1', fontSize: '0.92rem', marginTop: '0.35rem', lineHeight: '1.5' }}>
                      {isUnreleased && 'The administrator has not released the problem statements yet. Please stand by.'}
                      {isRoundStartedUnreleased && 'The round has been started by the administrator. Problem statements will be automatically published when the countdown reaches 00:00.'}
                      {isReleasedLocked && 'Problem Statements are released for viewing. Problem selection is currently disabled and will be enabled automatically when the countdown reaches 00:00.'}
                      {isSelectionOpen && 'Selection is OPEN! Note: Each Problem Statement can be selected by a MAXIMUM OF 2 TEAMS (First-Come, First-Served basis).'}
                      {isSelectionClosed && 'The problem selection period is now closed. Unselected teams must contact the event administrator.'}
                    </p>
                  </div>

                  {(isRoundStartedUnreleased || isReleasedLocked || isSelectionOpen) && (
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: `2px solid ${isSelectionOpen ? '#00E676' : (isReleasedLocked ? '#FFD700' : '#00F2FE')}`,
                      padding: '1.15rem 2rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      boxShadow: `0 0 25px ${isSelectionOpen ? 'rgba(0, 230, 118, 0.35)' : (isReleasedLocked ? 'rgba(255, 215, 0, 0.35)' : 'rgba(0, 242, 254, 0.35)')}`
                    }}>
                      <div style={{ fontSize: '0.75rem', color: isSelectionOpen ? '#00E676' : (isReleasedLocked ? '#FFD700' : '#00F2FE'), textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '800' }}>
                        {isSelectionOpen ? 'SELECTION TIME REMAINING' : (isReleasedLocked ? 'SELECTION WILL BE ENABLED IN' : 'PROBLEM STATEMENTS WILL BE RELEASED IN')}
                      </div>
                      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '2.5rem', fontWeight: '900', color: '#F8FAFC', letterSpacing: '3px', marginTop: '0.2rem' }}>
                        {formatTime(
                          secondsRemaining || (
                            isRoundStartedUnreleased ? timerState?.timeUntilReleaseSeconds :
                            (isReleasedLocked ? timerState?.timeUntilSelectionStartSeconds : timerState?.selectionTimeRemainingSeconds)
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isUnreleased || isRoundStartedUnreleased ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', margin: '2rem 0' }}>
                  <Lock size={48} color={isRoundStartedUnreleased ? '#00F2FE' : '#FF4B4B'} style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ color: '#F8FAFC', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                    {isRoundStartedUnreleased ? 'Problem Statements Releasing Soon' : 'Problem Statements Have Not Been Released Yet'}
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
                    {isRoundStartedUnreleased ? (
                      <>Problem Statements will be released in <strong style={{ color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>{formatTime(secondsRemaining || timerState?.timeUntilReleaseSeconds)}</strong>. Please wait.</>
                    ) : (
                      'Problem Statements have not been released yet. Please wait for the event administrator to start the round from the Admin panel.'
                    )}
                  </p>
                </div>
              ) : (
                <>
                  {/* SEARCH & DOMAIN FILTERS */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                      <input
                        type="text"
                        placeholder="Search problem title, ID, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 2.5rem',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid var(--border-cyan)',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                      <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                      {domains.map((dom) => (
                        <button
                          key={dom}
                          onClick={() => setSelectedDomain(dom)}
                          className={`btn-alpha-outline ${selectedDomain === dom ? 'active' : ''}`}
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.8rem',
                            borderRadius: '20px',
                            borderColor: selectedDomain === dom ? '#00F2FE' : 'rgba(255,255,255,0.1)',
                            background: selectedDomain === dom ? 'rgba(0,242,254,0.15)' : 'rgba(255,255,255,0.03)',
                            color: selectedDomain === dom ? '#00F2FE' : '#94A3B8'
                          }}
                        >
                          {dom}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PROBLEM STATEMENTS GRID */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                    {problems.map((prob) => {
                      const maxCap = prob.maxTeamCapacity || 2;
                      const count = prob.selectedCount || 0;
                      const isFull = count >= maxCap;

                      return (
                        <div key={prob._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: isFull ? 0.8 : 1 }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                              <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.9rem', fontWeight: '800', color: '#00F2FE', background: 'rgba(0, 242, 254, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                                {prob.problemId}
                              </span>
                              
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                padding: '0.25rem 0.65rem',
                                borderRadius: '12px',
                                background: isFull 
                                  ? 'rgba(255,75,75,0.2)' 
                                  : (count === 1 ? 'rgba(255,215,0,0.18)' : 'rgba(0,230,118,0.15)'),
                                color: isFull 
                                  ? '#FF4B4B' 
                                  : (count === 1 ? '#FFD700' : '#00E676'),
                                border: `1px solid ${isFull ? 'rgba(255,75,75,0.4)' : (count === 1 ? 'rgba(255,215,0,0.4)' : 'rgba(0,230,118,0.3)')}`
                              }}>
                                {isFull ? `FULL (${count}/${maxCap})` : (count === 1 ? `ALMOST FULL (${count}/${maxCap})` : `AVAILABLE (${count}/${maxCap})`)}
                              </span>
                            </div>

                            <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '0.65rem', lineHeight: '1.35' }}>
                              {prob.title}
                            </h3>
                            <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {prob.description}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                              {prob.technologies.map((tech) => (
                                <span key={tech} style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', color: '#CBD5E1', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                            <button
                              onClick={() => setActiveModalProblem(prob)}
                              className="btn-alpha-outline"
                              style={{ flex: 1, padding: '0.6rem', fontSize: '0.82rem', justifyContent: 'center' }}
                            >
                              View Details
                            </button>

                            <button
                              onClick={() => setConfirmingProblem(prob)}
                              disabled={!isSelectionOpen || isFull}
                              className="btn-alpha-gold"
                              style={{ flex: 1, padding: '0.6rem', fontSize: '0.82rem', justifyContent: 'center', opacity: (!isSelectionOpen || isFull) ? 0.45 : 1 }}
                            >
                              {isReleasedLocked ? 'RELEASE NOT STARTED' : (isFull ? `FULL (${count}/${maxCap})` : (isSelectionClosed ? 'SELECTION CLOSED' : (count === 1 ? 'ALMOST FULL • Select' : 'Select Problem')))}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: ATTENDANCE SESSIONS & SESSION ATTENDANCE QR */}
      {/* ==================================================== */}
      {activeTab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={22} color="#FFD700" /> ATTENDANCE SESSIONS
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '0.25rem' }}>
              Select an active attendance session below to display your session Attendance QR code and view real-time member attendance statuses.
            </p>
          </div>

          {/* SESSION CARDS / PICKER */}
          {attSessions.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {attSessions.map((sess) => {
                const isSelected = selectedAttSession?._id === sess._id;
                const sessData = myAttendanceFullData?.sessionDetailsList?.find(s => s.sessionId === sess.sessionId);
                const overallStatus = sessData?.overallStatus || (myAttendanceRecords[sess.sessionId] ? 'ALL_PRESENT' : 'NOT_MARKED');

                return (
                  <div
                    key={sess._id}
                    onClick={() => setSelectedAttSession(sess)}
                    className="glass-card"
                    style={{
                      padding: '1.25rem',
                      cursor: 'pointer',
                      borderLeft: overallStatus === 'ALL_PRESENT' ? '4px solid #00E676' : (overallStatus === 'SOME_ABSENT' ? '4px solid #FFD700' : (overallStatus === 'ALL_ABSENT' ? '4px solid #FF4B4B' : '4px solid rgba(0, 242, 254, 0.4)')),
                      background: isSelected ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255,255,255,0.02)',
                      boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', fontFamily: 'Orbitron, monospace', color: '#00F2FE' }}>{sess.sessionId}</span>
                      
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        background: sess.status === 'ACTIVE' ? 'rgba(0,230,118,0.2)' : 'rgba(255,215,0,0.15)',
                        color: sess.status === 'ACTIVE' ? '#00E676' : '#FFD700'
                      }}>
                        {sess.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>{sess.sessionName}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      📅 {sess.date} • ⏰ {sess.startTime} - {sess.endTime}
                    </div>

                    <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem' }}>
                      {overallStatus === 'ALL_PRESENT' ? (
                        <span style={{ color: '#00E676', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle2 size={14} /> 🟢 ALL MEMBERS PRESENT
                        </span>
                      ) : overallStatus === 'SOME_ABSENT' ? (
                        <span style={{ color: '#FFD700', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <AlertCircle size={14} /> 🟡 SOME MEMBERS ABSENT ({sessData?.presentCount}/{sessData?.totalMembers})
                        </span>
                      ) : overallStatus === 'ALL_ABSENT' ? (
                        <span style={{ color: '#FF4B4B', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <ShieldAlert size={14} /> 🔴 ALL MEMBERS ABSENT
                        </span>
                      ) : (
                        <span style={{ color: '#94A3B8' }}>
                          ⏳ Attendance Not Taken Yet
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* NO ATTENDANCE SESSION CREATED BANNER (QR Code hidden) */
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', color: '#94A3B8', border: '1px dashed rgba(255,255,255,0.15)', marginBottom: '1.5rem' }}>
              <Clock size={40} color="#94A3B8" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#F8FAFC', fontSize: '1.2rem', marginBottom: '0.5rem' }}>NO ATTENDANCE SESSION CREATED YET</h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
                Attendance session has not been created by Admin. The Session QR code will be displayed here automatically once an attendance session is created.
              </p>
            </div>
          )}

          {/* ATTENDANCE SESSION CONTENT (QR CODE DISPLAYED ONLY WHEN ATTENDANCE SESSION IS CREATED) */}
          {attSessions.length > 0 && selectedAttSession && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
              
              {/* LEFT COLUMN: QR CODE (BELOW 25% ONLY - Max Width 24%) */}
              <div
                className="glass-card"
                style={{
                  flex: '0 0 24%',
                  maxWidth: '24%',
                  minWidth: '220px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  border: '1px solid var(--border-cyan)',
                  background: 'rgba(15, 23, 42, 0.95)',
                  boxShadow: '0 0 25px rgba(0, 242, 254, 0.15)'
                }}
              >
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#FFD700', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  SESSION ATTENDANCE QR CODE
                </div>

                <div style={{ background: '#0F172A', padding: '0.75rem', borderRadius: '12px', border: '2px dashed #FFD700', display: 'inline-block', width: '100%', marginBottom: '0.75rem' }}>
                  {attQrDataUrl ? (
                    <img src={attQrDataUrl} alt="Session Attendance QR" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} />
                  ) : (
                    <div style={{ padding: '2rem 0', color: '#94A3B8', fontSize: '0.8rem' }}>Generating QR...</div>
                  )}
                </div>

                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.82rem', color: '#00F2FE', fontWeight: '800', marginBottom: '0.35rem' }}>
                  {displayTeamId}
                </div>
                
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: '1.4' }}>
                  Present to volunteer scanner for attendance check-in.
                </div>
              </div>

              {/* RIGHT COLUMN: OVERALL TEAM STATUS & MEMBER DETAILS */}
              <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
                
                {/* OVERALL TEAM ATTENDANCE STATUS CARD */}
                {(() => {
                  const sessData = myAttendanceFullData?.sessionDetailsList?.find(s => s.sessionId === selectedAttSession.sessionId);
                  const overallStatus = sessData?.overallStatus || (myAttendanceRecords[selectedAttSession.sessionId] ? 'ALL_PRESENT' : 'NOT_MARKED');
                  const presentCount = sessData?.presentCount || 0;
                  const absentCount = sessData?.absentCount || 0;
                  const totalMembers = sessData?.totalMembers || displayMembers.length;

                  let bannerColor = '#00F2FE';
                  let bannerBg = 'rgba(0, 242, 254, 0.08)';
                  let statusTitle = 'ATTENDANCE NOT TAKEN YET';
                  let statusDesc = `Volunteer check-in pending for ${selectedAttSession.sessionName}.`;

                  if (overallStatus === 'ALL_PRESENT') {
                    bannerColor = '#00E676';
                    bannerBg = 'rgba(0, 230, 118, 0.1)';
                    statusTitle = 'ALL MEMBERS PRESENT ✅';
                    statusDesc = `All ${totalMembers} team members are marked Present for ${selectedAttSession.sessionName}.`;
                  } else if (overallStatus === 'SOME_ABSENT') {
                    bannerColor = '#FFD700';
                    bannerBg = 'rgba(255, 215, 0, 0.1)';
                    statusTitle = `SOME MEMBERS ABSENT ⚠️ (${presentCount}/${totalMembers} Present, ${absentCount} Absent)`;
                    statusDesc = `${presentCount} member(s) Present, ${absentCount} member(s) Absent for ${selectedAttSession.sessionName}.`;
                  } else if (overallStatus === 'ALL_ABSENT') {
                    bannerColor = '#FF4B4B';
                    bannerBg = 'rgba(255, 75, 75, 0.1)';
                    statusTitle = `ALL MEMBERS ABSENT 🔴 (0/${totalMembers} Present)`;
                    statusDesc = `All ${totalMembers} team members are marked Absent for ${selectedAttSession.sessionName}.`;
                  }

                  return (
                    <div
                      className="glass-panel"
                      style={{
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        borderLeft: `5px solid ${bannerColor}`,
                        background: bannerBg,
                        borderColor: bannerColor
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>
                        OVERALL TEAM ATTENDANCE STATUS
                      </div>

                      <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: bannerColor, margin: '0.35rem 0' }}>
                        {statusTitle}
                      </h3>

                      <p style={{ color: '#CBD5E1', fontSize: '0.88rem', margin: 0 }}>
                        {statusDesc}
                      </p>
                    </div>
                  );
                })()}

                {/* TEAM DETAILS & ALL TEAM MEMBERS ROSTER */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>{displayTeamId}</span>
                      <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', margin: '0.15rem 0' }}>{displayTeamName}</h3>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: '#F8FAFC', fontWeight: '700' }}>Lead: {displayLeadName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{displayDepartment} • {displayCollege}</div>
                    </div>
                  </div>

                  {/* ALL MEMBERS ATTENDANCE STATUS TABLE */}
                  {(() => {
                    const sessData = myAttendanceFullData?.sessionDetailsList?.find(s => s.sessionId === selectedAttSession.sessionId);
                    const memberList = sessData?.members || displayMembers.map(m => ({
                      name: m.name,
                      registrationNumber: m.registrationNumber,
                      role: m.role || 'MEMBER',
                      status: 'NOT_MARKED'
                    }));

                    return (
                      <div>
                        <div style={{ fontSize: '0.82rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Users size={16} color="#00F2FE" /> ALL TEAM MEMBERS ATTENDANCE BREAKDOWN:
                        </div>

                        <div className="alpha-table-container">
                          <table className="alpha-table">
                            <thead>
                              <tr>
                                <th style={{ width: '40px' }}>#</th>
                                <th>Member Name</th>
                                <th>Registration No</th>
                                <th>Role</th>
                                <th>Attendance Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {memberList.map((m, idx) => {
                                const isPresent = m.status === 'PRESENT';
                                const isAbsent = m.status === 'ABSENT';

                                return (
                                  <tr key={idx}>
                                    <td style={{ color: '#94A3B8', fontWeight: '700' }}>{idx + 1}</td>
                                    <td style={{ fontWeight: '700', color: '#F8FAFC' }}>{m.name}</td>
                                    <td style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE' }}>{m.registrationNumber}</td>
                                    <td>
                                      <span style={{ fontSize: '0.75rem', color: m.role === 'LEAD' ? '#FFD700' : '#CBD5E1', fontWeight: '600' }}>
                                        {m.role || (idx === 0 ? 'LEAD' : 'MEMBER')}
                                      </span>
                                    </td>
                                    <td>
                                      {isPresent ? (
                                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(0,230,118,0.2)', color: '#00E676', border: '1px solid rgba(0,230,118,0.4)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                          <CheckCircle2 size={13} /> PRESENT
                                        </span>
                                      ) : isAbsent ? (
                                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(255,75,75,0.2)', color: '#FF4B4B', border: '1px solid rgba(255,75,75,0.4)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                          <ShieldAlert size={13} /> ABSENT
                                        </span>
                                      ) : (
                                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}>
                                          ⏳ PENDING
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* CONFIRMATION & DETAILS MODALS FOR PROBLEM SELECTION */}
      {confirmingProblem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#FFD700', fontSize: '1.35rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={22} color="#FFD700" /> CONFIRM PROBLEM SELECTION
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Selecting <strong>{confirmingProblem.problemId}</strong> will claim a slot for your team (Maximum 2 Teams per Problem Statement). Once confirmed, your selection cannot be changed.
            </p>

            <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', borderLeft: '4px solid #FFD700' }}>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.9rem', color: '#FFD700', fontWeight: '800' }}>
                {confirmingProblem.problemId}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: '700', margin: '0.25rem 0' }}>
                {confirmingProblem.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                Domain: {confirmingProblem.domain}
              </div>
            </div>

            {selectionError && (
              <div style={{ background: 'rgba(255, 75, 75, 0.15)', color: '#FF4B4B', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {selectionError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmingProblem(null)}
                className="btn-alpha-outline"
                disabled={selectingLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSelectProblem(confirmingProblem)}
                className="btn-alpha-gold"
                disabled={selectingLoading}
              >
                {selectingLoading ? 'Selecting...' : 'CONFIRM & LOCK SELECTION ✅'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModalProblem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE', fontSize: '0.9rem', fontWeight: '800' }}>
                  {activeModalProblem.problemId}
                </span>
                <h2 style={{ color: '#F8FAFC', fontSize: '1.4rem', margin: '0.25rem 0' }}>
                  {activeModalProblem.title}
                </h2>
              </div>
              <button onClick={() => setActiveModalProblem(null)} className="btn-alpha-outline" style={{ padding: '0.35rem 0.75rem' }}>✕</button>
            </div>

            <div style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              <strong>Description:</strong><br />{activeModalProblem.description}
            </div>

            {activeModalProblem.background && (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.88rem' }}>
                <strong style={{ color: '#00F2FE' }}>Background Context:</strong><br />{activeModalProblem.background}
              </div>
            )}

            {activeModalProblem.expectedSolution && (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.88rem' }}>
                <strong style={{ color: '#FFD700' }}>Expected Solution Deliverables:</strong><br />{activeModalProblem.expectedSolution}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <button onClick={() => setActiveModalProblem(null)} className="btn-alpha-cyan">
                Close Problem Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ 
        textAlign: 'center', 
        color: '#94A3B8', 
        fontSize: '0.85rem', 
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <span>Event ALPHA 2026 • College Hackathon Platform • KARE IEEE Education Society</span>
        
        {/* WhatsApp Group Link */}
        <a 
          href="https://chat.whatsapp.com/KQgGm91cXyS1WiZC8nVyls" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#25D366', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            textDecoration: 'none',
            fontSize: '0.82rem',
            fontWeight: '600',
            background: 'rgba(37, 211, 102, 0.12)',
            padding: '0.25rem 0.65rem',
            borderRadius: '12px',
            border: '1px solid rgba(37, 211, 102, 0.3)',
            transition: 'all 0.2s ease'
          }}
          title="Join Official WhatsApp Group"
        >
          <MessageCircle size={15} color="#25D366" />
          <span>WhatsApp Group</span>
        </a>

        {/* Instagram Link */}
        <a 
          href="https://www.instagram.com/kare_ieee_edu_society/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#E1306C', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            textDecoration: 'none',
            fontSize: '0.82rem',
            fontWeight: '600',
            background: 'rgba(225, 48, 108, 0.12)',
            padding: '0.25rem 0.65rem',
            borderRadius: '12px',
            border: '1px solid rgba(225, 48, 108, 0.3)',
            transition: 'all 0.2s ease'
          }}
          title="Follow on Instagram"
        >
          <Instagram size={15} color="#E1306C" />
          <span>Instagram</span>
        </a>
      </div>

    </div>
  );
}
