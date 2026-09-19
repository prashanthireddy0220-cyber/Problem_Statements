const express = require('express');
const router = express.Router();
const config = require('../config/env');
const { ProblemStatement, Team, TeamLead, ProblemSelection, SystemSettings, AuditLog } = require('../models/Schema');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Helper function to update and compute system timer phase dynamically
async function getOrUpdateSystemState() {
  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = await SystemSettings.create({
      readingDurationMinutes: config.READING_DURATION_MINUTES,
      selectionDurationMinutes: config.SELECTION_DURATION_MINUTES,
      currentPhase: 'NOT_STARTED'
    });
  }

  const now = new Date();

  // Phase transition logic
  if (settings.currentPhase === 'READING' && settings.readingEndsAt) {
    if (now >= new Date(settings.readingEndsAt)) {
      // Reading phase ended -> Automatically start Selection phase
      const selStart = new Date(settings.readingEndsAt);
      const selEnd = new Date(selStart.getTime() + settings.selectionDurationMinutes * 60 * 1000);
      settings.currentPhase = 'SELECTION';
      settings.selectionStartedAt = selStart;
      settings.selectionEndsAt = selEnd;
      await settings.save();

      await AuditLog.create({
        actor: 'SYSTEM',
        role: 'SYSTEM',
        action: 'PHASE_TRANSITION',
        target: 'SELECTION',
        metadata: { readingEndedAt: settings.readingEndsAt, selectionEndsAt: selEnd }
      });
    }
  }

  if (settings.currentPhase === 'SELECTION' && settings.selectionEndsAt) {
    if (now >= new Date(settings.selectionEndsAt)) {
      // Selection phase ended -> Automatically transition to CLOSED
      settings.currentPhase = 'CLOSED';
      await settings.save();

      await AuditLog.create({
        actor: 'SYSTEM',
        role: 'SYSTEM',
        action: 'PHASE_TRANSITION',
        target: 'CLOSED'
      });
    }
  }

  // Calculate remaining seconds
  let readingTimeRemainingSeconds = 0;
  let selectionTimeRemainingSeconds = 0;

  if (settings.currentPhase === 'READING' && settings.readingEndsAt) {
    readingTimeRemainingSeconds = Math.max(0, Math.floor((new Date(settings.readingEndsAt) - now) / 1000));
  } else if (settings.currentPhase === 'SELECTION' && settings.selectionEndsAt) {
    selectionTimeRemainingSeconds = Math.max(0, Math.floor((new Date(settings.selectionEndsAt) - now) / 1000));
  }

  return {
    settings,
    serverTime: now,
    currentPhase: settings.currentPhase,
    readingTimeRemainingSeconds,
    selectionTimeRemainingSeconds,
    readingStartedAt: settings.readingStartedAt,
    readingEndsAt: settings.readingEndsAt,
    selectionStartedAt: settings.selectionStartedAt,
    selectionEndsAt: settings.selectionEndsAt,
    problemSelectionEnabled: settings.problemSelectionEnabled
  };
}

// 1. GET SYSTEM TIMER STATE (Public / Authenticated)
router.get('/timer-state', async (req, res) => {
  try {
    const state = await getOrUpdateSystemState();
    return res.json(state);
  } catch (err) {
    console.error('Timer state error:', err);
    return res.status(500).json({ error: 'Failed to fetch timer state.' });
  }
});

// 2. GET LIST OF PROBLEM STATEMENTS
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { domain, search, difficulty } = req.query;
    let query = { status: 'PUBLISHED' };

    if (domain && domain !== 'ALL') {
      query.domain = domain;
    }
    if (difficulty && difficulty !== 'ALL') {
      query.difficulty = difficulty;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { problemId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const problems = await ProblemStatement.find(query).sort({ problemId: 1 });
    const state = await getOrUpdateSystemState();

    return res.json({
      problems,
      phase: state.currentPhase,
      timerState: state
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch problem statements.' });
  }
});

// 3. GET SINGLE PROBLEM DETAILS
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const problem = await ProblemStatement.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem statement not found.' });
    }
    return res.json({ problem });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch problem details.' });
  }
});

// 4. SELECT A PROBLEM STATEMENT (Team Lead Only - Atomic Race-Condition Protected)
router.post('/select', authenticateToken, requireRole('TEAM_LEAD'), async (req, res) => {
  try {
    const { problemId } = req.body;
    if (!problemId) {
      return res.status(400).json({ error: 'Problem Statement ID is required.' });
    }

    // A. Check Master System Access & State
    const state = await getOrUpdateSystemState();
    if (!state.problemSelectionEnabled) {
      return res.status(403).json({ error: 'Problem selection is currently disabled by the administrator.' });
    }

    if (state.currentPhase === 'NOT_STARTED') {
      return res.status(400).json({ error: 'Problem selection session has not been started yet.' });
    }

    if (state.currentPhase === 'READING') {
      return res.status(400).json({
        error: 'Problem selection is locked during the reading phase. Please wait until the selection period opens.',
        code: 'READING_PHASE_ACTIVE'
      });
    }

    if (state.currentPhase === 'CLOSED') {
      return res.status(400).json({ error: 'Problem selection period has closed.', code: 'SELECTION_CLOSED' });
    }

    // B. Check Team Lead & Team Record
    const teamLead = await TeamLead.findOne({ registrationNumber: req.user.registrationNumber }).populate('teamId');
    if (!teamLead || !teamLead.teamId) {
      return res.status(400).json({ error: 'Team record not found for this team lead.' });
    }

    const team = teamLead.teamId;

    if (team.selectionConfirmed) {
      return res.status(400).json({
        error: 'Your team has already confirmed a problem statement selection.',
        code: 'ALREADY_SELECTED',
        selectedProblemCode: team.selectedProblemCode
      });
    }

    // C. Find Target Problem Statement
    const problem = await ProblemStatement.findById(problemId);
    if (!problem || problem.status !== 'PUBLISHED') {
      return res.status(404).json({ error: 'Selected problem statement is unavailable or unpublished.' });
    }

    if (problem.selectedCount >= problem.maxTeamCapacity) {
      return res.status(400).json({
        error: `Problem statement ${problem.problemId} is FULL (${problem.selectedCount}/${problem.maxTeamCapacity} teams). Please select another problem.`,
        code: 'PROBLEM_FULL'
      });
    }

    // D. CRITICAL ATOMIC TRANSACTION / CONDITIONAL UPDATE (Prevents Concurrent Overbooking)
    const updatedProblem = await ProblemStatement.findOneAndUpdate(
      {
        _id: problem._id,
        status: 'PUBLISHED',
        selectedCount: { $lt: problem.maxTeamCapacity } // Atomic condition check
      },
      { $inc: { selectedCount: 1 } },
      { new: true }
    );

    if (!updatedProblem) {
      // Race condition occurred: Another team claimed the last slot just milliseconds ago
      return res.status(400).json({
        error: `Problem statement ${problem.problemId} was just filled by another team. Please choose another problem.`,
        code: 'PROBLEM_FULL'
      });
    }

    // E. Lock Team Selection
    team.selectedProblemId = updatedProblem._id;
    team.selectedProblemCode = updatedProblem.problemId;
    team.selectionConfirmed = true;
    team.selectedAt = new Date();
    await team.save();

    // F. Record Problem Selection Log
    const selectionRecord = await ProblemSelection.create({
      teamId: team._id,
      teamLeadRegNum: req.user.registrationNumber,
      problemStatementId: updatedProblem._id,
      selectedAt: new Date(),
      status: 'CONFIRMED'
    });

    // G. Audit Log Entry
    await AuditLog.create({
      actor: req.user.registrationNumber,
      role: 'TEAM_LEAD',
      action: 'SELECT_PROBLEM',
      target: updatedProblem.problemId,
      metadata: { teamName: team.name, problemTitle: updatedProblem.title }
    });

    return res.json({
      message: 'Problem statement selected and locked successfully!',
      selection: {
        teamName: team.name,
        problemId: updatedProblem.problemId,
        problemTitle: updatedProblem.title,
        domain: updatedProblem.domain,
        selectedAt: team.selectedAt,
        status: 'CONFIRMED'
      }
    });
  } catch (err) {
    console.error('Problem selection error:', err);
    return res.status(500).json({ error: 'Server error during problem selection.' });
  }
});

// 5. ADMIN: CREATE PROBLEM STATEMENT
router.post('/admin/create', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const {
      problemId, title, description, background, expectedSolution,
      requirements, constraints, domain, difficulty, technologies,
      maxTeamCapacity, pdfUrl, status
    } = req.body;

    if (!problemId || !title || !description) {
      return res.status(400).json({ error: 'Problem ID, Title, and Description are required.' });
    }

    const existing = await ProblemStatement.findOne({ problemId: problemId.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ error: `Problem ID '${problemId}' already exists.` });
    }

    const newProblem = await ProblemStatement.create({
      problemId: problemId.trim().toUpperCase(),
      title,
      description,
      background: background || '',
      expectedSolution: expectedSolution || '',
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n') : []),
      constraints: Array.isArray(constraints) ? constraints : (constraints ? constraints.split('\n') : []),
      domain: domain || 'General',
      difficulty: difficulty || 'Medium',
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',') : []),
      maxTeamCapacity: Number(maxTeamCapacity) || 5,
      pdfUrl: pdfUrl || '',
      status: status || 'PUBLISHED'
    });

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'CREATE_PROBLEM',
      target: newProblem.problemId
    });

    return res.status(201).json({ message: 'Problem statement created successfully.', problem: newProblem });
  } catch (err) {
    console.error('Create problem error:', err);
    return res.status(500).json({ error: 'Failed to create problem statement.' });
  }
});

// 6. ADMIN: UPDATE PROBLEM STATEMENT
router.put('/admin/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const problem = await ProblemStatement.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem statement not found.' });
    }

    const fields = ['title', 'description', 'background', 'expectedSolution', 'domain', 'difficulty', 'maxTeamCapacity', 'pdfUrl', 'status'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        problem[field] = req.body[field];
      }
    });

    if (req.body.requirements) {
      problem.requirements = Array.isArray(req.body.requirements) ? req.body.requirements : req.body.requirements.split('\n');
    }
    if (req.body.constraints) {
      problem.constraints = Array.isArray(req.body.constraints) ? req.body.constraints : req.body.constraints.split('\n');
    }
    if (req.body.technologies) {
      problem.technologies = Array.isArray(req.body.technologies) ? req.body.technologies : req.body.technologies.split(',');
    }

    await problem.save();

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'UPDATE_PROBLEM',
      target: problem.problemId
    });

    return res.json({ message: 'Problem statement updated successfully.', problem });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update problem statement.' });
  }
});

// 7. ADMIN: DELETE PROBLEM STATEMENT
router.delete('/admin/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const problem = await ProblemStatement.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem statement not found.' });
    }

    if (problem.selectedCount > 0) {
      return res.status(400).json({ error: `Cannot delete problem '${problem.problemId}' because ${problem.selectedCount} team(s) have selected it.` });
    }

    await ProblemStatement.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      actor: req.user.username,
      role: 'ADMIN',
      action: 'DELETE_PROBLEM',
      target: problem.problemId
    });

    return res.json({ message: 'Problem statement deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete problem statement.' });
  }
});

module.exports = router;
