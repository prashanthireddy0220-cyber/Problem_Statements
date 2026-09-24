import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, CheckCircle2, Clock, Search, Filter, Lock, 
  Sparkles, AlertCircle, FileText, Check, Award, ArrowRight, ShieldAlert,
  Users, UserCheck, QrCode, Download, Printer, Ticket, Calendar, ShieldCheck, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import QRCode from 'qrcode';
import AUTHORIZED_TEAMS from '../data/teamsData.js';

export default function TeamLeadDashboard() {
  const { user, refreshUserSession } = useAuth();

  // Participant Navigation: 'dashboard', 'problems', 'attendance'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Team Details Data State
  const [myTeamData, setMyTeamData] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
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

  // 1. Fetch My Team Details
  const fetchMyTeam = async () => {
    try {
      setLoadingTeam(true);
      const res = await axios.get('/api/teams/my-team');
      if (res.data) {
        setMyTeamData(res.data);
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
          setAttSessions(res.data.sessions);
          if (!selectedAttSession && res.data.sessions.length > 0) {
            const active = res.data.sessions.find(s => s.status === 'ACTIVE') || res.data.sessions[0];
            setSelectedAttSession(active);
          }
        }

        const myAttRes = await axios.get('/api/attendance/my-attendance');
        if (myAttRes.data?.markedSessions) {
          setMyAttendanceRecords(myAttRes.data.markedSessions);
        }
      } catch (e) {}
    };

    fetchAttendanceSessions();
    const interval = setInterval(fetchAttendanceSessions, 3000);
    return () => clearInterval(interval);
  }, []);

  // Generate Attendance Session QR Data URL
  useEffect(() => {
    if (selectedAttSession && user?.registrationNumber) {
      const attPayload = `ATTENDANCE:${selectedAttSession.sessionId}:${user.registrationNumber}:${user.team?.name || 'TEAM'}`;
      QRCode.toDataURL(attPayload, {
        width: 320,
        margin: 2,
        color: { dark: '#FFD700', light: '#0F172A' }
      }).then(setAttQrDataUrl).catch(console.error);
    }
  }, [selectedAttSession, user]);

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

  // Check confirmed problem selection
  useEffect(() => {
    if (user && user.team && user.team.selectionConfirmed) {
      setConfirmedData({
        teamName: user.team.name,
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

  const isUnreleased = !timerState?.problemStatementsReleased || timerState?.currentPhase === 'NOT_RELEASED';
  const isReleasedLocked = timerState?.problemStatementsReleased && (timerState?.currentPhase === 'RELEASED_LOCKED' || timerState?.currentPhase === 'READING' || timerState?.currentPhase === 'NOT_STARTED');
  const isSelectionOpen = timerState?.currentPhase === 'SELECTION_OPEN' || timerState?.currentPhase === 'SELECTION';
  const isSelectionClosed = timerState?.currentPhase === 'SELECTION_CLOSED' || timerState?.currentPhase === 'CLOSED';

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
                  <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>College / Institution</span>
                  <span style={{ fontWeight: '600', color: '#F8FAFC', fontSize: '0.92rem' }}>
                    {displayCollege}
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
                    {myTeamData?.teamLead?.email || `${displayTeamId.toLowerCase()}@hackathon.edu`}
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Phone Contact</div>
                  <div style={{ fontSize: '0.92rem', color: '#CBD5E1', marginTop: '0.2rem' }}>
                    {myTeamData?.teamLead?.phone || '+91 9876543210'}
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

                  {myTeamData?.team?.selectionConfirmed ? (
                    <div style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid #00E676', padding: '0.4rem 0.85rem', borderRadius: '20px', color: '#00E676', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={16} /> SELECTION CONFIRMED
                    </div>
                  ) : (
                    <button onClick={() => setActiveTab('problems')} className="btn-alpha-gold" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      Browse & Select Problem Statement <ArrowRight size={16} />
                    </button>
                  )}
                </div>

                {myTeamData?.team?.selectionConfirmed ? (
                  <div className="glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem', background: 'rgba(15,23,42,0.8)' }}>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.25rem', fontWeight: '900', color: '#FFD700', marginBottom: '0.35rem' }}>
                      {myTeamData.team.selectedProblemCode}
                    </div>
                    {myTeamData.team.selectedProblem && (
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                          {myTeamData.team.selectedProblem.title}
                        </div>
                        <div style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: '1.5' }}>
                          {myTeamData.team.selectedProblem.description}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '1.25rem', marginTop: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
                    No Problem Statement selected yet. Click the button above or visit the <strong>Problem Statements</strong> tab to select one during the selection phase.
                  </div>
                )}
              </div>

              {/* CARD 6: EVENT PASS (SEPARATE FROM TEAM QR & ATTENDANCE) */}
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '1.75rem', borderLeft: '4px solid #00E676' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: '#00E676', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Ticket size={22} color="#00E676" /> SEPARATE HACKATHON EVENT PASS
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Official hackathon entry pass for all team members (Separate from Team QR & Attendance QR)
                    </p>
                  </div>
                  <span style={{ padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'rgba(0,230,118,0.2)', color: '#00E676', fontSize: '0.85rem', fontWeight: '800' }}>
                    PASS STATUS: {myTeamData?.team?.eventPassStatus || 'ISSUED'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                  <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,230,118,0.3)' }}>
                    {eventPassQrDataUrl ? (
                      <img src={eventPassQrDataUrl} alt="Event Pass QR" style={{ width: '130px', height: '130px', display: 'block' }} />
                    ) : (
                      <div style={{ width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>Loading Pass QR...</div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <h4 style={{ color: '#F8FAFC', fontSize: '1.05rem', marginBottom: '0.35rem' }}>OFFICIAL EVENT ENTRY DELEGATE PASS</h4>
                    <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      This pass confirms registration for Team <strong>{displayTeamName}</strong> and all registered team members for College Hackathon ALPHA 2026.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      {/* ==================================================== */}
      {/* TAB 2: PROBLEM STATEMENTS SELECTION PORTAL */}
      {/* ==================================================== */}
      {activeTab === 'problems' && (
        <div>
          {confirmedData || (user?.team?.selectionConfirmed) ? (
            <div className="glass-panel" style={{ maxWidth: '800px', margin: '2rem auto', padding: '3rem 2rem', textAlign: 'center', borderColor: '#00E676', boxShadow: '0 0 40px rgba(0, 230, 118, 0.2)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 230, 118, 0.15)', border: '2px solid #00E676', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 25px rgba(0,230,118,0.4)' }}>
                <Award size={44} color="#00E676" />
              </div>
              
              <h1 style={{ fontFamily: 'var(--font-heading)', color: '#F8FAFC', fontSize: '2rem', marginBottom: '0.5rem' }}>
                🎉 PROBLEM STATEMENT CONFIRMED
              </h1>
              <p style={{ color: '#00E676', fontSize: '1.1rem', fontWeight: '700', marginBottom: '2rem', letterSpacing: '1px' }}>
                Your selection is locked in the database. ✅
              </p>

              <div className="glass-card" style={{ padding: '2rem', textAlign: 'left', marginBottom: '2rem', borderLeft: '4px solid #00E676' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Team Name</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F8FAFC' }}>{user?.team?.name || confirmedData?.teamName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Team Lead ID</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>{user?.registrationNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Selected Problem</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFD700', fontFamily: 'Orbitron, monospace' }}>
                      {confirmedData?.problemId || confirmedData?.problemCode || user?.team?.selectedProblemCode}
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn-alpha-cyan" onClick={() => window.print()}>
                <FileText size={18} /> Print Confirmation
              </button>
            </div>
          ) : (
            <>
              {/* PROMINENT LIVE SESSION TIMER BANNER */}
              <div className="glass-panel" style={{
                padding: '1.75rem 2rem',
                marginBottom: '2rem',
                borderColor: isSelectionOpen ? '#00E676' : (isReleasedLocked ? '#FFD700' : 'rgba(255,255,255,0.1)'),
                boxShadow: isSelectionOpen ? '0 0 35px rgba(0, 230, 118, 0.25)' : (isReleasedLocked ? '0 0 35px rgba(255, 215, 0, 0.25)' : 'none')
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                      {isUnreleased && <span className="phase-pill closed" style={{ background: 'rgba(255,75,75,0.15)', color: '#FF4B4B' }}>🔴 NOT RELEASED</span>}
                      {isReleasedLocked && <span className="phase-pill reading" style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}>🟡 PROBLEM STATEMENTS RELEASED</span>}
                      {isSelectionOpen && <span className="phase-pill selection" style={{ background: 'rgba(0,230,118,0.2)', color: '#00E676' }}>🟢 SELECTION IS OPEN</span>}
                      {isSelectionClosed && <span className="phase-pill closed">🔴 SELECTION CLOSED</span>}
                    </div>
                    
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#F8FAFC', letterSpacing: '0.5px' }}>
                      {isUnreleased && 'Problem Statements will be released soon.'}
                      {isReleasedLocked && 'Problem Statements Released'}
                      {isSelectionOpen && 'Selection is OPEN'}
                      {isSelectionClosed && 'Problem Selection Period Ended'}
                    </h2>

                    <p style={{ color: '#CBD5E1', fontSize: '0.92rem', marginTop: '0.35rem', lineHeight: '1.5' }}>
                      {isUnreleased && 'The administrator has not released the problem statements yet. Please stand by.'}
                      {isReleasedLocked && 'Problem Statements are released for viewing. Selection will open automatically when the scheduled timer reaches 00:00:00.'}
                      {isSelectionOpen && 'Selection is OPEN! Note: Each Problem Statement can be selected by a MAXIMUM OF 2 TEAMS (First-Come, First-Served basis).'}
                      {isSelectionClosed && 'The problem selection period is now closed. Unselected teams must contact the event administrator.'}
                    </p>
                  </div>

                  {(isReleasedLocked || isSelectionOpen) && (
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: `2px solid ${isSelectionOpen ? '#00E676' : '#FFD700'}`,
                      padding: '1.15rem 2rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      boxShadow: `0 0 25px ${isSelectionOpen ? 'rgba(0, 230, 118, 0.35)' : 'rgba(255, 215, 0, 0.35)'}`
                    }}>
                      <div style={{ fontSize: '0.75rem', color: isSelectionOpen ? '#00E676' : '#FFD700', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '800' }}>
                        {isSelectionOpen ? 'SELECTION TIME REMAINING' : 'SELECTION STARTS IN'}
                      </div>
                      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '2.5rem', fontWeight: '900', color: '#F8FAFC', letterSpacing: '3px', marginTop: '0.2rem' }}>
                        {formatTime(secondsRemaining || (isReleasedLocked ? timerState?.timeUntilSelectionStartSeconds : timerState?.selectionTimeRemainingSeconds))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isUnreleased ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', margin: '2rem 0' }}>
                  <Lock size={48} color="#FF4B4B" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ color: '#F8FAFC', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Problem Statements Not Released</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
                    Problem Statements will be released soon. Please wait for the event organizer to publish them.
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
                                background: isFull ? 'rgba(255,75,75,0.2)' : 'rgba(0,230,118,0.15)',
                                color: isFull ? '#FF4B4B' : '#00E676',
                                border: `1px solid ${isFull ? 'rgba(255,75,75,0.4)' : 'rgba(0,230,118,0.3)'}`
                              }}>
                                {isFull ? `FULL - ${count}/${maxCap} Teams` : `AVAILABLE (${count}/${maxCap} Teams)`}
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
                              {isReleasedLocked ? 'SELECTION NOT STARTED' : (isFull ? `FULL (${count}/${maxCap})` : (isSelectionClosed ? 'SELECTION CLOSED' : 'Select Problem'))}
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
              Select an active attendance session below to display your session-specific Attendance QR code for volunteer check-in.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {attSessions.map((sess) => {
              const isSelected = selectedAttSession?._id === sess._id;
              const isMarked = Boolean(myAttendanceRecords[sess.sessionId]);
              const record = myAttendanceRecords[sess.sessionId];

              return (
                <div
                  key={sess._id}
                  onClick={() => setSelectedAttSession(sess)}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    borderLeft: isMarked ? '4px solid #00E676' : (isSelected ? '4px solid #FFD700' : '4px solid rgba(255,255,255,0.1)'),
                    background: isMarked ? 'rgba(0,230,118,0.05)' : (isSelected ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.02)'),
                    boxShadow: isSelected ? '0 0 20px rgba(255, 215, 0, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontFamily: 'Orbitron, monospace', color: '#00F2FE' }}>{sess.sessionId}</span>
                    
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      background: isMarked ? 'rgba(0,230,118,0.2)' : (sess.status === 'ACTIVE' ? 'rgba(0,242,254,0.15)' : 'rgba(255,215,0,0.15)'),
                      color: isMarked ? '#00E676' : (sess.status === 'ACTIVE' ? '#00F2FE' : '#FFD700')
                    }}>
                      {isMarked ? '✅ PRESENT' : sess.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>{sess.sessionName}</h3>
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    📅 {sess.date} • ⏰ {sess.startTime} - {sess.endTime}
                  </div>

                  <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem' }}>
                    {isMarked ? (
                      <span style={{ color: '#00E676', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={14} /> Checked in at {new Date(record.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    ) : (
                      <span style={{ color: '#94A3B8' }}>
                        ⏳ Click to generate Attendance QR for volunteer scan
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ATTENDANCE SESSION QR CODE DISPLAY */}
          {selectedAttSession ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', maxWidth: '560px', margin: '0 auto', borderColor: '#FFD700', boxShadow: '0 0 30px rgba(255, 215, 0, 0.15)' }}>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#FFD700', fontWeight: '800', letterSpacing: '1px' }}>
                SESSION ATTENDANCE QR CODE
              </div>

              <h3 style={{ fontSize: '1.4rem', color: '#F8FAFC', margin: '0.35rem 0' }}>
                {selectedAttSession.sessionName}
              </h3>

              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Present this QR code to authorized volunteers at the hall entry scanner for attendance check-in.
              </p>

              <div style={{ background: '#0F172A', padding: '1.25rem', borderRadius: '16px', border: '2px dashed #FFD700', display: 'inline-block', marginBottom: '1rem' }}>
                {attQrDataUrl ? (
                  <img src={attQrDataUrl} alt="Session Attendance QR" style={{ width: '200px', height: '200px', display: 'block' }} />
                ) : (
                  <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>Generating Session QR...</div>
                )}
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.85rem', color: '#FFD700', marginTop: '0.65rem' }}>
                  Participant: {user?.registrationNumber} ({user?.name || 'Lead'})
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#94A3B8', background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: '8px' }}>
                ℹ️ Note: This Attendance QR code is generated dynamically for <strong>{selectedAttSession.sessionName}</strong>. It is separate from your permanent Team QR code.
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>
              No attendance sessions available.
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
                {selectingLoading ? 'Confirming...' : 'CONFIRM & LOCK SELECTION ✅'}
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

    </div>
  );
}
