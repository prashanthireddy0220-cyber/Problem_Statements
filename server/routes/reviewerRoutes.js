const express = require('express');
const router = express.Router();
const { Team, TeamLead, ProblemStatement, EvaluationRound, Evaluation, Reviewer, AuditLog } = require('../models/Schema');
const { authenticateToken, requireRole } = require('../middleware/auth');
const AUTHORIZED_TEAMS = require('../data/teamsData');

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

// 3. GET EVALUATIONS FOR SPECIFIC ROUND (SUBMITTED BY LOGGED-IN REVIEWER)
const handleGetEvaluations = async (req, res) => {
  try {
    const roundParam = req.params.round;
    const query = { reviewerId: req.user.id };

    if (roundParam && roundParam !== 'all') {
      const roundNum = Number(roundParam);
      if (!isNaN(roundNum)) {
        query.roundNumber = roundNum;
      }
    }

    const evaluations = await Evaluation.find(query).sort({ updatedAt: -1 });
    return res.json({ evaluations });
  } catch (err) {
    console.error('Reviewer get evaluations error:', err);
    return res.status(500).json({ error: 'Failed to fetch evaluations.' });
  }
};

router.get('/evaluations/:round', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleGetEvaluations);
router.get('/evaluations', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleGetEvaluations);
router.get('/:round', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleGetEvaluations);

// 4. ENTER / SUBMIT EVALUATION FOR A TEAM
const handleSubmitEvaluation = async (req, res) => {
  try {
    const { teamId, teamCode, roundNumber, criteriaMarks, comments, status } = req.body;

    if (!teamCode || !roundNumber || !Array.isArray(criteriaMarks) || criteriaMarks.length === 0) {
      return res.status(400).json({ error: 'Missing required evaluation fields (teamCode, roundNumber, criteriaMarks).' });
    }

    const roundNum = Number(roundNumber);
    await ensureRoundsExist();

    // Verify Evaluation Round Criteria
    let roundDoc = await EvaluationRound.findOne({ roundNumber: roundNum });
    const fallbackRound = DEFAULT_ROUNDS.find(r => r.roundNumber === roundNum);
    const roundCriteria = roundDoc?.criteria || fallbackRound?.criteria || [];

    if (roundCriteria.length === 0) {
      return res.status(400).json({ error: `Invalid evaluation round number: ${roundNum}` });
    }

    // Verify & Match Team
    const cleanTeamCode = teamCode.trim().toUpperCase();
    const authTeam = AUTHORIZED_TEAMS.find(t => t.teamId === cleanTeamCode || t.teamName.toUpperCase() === cleanTeamCode);
    let dbTeam = await Team.findOne({ $or: [{ teamId: cleanTeamCode }, { name: cleanTeamCode }, { teamName: cleanTeamCode }] });

    if (!dbTeam && !authTeam) {
      return res.status(404).json({ error: `Team ${cleanTeamCode} not found in database.` });
    }

    const matchedTeamId = dbTeam?._id || teamId || cleanTeamCode;
    const matchedTeamName = authTeam?.teamName || dbTeam?.teamName || dbTeam?.name || cleanTeamCode;

    // Strict Validation & Server-side Total Calculation
    let calculatedTotal = 0;
    const validatedCriteriaMarks = [];

    for (const item of criteriaMarks) {
      const targetCriterion = roundCriteria.find(c => c.key === item.criteriaKey || c.name === item.name);
      const maxAllowed = targetCriterion ? targetCriterion.maxMarks : (item.maxMark || 10);
      const rawMark = Number(item.mark);

      if (isNaN(rawMark) || rawMark < 0) {
        return res.status(400).json({ error: `Mark for '${item.name || item.criteriaKey}' cannot be negative.` });
      }

      if (rawMark > maxAllowed) {
        return res.status(400).json({
          error: `Mark for '${item.name || targetCriterion?.name}' (${rawMark}) exceeds maximum allowed mark (${maxAllowed}).`
        });
      }

      calculatedTotal += rawMark;
      validatedCriteriaMarks.push({
        criteriaKey: item.criteriaKey || targetCriterion?.key || item.name.toLowerCase().replace(/\s+/g, '_'),
        name: targetCriterion?.name || item.name,
        mark: rawMark,
        maxMark: maxAllowed
      });
    }

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

    // Prevent Duplicates / Upsert evaluation for (teamId/teamCode, roundNumber, reviewerId)
    let evaluationDoc = await Evaluation.findOne({
      $or: [
        { teamCode: cleanTeamCode, roundNumber: roundNum, reviewerId },
        { teamId: matchedTeamId, roundNumber: roundNum, reviewerId }
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

      // Update existing evaluation (Admin edit)
      evaluationDoc.criteriaMarks = validatedCriteriaMarks;
      evaluationDoc.totalMarks = calculatedTotal;
      evaluationDoc.comments = comments || evaluationDoc.comments || '';
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
        criteriaMarks: validatedCriteriaMarks,
        totalMarks: calculatedTotal,
        comments: comments || '',
        status: status || 'SUBMITTED',
        submittedAt: new Date()
      });
    }

    await AuditLog.create({
      actor: reviewerUsername,
      role: req.user.role,
      action: 'SUBMIT_EVALUATION',
      target: `Team ${cleanTeamCode} (Round ${roundNum})`,
      metadata: { totalMarks: calculatedTotal, roundNumber: roundNum }
    });

    return res.json({
      message: `Evaluation for Team ${cleanTeamCode} (Round ${roundNum}) saved successfully!`,
      evaluation: evaluationDoc
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
    const { criteriaMarks, comments, status } = req.body;
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

    if (Array.isArray(criteriaMarks)) {
      let calculatedTotal = 0;
      const validated = [];
      for (const item of criteriaMarks) {
        const rawMark = Number(item.mark);
        const maxAllowed = Number(item.maxMark) || 10;

        if (isNaN(rawMark) || rawMark < 0 || rawMark > maxAllowed) {
          return res.status(400).json({ error: `Invalid mark value for ${item.name}` });
        }

        calculatedTotal += rawMark;
        validated.push({
          criteriaKey: item.criteriaKey,
          name: item.name,
          mark: rawMark,
          maxMark: maxAllowed
        });
      }

      evaluationDoc.criteriaMarks = validated;
      evaluationDoc.totalMarks = calculatedTotal;
    }

    if (comments !== undefined) evaluationDoc.comments = comments;
    if (status !== undefined) evaluationDoc.status = status;
    evaluationDoc.submittedAt = new Date();

    await evaluationDoc.save();

    await AuditLog.create({
      actor: req.user.username,
      role: req.user.role,
      action: 'UPDATE_EVALUATION',
      target: `Evaluation ID ${evaluationDoc._id}`
    });

    return res.json({ message: 'Evaluation updated successfully.', evaluation: evaluationDoc });
  } catch (err) {
    console.error('Update evaluation error:', err);
    return res.status(500).json({ error: 'Failed to update evaluation.' });
  }
};

router.put('/evaluations/:id', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleUpdateEvaluation);
router.put('/:id', authenticateToken, requireRole('REVIEWER', 'ADMIN'), handleUpdateEvaluation);

module.exports = router;
