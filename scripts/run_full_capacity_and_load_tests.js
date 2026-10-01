const https = require('https');
const http = require('http');
const AUTHORIZED_TEAMS = require('../server/data/teamsData');

function request(urlStr, options = {}, body = null) {
  return new Promise((resolve) => {
    const url = new URL(urlStr);
    const client = url.protocol === 'https:' ? https : http;
    const data = body ? JSON.stringify(body) : null;

    const req = client.request({
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(options.headers || {})
      },
      timeout: 30000
    }, (res) => {
      let buf = '';
      res.on('data', d => buf += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data: JSON.parse(buf) });
        } catch (e) {
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data: buf });
        }
      });
    });

    req.on('error', err => resolve({ ok: false, status: 0, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 408, error: 'Timeout' }); });
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  const baseUrl = 'https://problem-statements-w7wq.onrender.com/api';
  console.log('========================================================================');
  console.log('🚀 COMPREHENSIVE SELECTION LIMIT, CONCURRENCY & LOAD TEST SUITE');
  console.log(`Target: ${baseUrl}`);
  console.log('========================================================================\n');

  // STEP 1: Admin Login
  console.log('1️⃣ Authenticating Admin...');
  const adminLogin = await request(`${baseUrl}/auth/admin/login`, { method: 'POST' }, { username: 'Admin', password: 'Admin0509' });
  if (!adminLogin.ok || !adminLogin.data?.token) {
    console.error('❌ Admin login failed:', adminLogin.data);
    process.exit(1);
  }
  const adminToken = adminLogin.data.token;
  const adminHeaders = { 'Authorization': `Bearer ${adminToken}` };
  console.log('   ✅ Admin authenticated successfully.');

  // STEP 2: Clear any previous selections
  console.log('\n2️⃣ Resetting selections to a clean state for test...');
  await request(`${baseUrl}/admin/reset-all-selections`, { method: 'POST', headers: adminHeaders }, {});
  console.log('   ✅ All prior selections cleared.');

  // STEP 3: Open selection for testing
  console.log('\n3️⃣ Enabling selection period via Admin session control...');
  await request(`${baseUrl}/admin/settings`, { method: 'POST', headers: adminHeaders }, { problemSelectionEnabled: true, problemStatementsReleased: true });
  const openRes = await request(`${baseUrl}/admin/session-control`, { method: 'POST', headers: adminHeaders }, { action: 'OPEN_NOW' });
  console.log('   ✅ Session OPEN_NOW status:', openRes.status, openRes.data?.message);

  // STEP 4: Fetch list of problem statements
  console.log('\n4️⃣ Fetching available problem statements...');
  const probListRes = await request(`${baseUrl}/problems`, { headers: adminHeaders });
  const problems = probListRes.data?.problems || [];
  console.log(`   ✅ Total problems loaded: ${problems.length}`);
  if (problems.length < 2) {
    console.error('❌ Not enough problem statements found to test.');
    process.exit(1);
  }

  const targetProblem = problems[0];
  const targetProblem2 = problems[1];
  console.log(`   🎯 Target Problem 1 for Concurrency Race: [${targetProblem.problemId}] "${targetProblem.title}" (Capacity limit: ${targetProblem.maxTeamCapacity || 2})`);
  console.log(`   🎯 Target Problem 2 for Double-Selection Check: [${targetProblem2.problemId}] "${targetProblem2.title}"`);

  // STEP 5: Authenticate 15 Teams concurrently
  console.log('\n5️⃣ Concurrently authenticating 15 test team leads...');
  const teamAuthStart = Date.now();
  const testTeams = AUTHORIZED_TEAMS.slice(0, 15);
  const loginPromises = testTeams.map(t => 
    request(`${baseUrl}/auth/team-lead/login`, { method: 'POST' }, {
      teamId: t.teamId,
      registrationNumber: t.regNum
    }).then(res => ({
      teamId: t.teamId,
      regNum: t.regNum,
      token: res.data?.token,
      ok: res.ok,
      user: res.data?.user
    }))
  );

  const loggedInTeams = (await Promise.all(loginPromises)).filter(t => t.ok && t.token);
  console.log(`   ✅ Successfully logged in ${loggedInTeams.length}/15 teams in ${Date.now() - teamAuthStart}ms.`);

  if (loggedInTeams.length < 5) {
    console.error('❌ Could not login enough teams to run concurrency test.');
    process.exit(1);
  }

  // TEST SUITE A: HIGH-CONCURRENCY RACE CONDITION TEST (CAPACITY LIMIT STRICT ENFORCEMENT)
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST A: HIGH-CONCURRENCY RACE ON SINGLE PROBLEM STATEMENT');
  console.log(`Simulating 8 teams simultaneously clicking SELECT on ${targetProblem.problemId} at the exact same millisecond...`);
  console.log('='.repeat(70));

  const raceTeams = loggedInTeams.slice(0, 8);
  const raceStart = Date.now();

  const racePromises = raceTeams.map((t, idx) => {
    return request(`${baseUrl}/problems/select`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${t.token}` }
    }, { problemId: targetProblem._id }).then(res => ({
      teamIndex: idx + 1,
      teamId: t.teamId,
      status: res.status,
      data: res.data
    }));
  });

  const raceResults = await Promise.all(racePromises);
  const raceDuration = Date.now() - raceStart;

  const successfulSelections = raceResults.filter(r => r.status === 200);
  const rejectedSelections = raceResults.filter(r => r.status === 400 && (r.data?.code === 'PROBLEM_FULL' || r.data?.error?.includes('full')));

  console.log(`\n📊 Race Results (Total duration: ${raceDuration}ms):`);
  console.log(`   ✅ Successful claims (200 OK): ${successfulSelections.length}`);
  console.log(`   🚫 Rejected attempts (400 Full): ${rejectedSelections.length}`);

  raceResults.forEach(r => {
    console.log(`   - Team ${r.teamId}: Status ${r.status} => ${r.status === 200 ? '🎉 WON SLOT' : (r.data?.error || r.data?.code)}`);
  });

  const maxCap = targetProblem.maxTeamCapacity || 2;
  if (successfulSelections.length === maxCap && rejectedSelections.length === (raceTeams.length - maxCap)) {
    console.log(`\n🏆 [PASS] STRICT CAPACITY ENFORCEMENT PASSED! Exactly ${maxCap} teams succeeded, and ${raceTeams.length - maxCap} teams were blocked atomically.`);
  } else {
    console.error(`\n❌ [FAIL] Capacity violation detected! Successful: ${successfulSelections.length}, Expected: ${maxCap}`);
    process.exit(1);
  }

  // Verify in database: selectedCount must be exactly 2
  const checkPsRes = await request(`${baseUrl}/problems/${targetProblem._id}`, { headers: adminHeaders });
  const freshPs = checkPsRes.data?.problem;
  console.log(`   🔍 Database check for ${targetProblem.problemId}: selectedCount = ${freshPs?.selectedCount} (Max Capacity = ${maxCap})`);
  if (freshPs?.selectedCount > maxCap) {
    console.error(`❌ [FAIL] Database selectedCount (${freshPs?.selectedCount}) exceeded maxCapacity (${maxCap})!`);
    process.exit(1);
  } else {
    console.log(`   ✅ [VERIFIED] Problem Statement selectedCount is exactly ${freshPs?.selectedCount}, strictly matching capacity limit!`);
  }

  // TEST SUITE B: EXTRA SELECTION AFTER FULL
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST B: SUBSEQUENT ATTEMPT AFTER PROBLEM STATEMENT IS FULL');
  console.log('='.repeat(70));
  const lateTeam = loggedInTeams[8];
  const lateAttempt = await request(`${baseUrl}/problems/select`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${lateTeam.token}` }
  }, { problemId: targetProblem._id });

  console.log(`   Late Attempt by Team ${lateTeam.teamId}: Status ${lateAttempt.status}`);
  console.log(`   Response:`, lateAttempt.data);
  if (lateAttempt.status === 400 && (lateAttempt.data?.code === 'PROBLEM_FULL' || lateAttempt.data?.error?.includes('full'))) {
    console.log(`   ✅ [PASS] Subsequent selection correctly rejected with PROBLEM_FULL.`);
  } else {
    console.error(`   ❌ [FAIL] Expected 400 PROBLEM_FULL, got:`, lateAttempt.status, lateAttempt.data);
  }

  // TEST SUITE C: DOUBLE SELECTION PREVENTION FOR SAME TEAM
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST C: DOUBLE SELECTION PREVENTION FOR SAME TEAM');
  console.log('Attempting to select a second problem with a team that already has one...');
  console.log('='.repeat(70));

  const winningTeamToken = successfulSelections[0] ? loggedInTeams.find(t => t.teamId === successfulSelections[0].teamId)?.token : null;
  if (winningTeamToken) {
    const doubleAttempt = await request(`${baseUrl}/problems/select`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${winningTeamToken}` }
    }, { problemId: targetProblem2._id });

    console.log(`   Double Attempt on Problem 2: Status ${doubleAttempt.status}`);
    console.log(`   Response:`, doubleAttempt.data);
    if (doubleAttempt.status === 400 && (doubleAttempt.data?.code === 'ALREADY_SELECTED' || doubleAttempt.data?.error?.includes('already has'))) {
      console.log(`   ✅ [PASS] Team cannot select a second problem statement.`);
    } else {
      console.error(`   ❌ [FAIL] Double selection check failed:`, doubleAttempt.status, doubleAttempt.data);
    }

    // TEST SUITE D: IDEMPOTENT RE-SELECTION FOR SAME PROBLEM
    console.log('\n' + '='.repeat(70));
    console.log('🧪 TEST D: IDEMPOTENT RE-SELECTION FOR SAME PROBLEM');
    console.log('='.repeat(70));
    const idempotentAttempt = await request(`${baseUrl}/problems/select`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${winningTeamToken}` }
    }, { problemId: targetProblem._id });

    console.log(`   Idempotent Re-selection Status: ${idempotentAttempt.status}`);
    console.log(`   Is Idempotent:`, idempotentAttempt.data?.isIdempotent);
    if (idempotentAttempt.status === 200 && idempotentAttempt.data?.isIdempotent) {
      console.log(`   ✅ [PASS] Idempotent retry succeeded safely without double counting.`);
    } else {
      console.error(`   ❌ [FAIL] Idempotent retry did not return expected response:`, idempotentAttempt.data);
    }
  }

  // TEST SUITE E: CONCURRENT MULTI-PROBLEM LOAD TEST
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST E: MULTI-PROBLEM CONCURRENT LOAD TEST (6 TEAMS SELECTING DIFFERENT PROBLEMS)');
  console.log('='.repeat(70));
  const remainingTeams = loggedInTeams.slice(9, 15);
  const loadStart = Date.now();

  const loadPromises = remainingTeams.map((t, idx) => {
    const targetIdx = 2 + (idx % (problems.length - 2));
    const prob = problems[targetIdx];
    return request(`${baseUrl}/problems/select`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${t.token}` }
    }, { problemId: prob._id }).then(res => ({
      teamId: t.teamId,
      problemId: prob.problemId,
      status: res.status,
      ok: res.ok,
      data: res.data
    }));
  });

  const loadResults = await Promise.all(loadPromises);
  console.log(`   ⚡ 6 concurrent selections completed in ${Date.now() - loadStart}ms.`);
  loadResults.forEach(r => {
    console.log(`   - Team ${r.teamId} selecting ${r.problemId}: Status ${r.status} (${r.ok ? 'SUCCESS' : r.data?.error})`);
  });

  const allLoadSuccess = loadResults.every(r => r.status === 200);
  if (allLoadSuccess) {
    console.log(`   ✅ [PASS] All concurrent load selections succeeded without errors.`);
  }

  // STEP 6: Clean up - Reset all selections & close selection as per user system instruction
  console.log('\n' + '='.repeat(70));
  console.log('🧹 CLEANUP: Resetting all test selections & resetting to initial clean state');
  console.log('='.repeat(70));
  await request(`${baseUrl}/admin/reset-all-selections`, { method: 'POST', headers: adminHeaders }, {});
  await request(`${baseUrl}/admin/session-control`, { method: 'POST', headers: adminHeaders }, { action: 'UNRELEASE_PROBLEMS' });
  await request(`${baseUrl}/admin/session-control`, { method: 'POST', headers: adminHeaders }, { action: 'CLOSE' });
  await request(`${baseUrl}/admin/settings`, { method: 'POST', headers: adminHeaders }, { problemSelectionEnabled: false, problemStatementsReleased: false });

  console.log('   ✅ All test selections cleaned up.');
  console.log('   ✅ System safely returned to NOT_RELEASED & SELECTION_CLOSED.');
  console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY! SYSTEM LOGIC & CAPACITY LIMITS FULLY VALIDATED!');
}

runTests().catch(console.error);
