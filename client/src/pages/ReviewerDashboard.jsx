import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Award, CheckCircle2, Clock, Search, Filter, Edit3, Eye, 
  Save, AlertCircle, RefreshCw, X, ChevronRight, CheckCircle, Info, Lock
} from 'lucide-react';
import axios from 'axios';

import AUTHORIZED_TEAMS from '../data/teamsData';
import { TOP_40_PROBLEMS } from '../data/problemStatementsData';

const DEFAULT_FRONTEND_ROUNDS = [
  {
    roundNumber: 1,
    roundName: 'Round 1 - Ideation & Architecture',
    maximumMarks: 100,
    active: true,
    status: 'ACTIVE',
    criteria: [
      { key: 'innovation', name: 'Innovation & Originality', maxMarks: 20, description: 'Novelty & uniqueness of solution' },
      { key: 'tech_approach', name: 'Technical Approach & Architecture', maxMarks: 20, description: 'System design & technical planning' },
      { key: 'problem_understanding', name: 'Problem Understanding', maxMarks: 20, description: 'Clarity on problem domain & scope' },
      { key: 'feasibility', name: 'Feasibility & Practicality', maxMarks: 15, description: 'Practical execution capability' },
      { key: 'presentation', name: 'Presentation & Defense', maxMarks: 15, description: 'Team communication & clarity' },
      { key: 'overall_impact', name: 'Overall Impact & Scalability', maxMarks: 10, description: 'Potential value & scalability' }
    ]
  },
  {
    roundNumber: 2,
    roundName: 'Round 2 - Implementation & Coding',
    maximumMarks: 100,
    active: false,
    status: 'CLOSED',
    criteria: [
      { key: 'code_quality', name: 'Code Quality & Structure', maxMarks: 25, description: 'Clean code & architectural standards' },
      { key: 'tech_complexity', name: 'Technical Complexity & Depth', maxMarks: 25, description: 'Algorithmic & engineering complexity' },
      { key: 'functionality', name: 'Functionality & Working Demo', maxMarks: 25, description: 'Working features & execution' },
      { key: 'ui_ux', name: 'UI/UX & User Interface', maxMarks: 25, description: 'Design quality & user experience' }
    ]
  },
  {
    roundNumber: 3,
    roundName: 'Round 3 - Final Pitch & Demo',
    maximumMarks: 100,
    active: false,
    status: 'CLOSED',
    criteria: [
      { key: 'completeness', name: 'Project Completeness & Stability', maxMarks: 35, description: 'Finished product & system stability' },
      { key: 'business_value', name: 'Business Value & Viability', maxMarks: 35, description: 'Market utility & real-world value' },
      { key: 'final_pitch', name: 'Final Presentation & Q/A Defense', maxMarks: 30, description: 'Pitch defense & Q/A answers' }
    ]
  }
];

const INITIAL_TEAMS_DATA = AUTHORIZED_TEAMS.map(item => {
  const probId = item.fixedProblemStatementId || 'PS-001';
  const matched = TOP_40_PROBLEMS.find(p => p.problemId === probId);
  return {
    _id: item.teamId,
    teamId: item.teamId,
    teamCode: item.teamId,
    teamName: item.teamName || item.teamId,
    teamLeadRegNum: item.regNum,
    teamLeadName: item.leadName || `Team Lead (${item.teamId})`,
    college: 'KARE',
    department: 'CSE',
    selectedProblemCode: probId,
    selectedProblemTitle: matched?.title || '',
    selectedProblemDomain: matched?.domain || '',
    selectedProblemDifficulty: matched?.difficulty || 'Medium',
    membersCount: item.members ? item.members.length : 4,
    registrationStatus: 'CONFIRMED'
  };
});

export default function ReviewerDashboard() {
  const { user } = useAuth();
  
  const [teams, setTeams] = useState(INITIAL_TEAMS_DATA);
  const [rounds, setRounds] = useState(DEFAULT_FRONTEND_ROUNDS);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedRoundNum, setSelectedRoundNum] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, SUBMITTED, PENDING
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Mark Entry Modal state (Section 1: Reviewer enters ONLY raw marks 0–100)
  const [activeModalTeam, setActiveModalTeam] = useState(null);
  const [rawMarkInput, setRawMarkInput] = useState('');
  const [commentsInput, setCommentsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEvaluations(selectedRoundNum);
    }
  }, [selectedRoundNum, user]);

  // Real-time synchronization: poll round statuses from backend so changes made by admin reflect immediately
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      axios.get('/api/reviewer/rounds').then(res => {
        if (res.data && res.data.rounds) {
          setRounds(res.data.rounds);
        }
      }).catch(() => {});
      fetchEvaluations(selectedRoundNum);
    }, 4000);
    return () => clearInterval(interval);
  }, [user, selectedRoundNum]);

  const fetchInitialData = async (retryCount = 0) => {
    try {
      const [teamsRes, roundsRes] = await Promise.all([
        axios.get('/api/reviewer/teams'),
        axios.get('/api/reviewer/rounds')
      ]);

      if (teamsRes.data && teamsRes.data.teams && teamsRes.data.teams.length > 0) {
        const enriched = teamsRes.data.teams.map(t => {
          const authItem = AUTHORIZED_TEAMS.find(a => a.teamId === (t.teamCode || t.teamId));
          const rawCode = t.selectedProblemCode;
          const isValidCode = rawCode && rawCode !== 'null' && rawCode !== 'undefined' && rawCode !== 'Not Selected';
          const probCode = isValidCode ? rawCode : (authItem?.fixedProblemStatementId || 'PS-001');
          const matched = TOP_40_PROBLEMS.find(p => p.problemId === probCode);
          return {
            ...t,
            selectedProblemCode: probCode,
            selectedProblemTitle: t.selectedProblemTitle || matched?.title || '',
            selectedProblemDomain: t.selectedProblemDomain || matched?.domain || '',
            selectedProblemDifficulty: t.selectedProblemDifficulty || matched?.difficulty || 'Medium'
          };
        });
        setTeams(enriched);
      }
      if (roundsRes.data && roundsRes.data.rounds) {
        setRounds(roundsRes.data.rounds);
      }
      
      await fetchEvaluations(selectedRoundNum);
      setErrorMsg('');
    } catch (err) {
      console.warn('Reviewer dashboard initial data attempt failed:', err?.message);
      if (retryCount < 5) {
        setErrorMsg(`Connecting to backend server (waking up server engine, attempt ${retryCount + 1}/5)... Retrying in 3s...`);
        setTimeout(() => fetchInitialData(retryCount + 1), 3000);
      } else {
        setErrorMsg('Backend server connection delayed (cold start standby). Click "Sync Data" above to retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluations = async (roundNum) => {
    try {
      const res = await axios.get(`/api/reviewer/evaluations/${roundNum}`);
      if (res.data && res.data.evaluations) {
        setEvaluations(res.data.evaluations);
      }
    } catch (err) {
      console.error('Failed to fetch evaluations:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  };

  // Find current selected round doc with clean fallback per round
  const fallbackRoundDoc = DEFAULT_FRONTEND_ROUNDS.find(r => r.roundNumber === selectedRoundNum) || DEFAULT_FRONTEND_ROUNDS[0];
  const matchedDbRound = rounds.find(r => r.roundNumber === selectedRoundNum);
  const currentRoundDoc = (matchedDbRound && matchedDbRound.criteria && matchedDbRound.criteria.length > 0)
    ? matchedDbRound
    : fallbackRoundDoc;

  // Strict check: Is the current round closed / not opened by the administrator?
  const isCurrentRoundClosed = Boolean(
    (matchedDbRound && (matchedDbRound.status === 'CLOSED' || matchedDbRound.active === false)) ||
    (!matchedDbRound && fallbackRoundDoc.active === false) ||
    currentRoundDoc.status === 'CLOSED' ||
    currentRoundDoc.active === false
  );

  // Map team evaluations for quick lookup with all possible keys (teamCode, teamId, _id)
  const evaluationMap = {};
  (evaluations || []).forEach(ev => {
    if (Number(ev.roundNumber) === Number(selectedRoundNum)) {
      if (ev.teamCode) {
        const c = String(ev.teamCode).trim();
        evaluationMap[c] = ev;
        evaluationMap[c.toUpperCase()] = ev;
        evaluationMap[c.toLowerCase()] = ev;
      }
      if (ev.teamId) {
        const id = String(ev.teamId).trim();
        evaluationMap[id] = ev;
        evaluationMap[id.toUpperCase()] = ev;
        evaluationMap[id.toLowerCase()] = ev;
      }
    }
  });

  const getTeamEvaluation = (team) => {
    if (!team) return null;
    const code = String(team.teamCode || team.teamId || '').trim();
    const id = team._id ? String(team._id).trim() : '';
    return evaluationMap[code] ||
           evaluationMap[code.toUpperCase()] ||
           evaluationMap[code.toLowerCase()] ||
           (id ? evaluationMap[id] : null) ||
           (id ? evaluationMap[id.toUpperCase()] : null) ||
           (team.teamId ? evaluationMap[String(team.teamId).trim()] : null) ||
           null;
  };

  const evaluatedCount = teams.filter(t => Boolean(getTeamEvaluation(t))).length;
  const totalTeamsCount = teams.length || AUTHORIZED_TEAMS.length;
  const progressPercent = totalTeamsCount > 0 ? Math.round((evaluatedCount / totalTeamsCount) * 100) : 0;

  // Filter teams by search and evaluation status
  const filteredTeams = teams.filter(t => {
    const isSubmitted = Boolean(getTeamEvaluation(t));
    
    if (statusFilter === 'SUBMITTED' && !isSubmitted) return false;
    if (statusFilter === 'PENDING' && isSubmitted) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (t.teamCode || '').toLowerCase().includes(term) ||
      (t.teamId || '').toLowerCase().includes(term) ||
      (t.teamName || '').toLowerCase().includes(term) ||
      (t.selectedProblemCode && t.selectedProblemCode.toLowerCase().includes(term)) ||
      (t.selectedProblemTitle && t.selectedProblemTitle.toLowerCase().includes(term))
    );
  });

  // Open Mark Entry Form (Reviewer enters ONLY raw marks 0–100)
  const openEvaluationModal = (team) => {
    if (isCurrentRoundClosed) {
      setErrorMsg(`Round ${selectedRoundNum} is currently closed. The administrator has not opened Round ${selectedRoundNum} for marks evaluation yet.`);
      return;
    }
    const existingEv = getTeamEvaluation(team);
    if (existingEv && user?.role === 'REVIEWER') {
      // Reviewers cannot view or edit marks once submitted
      return;
    }
    const initialRaw = existingEv ? (existingEv.rawScore !== undefined ? existingEv.rawScore : existingEv.totalMarks) : '';
    setRawMarkInput(initialRaw !== undefined && initialRaw !== null && initialRaw !== '' ? String(initialRaw) : '');
    setCommentsInput(existingEv?.comments || '');
    setActiveModalTeam(team);
    setErrorMsg('');
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!activeModalTeam) return;

    if (isCurrentRoundClosed) {
      setErrorMsg(`Cannot submit marks: Round ${selectedRoundNum} is currently closed by the Administrator.`);
      return;
    }

    // Section 20: Reject invalid marks with exact message
    if (rawMarkInput === '' || rawMarkInput === null || rawMarkInput === undefined || isNaN(Number(rawMarkInput))) {
      setErrorMsg('Marks must be between 0 and 100.');
      return;
    }
    const scoreNum = Number(rawMarkInput);
    if (scoreNum < 0 || scoreNum > 100) {
      setErrorMsg('Marks must be between 0 and 100.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        teamId: activeModalTeam._id,
        teamCode: activeModalTeam.teamCode || activeModalTeam.teamId,
        teamName: activeModalTeam.teamName,
        roundNumber: selectedRoundNum,
        rawScore: scoreNum,
        comments: commentsInput,
        status: 'SUBMITTED'
      };

      const res = await axios.post('/api/reviewer/evaluations', payload);
      
      const savedEv = res.data?.evaluation || {
        _id: `ev-${Date.now()}`,
        teamId: activeModalTeam._id,
        teamCode: activeModalTeam.teamCode || activeModalTeam.teamId,
        teamName: activeModalTeam.teamName,
        roundNumber: selectedRoundNum,
        rawScore: user?.role === 'ADMIN' ? scoreNum : null,
        totalMarks: user?.role === 'ADMIN' ? scoreNum : null,
        comments: user?.role === 'ADMIN' ? commentsInput : '',
        status: 'SUBMITTED',
        submittedAt: new Date()
      };

      // Optimistically update evaluations state
      setEvaluations(prev => {
        const cleanCode = String(activeModalTeam.teamCode || activeModalTeam.teamId || '').trim().toUpperCase();
        const cleanId = String(activeModalTeam._id || '').trim();
        const filtered = (prev || []).filter(item => !(
          Number(item.roundNumber) === Number(selectedRoundNum) &&
          (String(item.teamCode || '').trim().toUpperCase() === cleanCode || String(item.teamId || '').trim() === cleanId)
        ));
        return [savedEv, ...filtered];
      });

      setActionMsg(`Marks successfully submitted for ${activeModalTeam.teamCode || activeModalTeam.teamId}!`);
      setTimeout(() => setActionMsg(''), 4000);
      
      setActiveModalTeam(null);
      await fetchEvaluations(selectedRoundNum);
    } catch (err) {
      let msg = 'Failed to submit marks.';
      if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ flex: 1, padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      
      {/* 1. TOP HEADER & REVIEWER INFO BANNER */}
      <div className="glass-panel" style={{ padding: '1.5rem 1.75rem', marginBottom: '1.75rem', borderRadius: '16px', border: '1px solid rgba(0, 242, 254, 0.25)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0, 242, 254, 0.15)', border: '2px solid #00F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(0,242,254,0.2)' }}>
              <Award size={30} color="#00F2FE" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#00F2FE', fontWeight: 700 }}>
                Official Reviewer Portal
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', margin: '2px 0 0' }}>
                {user?.name || user?.username || 'Hackathon Evaluator'}
              </h1>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                {user?.email || `${user?.username || 'reviewer'}@hackathon.edu`} • Role: <strong style={{ color: '#FFD700' }}>{user?.role || 'REVIEWER'}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Total Teams Card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Total Registered Teams</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00F2FE', fontFamily: 'var(--font-heading)' }}>{totalTeamsCount}</div>
            </div>

            {/* Current Round Evaluated Count */}
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', minWidth: '160px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Round {selectedRoundNum} Progress</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
                {evaluatedCount} / {totalTeamsCount} <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>({progressPercent}%)</span>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-alpha-outline"
              style={{ padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.85rem' }}
              title="Refresh Data"
            >
              <RefreshCw size={16} className={refreshing ? 'spin' : ''} /> Sync Data
            </button>
          </div>
        </div>

        {/* Round Progress Bar */}
        <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '10px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${progressPercent}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #00F2FE 0%, #10B981 100%)',
              transition: 'width 0.4s ease'
            }} 
          />
        </div>
      </div>

      {/* ALERT NOTIFICATIONS */}
      {actionMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', padding: '0.85rem 1.25rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
          <CheckCircle2 size={20} />
          <span>{actionMsg}</span>
        </div>
      )}

      {errorMsg && !activeModalTeam && (
        <div style={{ background: 'rgba(255, 75, 75, 0.15)', border: '1px solid #FF4B4B', color: '#FF4B4B', padding: '0.85rem 1.25rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. ROUND SELECTION TABS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.4rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[1, 2, 3].map(roundNum => {
            const rdDoc = rounds.find(r => r.roundNumber === roundNum);
            const isRoundLocked = rdDoc ? (rdDoc.status === 'CLOSED' || rdDoc.active === false) : (roundNum > 1);
            const isSelected = selectedRoundNum === roundNum;
            
            return (
              <button
                key={roundNum}
                onClick={() => setSelectedRoundNum(roundNum)}
                style={{
                  padding: '0.65rem 1.35rem',
                  borderRadius: '10px',
                  border: isRoundLocked && !isSelected ? '1px dashed rgba(239, 68, 68, 0.35)' : 'none',
                  background: isSelected 
                    ? (isRoundLocked ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.95) 100%)' : 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)') 
                    : (isRoundLocked ? 'rgba(239, 68, 68, 0.08)' : 'transparent'),
                  color: isSelected ? (isRoundLocked ? '#FFFFFF' : '#0F172A') : (isRoundLocked ? '#FCA5A5' : '#94A3B8'),
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? (isRoundLocked ? '0 0 15px rgba(239, 68, 68, 0.4)' : '0 0 15px rgba(0, 242, 254, 0.4)') : 'none'
                }}
              >
                {isRoundLocked && <Lock size={14} color={isSelected ? '#FFFFFF' : '#EF4444'} />}
                <span>Round {roundNum}</span>
                <span style={{ 
                  background: isSelected ? 'rgba(15, 23, 42, 0.25)' : (isRoundLocked ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255,255,255,0.1)'), 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: isSelected ? (isRoundLocked ? '#FFFFFF' : '#0F172A') : (isRoundLocked ? '#F87171' : '#CBD5E1')
                }}>
                  {isRoundLocked ? 'LOCKED' : (rdDoc?.roundName ? rdDoc.roundName.split('-')[1]?.trim() || `R${roundNum}` : `R${roundNum}`)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Round Description & Open/Closed Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.78rem',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: isCurrentRoundClosed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: isCurrentRoundClosed ? '#EF4444' : '#10B981',
            border: `1px solid ${isCurrentRoundClosed ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
          }}>
            {isCurrentRoundClosed ? <Lock size={13} /> : <CheckCircle2 size={13} />}
            {isCurrentRoundClosed ? 'ROUND NOT OPENED / FROZEN' : 'ROUND OPEN & ACTIVE'}
          </span>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <strong style={{ color: isCurrentRoundClosed ? '#EF4444' : '#00F2FE' }}>{currentRoundDoc.roundName}</strong> • Max Score: <strong style={{ color: '#FFD700' }}>{currentRoundDoc.maximumMarks} Marks</strong>
          </div>
        </div>
      </div>

      {/* ROUND CLOSED NOTICE BANNER */}
      {isCurrentRoundClosed && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.15)'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Lock size={24} color="#EF4444" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F87171', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ROUND {selectedRoundNum} IS NOT OPEN FOR EVALUATION
            </div>
            <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '4px', lineHeight: 1.4 }}>
              The administrator has not opened Round {selectedRoundNum} for marks evaluation yet. Reviewers cannot enter or modify marks until the Administrator explicitly enables Round {selectedRoundNum} from the Admin Panel.
            </div>
          </div>
        </div>
      )}

      {/* 3. FILTERS & SEARCH BAR */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', borderRadius: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Search Field */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Team ID (ALPHA-001), Team Name, or Problem Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.75rem',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-cyan)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="#94A3B8" />
          <span style={{ fontSize: '0.82rem', color: '#94A3B8', marginRight: '0.25rem' }}>Status:</span>
          {['ALL', 'SUBMITTED', 'PENDING'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: statusFilter === f ? '#00F2FE' : 'rgba(255,255,255,0.1)',
                background: statusFilter === f ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                color: statusFilter === f ? '#00F2FE' : '#94A3B8',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 4. TEAMS MARKS TABLE */}
      <div className="glass-panel" style={{ borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
            <RefreshCw size={28} className="spin" color="#00F2FE" style={{ marginBottom: '0.75rem' }} />
            <div>Loading teams dataset...</div>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
            <Info size={32} color="#94A3B8" style={{ marginBottom: '0.75rem' }} />
            <div>No registered teams match your filter query.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Team ID</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Team Name</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Problem Statement</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team, idx) => {
                  const ev = getTeamEvaluation(team);
                  const isSubmitted = Boolean(ev);

                  return (
                    <tr 
                      key={team._id || team.teamCode || team.teamId} 
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                        transition: 'background 0.2s'
                      }}
                    >
                      {/* Team ID */}
                      <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: '#00F2FE', fontFamily: 'var(--font-heading)' }}>
                        {team.teamCode || team.teamId}
                      </td>

                      {/* Team Name */}
                      <td style={{ padding: '0.9rem 1.25rem', color: '#F8FAFC', fontWeight: 600 }}>
                        {team.teamName}
                      </td>

                      {/* Problem Statement */}
                      <td style={{ padding: '0.9rem 1.25rem', color: '#CBD5E1', fontSize: '0.82rem' }}>
                        {(() => {
                          const authItem = AUTHORIZED_TEAMS.find(a => a.teamId === (team.teamCode || team.teamId));
                          const rawCode = team.selectedProblemCode;
                          const isValidCode = rawCode && rawCode !== 'null' && rawCode !== 'undefined' && rawCode !== 'Not Selected';
                          const probCode = isValidCode ? rawCode : (authItem?.fixedProblemStatementId || 'PS-001');
                          const matched = TOP_40_PROBLEMS.find(p => p.problemId === probCode);
                          const title = team.selectedProblemTitle || matched?.title || '';
                          const domain = team.selectedProblemDomain || matched?.domain || '';

                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                  color: '#00F2FE',
                                  fontWeight: '800',
                                  fontFamily: 'Orbitron, monospace',
                                  fontSize: '0.88rem',
                                  background: 'rgba(0, 242, 254, 0.12)',
                                  padding: '2px 7px',
                                  borderRadius: '5px',
                                  border: '1px solid rgba(0, 242, 254, 0.25)'
                                }}>
                                  {probCode}
                                </span>
                                {domain && (
                                  <span style={{ fontSize: '0.7rem', color: '#FFD700', background: 'rgba(255, 215, 0, 0.1)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                                    {domain.split('&')[0].trim()}
                                  </span>
                                )}
                              </div>
                              {title ? (
                                <span style={{ fontSize: '0.76rem', color: '#CBD5E1', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={title}>
                                  {title}
                                </span>
                              ) : null}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '0.9rem 1.25rem', textAlign: 'center' }}>
                        {isSubmitted ? (
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle size={12} /> Submitted
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                        {isSubmitted && user?.role === 'REVIEWER' ? (
                          <button
                            disabled
                            style={{
                              padding: '0.45rem 0.9rem',
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              border: '1px solid rgba(16, 185, 129, 0.35)',
                              background: 'rgba(16, 185, 129, 0.08)',
                              color: '#10B981',
                              fontWeight: 700,
                              cursor: 'not-allowed',
                              opacity: 0.85,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            <CheckCircle size={14} color="#10B981" /> Submitted
                          </button>
                        ) : isCurrentRoundClosed ? (
                          <button
                            disabled
                            title={`Round ${selectedRoundNum} is closed. The administrator has not opened mark entry.`}
                            style={{
                              padding: '0.45rem 0.9rem',
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              background: 'rgba(239, 68, 68, 0.08)',
                              color: '#F87171',
                              fontWeight: 600,
                              cursor: 'not-allowed',
                              opacity: 0.8,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            <Lock size={13} color="#EF4444" /> Round Closed
                          </button>
                        ) : (
                          <button
                            onClick={() => openEvaluationModal(team)}
                            className="btn-alpha-cyan"
                            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', borderRadius: '8px' }}
                          >
                            {isSubmitted ? (
                              <>
                                <Edit3 size={14} /> Edit Marks
                              </>
                            ) : (
                              <>
                                <Edit3 size={14} /> Enter Marks
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. MARK ENTRY MODAL (Section 1: Reviewer enters ONLY raw marks 0–100) */}
      {activeModalTeam && (() => {
        const modalEv = getTeamEvaluation(activeModalTeam);
        const isEvSubmitted = Boolean(modalEv && modalEv.status === 'SUBMITTED');
        const isLocked = (isEvSubmitted && user?.role === 'REVIEWER') || isCurrentRoundClosed;
        const currentScore = modalEv ? (modalEv.rawScore !== undefined ? modalEv.rawScore : modalEv.totalMarks) : null;

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '560px', padding: '2rem', border: '1px solid #00F2FE', boxShadow: '0 0 30px rgba(0, 242, 254, 0.25)' }}>
              
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#00F2FE', textTransform: 'uppercase', fontWeight: 700 }}>
                    {isLocked ? 'View Submitted Marks' : 'Mark Entry'} • Round {selectedRoundNum}
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', margin: '2px 0 0' }}>
                    {activeModalTeam.teamCode || activeModalTeam.teamId} — {activeModalTeam.teamName}
                  </h2>
                </div>
                <button 
                  onClick={() => setActiveModalTeam(null)} 
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.3rem' }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Round Closed Warning inside Modal */}
              {isCurrentRoundClosed && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  color: '#F87171',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.88rem'
                }}>
                  <Lock size={18} color="#EF4444" />
                  <span><strong>Round {selectedRoundNum} is Closed:</strong> Mark entry is locked because the administrator has not opened this round yet.</span>
                </div>
              )}

              {/* Submitted Marks Banner */}
              {isEvSubmitted && currentScore !== null && currentScore !== undefined && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(0, 242, 254, 0.12) 100%)',
                  border: '2px solid #10B981',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                  textAlign: 'center',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)'
                }}>
                  <div style={{ fontSize: '0.78rem', color: '#10B981', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>
                    ✓ Current Submitted Raw Marks
                  </div>
                  <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#10B981', fontFamily: 'var(--font-heading)', margin: '0.25rem 0' }}>
                    {currentScore} <span style={{ fontSize: '1.3rem', color: '#94A3B8' }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                    Evaluation Saved & Submitted • Round {selectedRoundNum}
                  </div>
                </div>
              )}

              {/* Problem Statement Banner inside Modal */}
              <div style={{ background: 'rgba(0, 242, 254, 0.06)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '0.9rem 1.25rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#00F2FE', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
                    Assigned Problem Statement
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#F8FAFC', marginTop: '3px' }}>
                    {(() => {
                      const authItem = AUTHORIZED_TEAMS.find(a => a.teamId === (activeModalTeam.teamCode || activeModalTeam.teamId));
                      const rawCode = activeModalTeam.selectedProblemCode;
                      const isValidCode = rawCode && rawCode !== 'null' && rawCode !== 'undefined' && rawCode !== 'Not Selected';
                      const probCode = isValidCode ? rawCode : (authItem?.fixedProblemStatementId || 'PS-001');
                      const matched = TOP_40_PROBLEMS.find(p => p.problemId === probCode);
                      const title = activeModalTeam.selectedProblemTitle || matched?.title || '';
                      const domain = activeModalTeam.selectedProblemDomain || matched?.domain || '';

                      return (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#FFD700', fontFamily: 'Orbitron, monospace', fontSize: '1.05rem' }}>{probCode}</span>
                            {domain && <span style={{ fontSize: '0.72rem', color: '#00F2FE', background: 'rgba(0,242,254,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(0,242,254,0.2)' }}>{domain}</span>}
                          </div>
                          {title && <div style={{ fontSize: '0.82rem', color: '#CBD5E1', marginTop: '4px', fontWeight: '500' }}>{title}</div>}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Modal Locked Alert for Reviewers */}
              {isLocked && (
                <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', color: '#F59E0B', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Lock size={20} />
                  <span>Evaluation submitted & locked. Reviewers cannot edit marks after submission. Only Admin can edit submitted marks.</span>
                </div>
              )}

              {/* Modal Error Alert */}
              {errorMsg && (
                <div style={{ background: 'rgba(255, 75, 75, 0.15)', border: '1px solid #FF4B4B', color: '#FF4B4B', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitEvaluation}>
                {/* SECTION 1: Reviewer enters ONLY raw marks (0–100) */}
                <div style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0, 242, 254, 0.25)', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#00F2FE', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {isEvSubmitted ? 'Submitted Raw Marks (0 – 100)' : 'Raw Marks (0 – 100)'}
                  </label>
                  
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      placeholder="e.g. 82"
                      disabled={isLocked}
                      value={rawMarkInput !== '' ? rawMarkInput : (currentScore !== null && currentScore !== undefined ? String(currentScore) : '')}
                      onChange={(e) => {
                        setRawMarkInput(e.target.value);
                        setErrorMsg('');
                      }}
                      style={{
                        width: '140px',
                        padding: '0.85rem 1rem',
                        textAlign: 'center',
                        background: 'rgba(30, 41, 59, 0.95)',
                        border: '2px solid #00F2FE',
                        borderRadius: '12px',
                        color: isLocked ? '#10B981' : '#00F2FE',
                        fontWeight: 900,
                        fontSize: '1.8rem',
                        fontFamily: 'var(--font-heading)',
                        outline: 'none',
                        cursor: isLocked ? 'default' : 'text',
                        boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)'
                      }}
                    />
                    <span style={{ fontSize: '1.3rem', color: '#94A3B8', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                      / 100
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.85rem' }}>
                    {isLocked ? 'Submitted marks are recorded on the authoritative server.' : 'Enter raw evaluation score from 0 to 100.'}
                  </div>
                </div>

                {/* Optional Comments */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Reviewer Notes / Feedback (Optional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Add optional notes or feedback for this team..."
                    disabled={isLocked}
                    value={commentsInput}
                    onChange={(e) => setCommentsInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: isLocked ? 'rgba(15, 23, 42, 0.5)' : 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: isLocked ? '#94A3B8' : '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none',
                      resize: 'none',
                      cursor: isLocked ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {/* Submit Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  {isLocked ? (
                    <button
                      type="button"
                      onClick={() => setActiveModalTeam(null)}
                      className="btn-alpha-cyan"
                      style={{ padding: '0.7rem 1.5rem', fontSize: '0.88rem' }}
                    >
                      Close (View Only)
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveModalTeam(null)}
                        className="btn-alpha-outline"
                        style={{ padding: '0.7rem 1.25rem', fontSize: '0.88rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-alpha-cyan"
                        style={{ padding: '0.7rem 1.5rem', fontSize: '0.88rem' }}
                      >
                        {submitting ? 'Saving Marks...' : (
                          <>
                            <Save size={16} /> SUBMIT MARKS
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
