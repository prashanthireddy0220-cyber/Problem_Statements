import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, CheckCircle, Clock, Search, Filter, Lock, 
  Sparkles, AlertCircle, FileText, Check, Award, ArrowRight, ShieldAlert 
} from 'lucide-react';
import axios from 'axios';

export default function TeamLeadDashboard() {
  const { user, refreshUserSession } = useAuth();
  
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

  // Poll problems and timer state
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
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
      } catch (e) {
        // Interceptor handles session revocation
      }
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedDomain, selectedDifficulty, searchTerm]);

  // Local 1-second countdown ticker based on server end timestamp
  useEffect(() => {
    const updateCountdown = () => {
      if (!timerState) return;
      const targetEnd = timerState.currentPhase === 'READING'
        ? timerState.readingEndsAt
        : (timerState.currentPhase === 'SELECTION' ? timerState.selectionEndsAt : null);

      if (targetEnd) {
        const remaining = Math.max(0, Math.floor((new Date(targetEnd).getTime() - Date.now()) / 1000));
        setSecondsRemaining(remaining);
      } else {
        setSecondsRemaining(0);
      }
    };

    updateCountdown();
    const ticker = setInterval(updateCountdown, 1000);
    return () => clearInterval(ticker);
  }, [timerState]);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return '00:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if current team already confirmed a selection
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
    } catch (err) {
      setSelectingLoading(false);
      setSelectionError(err.response?.data?.error || 'Failed to select problem statement.');
    }
  };

  const isSelectionPhase = timerState?.currentPhase === 'SELECTION';
  const isReadingPhase = timerState?.currentPhase === 'READING';
  const isClosedPhase = timerState?.currentPhase === 'CLOSED';

  // Domains list for filtering
  const domains = ['ALL', 'IoT & Smart Energy', 'AI & Cybersecurity', 'Web3 & Blockchain', 'Smart Cities & AI', 'Healthcare & NLP'];

  return (
    <div className="main-layout">
      
      {/* SELECTION CONFIRMED SUCCESS VIEW */}
      {confirmedData || (user?.team?.selectionConfirmed) ? (
        <div className="glass-panel" style={{ maxWidth: '800px', margin: '2rem auto', padding: '3rem 2rem', textAlign: 'center', borderColor: '#00E676', boxShadow: '0 0 40px rgba(0, 230, 118, 0.2)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 230, 118, 0.15)', border: '2px solid #00E676', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 25px rgba(0,230,118,0.4)' }}>
            <Award size={44} color="#00E676" />
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#F8FAFC', fontSize: '2rem', marginBottom: '0.5rem' }}>
            🎉 PROBLEM STATEMENT SELECTED
          </h1>
          <p style={{ color: '#00E676', fontSize: '1.1rem', fontWeight: '700', marginBottom: '2rem', letterSpacing: '1px' }}>
            SELECTION CONFIRMED & LOCKED ✅ (1-TO-1 RESERVED)
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

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-alpha-cyan" onClick={() => window.print()}>
              <FileText size={18} /> Print / Save Confirmation
            </button>
          </div>
        </div>
      ) : (

        /* READING & SELECTION PORTAL MAIN VIEW */
        <>
          {/* PROMINENT LIVE SESSION TIMER BANNER */}
          <div className="glass-panel" style={{
            padding: '1.75rem 2rem',
            marginBottom: '2rem',
            borderColor: isSelectionPhase ? '#FFD700' : (isReadingPhase ? '#00F2FE' : 'rgba(255,255,255,0.1)'),
            boxShadow: isSelectionPhase ? '0 0 35px rgba(255, 215, 0, 0.25)' : (isReadingPhase ? '0 0 35px rgba(0, 242, 254, 0.25)' : 'none')
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                  {isReadingPhase && <span className="phase-pill reading">🟢 READING PHASE IN PROGRESS</span>}
                  {isSelectionPhase && <span className="phase-pill selection">🟠 SELECTION PHASE OPEN</span>}
                  {isClosedPhase && <span className="phase-pill closed">🔴 SELECTION CLOSED</span>}
                  {timerState?.currentPhase === 'NOT_STARTED' && <span className="phase-pill" style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>⚪ SESSION NOT STARTED</span>}
                </div>
                
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#F8FAFC', letterSpacing: '0.5px' }}>
                  {isReadingPhase && `Problem Statement Reading Period (${timerState?.settings?.readingDurationMinutes || 30} Minutes)`}
                  {isSelectionPhase && `Problem Selection Is Now OPEN (${timerState?.settings?.selectionDurationMinutes || 5} Minutes)`}
                  {isClosedPhase && 'Problem Selection Period Ended'}
                  {timerState?.currentPhase === 'NOT_STARTED' && 'Waiting for Admin to Start Selection Timer'}
                </h2>

                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', marginTop: '0.35rem', lineHeight: '1.5' }}>
                  {isReadingPhase && 'Read and understand all problem statements below. Problem selection buttons will be ENABLED automatically when this reading timer reaches 00:00.'}
                  {isSelectionPhase && 'Selection is OPEN! Note: Each Problem Statement can be selected by ONLY ONE Team (1-to-1 reservation). Confirm your choice quickly!'}
                  {isClosedPhase && 'The selection period is closed. Unselected teams must contact the event administrator.'}
                  {timerState?.currentPhase === 'NOT_STARTED' && 'The administrator has not started the reading phase yet. Please stand by for session activation.'}
                </p>
              </div>

              {/* LIVE COUNTDOWN DISPLAY CARD */}
              {(isReadingPhase || isSelectionPhase) && (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: `2px solid ${isSelectionPhase ? '#FFD700' : '#00F2FE'}`,
                  padding: '1.15rem 2rem',
                  borderRadius: '16px',
                  textAlign: 'center',
                  boxShadow: `0 0 25px ${isSelectionPhase ? 'rgba(255, 215, 0, 0.35)' : 'rgba(0, 242, 254, 0.35)'}`
                }}>
                  <div style={{ fontSize: '0.75rem', color: isSelectionPhase ? '#FFD700' : '#00F2FE', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '800' }}>
                    {isSelectionPhase ? 'SELECTION TIME REMAINING' : 'READING TIME REMAINING'}
                  </div>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '2.5rem', fontWeight: '900', color: '#F8FAFC', letterSpacing: '3px', marginTop: '0.2rem' }}>
                    {formatTime(secondsRemaining || (isReadingPhase ? timerState?.readingTimeRemainingSeconds : timerState?.selectionTimeRemainingSeconds))}
                  </div>
                </div>
              )}
            </div>
          </div>

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

            {/* Domain Filter Pills */}
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
              const maxCap = prob.maxTeamCapacity || 1;
              const isFull = prob.selectedCount >= maxCap;

              return (
                <div key={prob._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: isFull ? 0.75 : 1 }}>
                  <div>
                    {/* Header Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.9rem', fontWeight: '800', color: '#00F2FE', background: 'rgba(0, 242, 254, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                        {prob.problemId}
                      </span>
                      
                      {/* 1-to-1 TEAM RESERVATION BADGE */}
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '12px',
                        background: isFull ? 'rgba(255,75,75,0.2)' : 'rgba(0,230,118,0.15)',
                        color: isFull ? '#FF4B4B' : '#00E676',
                        border: `1px solid ${isFull ? 'rgba(255,75,75,0.4)' : 'rgba(0,230,118,0.3)'}`
                      }}>
                        {isFull ? 'TAKEN BY ANOTHER TEAM ❌ (1/1)' : 'AVAILABLE (0/1 Team Claimed)'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '0.65rem', lineHeight: '1.35' }}>
                      {prob.title}
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {prob.description}
                    </p>

                    {/* Tech Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {prob.technologies.map((tech) => (
                        <span key={tech} style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', color: '#CBD5E1', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
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
                      disabled={!isSelectionPhase || isFull}
                      className="btn-alpha-gold"
                      style={{ flex: 1, padding: '0.6rem', fontSize: '0.82rem', justifyContent: 'center', opacity: (!isSelectionPhase || isFull) ? 0.45 : 1 }}
                    >
                      {isReadingPhase ? 'Locked 🔒 (Reading Phase)' : (isFull ? 'TAKEN ❌ (1/1)' : 'Select Problem')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CONFIRMATION MODAL */}
          {confirmingProblem && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#FFD700', fontSize: '1.35rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={22} color="#FFD700" /> CONFIRM 1-TO-1 PROBLEM SELECTION
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Selecting <strong>{confirmingProblem.problemId}</strong> will claim this problem statement exclusively for your team (1 Team per Problem). Once confirmed, no other team can select it and your choice cannot be changed.
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

          {/* PROBLEM DETAILS MODAL */}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Requirements:</strong>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.35rem', fontSize: '0.82rem', color: '#CBD5E1' }}>
                      {activeModalProblem.requirements.map((r, idx) => <li key={idx}>{r}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Constraints:</strong>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.35rem', fontSize: '0.82rem', color: '#CBD5E1' }}>
                      {activeModalProblem.constraints.map((c, idx) => <li key={idx}>{c}</li>)}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                  <button onClick={() => setActiveModalProblem(null)} className="btn-alpha-cyan">
                    Close Problem Details
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}
