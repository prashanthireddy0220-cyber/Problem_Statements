const assert = require('assert');

const BASE_URL = 'http://localhost:5000';

async function req(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function runE2ETests() {
  console.log('🚀 Starting Comprehensive End-to-End API Tests for Automatic Min-Max Normalization...\n');

  // 1. Authenticate Reviewer 1
  console.log('1. Authenticating Reviewer 1...');
  const rev1Login = await req('/api/reviewer/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'reviewer1', password: 'rev123' })
  });
  assert.strictEqual(rev1Login.status, 200, 'Reviewer 1 login failed');
  const rev1Token = rev1Login.data.token;
  const rev1Id = (rev1Login.data.user && rev1Login.data.user.id) || rev1Login.data.reviewer?._id;
  console.log(`✅ Reviewer 1 logged in. ID: ${rev1Id}`);

  // 2. Authenticate Reviewer 2
  console.log('2. Authenticating Reviewer 2...');
  const rev2Login = await req('/api/reviewer/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'reviewer2', password: 'rev123' })
  });
  assert.strictEqual(rev2Login.status, 200, 'Reviewer 2 login failed');
  const rev2Token = rev2Login.data.token;
  const rev2Id = (rev2Login.data.user && rev2Login.data.user.id) || rev2Login.data.reviewer?._id;
  console.log(`✅ Reviewer 2 logged in. ID: ${rev2Id}`);

  // 3. Authenticate Admin
  console.log('3. Authenticating Admin...');
  const adminLogin = await req('/api/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  assert.strictEqual(adminLogin.status, 200, 'Admin login failed');
  const adminToken = adminLogin.data.token;
  console.log('✅ Admin logged in.');

  // Fetch Teams
  const teamsRes = await req('/api/reviewer/teams', {
    headers: { Authorization: `Bearer ${rev1Token}` }
  });
  const teams = teamsRes.data.teams || teamsRes.data;
  assert(teams.length >= 6, 'Must have at least 6 teams');
  const [teamA, teamB, teamC, teamD, teamE, teamF] = teams;
  console.log(`Using teams: A=${teamA.teamId}, B=${teamB.teamId}, C=${teamC.teamId}, D=${teamD.teamId}, E=${teamE.teamId}, F=${teamF.teamId}`);

  // Ensure Round 1 is Open
  await req('/api/admin/rounds/1/open', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });

  // Reset any preexisting evaluations for isolated test execution
  await req('/api/admin/evaluations/all', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });

  // 4. Test Validation: Reject invalid marks
  console.log('\n4. Testing Mark Validation (0 - 100 bounds)...');
  const invalidTests = [-5, 105, 'invalid', null, undefined];
  for (const inv of invalidTests) {
    const res = await req('/api/reviewer/evaluations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${rev1Token}` },
      body: JSON.stringify({
        teamId: teamA._id,
        roundNumber: 1,
        rawScore: inv
      })
    });
    assert(res.status === 400, `Expected 400 for rawScore: ${inv}, got: ${res.status}`);
    assert(res.data.error.includes('Marks must be between 0 and 100'), `Expected validation message, got: ${res.data.error}`);
  }
  console.log('✅ All invalid mark bounds rejected with "Marks must be between 0 and 100."');

  // 5. Test Section 25 Case 1: Reviewer 1, Round 1 (Team A=82, B=91, C=74, D=65)
  console.log('\n5. Testing Section 25 Case 1: (A=82, B=91, C=74, D=65)...');
  
  // Submit A = 82
  await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev1Token}` },
    body: JSON.stringify({ teamId: teamA._id, roundNumber: 1, rawScore: 82 })
  });
  // Submit B = 91
  await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev1Token}` },
    body: JSON.stringify({ teamId: teamB._id, roundNumber: 1, rawScore: 91 })
  });
  // Submit C = 74
  await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev1Token}` },
    body: JSON.stringify({ teamId: teamC._id, roundNumber: 1, rawScore: 74 })
  });
  // Submit D = 65
  await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev1Token}` },
    body: JSON.stringify({ teamId: teamD._id, roundNumber: 1, rawScore: 65 })
  });

  // Inspect Admin Normalization View for Round 1, Reviewer 1
  let normRes = await req(`/api/admin/normalization/1/${rev1Id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(normRes.status, 200);
  let { minimumScore, maximumScore, evaluations } = normRes.data;

  console.log(`Calculated: MIN=${minimumScore}, MAX=${maximumScore}`);
  assert.strictEqual(minimumScore, 65, 'MIN should be 65');
  assert.strictEqual(maximumScore, 91, 'MAX should be 91');

  const evMap1 = {};
  evaluations.forEach(e => { evMap1[e.teamCode] = e.normalizedScore; });
  console.log('Case 1 Normalized Scores:', evMap1);

  assert.strictEqual(evMap1[teamA.teamId], 65.38, `Expected Team A=65.38, got ${evMap1[teamA.teamId]}`);
  assert.strictEqual(evMap1[teamB.teamId], 100.00, `Expected Team B=100.00, got ${evMap1[teamB.teamId]}`);
  assert.strictEqual(evMap1[teamC.teamId], 34.62, `Expected Team C=34.62, got ${evMap1[teamC.teamId]}`);
  assert.strictEqual(evMap1[teamD.teamId], 0.00, `Expected Team D=0.00, got ${evMap1[teamD.teamId]}`);
  console.log('✅ Section 25 Case 1 verified successfully!');

  // 6. Test Section 25 Case 2: Submit Team E = 60 (New MIN = 60)
  console.log('\n6. Testing Section 25 Case 2: Submit Team E = 60 (New MIN = 60)...');
  await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev1Token}` },
    body: JSON.stringify({ teamId: teamE._id, roundNumber: 1, rawScore: 60 })
  });

  normRes = await req(`/api/admin/normalization/1/${rev1Id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  minimumScore = normRes.data.minimumScore;
  maximumScore = normRes.data.maximumScore;
  evaluations = normRes.data.evaluations;

  console.log(`Calculated: MIN=${minimumScore}, MAX=${maximumScore}`);
  assert.strictEqual(minimumScore, 60, 'MIN should now be 60');
  assert.strictEqual(maximumScore, 91, 'MAX should remain 91');

  const evMap2 = {};
  evaluations.forEach(e => { evMap2[e.teamCode] = e.normalizedScore; });
  console.log('Case 2 Recalculated Scores:', evMap2);

  assert.strictEqual(evMap2[teamA.teamId], 70.97, `Expected Team A=70.97, got ${evMap2[teamA.teamId]}`);
  assert.strictEqual(evMap2[teamB.teamId], 100.00, `Expected Team B=100.00, got ${evMap2[teamB.teamId]}`);
  assert.strictEqual(evMap2[teamC.teamId], 45.16, `Expected Team C=45.16, got ${evMap2[teamC.teamId]}`);
  assert.strictEqual(evMap2[teamD.teamId], 16.13, `Expected Team D=16.13, got ${evMap2[teamD.teamId]}`);
  assert.strictEqual(evMap2[teamE.teamId], 0.00, `Expected Team E=0.00, got ${evMap2[teamE.teamId]}`);
  console.log('✅ Section 25 Case 2 (Dynamic Recalculation on New Minimum) verified successfully!');

  // 7. Test Section 25 Case 3: Submit Team F = 98 (New MAX = 98)
  console.log('\n7. Testing Section 25 Case 3: Submit Team F = 98 (New MAX = 98)...');
  await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev1Token}` },
    body: JSON.stringify({ teamId: teamF._id, roundNumber: 1, rawScore: 98 })
  });

  normRes = await req(`/api/admin/normalization/1/${rev1Id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(normRes.data.minimumScore, 60, 'MIN should remain 60');
  assert.strictEqual(normRes.data.maximumScore, 98, 'MAX should now be 98');
  console.log('✅ Section 25 Case 3 (New Maximum = 98) verified successfully!');

  // 8. Test Section 25 Case 4: MIN = MAX Special Case (Reviewer 2, Round 2)
  console.log('\n8. Testing Section 25 Case 4: MIN = MAX Special Case (R2, Reviewer 2)...');
  await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev2Token}` },
    body: JSON.stringify({ teamId: teamA._id, roundNumber: 2, rawScore: 80 })
  });
  await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev2Token}` },
    body: JSON.stringify({ teamId: teamB._id, roundNumber: 2, rawScore: 80 })
  });
  await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev2Token}` },
    body: JSON.stringify({ teamId: teamC._id, roundNumber: 2, rawScore: 80 })
  });

  normRes = await req(`/api/admin/normalization/2/${rev2Id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(normRes.data.minimumScore, 80);
  assert.strictEqual(normRes.data.maximumScore, 80);
  normRes.data.evaluations.forEach(e => {
    assert.strictEqual(e.normalizedScore, 100.00, `Expected 100.00 for MIN=MAX, got ${e.normalizedScore}`);
  });
  console.log('✅ MIN = MAX verified: all 3 teams scored 100.00 without division by zero.');

  // Submit Team D = 60 to break MIN=MAX
  console.log('Submitting Team D = 60 to break MIN=MAX...');
  await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev2Token}` },
    body: JSON.stringify({ teamId: teamD._id, roundNumber: 2, rawScore: 60 })
  });

  normRes = await req(`/api/admin/normalization/2/${rev2Id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(normRes.data.minimumScore, 60);
  assert.strictEqual(normRes.data.maximumScore, 80);
  const evMapBreak = {};
  normRes.data.evaluations.forEach(e => { evMapBreak[e.teamCode] = e.normalizedScore; });
  assert.strictEqual(evMapBreak[teamA.teamId], 100.00);
  assert.strictEqual(evMapBreak[teamB.teamId], 100.00);
  assert.strictEqual(evMapBreak[teamC.teamId], 100.00);
  assert.strictEqual(evMapBreak[teamD.teamId], 0.00);
  console.log('✅ Successfully transitioned from MIN=MAX to standard formula!');

  // 9. Reviewer Privacy Verification (Section 13)
  console.log('\n9. Testing Reviewer Privacy (Section 13)...');
  const rev1Evs = await req('/api/reviewer/evaluations', {
    headers: { Authorization: `Bearer ${rev1Token}` }
  });
  assert.strictEqual(rev1Evs.status, 200);
  for (const ev of rev1Evs.data.evaluations) {
    // Reviewer must NOT see minScore, maxScore, or normalizedScore
    assert.strictEqual(ev.minimumReviewerScore, undefined, 'Reviewer should not see minimumReviewerScore');
    assert.strictEqual(ev.maximumReviewerScore, undefined, 'Reviewer should not see maximumReviewerScore');
    assert.strictEqual(ev.normalizedScore, undefined, 'Reviewer should not see normalizedScore');
    // Reviewer should only see their own evaluations
    assert.strictEqual(String(ev.reviewerId), String(rev1Id), 'Reviewer should not see other reviewers evaluations');
  }
  console.log('✅ Reviewer Privacy verified: Reviewer sees only own raw scores; MIN, MAX, and normalized scores are hidden.');

  // 10. Admin Score Correction (Section 10)
  console.log('\n10. Testing Admin Score Correction...');
  const correctionRes = await req('/api/admin/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      teamId: teamA._id,
      roundNumber: 1,
      reviewerId: rev1Id,
      rawScore: 95,
      comments: 'Correcting after administrative review'
    })
  });
  assert.strictEqual(correctionRes.status, 200);
  console.log('✅ Admin score correction executed successfully.');

  // Verify recalculation after correction
  normRes = await req(`/api/admin/normalization/1/${rev1Id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const correctedA = normRes.data.evaluations.find(e => e.teamCode === teamA.teamId);
  assert.strictEqual(correctedA.rawScore, 95);
  console.log(`✅ Corrected Team A rawScore=95, new MAX=${normRes.data.maximumScore}, new Normalized=${correctedA.normalizedScore}`);

  // 11. Round Closure / Freeze (Section 21)
  console.log('\n11. Testing Round Closure / Freeze (Section 21)...');
  const closeRes = await req('/api/admin/rounds/1/close', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(closeRes.status, 200);
  assert.strictEqual(closeRes.data.round.status, 'CLOSED');
  console.log('✅ Round 1 closed and frozen.');

  // Attempt submission during closed round
  const submitWhileClosed = await req('/api/reviewer/evaluations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rev1Token}` },
    body: JSON.stringify({ teamId: teams[10]._id, roundNumber: 1, rawScore: 85 })
  });
  assert.strictEqual(submitWhileClosed.status, 403);
  assert(submitWhileClosed.data?.error && (submitWhileClosed.data.error.includes('closed') || submitWhileClosed.data.error.includes('frozen')), 'Should reject submission when round is closed');
  console.log('✅ Submissions rejected when round is closed.');

  // Reopen Round 1
  const openRes = await req('/api/admin/rounds/1/open', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(openRes.status, 200);
  assert.strictEqual(openRes.data.round.status, 'ACTIVE');
  console.log('✅ Round 1 successfully reopened.');

  // 12. Leaderboard Authority Verification (Section 15, 17)
  console.log('\n12. Testing Authoritative Leaderboard...');
  const lbRes = await req('/api/admin/leaderboard', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(lbRes.status, 200);
  const leaderboard = lbRes.data.leaderboard;
  assert(leaderboard.length > 0, 'Leaderboard should have teams');
  console.log(`Leaderboard top team: Rank #${leaderboard[0].rank} ${leaderboard[0].teamCode} Total: ${leaderboard[0].combinedTotal}`);
  // Check descending order of scores
  for (let i = 0; i < leaderboard.length - 1; i++) {
    assert(leaderboard[i].combinedTotal >= leaderboard[i + 1].combinedTotal, 'Leaderboard must be sorted descending by combinedTotal');
  }
  console.log('✅ Leaderboard is strictly ranked by combined normalized total.');

  console.log('\n=======================================================');
  console.log('🎉 ALL 12 END-TO-END NORMALIZATION TEST SUITES PASSED! 🎉');
  console.log('=======================================================');
}

runE2ETests().catch(err => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
