const mongoose = require('mongoose');
const { Evaluation, RoundReviewerNormalization, Team, EvaluationRound } = require('../models/Schema');
const AUTHORIZED_TEAMS = require('../data/teamsData');

/**
 * Validates that raw score is between 0 and 100 inclusive.
 * Reject: negative numbers, values above 100, NaN, null, undefined, empty values, non-numeric values.
 * Error display message: "Marks must be between 0 and 100."
 */
function validateRawScore(rawScore) {
  if (rawScore === undefined || rawScore === null || rawScore === '') {
    throw new Error('Marks must be between 0 and 100.');
  }
  if (typeof rawScore === 'boolean') {
    throw new Error('Marks must be between 0 and 100.');
  }
  const num = Number(rawScore);
  if (isNaN(num)) {
    throw new Error('Marks must be between 0 and 100.');
  }
  if (num < 0 || num > 100) {
    throw new Error('Marks must be between 0 and 100.');
  }
  return num;
}

/**
 * Exact Min-Max Normalization Formula:
 * ((rawScore - minScore) / (maxScore - minScore)) * 100
 * Special case: If minScore === maxScore, normalizedScore = 100.
 */
function calculateNormalizedScore(rawScore, minScore, maxScore) {
  if (minScore === maxScore) {
    return 100;
  }
  const normalized = ((rawScore - minScore) / (maxScore - minScore)) * 100;
  return Number(normalized.toFixed(2));
}

/**
 * Recalculates Min, Max, and ALL normalized marks for a given (roundNumber, reviewerId).
 * This guarantees no team's normalized score remains stale when MIN or MAX changes.
 */
async function recalculateRoundReviewerNormalization(roundNumber, reviewerId) {
  const roundNum = Number(roundNumber);
  if (isNaN(roundNum)) {
    throw new Error('Invalid round number.');
  }

  // Find all evaluations for this specific round and reviewer
  // Handle reviewerId comparison whether stored as ObjectId or string
  const revQueries = [{ reviewerId: reviewerId }, { reviewerId: String(reviewerId) }];
  if (mongoose.Types.ObjectId.isValid(reviewerId)) {
    revQueries.push({ reviewerId: new mongoose.Types.ObjectId(reviewerId) });
  }

  const evaluations = await Evaluation.find({
    roundNumber: roundNum,
    $or: revQueries
  });

  if (!evaluations || evaluations.length === 0) {
    return {
      roundNumber: roundNum,
      reviewerId,
      minScore: 0,
      maxScore: 0,
      count: 0,
      updatedEvaluations: []
    };
  }

  // Extract all valid raw scores
  const validScores = evaluations
    .map(e => Number(e.rawScore))
    .filter(s => !isNaN(s) && s >= 0 && s <= 100);

  if (validScores.length === 0) {
    return {
      roundNumber: roundNum,
      reviewerId,
      minScore: 0,
      maxScore: 0,
      count: 0,
      updatedEvaluations: []
    };
  }

  const minScore = Math.min(...validScores);
  const maxScore = Math.max(...validScores);
  const now = new Date();

  // Recalculate normalized score for EVERY evaluation document
  for (const ev of evaluations) {
    ev.minimumReviewerScore = minScore;
    ev.maximumReviewerScore = maxScore;
    if (ev.adminModified) {
      // Direct Admin Mark: DO NOT normalize when admin changes the marks
      ev.normalizedScore = Number(ev.rawScore);
    } else {
      const norm = calculateNormalizedScore(Number(ev.rawScore), minScore, maxScore);
      ev.normalizedScore = norm;
    }
    ev.calculatedAt = now;
    await ev.save();
  }

  // Upsert RoundReviewerNormalization summary metadata
  const firstEv = evaluations[0];
  await RoundReviewerNormalization.findOneAndUpdate(
    {
      roundNumber: roundNum,
      $or: revQueries
    },
    {
      $set: {
        roundNumber: roundNum,
        reviewerId: reviewerId,
        reviewerUsername: firstEv?.reviewerUsername || '',
        reviewerName: firstEv?.reviewerName || '',
        minimumScore: minScore,
        maximumScore: maxScore,
        totalEvaluated: evaluations.length,
        calculatedAt: now
      }
    },
    { upsert: true, new: true }
  );

  return {
    roundNumber: roundNum,
    reviewerId,
    reviewerUsername: firstEv?.reviewerUsername || '',
    reviewerName: firstEv?.reviewerName || '',
    minScore,
    maxScore,
    count: evaluations.length,
    updatedEvaluations: evaluations
  };
}

/**
 * Calculates authoritative team leaderboard with normalized scores.
 * Per round tally = average of submitted reviewer normalized scores (or (R1 + R2 + R3) / 3).
 * Combined Total = Round 1 Tally + Round 2 Tally + Round 3 Tally (Max 300).
 */
async function getLeaderboardData() {
  const [evaluations, dbTeams] = await Promise.all([
    Evaluation.find().sort({ roundNumber: 1, teamCode: 1 }),
    Team.find()
  ]);

  const leaderboard = AUTHORIZED_TEAMS.map((item) => {
    const teamCode = item.teamId;
    const teamName = item.teamName || item.teamId;
    const dbTeam = dbTeams.find(t => t.name === teamCode || t.teamId === teamCode || t.teamLeadRegNum === item.regNum);

    // Get evaluations for each round
    const teamEvaluations = evaluations.filter(e => 
      e.teamCode === teamCode || 
      (dbTeam && e.teamId && String(e.teamId) === String(dbTeam._id))
    );

    // Round details & tallies
    const roundsData = {};
    let combinedTotal = 0;
    let roundsEvaluatedCount = 0;

    [1, 2, 3].forEach(rNum => {
      const rEvs = teamEvaluations.filter(e => e.roundNumber === rNum);
      if (rEvs.length > 0) {
        // Collect normalized scores from all reviewers who evaluated this team in this round
        // If admin modified the score, use rawScore directly without normalization
        const normScores = rEvs.map(e => (e.adminModified ? Number(e.rawScore) : (Number(e.normalizedScore) !== undefined ? Number(e.normalizedScore) : Number(e.rawScore))));
        const rawScores = rEvs.map(e => Number(e.rawScore) || 0);

        // Final round tally = average of reviewer normalized scores
        const roundNormalizedTally = Number((normScores.reduce((sum, val) => sum + val, 0) / normScores.length).toFixed(2));
        
        roundsData[rNum] = {
          roundNumber: rNum,
          evaluated: true,
          reviewersCount: rEvs.length,
          normalizedTally: roundNormalizedTally,
          rawTally: Number((rawScores.reduce((sum, val) => sum + val, 0) / rawScores.length).toFixed(2)),
          reviewersBreakdown: rEvs.map(e => ({
            _id: e._id,
            reviewerId: e.reviewerId,
            reviewerName: e.reviewerName,
            reviewerUsername: e.reviewerUsername,
            rawScore: e.rawScore,
            minimumScore: e.minimumReviewerScore,
            maximumScore: e.maximumReviewerScore,
            normalizedScore: e.adminModified ? e.rawScore : e.normalizedScore,
            adminModified: Boolean(e.adminModified),
            submittedAt: e.submittedAt
          }))
        };

        combinedTotal += roundNormalizedTally;
        roundsEvaluatedCount++;
      } else {
        roundsData[rNum] = {
          roundNumber: rNum,
          evaluated: false,
          reviewersCount: 0,
          normalizedTally: null,
          rawTally: null,
          reviewersBreakdown: []
        };
      }
    });

    combinedTotal = Number(combinedTotal.toFixed(2));

    return {
      teamId: teamCode,
      teamCode: teamCode,
      teamName: teamName,
      leadName: item.leadName || '',
      college: dbTeam?.college || 'KARE',
      department: dbTeam?.department || 'CSE',
      selectedProblemCode: dbTeam?.selectedProblemCode || 'Not Selected',
      rounds: roundsData,
      round1Score: roundsData[1]?.normalizedTally,
      round2Score: roundsData[2]?.normalizedTally,
      round3Score: roundsData[3]?.normalizedTally,
      combinedTotal: combinedTotal,
      roundsEvaluatedCount: roundsEvaluatedCount,
      hasEvaluations: roundsEvaluatedCount > 0
    };
  });

  // Sort descending by Combined Total Normalized Score, with tiebreakers on R3, R2, R1
  leaderboard.sort((a, b) => {
    if (b.combinedTotal !== a.combinedTotal) {
      return b.combinedTotal - a.combinedTotal;
    }
    const bR3 = b.round3Score || 0;
    const aR3 = a.round3Score || 0;
    if (bR3 !== aR3) return bR3 - aR3;
    const bR2 = b.round2Score || 0;
    const aR2 = a.round2Score || 0;
    if (bR2 !== aR2) return bR2 - aR2;
    const bR1 = b.round1Score || 0;
    const aR1 = a.round1Score || 0;
    return bR1 - aR1;
  });

  // Assign ranks
  let currentRank = 1;
  for (let i = 0; i < leaderboard.length; i++) {
    if (i > 0 && leaderboard[i].combinedTotal < leaderboard[i - 1].combinedTotal) {
      currentRank = i + 1;
    }
    leaderboard[i].rank = leaderboard[i].hasEvaluations ? currentRank : '-';
  }

  return leaderboard;
}

module.exports = {
  validateRawScore,
  calculateNormalizedScore,
  recalculateRoundReviewerNormalization,
  getLeaderboardData
};
