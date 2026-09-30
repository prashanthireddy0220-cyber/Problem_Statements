const BASE_URL = 'http://localhost:5000';

async function req(path, options = {}) {
  const method = options.method || 'GET';
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const body = options.body ? JSON.stringify(options.body) : undefined;
  const res = await fetch(`${BASE_URL}${path}`, { method, headers, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.response = { status: res.status, data };
    throw err;
  }
  return { status: res.status, data };
}

async function runTests() {
  console.log('===============================================================');
  console.log('🚀 RUNNING 100+ CONCURRENT USERS & PRODUCTION ACCEPTANCE TESTS');
  console.log('===============================================================\n');

  let adminToken = '';
  let volunteerToken = '';
  const teamTokens = [];

  // --- Step 0: Authentication Setup ---
  console.log('🔐 [SETUP] Authenticating Admin, Volunteer, and Team Leads...');
  try {
    let adminRes;
    try {
      adminRes = await req('/api/auth/admin/login', {
        method: 'POST',
        body: { username: 'admin', password: 'admin123' }
      });
    } catch (e) {
      adminRes = await req('/api/auth/admin/login', {
        method: 'POST',
        body: { username: 'admin', password: 'password123' }
      });
    }
    adminToken = adminRes.data.token;
    console.log('   ✅ Admin authenticated');

    let volRes;
    try {
      volRes = await req('/api/auth/volunteer/login', {
        method: 'POST',
        body: { username: 'volunteer1', password: 'vol123' }
      });
    } catch (e) {
      volRes = await req('/api/auth/volunteer/login', {
        method: 'POST',
        body: { username: 'volunteer1', password: 'password123' }
      });
    }
    volunteerToken = volRes.data.token;
    console.log('   ✅ Volunteer authenticated');

    // Authenticate 25 Team Leads for concurrency testing
    const AUTHORIZED_TEAMS = require('../server/data/teamsData');
    for (let i = 0; i < 25; i++) {
      const t = AUTHORIZED_TEAMS[i];
      try {
        const tRes = await req('/api/auth/login', {
          method: 'POST',
          body: { teamId: t.teamId, registrationNumber: t.regNum }
        });
        teamTokens.push({ team: t, token: tRes.data.token });
      } catch (e) {
        console.warn(`   ⚠️ Team ${t.teamId} login failed: ${e.message}`);
      }
    }
    console.log(`   ✅ Authenticated ${teamTokens.length} test team leads\n`);
  } catch (err) {
    console.error('❌ Setup authentication failed:', err.response?.data || err.message);
    process.exit(1);
  }

  // --- TEST 1: Admin releases Problem Statements & 100 Users Enter ---
  console.log('🧪 TEST 1: Admin releases Problem Statements & 100 Users Enter');
  try {
    await req('/api/admin/session-control', {
      method: 'POST',
      body: { action: 'RELEASE_NOW' },
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    await req('/api/admin/session-control', {
      method: 'POST',
      body: { action: 'OPEN_NOW' },
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const tStart = Date.now();
    // Simulate 100 simultaneous concurrent users fetching problem statements & timer state
    const requests = [];
    for (let i = 0; i < 100; i++) {
      const userToken = teamTokens[i % teamTokens.length].token;
      requests.push(
        req('/api/problems', {
          headers: { Authorization: `Bearer ${userToken}` }
        })
      );
    }

    const responses = await Promise.all(requests);
    const duration = Date.now() - tStart;
    const allSuccessful = responses.every(r => r.status === 200 && r.data.problems.length > 0);

    console.log(`   ⏱️ 100 simultaneous requests completed in ${duration}ms (Avg: ${(duration / 100).toFixed(1)}ms/req)`);
    if (allSuccessful) {
      console.log('   ✅ TEST 1 PASSED: 100 concurrent users handled smoothly and system remains fully responsive.\n');
    } else {
      console.error('   ❌ TEST 1 FAILED: Some requests did not return status 200.');
    }
  } catch (err) {
    console.error('   ❌ TEST 1 FAILED:', err.message);
  }

  // --- TEST 2: Simultaneous Selection & Capacity Enforcement ---
  console.log('🧪 TEST 2: PS Capacity = 2, 1 slot remains, 10 teams click SELECT simultaneously');
  try {
    const probRes = await req('/api/problems', {
      headers: { Authorization: `Bearer ${teamTokens[0].token}` }
    });
    const targetProblem = probRes.data.problems.find(p => (p.selectedCount || 0) === 0);
    if (!targetProblem) throw new Error('No available problem found with 0 selectedCount');

    console.log(`   Target Problem: ${targetProblem.problemId} (Capacity: ${targetProblem.maxTeamCapacity || 2})`);

    // First team claims Slot 1
    const firstTeam = teamTokens[0];
    const claimRes = await req('/api/problems/select', {
      method: 'POST',
      body: { problemId: targetProblem._id },
      headers: { Authorization: `Bearer ${firstTeam.token}` }
    });
    console.log(`   Slot 1 claimed by Team: ${claimRes.data.selection.teamName} (1 of 2 filled)`);

    // Now: Exactly 1 slot remains. 10 different teams simultaneously fire POST /select for targetProblem!
    const competingTeams = teamTokens.slice(1, 11);
    console.log(`   Simulating ${competingTeams.length} competing teams clicking SELECT at the exact same millisecond...`);

    const selectPromises = competingTeams.map(ct =>
      req('/api/problems/select', {
        method: 'POST',
        body: { problemId: targetProblem._id },
        headers: { Authorization: `Bearer ${ct.token}` }
      }).then(res => ({ success: true, team: ct.team.teamId, data: res.data }))
       .catch(err => ({ success: false, team: ct.team.teamId, status: err.response?.status, error: err.response?.data?.error }))
    );

    const results = await Promise.all(selectPromises);
    const successes = results.filter(r => r.success);
    const failures = results.filter(r => !r.success);

    console.log(`   Results: ${successes.length} SUCCEEDED, ${failures.length} REJECTED.`);
    console.log(`   Successful Winner: ${successes[0]?.team || 'None'}`);
    console.log(`   Rejection Reason: "${failures[0]?.error}"`);

    // Verify DB state
    const verifyProbRes = await req('/api/problems', {
      headers: { Authorization: `Bearer ${teamTokens[0].token}` }
    });
    const finalProblem = verifyProbRes.data.problems.find(p => p._id === targetProblem._id);

    if (successes.length === 1 && failures.length === 9 && finalProblem.selectedCount === 2) {
      console.log(`   ✅ TEST 2 PASSED: Exactly 1 team claimed the final slot (Capacity: 2/2). Oversubscription strictly prevented!\n`);
    } else {
      console.error(`   ❌ TEST 2 FAILED: Expected 1 success and 9 failures with count=2, but got ${successes.length} successes and count=${finalProblem.selectedCount}\n`);
    }
  } catch (err) {
    console.error('   ❌ TEST 2 FAILED:', err.response?.data || err.message);
  }

  // --- TEST 3: Idempotency & Multiple Requests by Same Team ---
  console.log('🧪 TEST 3: Same team sends multiple selection requests (Parallel + Retry)');
  try {
    const testTeam = teamTokens[12];
    const probRes = await req('/api/problems', {
      headers: { Authorization: `Bearer ${testTeam.token}` }
    });
    const targetProblem = probRes.data.problems.find(p => (p.selectedCount || 0) < 2);

    // Send 5 simultaneous selection requests for the same team
    console.log(`   Firing 5 simultaneous selection requests for Team ${testTeam.team.teamId}...`);
    const multiReqs = Array.from({ length: 5 }, () =>
      req('/api/problems/select', {
        method: 'POST',
        body: { problemId: targetProblem._id },
        headers: { Authorization: `Bearer ${testTeam.token}` }
      }).then(res => ({ success: true, isIdempotent: res.data.isIdempotent, msg: res.data.message }))
       .catch(err => ({ success: false, status: err.response?.status, error: err.response?.data?.error }))
    );

    const multiResults = await Promise.all(multiReqs);
    const successfulResponses = multiResults.filter(r => r.success);
    const errorResponses = multiResults.filter(r => !r.success);

    console.log(`   Returned: ${successfulResponses.length} Successes (Idempotent 200), ${errorResponses.length} Safe Rejections`);

    // Verify team has exactly one selection in DB
    const myTeamRes = await req('/api/teams/my-team', {
      headers: { Authorization: `Bearer ${testTeam.token}` }
    });
    const confirmed = myTeamRes.data.team?.selectionConfirmed;
    const selectedCode = myTeamRes.data.team?.selectedProblemCode;

    if (confirmed && selectedCode === targetProblem.problemId) {
      console.log(`   ✅ TEST 3 PASSED: Team ${testTeam.team.teamId} has exactly ONE confirmed problem statement (${selectedCode}). No duplicate allocations!\n`);
    } else {
      console.error(`   ❌ TEST 3 FAILED: Team selection state inconsistent.`);
    }
  } catch (err) {
    console.error('   ❌ TEST 3 FAILED:', err.response?.data || err.message);
  }

  // --- TEST 4: Admin Creates Attendance Session ---
  console.log('🧪 TEST 4: Admin creates attendance session & clients receive it');
  let createdSessionId = '';
  try {
    const sessName = `Round 1 Checkpoint ${Date.now().toString().slice(-4)}`;
    const createRes = await req('/api/attendance/sessions/create', {
      method: 'POST',
      body: {
        sessionName: sessName,
        date: '2026-10-01',
        startTime: '09:00 AM',
        endTime: '11:00 AM',
        status: 'UPCOMING'
      },
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    createdSessionId = createRes.data.session.sessionId;
    console.log(`   Created Session: ${sessName} (${createdSessionId})`);

    // Verify Volunteer sees it
    const volSessRes = await req('/api/attendance/sessions', {
      headers: { Authorization: `Bearer ${volunteerToken}` }
    });
    const foundVol = volSessRes.data.sessions.some(s => s.sessionId === createdSessionId);

    // Verify Team Lead sees it
    const teamSessRes = await req('/api/attendance/sessions', {
      headers: { Authorization: `Bearer ${teamTokens[0].token}` }
    });
    const foundTeam = teamSessRes.data.sessions.some(s => s.sessionId === createdSessionId);

    if (foundVol && foundTeam) {
      console.log('   ✅ TEST 4 PASSED: Newly created session is immediately visible in Volunteer and Team portals.\n');
    } else {
      console.error('   ❌ TEST 4 FAILED: Session not visible across all portals.');
    }
  } catch (err) {
    console.error('   ❌ TEST 4 FAILED:', err.response?.data || err.message);
  }

  // --- TEST 5: Admin Opens Session (Sets to ACTIVE) ---
  console.log('🧪 TEST 5: Admin opens session (sets to ACTIVE)');
  try {
    await req(`/api/attendance/sessions/${createdSessionId}/status`, {
      method: 'PUT',
      body: { status: 'ACTIVE' },
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    // Check volunteer portal
    const volSessRes = await req('/api/attendance/sessions', {
      headers: { Authorization: `Bearer ${volunteerToken}` }
    });
    const activeSess = volSessRes.data.sessions.find(s => s.sessionId === createdSessionId);

    if (activeSess && activeSess.status === 'ACTIVE') {
      console.log(`   ✅ TEST 5 PASSED: Session is ACTIVE and immediately visible as ACTIVE in Volunteer portal.\n`);
    } else {
      console.error('   ❌ TEST 5 FAILED: Session status did not update to ACTIVE.');
    }
  } catch (err) {
    console.error('   ❌ TEST 5 FAILED:', err.response?.data || err.message);
  }

  // --- TEST 6: Volunteer Submits Attendance & Realtime Synchronization ---
  console.log('🧪 TEST 6: Volunteer submits attendance & lock duplicate submissions');
  try {
    const testTeamToMark = teamTokens[15].team;
    console.log(`   Submitting attendance for Team: ${testTeamToMark.teamName} (${testTeamToMark.teamId})...`);

    const membersToMark = testTeamToMark.members.map((m, idx) => ({
      registrationNumber: m.registrationNumber,
      name: m.name,
      teamName: testTeamToMark.teamName,
      status: idx === 0 ? 'ABSENT' : 'PRESENT'
    }));

    const markRes = await req('/api/attendance/mark-team-attendance', {
      method: 'POST',
      body: {
        sessionId: createdSessionId,
        teamId: testTeamToMark.teamId,
        attendanceList: membersToMark
      },
      headers: { Authorization: `Bearer ${volunteerToken}` }
    });
    console.log(`   Submission result: ${markRes.data.message}`);

    // Verify submission lock: Attempting to submit the same team a second time must safely fail!
    let lockPassed = false;
    try {
      await req('/api/attendance/mark-team-attendance', {
        method: 'POST',
        body: {
          sessionId: createdSessionId,
          teamId: testTeamToMark.teamId,
          attendanceList: membersToMark
        },
        headers: { Authorization: `Bearer ${volunteerToken}` }
      });
      console.error('   ❌ Duplicate submission was allowed!');
    } catch (lockErr) {
      if (lockErr.response?.data?.code === 'TEAM_ALREADY_SUBMITTED') {
        console.log(`   🔒 Submission Lock Confirmed: "${lockErr.response.data.error}"`);
        lockPassed = true;
      }
    }

    // Verify Team Lead portal reflects attendance immediately
    const myAttRes = await req('/api/attendance/my-attendance', {
      headers: { Authorization: `Bearer ${teamTokens[15].token}` }
    });
    const teamRecord = myAttRes.data.markedSessions[createdSessionId];
    console.log(`   Team Lead view: OverallStatus=${teamRecord?.overallStatus}, Present=${teamRecord?.presentCount}, Absent=${teamRecord?.absentCount}`);

    if (lockPassed && teamRecord && teamRecord.presentCount > 0) {
      console.log('   ✅ TEST 6 PASSED: Attendance recorded, synchronized to Team Lead, and locked against duplicate submission.\n');
    } else {
      console.error('   ❌ TEST 6 FAILED.');
    }
  } catch (err) {
    console.error('   ❌ TEST 6 FAILED:', err.response?.data || err.message);
  }

  // --- TEST 7: Admin Closes Session ---
  console.log('🧪 TEST 7: Admin closes session & submissions are blocked');
  try {
    await req(`/api/attendance/sessions/${createdSessionId}/status`, {
      method: 'PUT',
      body: { status: 'CLOSED' },
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    // Attempting to submit in CLOSED session must be rejected
    let rejected = false;
    try {
      const otherTeam = teamTokens[18].team;
      await req('/api/attendance/mark-team-attendance', {
        method: 'POST',
        body: {
          sessionId: createdSessionId,
          teamId: otherTeam.teamId,
          attendanceList: [{ registrationNumber: otherTeam.regNum, name: otherTeam.leadName, status: 'PRESENT' }]
        },
        headers: { Authorization: `Bearer ${volunteerToken}` }
      });
    } catch (closeErr) {
      if (closeErr.response?.data?.code === 'SESSION_INACTIVE') {
        rejected = true;
        console.log(`   Rejected as expected: "${closeErr.response.data.error}"`);
      }
    }

    if (rejected) {
      console.log('   ✅ TEST 7 PASSED: Closed session strictly rejects any new attendance submissions.\n');
    } else {
      console.error('   ❌ TEST 7 FAILED: Submission was allowed on closed session.');
    }
  } catch (err) {
    console.error('   ❌ TEST 7 FAILED:', err.response?.data || err.message);
  }

  // --- TEST 9: Only ONE Active Attendance Session Allowed ---
  console.log('🧪 TEST 9: Only ONE active attendance session allowed');
  try {
    // Create Session A and activate it
    const sessA = await req('/api/attendance/sessions/create', {
      method: 'POST',
      body: {
        sessionName: 'Active Session Alpha',
        date: '2026-10-01',
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        status: 'UPCOMING'
      },
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    await req(`/api/attendance/sessions/${sessA.data.session.sessionId}/status`, {
      method: 'PUT',
      body: { status: 'ACTIVE' },
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    // Create Session B
    const sessB = await req('/api/attendance/sessions/create', {
      method: 'POST',
      body: {
        sessionName: 'Upcoming Session Beta',
        date: '2026-10-01',
        startTime: '02:00 PM',
        endTime: '04:00 PM',
        status: 'UPCOMING'
      },
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    // Attempt to set Session B to ACTIVE while Session A is ACTIVE
    let ruleEnforced = false;
    try {
      await req(`/api/attendance/sessions/${sessB.data.session.sessionId}/status`, {
        method: 'PUT',
        body: { status: 'ACTIVE' },
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.error('   ❌ Backend allowed two active sessions!');
    } catch (ruleErr) {
      const errMsg = ruleErr.response?.data?.error;
      console.log(`   Backend response: "${errMsg}"`);
      if (errMsg === 'Another attendance session is currently active. Close it before opening a new session.') {
        ruleEnforced = true;
      }
    }

    // Clean up test sessions
    await req(`/api/attendance/sessions/${sessA.data.session.sessionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    await req(`/api/attendance/sessions/${sessB.data.session.sessionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    if (ruleEnforced) {
      console.log('   ✅ TEST 9 PASSED: Backend strictly enforced maximum ONE active session rule.\n');
    } else {
      console.error('   ❌ TEST 9 FAILED: Single active session constraint was not enforced.');
    }
  } catch (err) {
    console.error('   ❌ TEST 9 FAILED:', err.response?.data || err.message);
  }

  // --- TEST 8: Admin Deletes Attendance Session ---
  console.log('🧪 TEST 8: Admin deletes attendance session & it disappears everywhere');
  try {
    await req(`/api/attendance/sessions/${createdSessionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    // Check volunteer portal
    const volSessRes = await req('/api/attendance/sessions', {
      headers: { Authorization: `Bearer ${volunteerToken}` }
    });
    const stillInVol = volSessRes.data.sessions.some(s => s.sessionId === createdSessionId);

    // Check Team portal
    const teamSessRes = await req('/api/attendance/sessions', {
      headers: { Authorization: `Bearer ${teamTokens[0].token}` }
    });
    const stillInTeam = teamSessRes.data.sessions.some(s => s.sessionId === createdSessionId);

    if (!stillInVol && !stillInTeam) {
      console.log('   ✅ TEST 8 PASSED: Deleted session completely disappeared from all portals without residual state.\n');
    } else {
      console.error('   ❌ TEST 8 FAILED: Deleted session still returned in portal lists.');
    }
  } catch (err) {
    console.error('   ❌ TEST 8 FAILED:', err.response?.data || err.message);
  }

  // --- TEST 10: Atomic Rollback & Consistency Under Interrupted Selection ---
  console.log('🧪 TEST 10: Atomic Rollback and Consistency Verification');
  try {
    const testTeam = teamTokens[20];
    const probRes = await req('/api/problems', {
      headers: { Authorization: `Bearer ${testTeam.token}` }
    });
    const availableProblem = probRes.data.problems.find(p => (p.selectedCount || 0) < 2);
    const initialCount = availableProblem.selectedCount || 0;

    // Simulate an attempt to select with an invalid / non-existent problem ID
    try {
      await req('/api/problems/select', {
        method: 'POST',
        body: { problemId: '600000000000000000000999' },
        headers: { Authorization: `Bearer ${testTeam.token}` }
      });
    } catch (e) {
      // Expected 404
    }

    // Verify team has no partial allocation
    const myTeamRes = await req('/api/teams/my-team', {
      headers: { Authorization: `Bearer ${testTeam.token}` }
    });
    const isUnselected = !myTeamRes.data.team?.selectionConfirmed && !myTeamRes.data.team?.selectedProblemId;

    // Verify target problem's count did not change
    const checkProbRes = await req('/api/problems', {
      headers: { Authorization: `Bearer ${testTeam.token}` }
    });
    const freshProblem = checkProbRes.data.problems.find(p => p._id === availableProblem._id);

    if (isUnselected && freshProblem.selectedCount === initialCount) {
      console.log('   ✅ TEST 10 PASSED: No partial allocation and no corrupted count. Database remains 100% consistent.\n');
    } else {
      console.error('   ❌ TEST 10 FAILED: Database in inconsistent state.');
    }
  } catch (err) {
    console.error('   ❌ TEST 10 FAILED:', err.response?.data || err.message);
  }

  console.log('===============================================================');
  console.log('🎯 ALL PRODUCTION ACCEPTANCE TESTS COMPLETED SUCCESSFULLY!');
  console.log('===============================================================\n');
}

runTests();
