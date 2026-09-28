import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Award, CheckCircle2, Clock, Search, Filter, Edit3, Eye, 
  Save, AlertCircle, RefreshCw, X, ChevronRight, CheckCircle, Info
} from 'lucide-react';
import axios from 'axios';

import AUTHORIZED_TEAMS from '../data/teamsData';

const DEFAULT_FRONTEND_ROUNDS = [
  {
    roundNumber: 1,
    roundName: 'Round 1 - Ideation & Architecture',
    maximumMarks: 60,
    criteria: [
      { key: 'innovation', name: 'Innovation', maxMarks: 10, description: 'Novelty & originality of solution' },
      { key: 'tech_approach', name: 'Technical Approach', maxMarks: 10, description: 'System design & architecture' },
      { key: 'problem_understanding', name: 'Problem Understanding', maxMarks: 10, description: 'Clarity on problem domain' },
      { key: 'feasibility', name: 'Feasibility', maxMarks: 10, description: 'Practicality within time limits' },
      { key: 'presentation', name: 'Presentation', maxMarks: 10, description: 'Team communication & clarity' },
      { key: 'overall_impact', name: 'Overall Impact', maxMarks: 10, description: 'Potential value & scalability' }
    ]
  },
  {
    roundNumber: 2,
    roundName: 'Round 2 - Implementation & Coding',
    maximumMarks: 60,
    criteria: [
      { key: 'code_quality', name: 'Code Quality & Architecture', maxMarks: 15, description: 'Clean code & structure' },
      { key: 'tech_complexity', name: 'Technical Complexity', maxMarks: 15, description: 'Depth of implementation' },
      { key: 'functionality', name: 'Functionality & Working Demo', maxMarks: 15, description: 'Features working as intended' },
      { key: 'ui_ux', name: 'UI/UX & Design', maxMarks: 15, description: 'User interface & interaction' }
    ]
  },
  {
    roundNumber: 3,
    roundName: 'Round 3 - Final Pitch & Demo',
    maximumMarks: 60,
    criteria: [
      { key: 'completeness', name: 'Project Completeness', maxMarks: 20, description: 'Finished features & stability' },
      { key: 'business_value', name: 'Business Value & Viability', maxMarks: 20, description: 'Real-world utility' },
      { key: 'final_pitch', name: 'Final Presentation & Q/A', maxMarks: 20, description: 'Live demonstration & responses' }
    ]
  }
];

const INITIAL_TEAMS_DATA = AUTHORIZED_TEAMS.map(item => ({
  _id: item.teamId,
  teamId: item.teamId,
  teamCode: item.teamId,
  teamName: item.teamName || item.teamId,
  teamLeadRegNum: item.regNum,
  teamLeadName: item.leadName || `Team Lead (${item.teamId})`,
  college: 'KARE',
  department: 'CSE',
  selectedProblemCode: 'Not Selected',
  selectedProblemTitle: '',
  membersCount: item.members ? item.members.length : 4,
  registrationStatus: 'CONFIRMED'
}));

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
  
  // Mark Entry Modal state
  const [activeModalTeam, setActiveModalTeam] = useState(null);
  const [criteriaInputs, setCriteriaInputs] = useState({});
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

  const fetchInitialData = async (retryCount = 0) => {
    try {
      const [teamsRes, roundsRes] = await Promise.all([
        axios.get('/api/reviewer/teams'),
        axios.get('/api/reviewer/rounds')
      ]);

      if (teamsRes.data && teamsRes.data.teams && teamsRes.data.teams.length > 0) {
        setTeams(teamsRes.data.teams);
      }
      if (roundsRes.data && roundsRes.data.rounds) {
        setRounds(roundsRes.data.rounds);
      }
      
      await fetchEvaluations(selectedRoundNum);
      setErrorMsg('');
    } catch (err) {
      console.error('Failed to load reviewer dashboard data:', err);
      if (retryCount < 2) {
        setErrorMsg('Connecting to backend server (waking up server engine)... Retrying...');
        setTimeout(() => fetchInitialData(retryCount + 1), 3000);
      } else {
        setErrorMsg(err.response?.data?.error || err.message || 'Backend server connection delayed. Click Sync Data to retry.');
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

  // Map team evaluations for quick lookup
  const evaluationMap = {};
  evaluations.forEach(ev => {
    if (ev.roundNumber === selectedRoundNum) {
      evaluationMap[ev.teamCode] = ev;
      if (ev.teamId) evaluationMap[ev.teamId] = ev;
    }
  });

  const evaluatedCount = teams.filter(t => Boolean(evaluationMap[t.teamCode] || evaluationMap[t._id])).length;
  const totalTeamsCount = teams.length || 60;
  const progressPercent = totalTeamsCount > 0 ? Math.round((evaluatedCount / totalTeamsCount) * 100) : 0;

  // Filter teams by search and evaluation status
  const filteredTeams = teams.filter(t => {
    const isSubmitted = Boolean(evaluationMap[t.teamCode] || evaluationMap[t._id]);
    
    if (statusFilter === 'SUBMITTED' && !isSubmitted) return false;
    if (statusFilter === 'PENDING' && isSubmitted) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.teamCode.toLowerCase().includes(term) ||
      t.teamName.toLowerCase().includes(term) ||
      (t.selectedProblemCode && t.selectedProblemCode.toLowerCase().includes(term)) ||
      (t.selectedProblemTitle && t.selectedProblemTitle.toLowerCase().includes(term))
    );
  });

  // Open Mark Entry Form
  const openEvaluationModal = (team) => {
    const existingEv = evaluationMap[team.teamCode] || evaluationMap[team._id];
    const initialInputs = {};

    const activeCriteria = (currentRoundDoc.criteria && currentRoundDoc.criteria.length > 0) 
      ? currentRoundDoc.criteria 
      : fallbackRoundDoc.criteria;

    activeCriteria.forEach(crit => {
      const existingMarkObj = existingEv?.criteriaMarks?.find(c => c.criteriaKey === crit.key || c.name === crit.name);
      initialInputs[crit.key] = (existingMarkObj !== undefined && existingMarkObj !== null) ? existingMarkObj.mark : '';
    });

    setCriteriaInputs(initialInputs);
    setCommentsInput(existingEv?.comments || '');
    setActiveModalTeam(team);
    setErrorMsg('');
  };

  const handleCriterionChange = (key, value, maxAllowed) => {
    if (value === '') {
      setCriteriaInputs(prev => ({ ...prev, [key]: '' }));
      return;
    }
    const num = Number(value);
    if (isNaN(num)) return;
    if (num < 0) return;
    if (num > maxAllowed) return; // Prevent entering > maxMarks
    
    setCriteriaInputs(prev => ({ ...prev, [key]: num }));
  };

  // Calculate live sum total
  const calculatedTotalScore = Object.values(criteriaInputs).reduce((acc, curr) => {
    const val = Number(curr);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!activeModalTeam) return;

    const activeCriteria = (currentRoundDoc.criteria && currentRoundDoc.criteria.length > 0) 
      ? currentRoundDoc.criteria 
      : fallbackRoundDoc.criteria;
    const formattedMarks = [];

    for (const crit of activeCriteria) {
      const val = criteriaInputs[crit.key];
      if (val === '' || val === undefined || val === null) {
        setErrorMsg(`Please enter a mark for '${crit.name}'.`);
        return;
      }
      formattedMarks.push({
        criteriaKey: crit.key,
        name: crit.name,
        mark: Number(val),
        maxMark: crit.maxMarks
      });
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        teamId: activeModalTeam._id,
        teamCode: activeModalTeam.teamCode,
        teamName: activeModalTeam.teamName,
        roundNumber: selectedRoundNum,
        criteriaMarks: formattedMarks,
        comments: commentsInput,
        status: 'SUBMITTED'
      };

      const res = await axios.post('/api/reviewer/evaluations', payload);
      
      setActionMsg(`Marks saved successfully for ${activeModalTeam.teamCode}!`);
      setTimeout(() => setActionMsg(''), 4000);
      
      setActiveModalTeam(null);
      await fetchEvaluations(selectedRoundNum);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to submit marks.';
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
            const isSelected = selectedRoundNum === roundNum;
            const rCount = teams.filter(t => Boolean(evaluationMap[t.teamCode] || evaluationMap[t._id])).length;
            
            return (
              <button
                key={roundNum}
                onClick={() => setSelectedRoundNum(roundNum)}
                style={{
                  padding: '0.65rem 1.35rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: isSelected ? 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)' : 'transparent',
                  color: isSelected ? '#0F172A' : '#94A3B8',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 15px rgba(0, 242, 254, 0.4)' : 'none'
                }}
              >
                <span>Round {roundNum}</span>
                <span style={{ 
                  background: isSelected ? 'rgba(15, 23, 42, 0.2)' : 'rgba(255,255,255,0.1)', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem',
                  color: isSelected ? '#0F172A' : '#CBD5E1'
                }}>
                  {rdDoc?.roundName ? rdDoc.roundName.split('-')[1]?.trim() || `R${roundNum}` : `R${roundNum}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Round Description Badge */}
        <div style={{ fontSize: '0.85rem', color: '#94A3B8', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <strong style={{ color: '#00F2FE' }}>{currentRoundDoc.roundName}</strong> • Max Score: <strong style={{ color: '#FFD700' }}>{currentRoundDoc.maximumMarks} Marks</strong>
        </div>
      </div>

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
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Round {selectedRoundNum} Score</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team, idx) => {
                  const ev = evaluationMap[team.teamCode] || evaluationMap[team._id];
                  const isSubmitted = Boolean(ev);
                  const totalScore = isSubmitted ? ev.totalMarks : '--';

                  return (
                    <tr 
                      key={team._id || team.teamCode} 
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                        transition: 'background 0.2s'
                      }}
                    >
                      {/* Team ID */}
                      <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: '#00F2FE', fontFamily: 'var(--font-heading)' }}>
                        {team.teamCode}
                      </td>

                      {/* Team Name */}
                      <td style={{ padding: '0.9rem 1.25rem', color: '#F8FAFC', fontWeight: 600 }}>
                        {team.teamName}
                      </td>

                      {/* Problem Statement */}
                      <td style={{ padding: '0.9rem 1.25rem', color: '#CBD5E1', fontSize: '0.82rem' }}>
                        {team.selectedProblemCode && team.selectedProblemCode !== 'Not Selected' ? (
                          <span>
                            <strong style={{ color: '#FFD700' }}>{team.selectedProblemCode}</strong>
                            {team.selectedProblemTitle ? ` - ${team.selectedProblemTitle.slice(0, 32)}...` : ''}
                          </span>
                        ) : (
                          <span style={{ color: '#64748B', italic: true }}>Not Selected Yet</span>
                        )}
                      </td>

                      {/* Total Score */}
                      <td style={{ padding: '0.9rem 1.25rem', textAlign: 'center', fontWeight: 800, fontSize: '1rem', color: isSubmitted ? '#10B981' : '#64748B' }}>
                        {isSubmitted ? `${totalScore} / ${currentRoundDoc.maximumMarks}` : '--'}
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
                        <button
                          onClick={() => openEvaluationModal(team)}
                          className={isSubmitted ? 'btn-alpha-outline' : 'btn-alpha-cyan'}
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. MARK ENTRY MODAL */}
      {activeModalTeam && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px', padding: '2rem', border: '1px solid #00F2FE', boxShadow: '0 0 30px rgba(0, 242, 254, 0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#00F2FE', textTransform: 'uppercase', fontWeight: 700 }}>
                  Mark Entry • Round {selectedRoundNum}
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', margin: '2px 0 0' }}>
                  {activeModalTeam.teamCode} — {activeModalTeam.teamName}
                </h2>
              </div>
              <button 
                onClick={() => setActiveModalTeam(null)} 
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.3rem' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Error Alert */}
            {errorMsg && (
              <div style={{ background: 'rgba(255, 75, 75, 0.15)', border: '1px solid #FF4B4B', color: '#FF4B4B', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitEvaluation}>
              {/* Criteria Inputs List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '360px', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
                {(currentRoundDoc.criteria || []).map((crit) => {
                  const val = criteriaInputs[crit.key] ?? '';

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
                        {crit.description && (
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                            {crit.description}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <input
                          type="number"
                          min="0"
                          max={crit.maxMarks}
                          step="1"
                          placeholder="0"
                          value={val}
                          onChange={(e) => handleCriterionChange(crit.key, e.target.value, crit.maxMarks)}
                          style={{
                            width: '75px',
                            padding: '0.5rem',
                            textAlign: 'center',
                            background: 'rgba(30, 41, 59, 0.9)',
                            border: '1px solid var(--border-cyan)',
                            borderRadius: '8px',
                            color: '#00F2FE',
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

              {/* Optional Comments */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Reviewer Notes / Feedback (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Add feedback or key observations for this team..."
                  value={commentsInput}
                  onChange={(e) => setCommentsInput(e.target.value)}
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

              {/* Total Summary Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0, 242, 254, 0.08)', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(0, 242, 254, 0.2)', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Total Calculated Marks</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00F2FE', fontFamily: 'var(--font-heading)' }}>
                    {calculatedTotalScore} / {currentRoundDoc.maximumMarks}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} /> Backend Validated
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
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
                      <Save size={16} /> Save / Submit Marks
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
