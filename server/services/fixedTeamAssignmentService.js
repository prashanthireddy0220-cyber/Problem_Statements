const { ProblemStatement, Team, ProblemSelection } = require('../models/Schema');
const problemStatementsData = require('../data/problemStatements');
const fixedData = require('../data/fixed_team_problem_statements.json');
const teamsData = require('../data/teamsData');

async function syncFixedTeamProblemStatements() {
  console.log('🔄 Initiating Complete Synchronization of Fixed Problem Statements & Team Assignments...');

  const validProblemIds = problemStatementsData.map(p => p.problemId);

  // 1. Remove all old/extra problem statements not in PS-001 to PS-040 from database
  const removeResult = await ProblemStatement.deleteMany({ problemId: { $nin: validProblemIds } });
  if (removeResult.deletedCount > 0) {
    console.log(`🧹 Removed ${removeResult.deletedCount} outdated problem statement(s) not in PS-001..PS-040.`);
  }

  // 2. Upsert all 40 problem statements
  const bulkOps = problemStatementsData.map(p => ({
    updateOne: {
      filter: { problemId: p.problemId },
      update: {
        $set: {
          title: p.title,
          description: p.description,
          background: p.background,
          expectedSolution: p.expectedSolution,
          requirements: p.requirements,
          constraints: p.constraints,
          domain: p.domain,
          difficulty: p.difficulty || 'Medium',
          technologies: p.technologies,
          maxTeamCapacity: 2,
          assignedTeams: p.assignedTeams || [],
          status: 'PUBLISHED'
        }
      },
      upsert: true
    }
  }));
  await ProblemStatement.bulkWrite(bulkOps);
  console.log(`✅ Upserted all ${problemStatementsData.length} problem statements.`);

  // 3. Map problemId to MongoDB Document ID
  const allProblemsInDb = await ProblemStatement.find({ problemId: { $in: validProblemIds } });
  const problemIdToDoc = {};
  for (const p of allProblemsInDb) {
    problemIdToDoc[p.problemId] = p;
  }

  // 4. Map each team to its pre-assigned problem statement
  const assignmentMap = {};
  for (const t of fixedData.teams) {
    assignmentMap[t.team_id] = t.problem_statement_id;
  }

  let assignedTeamsCount = 0;
  for (const teamItem of teamsData) {
    const assignedProblemCode = assignmentMap[teamItem.teamId] || teamItem.fixedProblemStatementId;
    if (!assignedProblemCode) continue;

    const pDoc = problemIdToDoc[assignedProblemCode];
    const pDocId = pDoc ? pDoc._id : null;

    let teamDoc = await Team.findOne({
      $or: [
        { teamId: teamItem.teamId },
        { name: teamItem.teamId }
      ]
    });

    if (!teamDoc) {
      teamDoc = await Team.create({
        name: teamItem.teamId,
        teamId: teamItem.teamId,
        teamName: teamItem.teamName || teamItem.teamId,
        teamLeadRegNum: teamItem.regNum,
        college: 'KARE',
        department: 'CSE',
        members: teamItem.members || [],
        teamQrToken: `TQ-${teamItem.teamId}-${teamItem.regNum.slice(-4)}`,
        eventPassQrToken: `EP-${teamItem.teamId}-${teamItem.regNum.slice(-4)}`,
        registrationStatus: 'CONFIRMED',
        eventPassStatus: 'ISSUED',
        selectedProblemCode: assignedProblemCode,
        selectedProblemId: pDocId,
        selectionConfirmed: true,
        selectedAt: new Date()
      });
    } else {
      teamDoc.selectedProblemCode = assignedProblemCode;
      teamDoc.selectedProblemId = pDocId;
      teamDoc.selectionConfirmed = true;
      if (!teamDoc.selectedAt) teamDoc.selectedAt = new Date();
      await teamDoc.save();
    }

    if (pDocId) {
      await ProblemSelection.findOneAndUpdate(
        { teamId: teamDoc._id },
        {
          teamId: teamDoc._id,
          teamLeadRegNum: teamDoc.teamLeadRegNum || teamItem.regNum,
          problemStatementId: pDocId,
          status: 'CONFIRMED',
          selectedAt: teamDoc.selectedAt || new Date()
        },
        { upsert: true, new: true }
      );
    }
    assignedTeamsCount++;
  }
  console.log(`✅ Permanently fixed and assigned problem statements for all ${assignedTeamsCount} teams.`);

  // 5. Synchronize selectedCount and assignedTeams for each problem statement based on confirmed assignments
  for (const p of problemStatementsData) {
    const activeTeams = await Team.find({
      selectedProblemCode: p.problemId,
      selectionConfirmed: true
    }).select('teamId name');
    const assignedTeamIds = activeTeams.map(t => t.teamId || t.name);
    const resolvedTeams = assignedTeamIds.length > 0 ? assignedTeamIds : (p.assignedTeams || []);

    await ProblemStatement.updateOne(
      { problemId: p.problemId },
      { 
        $set: { 
          selectedCount: resolvedTeams.length,
          assignedTeams: resolvedTeams 
        } 
      }
    );
  }

  const finalTotal = await ProblemStatement.countDocuments();
  console.log(`🎉 Fixed Problem Statements & Team Assignments Complete: Exactly ${finalTotal} statements in DB, all teams assigned.`);

  return {
    totalProblems: finalTotal,
    assignedTeamsCount,
    deletedOldProblems: removeResult.deletedCount
  };
}

module.exports = {
  syncFixedTeamProblemStatements
};
