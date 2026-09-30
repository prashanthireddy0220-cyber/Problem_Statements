import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  QrCode, Camera, CheckCircle2, AlertTriangle, Search, 
  Lock, RefreshCw, UserCheck, XCircle, ShieldAlert, Users
} from 'lucide-react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';

import AUTHORIZED_TEAMS from '../data/teamsData.js';

export default function VolunteerScanner() {
  const { user } = useAuth();
  
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [inputRegNum, setInputRegNum] = useState('');
  const [scannedParticipant, setScannedParticipant] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [markingLoading, setMarkingLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const totalMemberCount = AUTHORIZED_TEAMS.reduce((acc, t) => acc + (t.members ? t.members.length : 4), 0);

  // Present Roster State
  const [roster, setRoster] = useState([]);
  const [rosterStats, setRosterStats] = useState({ markedCount: 0, presentCount: 0, absentCount: 0, totalRegistered: totalMemberCount });
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterStatusFilter, setRosterStatusFilter] = useState('ALL');
  
  const scannerRef = useRef(null);

  // Poll sessions and roster
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get('/api/attendance/sessions');
      const list = res.data.sessions || [];
      setSessions(list);
      
      if (list.length > 0) {
        if (!selectedSessionId || !list.some(s => s.sessionId === selectedSessionId)) {
          const activeSess = list.find(s => s.status === 'ACTIVE') || list[0];
          setSelectedSessionId(activeSess.sessionId);
          setActiveSession(activeSess);
        } else {
          const current = list.find(s => s.sessionId === selectedSessionId);
          setActiveSession(current || null);
        }
      } else {
        setSelectedSessionId('');
        setActiveSession(null);
        setRoster([]);
      }
    } catch (e) {
      // ignore
    }
  };

  // Fetch roster whenever selectedSessionId, rosterSearch, or rosterStatusFilter changes
  useEffect(() => {
    if (selectedSessionId) {
      fetchRoster();
    }
  }, [selectedSessionId, rosterSearch, rosterStatusFilter]);

  const fetchRoster = async () => {
    if (!selectedSessionId) return;
    try {
      const res = await axios.get('/api/attendance/session-roster', {
        params: {
          sessionId: selectedSessionId,
          search: rosterSearch,
          status: rosterStatusFilter
        }
      });
      setRoster(res.data.records || []);
      setRosterStats({
        markedCount: res.data.markedCount || 0,
        presentCount: res.data.presentCount || 0,
        absentCount: res.data.absentCount || 0,
        totalRegistered: res.data.totalRegistered || totalMemberCount
      });
    } catch (e) {
      // ignore
    }
  };

  const handleSessionChange = (e) => {
    const sId = e.target.value;
    setSelectedSessionId(sId);
    const found = sessions.find(s => s.sessionId === sId);
    setActiveSession(found || null);
    setScannedParticipant(null);
    setScanResult(null);
    setLookupError('');
  };

  const extractCleanId = (rawInput) => {
    if (!rawInput || typeof rawInput !== 'string') return '';
    let str = rawInput.trim();

    if (str.startsWith('ALPHA-SESSION-ATTENDANCE-QR:') || str.startsWith('ATTENDANCE:')) {
      const parts = str.split(':');
      if (parts.length >= 3 && parts[2]) {
        str = parts[2].trim();
      } else if (parts.length >= 2 && parts[1]) {
        str = parts[1].trim();
      }
    }

    if (str.includes('/') || str.toLowerCase().startsWith('http')) {
      try {
        const parts = str.split('/').filter(p => p.trim().length > 0);
        if (parts.length > 0) {
          str = parts[parts.length - 1];
        }
      } catch (e) {}
    }

    str = str.split('?')[0].split('#')[0].trim().toUpperCase();

    if (/^\d{8,12}$/.test(str)) {
      return str;
    }

    const alphaMatch = str.match(/ALPHA-?(\d+)/i);
    if (alphaMatch) {
      return `ALPHA-${alphaMatch[1].padStart(3, '0')}`;
    }

    return str;
  };

  // Participant lookup function with Guaranteed Local AUTHORIZED_TEAMS Fallback
  const handleLookup = async (queryStr) => {
    if (!queryStr || !queryStr.trim()) return;
    const cleanQuery = extractCleanId(queryStr);
    const upperRaw = queryStr.trim().toUpperCase();
    const cleanUpper = cleanQuery.toUpperCase();
    setInputRegNum(cleanQuery);
    setLookupError('');
    setScanResult(null);

    // 1. Guaranteed Instant Local Lookup using AUTHORIZED_TEAMS
    const alphaMatch = upperRaw.match(/ALPHA-?(\d+)/i) || cleanUpper.match(/ALPHA-?(\d+)/i);
    const candidateTeamId = alphaMatch ? `ALPHA-${alphaMatch[1].padStart(3, '0')}` : null;

    // Check if the query is an individual member registration number
    let localMember = null;
    let localTeam = null;

    for (const t of AUTHORIZED_TEAMS) {
      if (t.members && Array.isArray(t.members)) {
        const m = t.members.find(mem => {
          const mReg = String(mem.registrationNumber || '').trim().toUpperCase();
          if (cleanUpper && mReg === cleanUpper) return true;
          if (upperRaw && mReg === upperRaw) return true;
          if ((cleanUpper === '9924005005' || cleanUpper === '9923005005' || upperRaw === '9924005005' || upperRaw === '9923005005') && mem.name === 'GORLA UPENDRA') return true;
          return false;
        });
        if (m) {
          localMember = m;
          localTeam = t;
          break;
        }
      }
    }

    if (localMember && localTeam) {
      const isLead = localMember.role === 'LEAD' || localMember.registrationNumber === localTeam.regNum;
      setScannedParticipant({
        isTeamScan: false,
        scannedRegNum: localMember.registrationNumber,
        registrationNumber: localMember.registrationNumber,
        name: localMember.name,
        role: localMember.role || (isLead ? 'LEAD' : 'MEMBER'),
        isTeamLead: isLead,
        teamName: localTeam.teamName,
        teamId: localTeam.teamId,
        leadName: localTeam.leadName,
        leadRegNum: localTeam.regNum,
        college: 'KARE',
        department: 'CSE',
        members: localTeam.members
      });
    } else {
      const localTeamOnly = AUTHORIZED_TEAMS.find(t => 
        t.teamId === cleanUpper || 
        t.teamId === upperRaw ||
        (candidateTeamId && t.teamId === candidateTeamId) ||
        (t.teamName && t.teamName.toUpperCase() === upperRaw)
      );

      if (localTeamOnly) {
        setScannedParticipant({
          isTeamScan: true,
          scannedRegNum: null,
          registrationNumber: localTeamOnly.regNum,
          name: localTeamOnly.teamName,
          teamName: localTeamOnly.teamName,
          teamId: localTeamOnly.teamId,
          leadName: localTeamOnly.leadName,
          leadRegNum: localTeamOnly.regNum,
          college: 'KARE',
          department: 'CSE',
          isTeamLead: true,
          role: 'TEAM',
          members: localTeamOnly.members
        });
      }
    }

    // 2. Query backend to verify server state
    try {
      const res = await axios.get('/api/attendance/participant/lookup', {
        params: { query: cleanQuery }
      });
      if (res.data && res.data.participant) {
        setScannedParticipant(res.data.participant);
      }
    } catch (err) {
      if (!localMember && !localTeam) {
        setScannedParticipant(null);
        setLookupError(err.response?.data?.error || `Participant / Team '${cleanQuery}' not found.`);
      }
    }
  };

  // Team Member Toggle State for Volunteer
  const [teamToggles, setTeamToggles] = useState({});

  // Initialize toggles whenever scanned participant changes
  useEffect(() => {
    if (scannedParticipant) {
      const initialMap = {};
      const members = scannedParticipant.members || [];

      members.forEach(m => {
        const cleanReg = String(m.registrationNumber || '').trim().toUpperCase();

        // Check if this member is ALREADY recorded in the current session roster
        const existingRosterItem = roster.find(r => {
          const rReg = String(r.participantRegNum || '').trim().toUpperCase();
          return rReg === cleanReg || (m.name === 'GORLA UPENDRA' && (rReg === '9923005005' || rReg === '9924005005'));
        });

        if (existingRosterItem && (existingRosterItem.status === 'PRESENT' || existingRosterItem.status === 'ABSENT')) {
          // Preserve existing status already recorded
          initialMap[m.registrationNumber] = existingRosterItem.status;
        } else {
          // If this was an individual scan/search for this specific member:
          const isScannedIndividual = !scannedParticipant.isTeamScan && (
            cleanReg === String(scannedParticipant.registrationNumber || '').trim().toUpperCase() ||
            m.name === scannedParticipant.name
          );

          if (isScannedIndividual) {
            initialMap[m.registrationNumber] = 'PRESENT';
          } else {
            // "initially: NO individual member should be marked PRESENT unless their attendance is actually submitted."
            initialMap[m.registrationNumber] = 'ABSENT';
          }
        }
      });
      setTeamToggles(initialMap);
    }
  }, [scannedParticipant, roster]);

  const toggleMemberStatus = (regNum) => {
    setTeamToggles(prev => ({
      ...prev,
      [regNum]: prev[regNum] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    }));
  };

  // Mark Team Attendance Request
  const handleMarkTeamAttendance = async () => {
    if (!activeSession || !scannedParticipant) return;
    
    setMarkingLoading(true);
    setScanResult(null);

    const members = scannedParticipant.members && scannedParticipant.members.length > 0
      ? scannedParticipant.members
      : [{ name: scannedParticipant.name, registrationNumber: scannedParticipant.registrationNumber }];

    const attendanceList = members.map(m => {
      const reg = String(m.registrationNumber || m.regNum || m.regNo || '').trim().toUpperCase();
      const statusVal = teamToggles[m.registrationNumber] || teamToggles[reg];
      return {
        registrationNumber: reg || m.registrationNumber,
        name: m.name,
        teamName: scannedParticipant.teamName,
        status: statusVal === 'PRESENT' ? 'PRESENT' : 'ABSENT'
      };
    });

    try {
      const res = await axios.post('/api/attendance/mark-team-attendance', {
        sessionId: activeSession.sessionId,
        teamId: scannedParticipant.teamId,
        attendanceList
      });
      setMarkingLoading(false);
      setScanResult({ success: true, message: res.data.message, records: res.data.records });
      setScannedParticipant(null);
      setInputRegNum('');
      await fetchRoster();
    } catch (err) {
      setMarkingLoading(false);
      const errData = err.response?.data;
      setScanResult({
        success: false,
        message: errData?.error || 'Failed to submit team attendance.'
      });
    }
  };

  // Camera QR Code Scanner
  const startQrScanner = () => {
    setIsScanning(true);
    setTimeout(() => {
      try {
        const html5QrCode = new Html5Qrcode('qr-reader-container');
        scannerRef.current = html5QrCode;

        html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            html5QrCode.stop();
            setIsScanning(false);
            setInputRegNum(decodedText);
            handleLookup(decodedText);
          },
          (errorMessage) => {}
        ).catch(err => {
          setIsScanning(false);
        });
      } catch (err) {
        setIsScanning(false);
      }
    }, 300);
  };

  const stopQrScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop();
      } catch (e) {}
    }
    setIsScanning(false);
  };

  const isClosed = activeSession?.status === 'CLOSED';
  const isActive = activeSession?.status === 'ACTIVE';

  const isTeamAlreadySubmitted = Boolean(
    scannedParticipant && roster.some(r => {
      const memberRegs = (scannedParticipant.members || []).map(m => String(m.registrationNumber || '').trim().toUpperCase());
      const cleanScannedTeamId = String(scannedParticipant.teamId || '').trim().toUpperCase();
      const rReg = String(r.participantRegNum || '').trim().toUpperCase();
      const rTeam = String(r.teamId || '').trim().toUpperCase();
      return (memberRegs.includes(rReg) || (cleanScannedTeamId && rTeam === cleanScannedTeamId)) && (r.status === 'PRESENT' || r.status === 'ABSENT');
    })
  );

  return (
    <div className="main-layout" style={{ maxWidth: '1000px' }}>
      
      {/* 1. TOP HEADER BANNER */}
      <div className="glass-panel" style={{ padding: '1.25rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.15)', border: '1px solid var(--border-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode color="#00F2FE" size={24} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: '#F8FAFC', letterSpacing: '0.5px' }}>
              VOLUNTEER ATTENDANCE PORTAL
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
              Event ALPHA • KARE IEEE Education Society
            </p>
          </div>
        </div>

        <button onClick={fetchSessions} className="btn-alpha-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
          <RefreshCw size={14} /> Refresh Sessions
        </button>
      </div>

      {/* 2. SELECT ATTENDANCE SESSION DROPDOWN & TOTAL PRESENT STAT CARD */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
          
          {/* Dropdown Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#00F2FE', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={16} /> SELECT ATTENDANCE SESSION:
              </label>

              {/* Status Badge */}
              {isClosed ? (
                <span className="phase-pill closed" style={{ fontSize: '0.78rem', padding: '0.25rem 0.75rem' }}>
                  🚨 SESSION CLOSED
                </span>
              ) : isActive ? (
                <span className="phase-pill reading" style={{ fontSize: '0.78rem', padding: '0.25rem 0.75rem', background: 'rgba(0,230,118,0.15)', color: '#00E676', borderColor: '#00E676' }}>
                  🟢 SESSION ACTIVE
                </span>
              ) : (
                <span className="phase-pill" style={{ fontSize: '0.78rem', padding: '0.25rem 0.75rem', background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}>
                  🟡 UPCOMING
                </span>
              )}
            </div>

            <select
              value={selectedSessionId}
              onChange={handleSessionChange}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: 'rgba(15, 23, 42, 0.95)',
                border: `1px solid ${isClosed ? '#FF4B4B' : 'var(--border-cyan)'}`,
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {sessions.map((sess) => (
                <option key={sess._id} value={sess.sessionId} style={{ background: '#0F172A', color: '#FFF' }}>
                  {sess.sessionName} ({sess.date}) — {sess.status === 'CLOSED' ? '🚨 CLOSED' : (sess.status === 'ACTIVE' ? '🟢 ACTIVE' : '🟡 UPCOMING')}
                </option>
              ))}
            </select>
          </div>

          {/* Total Marked Present Counter Card */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-cyan)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              TOTAL MARKED PRESENT
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#00E676', fontFamily: 'Orbitron, monospace', marginTop: '0.2rem' }}>
              {rosterStats.presentCount !== undefined ? rosterStats.presentCount : rosterStats.markedCount} <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>/ {rosterStats.totalRegistered || totalMemberCount}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. CENTER PANEL: IF SESSION IS CLOSED BY ADMIN (DISPLAY LOCK BANNER AS IN PICTURE) */}
      {isClosed ? (
        <div className="glass-panel" style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          borderColor: 'rgba(255, 75, 75, 0.5)',
          background: 'rgba(255, 75, 75, 0.05)',
          boxShadow: '0 0 30px rgba(255, 75, 75, 0.15)'
        }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255, 75, 75, 0.15)', border: '2px solid #FF4B4B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 0 20px rgba(255, 75, 75, 0.4)' }}>
            <Lock size={36} color="#FF4B4B" />
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#FF4B4B', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '0.75rem' }}>
            ATTENDANCE SESSION IS CLOSED BY ADMIN
          </h2>

          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', maxW: '650px', margin: '0 auto 0.85rem', lineHeight: '1.5' }}>
            Attendance scanning is locked for <strong>'{activeSession?.sessionName}'</strong>. Volunteers cannot take or modify attendance when a session is closed.
          </p>

          <p style={{ color: '#FFD700', fontSize: '0.85rem', fontWeight: '600' }}>
            Please request the Event Administrator to open this session from the Admin Dashboard to resume taking attendance.
          </p>
        </div>
      ) : (

        /* ACTIVE SCANNING PANEL (WHEN SESSION IS ACTIVE) */
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#00E676', textTransform: 'uppercase', fontWeight: '700' }}>🟢 SCANNER ACTIVE</span>
              <h2 style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: '800' }}>{activeSession?.sessionName}</h2>
            </div>

            {!isScanning ? (
              <button onClick={startQrScanner} className="btn-alpha-gold" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
                <Camera size={18} /> Start Camera Scanner
              </button>
            ) : (
              <button onClick={stopQrScanner} className="btn-alpha-outline" style={{ padding: '0.65rem 1.25rem', color: '#FF4B4B', borderColor: '#FF4B4B' }}>
                Stop Scanner
              </button>
            )}
          </div>

          {/* Camera Container */}
          {isScanning && (
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <div id="qr-reader-container" style={{ maxWidth: '400px', margin: '0 auto', border: '2px solid #FFD700', borderRadius: '14px', overflow: 'hidden' }}></div>
              <p style={{ color: '#FFD700', fontSize: '0.82rem', marginTop: '0.5rem' }}>Position participant QR code within camera box...</p>
            </div>
          )}

          {/* Manual Input / Search Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Participant Registration Number / QR Payload
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Enter Team ID (e.g. ALPHA-008) or Registration No."
                value={inputRegNum}
                onChange={(e) => {
                  setInputRegNum(e.target.value.toUpperCase());
                  if (e.target.value.length >= 6) {
                    handleLookup(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLookup(inputRegNum);
                }}
                style={{
                  flex: '1 1 200px',
                  minWidth: '0',
                  padding: '0.85rem 1rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => handleLookup(inputRegNum)}
                className="btn-alpha-cyan"
                style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                <Search size={18} /> Search
              </button>
            </div>
          </div>

          {/* FEEDBACK BANNERS */}
          {lookupError && (
            <div style={{ background: 'rgba(255, 75, 75, 0.15)', border: '1px solid rgba(255, 75, 75, 0.4)', color: '#FF4B4B', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle size={20} />
              <span>{lookupError}</span>
            </div>
          )}

          {scanResult && (
            <div style={{
              background: scanResult.success ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 215, 0, 0.15)',
              border: `1px solid ${scanResult.success ? '#00E676' : '#FFD700'}`,
              color: scanResult.success ? '#00E676' : '#FFD700',
              padding: '1.25rem',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {scanResult.success ? <CheckCircle2 size={22} color="#00E676" /> : <AlertTriangle size={22} color="#FFD700" />}
                {scanResult.message}
              </div>
              {scanResult.record && (
                <div style={{ fontSize: '0.85rem', color: '#F8FAFC', marginTop: '0.5rem' }}>
                  Student: <strong>{scanResult.record.name}</strong> ({scanResult.record.registrationNumber}) • Team: {scanResult.record.teamName}
                </div>
              )}
            </div>
          )}

          {/* VERIFIED TEAM & PARTICIPANT DETAILS CARD */}
          {scannedParticipant && (
            <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid #00F2FE', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.95)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: '0.75rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#00E676', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>
                  {scannedParticipant.isTeamScan ? 'TEAM IDENTIFIED FOR ATTENDANCE ✅' : 'PARTICIPANT IDENTIFIED FOR ATTENDANCE ✅'}
                </div>
                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.9rem', fontWeight: '800', color: '#00F2FE', background: 'rgba(0,242,254,0.1)', padding: '0.25rem 0.65rem', borderRadius: '12px', border: '1px solid rgba(0,242,254,0.3)' }}>
                  {scannedParticipant.teamId || 'TEAM'}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Team Name</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFD700' }}>
                    {scannedParticipant.teamName}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>
                    {scannedParticipant.isTeamScan ? 'Team Lead' : 'Scanned Student'}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#F8FAFC' }}>
                    {scannedParticipant.isTeamScan ? scannedParticipant.leadName : scannedParticipant.name}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>
                    {scannedParticipant.isTeamScan ? 'Team Lead Reg No' : 'Registration Number'}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>
                    {scannedParticipant.isTeamScan ? scannedParticipant.leadRegNum : scannedParticipant.registrationNumber}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Role / Status</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#CBD5E1' }}>
                    {scannedParticipant.isTeamScan ? (
                      <span style={{ color: '#FFD700' }}>👑 TEAM (Lead: {scannedParticipant.leadName})</span>
                    ) : (
                      <span style={{ color: scannedParticipant.role === 'LEAD' ? '#FFD700' : '#00E676' }}>
                        {scannedParticipant.role === 'LEAD' ? '👑 TEAM LEAD' : '👤 TEAM MEMBER'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ALL TEAM MEMBERS LIST WITH TOGGLE BUTTONS */}
              {scannedParticipant.members && scannedParticipant.members.length > 0 && (
                <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#00F2FE', textTransform: 'uppercase', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Users size={18} color="#00F2FE" /> TEAM MEMBERS ATTENDANCE ({scannedParticipant.members.length} Members)
                    </div>
                    
                    {/* Quick Select All Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const allP = {};
                          scannedParticipant.members.forEach(m => { allP[m.registrationNumber] = 'PRESENT'; });
                          setTeamToggles(allP);
                        }}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: 'rgba(0,230,118,0.15)', border: '1px solid #00E676', color: '#00E676', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}
                      >
                        ✓ Mark All Present
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const allA = {};
                          scannedParticipant.members.forEach(m => { allA[m.registrationNumber] = 'ABSENT'; });
                          setTeamToggles(allA);
                        }}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: 'rgba(255,75,75,0.15)', border: '1px solid #FF4B4B', color: '#FF4B4B', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}
                      >
                        ✗ Mark All Absent
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                    {scannedParticipant.members.map((m, idx) => {
                      const isPresent = (teamToggles[m.registrationNumber] || 'PRESENT') === 'PRESENT';
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: '0.85rem 1rem',
                            background: 'rgba(15, 23, 42, 0.9)',
                            borderRadius: '10px',
                            border: `1px solid ${isPresent ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 75, 75, 0.4)'}`,
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#F8FAFC' }}>
                              {idx + 1}. {m.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#00F2FE', fontFamily: 'Orbitron, monospace', marginTop: '0.15rem' }}>
                              {m.registrationNumber} • <span style={{ color: m.role === 'LEAD' ? '#FFD700' : '#CBD5E1' }}>{m.role || (idx === 0 ? 'LEAD' : 'MEMBER')}</span>
                            </div>
                          </div>

                          {/* TOGGLE BUTTON */}
                          <button
                            type="button"
                            onClick={() => toggleMemberStatus(m.registrationNumber)}
                            style={{
                              padding: '0.45rem 0.9rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '800',
                              cursor: 'pointer',
                              border: isPresent ? '1px solid #00E676' : '1px solid #FF4B4B',
                              background: isPresent ? 'linear-gradient(135deg, rgba(0,230,118,0.25) 0%, rgba(0,176,255,0.25) 100%)' : 'rgba(255, 75, 75, 0.25)',
                              color: isPresent ? '#00E676' : '#FF4B4B',
                              boxShadow: isPresent ? '0 0 10px rgba(0, 230, 118, 0.3)' : '0 0 10px rgba(255, 75, 75, 0.3)',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {isPresent ? '🟢 PRESENT' : '🔴 ABSENT'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button onClick={() => setScannedParticipant(null)} className="btn-alpha-outline">Cancel</button>
                <button
                  onClick={handleMarkTeamAttendance}
                  disabled={markingLoading || isTeamAlreadySubmitted || !isActive}
                  className="btn-alpha-cyan"
                  style={{
                    background: isTeamAlreadySubmitted 
                      ? 'rgba(255, 75, 75, 0.2)' 
                      : 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)',
                    border: isTeamAlreadySubmitted ? '1px solid #FF4B4B' : '1px solid #00F2FE',
                    color: isTeamAlreadySubmitted ? '#FF4B4B' : '#0F172A',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '800',
                    cursor: (isTeamAlreadySubmitted || !isActive) ? 'not-allowed' : 'pointer',
                    opacity: (isTeamAlreadySubmitted || !isActive) ? 0.7 : 1
                  }}
                >
                  {isTeamAlreadySubmitted 
                    ? '🔒 ATTENDANCE LOCKED (ALREADY SUBMITTED)' 
                    : (markingLoading ? 'Submitting...' : 'SUBMIT TEAM ATTENDANCE ✅')}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. ATTENDANCE ROSTER TABLE FOR SELECTED SESSION */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users color="#00F2FE" size={20} /> ALL INDIVIDUAL PARTICIPANTS ROSTER ({activeSession?.sessionName || 'Selected Session'})
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
              Showing {roster.length} participants • Marked: {rosterStats.markedCount} (Present: {rosterStats.presentCount || 0}, Absent: {rosterStats.absentCount || 0})
            </div>
          </div>

          {/* Roster Controls: Status Filter & Search */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={rosterStatusFilter}
              onChange={(e) => setRosterStatusFilter(e.target.value)}
              style={{
                padding: '0.6rem 0.85rem',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid var(--border-cyan)',
                borderRadius: '8px',
                color: '#FFF',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Statuses (Global 240 Matrix)</option>
              <option value="PRESENT">🟢 Present Only</option>
              <option value="ABSENT">🔴 Absent Only</option>
              <option value="NOT_MARKED">⏳ Pending Only</option>
            </select>

            <div style={{ position: 'relative', width: '240px' }}>
              <input
                type="text"
                placeholder="Search student, reg, team..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem 0.6rem 2.2rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>

        <div className="alpha-table-container">
          <table className="alpha-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Student Name</th>
                <th>Registration No</th>
                <th>Team ID & Name</th>
                <th>Role</th>
                <th>Individual Status</th>
                <th>Time Marked</th>
              </tr>
            </thead>
            <tbody>
              {roster.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                    No participant records found for the selected filters.
                  </td>
                </tr>
              ) : (
                roster.map((item, idx) => {
                  const extractAlphaCode = (str) => {
                    if (!str) return null;
                    const m = String(str).match(/ALPHA-?(\d+)/i);
                    return m ? `ALPHA-${m[1].padStart(3, '0')}` : null;
                  };

                  const cleanReg = String(item.participantRegNum || '').trim().toUpperCase();
                  const targetTeamCode = extractAlphaCode(item.teamId) || extractAlphaCode(cleanReg) || extractAlphaCode(item.teamName) || extractAlphaCode(item.participantName);

                  let authTeam = AUTHORIZED_TEAMS.find(t => t.teamId === targetTeamCode || t.regNum === cleanReg);
                  if (!authTeam && cleanReg) {
                    authTeam = AUTHORIZED_TEAMS.find(t => t.members && t.members.some(m => {
                      const mReg = String(m.registrationNumber || '').trim().toUpperCase();
                      return mReg === cleanReg || (m.name === 'GORLA UPENDRA' && (cleanReg === '9924005005' || cleanReg === '9923005005'));
                    }));
                  }

                  const authMember = authTeam?.members?.find(m => {
                    const mReg = String(m.registrationNumber || '').trim().toUpperCase();
                    return mReg === cleanReg || (m.name === 'GORLA UPENDRA' && (cleanReg === '9924005005' || cleanReg === '9923005005'));
                  });

                  const displayName = authMember?.name || item.participantName || (cleanReg === authTeam?.regNum ? authTeam?.leadName : cleanReg);
                  const displayTeamId = authTeam?.teamId || item.teamId || 'ALPHA';
                  const displayTeamName = authTeam?.teamName || item.teamName || 'Team';
                  const displayRegNum = authMember?.registrationNumber || item.participantRegNum || cleanReg;
                  const role = authMember?.role || item.role || (cleanReg === authTeam?.regNum ? 'LEAD' : 'MEMBER');

                  const isPresent = item.status === 'PRESENT';
                  const isAbsent = item.status === 'ABSENT';

                  return (
                    <tr key={item._id || idx}>
                      <td style={{ color: '#94A3B8', fontWeight: '700' }}>{idx + 1}</td>
                      <td style={{ fontWeight: '700', color: '#F8FAFC' }}>{displayName}</td>
                      <td style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE' }}>{displayRegNum}</td>
                      <td><span style={{ color: '#FFD700', fontWeight: '600' }}>{displayTeamId}</span> ({displayTeamName})</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: role === 'LEAD' ? '#FFD700' : '#CBD5E1', fontWeight: '600' }}>
                          {role === 'LEAD' ? '👑 LEAD' : 'MEMBER'}
                        </span>
                      </td>
                      <td>
                        {isPresent ? (
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(0,230,118,0.2)', color: '#00E676', border: '1px solid rgba(0,230,118,0.4)' }}>
                            🟢 PRESENT
                          </span>
                        ) : isAbsent ? (
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(255,75,75,0.2)', color: '#FF4B4B', border: '1px solid rgba(255,75,75,0.4)' }}>
                            🔴 ABSENT
                          </span>
                        ) : (
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '600', background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}>
                            ⏳ PENDING
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                        {item.markedAt ? new Date(item.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
