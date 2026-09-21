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

  // Server-synchronized 1-second countdown ticker
  useEffect(() => {
    const updateCountdown = () => {
      if (!timerState || !timerState.serverTime) return;

      const serverNow = new Date(timerState.serverTime).getTime();
      const clientNow = Date.now();
      const serverOffset = clientNow - serverNow; // Offset between client clock & server time

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

  const isUnreleased = !timerState?.problemStatementsReleased || timerState?.currentPhase === 'NOT_RELEASED';
  const isReleasedLocked = timerState?.problemStatementsReleased && (timerState?.currentPhase === 'RELEASED_LOCKED' || timerState?.currentPhase === 'READING' || timerState?.currentPhase === 'NOT_STARTED');
  const isSelectionOpen = timerState?.currentPhase === 'SELECTION_OPEN' || timerState?.currentPhase === 'SELECTION';
  const isSelectionClosed = timerState?.currentPhase === 'SELECTION_CLOSED' || timerState?.currentPhase === 'CLOSED';

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
            Problem Statement selected successfully. ✅
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

              {/* LIVE COUNTDOWN DISPLAY CARD */}
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

          {/* UNRELEASED STATE PLACEHOLDER */}
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
                  const maxCap = prob.maxTeamCapacity || 2;
                  const count = prob.selectedCount || 0;
                  const isFull = count >= maxCap;

                  return (
                    <div key={prob._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: isFull ? 0.8 : 1 }}>
                      <div>
                        {/* Header Badges */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                          <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.9rem', fontWeight: '800', color: '#00F2FE', background: 'rgba(0, 242, 254, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                            {prob.problemId}
                          </span>
                          
                          {/* 2-TEAM CAPACITY BADGE */}
                          <span style={{
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '12px',
                            background: isFull ? 'rgba(255,75,75,0.2)' : 'rgba(0,230,118,0.15)',
                            color: isFull ? '#FF4B4B' : '#00E676',
                            border: `1px solid ${isFull ? 'rgba(255,75,75,0.4)' : 'rgba(0,230,118,0.3)'}`
                          }}>
                            {isFull ? `FULL - ${count}/${maxCap} Teams` : `AVAILABLE (${count}/${maxCap} Teams Selected)`}
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
                          disabled={!isSelectionOpen || isFull}
                          className="btn-alpha-gold"
                          style={{ flex: 1, padding: '0.6rem', fontSize: '0.82rem', justifyContent: 'center', opacity: (!isSelectionOpen || isFull) ? 0.45 : 1 }}
                        >
                          {isReleasedLocked ? 'SELECTION NOT STARTED' : (isFull ? `FULL (${count}/${maxCap} Teams)` : (isSelectionClosed ? 'SELECTION CLOSED' : 'Select Problem'))}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* CONFIRMATION MODAL */}
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
