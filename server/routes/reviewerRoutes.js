const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Team, TeamLead, ProblemStatement, EvaluationRound, Evaluation, Reviewer, AuditLog, ActiveSession } = require('../models/Schema');
const { authenticateToken, requireRole, JWT_SECRET } = require('../middleware/auth');
const AUTHORIZED_TEAMS = require('../data/teamsData');

// Reviewer Direct Login Handler
const handleReviewerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const reviewer = await Reviewer.findOne({ username: cleanUsername });
    if (!reviewer) {
      return res.status(401).json({ error: 'Invalid reviewer credentials.' });
    }

    const isMatch = await bcrypt.compare(password, reviewer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid reviewer credentials.' });
    }

    const newSessionId = uuidv4();
    await ActiveSession.create({
      userId: reviewer._id.toString(),
      registrationNumber: reviewer.username,
      role: 'REVIEWER',
      sessionId: newSessionId,
      loginTime: new Date()
    });

    const token = jwt.sign({
      id: reviewer._id.toString(),
      username: reviewer.username,
      name: reviewer.name,
      role: 'REVIEWER',
      sessionId: newSessionId
    }, JWT_SECRET, { expiresIn: '24h' });

    await AuditLog.create({
      actor: reviewer.username,
      role: 'REVIEWER',
      action: 'LOGIN',
      target: 'Reviewer Dashboard'
    });

    return res.json({
      message: 'Reviewer login successful',
      token,
      sessionId: newSessionId,
      user: {
        id: reviewer._id,
        username: reviewer.username,
        name: reviewer.name,
        email: reviewer.email || `${reviewer.username}@hackathon.edu`,
        role: 'REVIEWER'
      }
    });
  } catch (err) {
    console.error('Reviewer login error:', err);
    return res.status(500).json({ error: 'Server error during reviewer authentication.' });
  }
};

router.post('/login', handleReviewerLogin);
router.post('/reviewer/login', handleReviewerLogin);
router.get('/login', (req, res) => res.json({ status: 'ACTIVE', message: 'Reviewer Login endpoint active.' }));

// Default Evaluation Criteria per Round (Used as fallback if DB isn't seeded)
const DEFAULT_ROUNDS = [
  {
    roundNumber: 1,
    roundName: 'Round 1 - Ideation & Architecture',
    description: 'Initial evaluation of team problem understanding, feasibility, and design approach.',
    maximumMarks: 100,
    active: true,
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
    description: 'Mid-event evaluation of codebase, technical complexity, and progress.',
    maximumMarks: 100,
    active: true,
    criteria: [
      { key: 'code_quality', name: 'Code Quality & Structure', maxMarks: 25, description: 'Clean code & architectural standards' },
      { key: 'tech_complexity', name: 'Technical Complexity & Depth', maxMarks: 25, description: 'Algorithmic & engineering complexity' },
      { key: 'functionality', name: 'Functionality & Working Demo', maxMarks: 25, description: 'Working features & execution' },
      { key: 'ui_ux', name: 'UI/UX & User Interface', maxMarks: 25, description: 'Design quality & user experience' }
    ]
  },
  {
    roundNumber: 3,
    roundName: 'Round 3 - Final Demo & Pitch',
    description: 'Final evaluation of complete project, live demo, and QA.',
    maximumMarks: 100,
    active: true,
    criteria: [
      { key: 'completeness', name: 'Project Completeness & Stability', maxMarks: 35, description: 'Finished product & system stability' },
      { key: 'business_value', name: 'Business Value & Viability', maxMarks: 35, description: 'Market utility & real-world value' },
      { key: 'final_pitch', name: 'Final Presentation & Q/A Defense', maxMarks: 30, description: 'Pitch defense & Q/A answers' }
    ]
  }
];

// Helper to ensure default rounds exist in DB and update to 100 marks
async function ensureRoundsExist() {
  for (const r of DEFAULT_ROUNDS) {
    let doc = await EvaluationRound.findOne({ roundNumber: r.roundNumber });
    if (!doc) {
      await EvaluationRound.create(r);
    } else {
      doc.maximumMarks = 100;
      doc.criteria = r.criteria;
      doc.roundName = r.roundName;
      await doc.save();
    }
  }
}

// 1. GET ALL REGISTERED TEAMS FOR REVIEWER
router.get('/teams', authenticateToken, requireRole('REVIEWER', 'ADMIN'), async (req, res) => {
  try {
    const teams = await Team.find();
    const problemStatements = await ProblemStatement.find();

    const result = AUTHORIZED_TEAMS.map((item) => {
      const dbTeam = teams.find(t => t.name === item.teamId || t.teamId === item.teamId || t.teamLeadRegNum === item.regNum);
      const probCode = dbTeam?.selectedProblemCode && dbTeam.selectedProblemCode !== 'null' ? dbTeam.selectedProblemCode : 'Not Selected';
      const matchedProblem = probCode !== 'Not Selected' ? problemStatements.find(p => p.problemId === probCode) : null;

      return {
        _id: dbTeam?._id || item.teamId,
        teamId: item.teamId,
        teamCode: item.teamId,
        teamName: item.teamName || item.teamId,
        teamLeadRegNum: item.regNum,
        teamLeadName: item.leadName || `Team Lead (${item.teamId})`,
        college: dbTeam?.college || 'KARE',
        department: dbTeam?.department || 'CSE',
        selectedProblemCode: probCode,
        selectedProblemTitle: matchedProblem?.title || '',
        membersCount: item.members ? item.members.length : 0,
        registrationStatus: dbTeam?.registrationStatus || 'CONFIRMED'
      };
    });

    return res.json({ total: result.length, teams: result });
  } catch (err) {
    console.error('Reviewer get teams error:', err);
    return res.status(500).json({ error: 'Failed to fetch teams list.' });
  }
});

// 2. GET EVALUATION ROUNDS & CRITERIA
router.get('/rounds', authenticateToken, requireRole('REVIEWER', 'ADMIN'), async (req, res) => {
  try {
    await ensureRoundsExist();
    const dbRounds = await EvaluationRound.find().sort({ roundNumber: 1 });
    return res.json({ rounds: dbRounds.length > 0 ? dbRounds : DEFAULT_ROUNDS });
  } catch (err) {
    console.error('Reviewer get rounds error:', err);
    return res.json({ rounds: DEFAULT_ROUNDS });
  }
});

const { validateRawScore, recalculateRoundReviewerNormalization } = require('../services/normalizationService');

// 3. GET EVALUATIONS FOR SPECIFIC ROUND (SUBMITTED BY LOGGED-IN REVIEWER - REVIEWER PRIVACY PROTECTED)
const handleGetEvaluations = async (req, res) => {
  try {
    const roundParam = req.params.round;
    const revQueries = [];

    if (req.user?.id) {
      revQueries.push({ reviewerId: req.user.id });
      revQueries.push({ reviewerId: String(req.user.id) });
      if (mongoose.Types.ObjectId.isValid(req.user.id)) {
        revQueries.push({ reviewerId: new mongoose.Types.ObjectId(req.user.id) });
      }
    }
    if (req.user?.username) {
      revQueries.push({ reviewerUsername: req.user.username });
    }

    let query = {};
    if (req.user?.role === 'REVIEWER') {
      query.$or = revQueries;
    }

    if (roundParam && roundParam !== 'all') {
      const roundNum = Number(roundParam);
      if (!isNaN(roundNum)) {
        query.roundNumber = roundNum;
      }
    }

    const evaluations = await Evaluation.find(query).sort({ updatedAt: -1 });
    
    // Privacy: If user is REVIEWER, mask raw marks so reviewer cannot see marks once entered
    const sanitizedEvaluations = evaluations.map(ev => ({
      _id: ev._id,
      teamId: ev.teamId,
      teamCode: ev.teamCode,
      teamName: ev.teamName,
      roundNumber: ev.roundNumber,
      reviewerId: ev.reviewerId,
      rawScore: req.user?.role === 'ADMIN' ? (ev.rawScore !== undefined ? ev.rawScore : ev.totalMarks) : null,
      totalMarks: req.user?.role === 'ADMIN' ? (ev.rawScore !== undefined ? ev.rawScore : ev.totalMarks) : null,
      comments: req.user?.role === 'ADMIN' ? (ev.comments || '') : '',
      status: ev.status || 'SUBMITTED',
      submittedAt: ev.submittedAt
    }));

    return res.json({ evaluations: sanitizedEvaluations });
  } catch (err) {
    console.error('Reviewer get evaluations error:', err);
    return res.status(500).json({ error: 'Failed to fetch evaluations.' });
  }
};

router.get('/evaluations/:round', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleGetEvaluations);
router.get('/evaluations', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleGetEvaluations);
router.get('/:round', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleGetEvaluations);

// 4. ENTER / SUBMIT EVALUATION FOR A TEAM (RAW MARKS ONLY, BACKEND AUTOMATIC MIN-MAX NORMALIZATION)
const handleSubmitEvaluation = async (req, res) => {
  try {
    const { teamId, teamCode, teamName, roundNumber, rawScore, marks, criteriaMarks, comments, status } = req.body;

    const roundNum = Number(roundNumber);
    if (!roundNumber || isNaN(roundNum)) {
      return res.status(400).json({ error: `Invalid evaluation round number: ${roundNumber}` });
    }

    const rawTeamIdentifier = teamCode || teamId;
    if (!rawTeamIdentifier) {
      return res.status(400).json({ error: 'Team Code or Team ID is required.' });
    }

    // Section 20: Strict 0-100 Validation
    let candidateRawScore = rawScore;
    if (candidateRawScore === undefined || candidateRawScore === null || candidateRawScore === '') {
      if (marks !== undefined && marks !== null && marks !== '') {
        candidateRawScore = marks;
      } else if (Array.isArray(criteriaMarks) && criteriaMarks.length > 0) {
        candidateRawScore = criteriaMarks.reduce((sum, item) => sum + (Number(item.mark) || 0), 0);
      }
    }

    let cleanRawScore;
    try {
      cleanRawScore = validateRawScore(candidateRawScore);
    } catch (valErr) {
      return res.status(400).json({ error: 'Marks must be between 0 and 100.' });
    }

    // Section 21: Check if Round is Closed by Admin (Reviewers cannot submit new marks)
    const roundDoc = await EvaluationRound.findOne({ roundNumber: roundNum });
    if (req.user.role === 'REVIEWER' && roundDoc && (roundDoc.status === 'CLOSED' || roundDoc.active === false)) {
      return res.status(403).json({
        error: `Evaluation Round ${roundNum} is closed and frozen. New mark submissions are not permitted.`,
        code: 'ROUND_CLOSED'
      });
    }

    // Verify & Match Team
    let matchedDbTeam = null;
    if (mongoose.Types.ObjectId.isValid(rawTeamIdentifier)) {
      matchedDbTeam = await Team.findById(rawTeamIdentifier);
    }
    if (!matchedDbTeam) {
      const cleanIdentifier = String(rawTeamIdentifier).trim().toUpperCase();
      matchedDbTeam = await Team.findOne({ $or: [{ teamId: cleanIdentifier }, { name: cleanIdentifier }, { teamName: cleanIdentifier }] });
    }

    const cleanTeamCode = matchedDbTeam?.teamId || matchedDbTeam?.name || String(rawTeamIdentifier).trim().toUpperCase();
    const authTeam = AUTHORIZED_TEAMS.find(t => t.teamId === cleanTeamCode || t.teamName?.toUpperCase() === cleanTeamCode);

    if (!matchedDbTeam && !authTeam) {
      return res.status(404).json({ error: `Team ${cleanTeamCode} not found in database.` });
    }

    const matchedTeamId = matchedDbTeam?._id || teamId || cleanTeamCode;
    const matchedTeamName = teamName || authTeam?.teamName || matchedDbTeam?.teamName || matchedDbTeam?.name || cleanTeamCode;

    // Get Reviewer Details from Server Session
    let reviewerName = req.user.name || req.user.username;
    let reviewerUsername = req.user.username || 'reviewer';
    let reviewerId = req.user.id;

    if (req.user.role === 'REVIEWER') {
      const dbReviewer = await Reviewer.findById(req.user.id);
      if (dbReviewer) {
        reviewerName = dbReviewer.name;
        reviewerUsername = dbReviewer.username;
      }
    }

    // Check if an evaluation already exists for (team, round, reviewer)
    const revMatch = [{ reviewerId: reviewerId }, { reviewerId: String(reviewerId) }];
    if (mongoose.Types.ObjectId.isValid(reviewerId)) {
      revMatch.push({ reviewerId: new mongoose.Types.ObjectId(reviewerId) });
    }
    if (reviewerUsername) {
      revMatch.push({ reviewerUsername: reviewerUsername });
    }

    let evaluationDoc = await Evaluation.findOne({
      roundNumber: roundNum,
      $or: revMatch,
      $and: [
        { $or: [{ teamCode: cleanTeamCode }, { teamId: matchedTeamId }] }
      ]
    });

    if (evaluationDoc) {
      // Lock submitted evaluations for Reviewers (Only ADMIN can edit submitted marks)
      if (req.user.role === 'REVIEWER' && evaluationDoc.status === 'SUBMITTED') {
        return res.status(403).json({
          error: 'Evaluation marks have already been submitted for this team and cannot be modified by reviewers. Only an Administrator can edit submitted marks.',
          code: 'EVALUATION_LOCKED'
        });
      }

      // Update existing evaluation
      evaluationDoc.rawScore = cleanRawScore;
      evaluationDoc.totalMarks = cleanRawScore;
      evaluationDoc.criteriaMarks = [{ criteriaKey: 'raw_score', name: 'Raw Marks', mark: cleanRawScore, maxMark: 100 }];
      evaluationDoc.comments = comments !== undefined ? comments : evaluationDoc.comments;
      evaluationDoc.status = status || 'SUBMITTED';
      evaluationDoc.submittedAt = new Date();
      await evaluationDoc.save();
    } else {
      // Create new evaluation
      evaluationDoc = await Evaluation.create({
        teamId: matchedTeamId,
        teamCode: cleanTeamCode,
        teamName: matchedTeamName,
        roundNumber: roundNum,
        reviewerId: reviewerId,
        reviewerUsername: reviewerUsername,
        reviewerName: reviewerName,
        rawScore: cleanRawScore,
        totalMarks: cleanRawScore,
        criteriaMarks: [{ criteriaKey: 'raw_score', name: 'Raw Marks', mark: cleanRawScore, maxMark: 100 }],
        comments: comments || '',
        status: status || 'SUBMITTED',
        submittedAt: new Date()
      });
    }

    // Section 4 & 7 & 12: AUTOMATIC MIN-MAX RECALCULATION
    // Recalculate MIN, MAX, and normalized scores for ALL teams evaluated by this reviewer in this round
    await recalculateRoundReviewerNormalization(roundNum, reviewerId);

    await AuditLog.create({
      actor: reviewerUsername,
      role: req.user.role,
      action: 'SUBMIT_RAW_SCORE',
      target: `Team ${cleanTeamCode} (Round ${roundNum})`,
      metadata: { rawScore: cleanRawScore, roundNumber: roundNum }
    });

    // Return sanitized response for reviewer (protects privacy: reviewer cannot see marks once entered)
    const isAdmin = req.user?.role === 'ADMIN';
    return res.json({
      message: `Marks for Team ${cleanTeamCode} (Round ${roundNum}) submitted successfully!`,
      evaluation: {
        _id: evaluationDoc._id,
        teamId: evaluationDoc.teamId,
        teamCode: evaluationDoc.teamCode,
        teamName: evaluationDoc.teamName,
        roundNumber: evaluationDoc.roundNumber,
        rawScore: isAdmin ? cleanRawScore : null,
        totalMarks: isAdmin ? cleanRawScore : null,
        comments: isAdmin ? evaluationDoc.comments : '',
        status: evaluationDoc.status,
        submittedAt: evaluationDoc.submittedAt
      }
    });
  } catch (err) {
    console.error('Submit evaluation error:', err);
    return res.status(500).json({ error: 'Failed to submit evaluation marks.' });
  }
};

router.post('/evaluations', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleSubmitEvaluation);
router.post('/', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleSubmitEvaluation);

// 5. UPDATE EXISTING EVALUATION BY ID (Admin only or draft update)
const handleUpdateEvaluation = async (req, res) => {
  try {
    const { rawScore, marks, criteriaMarks, comments, status } = req.body;
    const evaluationDoc = await Evaluation.findById(req.params.id);

    if (!evaluationDoc) {
      return res.status(404).json({ error: 'Evaluation record not found.' });
    }

    // Reviewers cannot edit submitted evaluations
    if (req.user.role === 'REVIEWER' && evaluationDoc.status === 'SUBMITTED') {
      return res.status(403).json({
        error: 'Submitted evaluation marks are locked and cannot be edited by reviewers. Contact Administrator.',
        code: 'EVALUATION_LOCKED'
      });
    }

    // Verify reviewer ownership unless admin
    if (req.user.role === 'REVIEWER' && evaluationDoc.reviewerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to edit another reviewer\'s evaluation.' });
    }

    let updatedRawScore = evaluationDoc.rawScore;
    let candidateScore = rawScore !== undefined ? rawScore : marks;

    if (candidateScore !== undefined && candidateScore !== null && candidateScore !== '') {
      try {
        updatedRawScore = validateRawScore(candidateScore);
      } catch (e) {
        return res.status(400).json({ error: 'Marks must be between 0 and 100.' });
      }
      evaluationDoc.rawScore = updatedRawScore;
      evaluationDoc.totalMarks = updatedRawScore;
      evaluationDoc.criteriaMarks = [{ criteriaKey: 'raw_score', name: 'Raw Marks', mark: updatedRawScore, maxMark: 100 }];
    } else if (Array.isArray(criteriaMarks)) {
      let calculatedTotal = 0;
      for (const item of criteriaMarks) {
        const rawMark = Number(item.mark) || 0;
        calculatedTotal += rawMark;
      }
      try {
        updatedRawScore = validateRawScore(calculatedTotal);
      } catch (e) {
        return res.status(400).json({ error: 'Marks must be between 0 and 100.' });
      }
      evaluationDoc.rawScore = updatedRawScore;
      evaluationDoc.totalMarks = updatedRawScore;
      evaluationDoc.criteriaMarks = criteriaMarks;
    }

    if (comments !== undefined) evaluationDoc.comments = comments;
    if (status !== undefined) evaluationDoc.status = status;
    evaluationDoc.submittedAt = new Date();

    await evaluationDoc.save();

    // Trigger normalization recalculation whenever score changes
    await recalculateRoundReviewerNormalization(evaluationDoc.roundNumber, evaluationDoc.reviewerId);

    await AuditLog.create({
      actor: req.user.username,
      role: req.user.role,
      action: 'UPDATE_EVALUATION',
      target: `Team ${evaluationDoc.teamCode} (Round ${evaluationDoc.roundNumber})`,
      metadata: { rawScore: updatedRawScore }
    });

    const refreshedEv = await Evaluation.findById(evaluationDoc._id);
    return res.json({ message: 'Evaluation updated successfully.', evaluation: refreshedEv });
  } catch (err) {
    console.error('Update evaluation error:', err);
    return res.status(500).json({ error: 'Failed to update evaluation.' });
  }
};

router.put('/evaluations/:id', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleUpdateEvaluation);
router.put('/:id', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleUpdateEvaluation);

module.exports = router;
