import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  QrCode, Camera, CheckCircle2, AlertTriangle, Search, 
  Lock, RefreshCw, UserCheck, XCircle, ShieldAlert, Users
} from 'lucide-react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';

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

  // Present Roster State
  const [roster, setRoster] = useState([]);
  const [rosterStats, setRosterStats] = useState({ markedCount: 0, totalRegistered: 0 });
  const [rosterSearch, setRosterSearch] = useState('');
  
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
        if (!selectedSessionId) {
          const activeSess = list.find(s => s.status === 'ACTIVE') || list[0];
          setSelectedSessionId(activeSess.sessionId);
          setActiveSession(activeSess);
        } else {
          const current = list.find(s => s.sessionId === selectedSessionId) || list[0];
          setActiveSession(current);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  // Fetch roster whenever selectedSessionId or rosterSearch changes
  useEffect(() => {
    if (selectedSessionId) {
      fetchRoster();
    }
  }, [selectedSessionId, rosterSearch]);

  const fetchRoster = async () => {
    if (!selectedSessionId) return;
    try {
      const res = await axios.get('/api/attendance/session-roster', {
        params: { sessionId: selectedSessionId, search: rosterSearch }
      });
      setRoster(res.data.records || []);
      setRosterStats({
        markedCount: res.data.markedCount || 0,
        totalRegistered: res.data.totalRegistered || 0
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

  // Participant lookup function
  const handleLookup = async (queryStr) => {
    if (!queryStr || !queryStr.trim()) return;
    setLookupError('');
    setScanResult(null);

    try {
      const res = await axios.get('/api/attendance/participant/lookup', {
        params: { query: queryStr.trim() }
      });
      setScannedParticipant(res.data.participant);
    } catch (err) {
      setScannedParticipant(null);
      setLookupError(err.response?.data?.error || 'Participant not found.');
    }
  };

  // Mark Attendance Request
  const handleMarkAttendance = async () => {
    if (!activeSession || !scannedParticipant) return;
    
    setMarkingLoading(true);
    setScanResult(null);

    try {
      const res = await axios.post('/api/attendance/scan', {
        sessionId: activeSession.sessionId,
        participantRegNum: scannedParticipant.registrationNumber
      });
      setMarkingLoading(false);
      setScanResult({ success: true, message: res.data.message, record: res.data.record });
      setScannedParticipant(null);
      setInputRegNum('');
      fetchRoster();
    } catch (err) {
      setMarkingLoading(false);
      const errData = err.response?.data;
      setScanResult({
        success: false,
        isDuplicate: errData?.code === 'DUPLICATE_ATTENDANCE',
        message: errData?.error || 'Failed to mark attendance.'
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
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
          
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
              {rosterStats.markedCount} <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>/ {rosterStats.totalRegistered}</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: '1rem' }}>
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
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="e.g. HACK2026-001 or HACK2026-001-M1"
                value={inputRegNum}
                onChange={(e) => {
                  setInputRegNum(e.target.value.toUpperCase());
                  if (e.target.value.length >= 6) {
                    handleLookup(e.target.value);
                  }
                }}
                style={{
                  flex: 1,
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
                style={{ padding: '0.85rem 1.25rem' }}
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

          {/* VERIFIED PARTICIPANT DETAILS CARD */}
          {scannedParticipant && (
            <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid #00F2FE', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#00F2FE', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: '700' }}>
                PARTICIPANT FOUND ✅
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Registration Number</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#00F2FE', fontFamily: 'Orbitron, monospace' }}>
                    {scannedParticipant.registrationNumber}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Full Name</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#F8FAFC' }}>
                    {scannedParticipant.name}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Team Name</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFD700' }}>
                    {scannedParticipant.teamName}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>College / Dept</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#CBD5E1' }}>
                    {scannedParticipant.college} ({scannedParticipant.department})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setScannedParticipant(null)} className="btn-alpha-outline">Cancel</button>
                <button
                  onClick={handleMarkAttendance}
                  disabled={markingLoading}
                  className="btn-alpha-cyan"
                  style={{ background: 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)', padding: '0.75rem 1.5rem' }}
                >
                  {markingLoading ? 'Recording...' : 'MARK ATTENDANCE ✅'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. PRESENT ROSTER TABLE FOR SELECTED ATTENDANCE SESSION */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users color="#00F2FE" size={20} /> PRESENT ROSTER FOR {activeSession?.sessionName || 'Selected Session'} ({roster.length})
            </h3>
          </div>

          {/* Roster Search Bar */}
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search roster..."
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

        <div className="alpha-table-container">
          <table className="alpha-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Student Name</th>
                <th>Registration No</th>
                <th>Team Name</th>
                <th>Status</th>
                <th>Time Marked</th>
              </tr>
            </thead>
            <tbody>
              {roster.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                    No attendance records marked yet for this session.
                  </td>
                </tr>
              ) : (
                roster.map((item, idx) => (
                  <tr key={item._id}>
                    <td style={{ color: '#94A3B8', fontWeight: '700' }}>{idx + 1}</td>
                    <td style={{ fontWeight: '700', color: '#F8FAFC' }}>{item.participantName}</td>
                    <td style={{ fontFamily: 'Orbitron, monospace', color: '#00F2FE' }}>{item.participantRegNum}</td>
                    <td style={{ color: '#FFD700', fontWeight: '600' }}>{item.teamName}</td>
                    <td>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', background: 'rgba(0,230,118,0.2)', color: '#00E676', border: '1px solid rgba(0,230,118,0.4)' }}>
                        PRESENT
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                      {new Date(item.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
