const axios = require('axios');

const BASE_URL = 'https://problem-statements-w7wq.onrender.com/api';

async function main() {
  console.log('========================================================================');
  console.log('🧪 TESTING MANUAL PROBLEM RELEASE & TEAM REFRESH BEHAVIOR');
  console.log('========================================================================\n');

  // 1. Authenticate Admin
  console.log('1️⃣ Logging in as Admin...');
  const adminLoginRes = await axios.post(`${BASE_URL}/admin/login`, {
    username: 'Admin',
    password: 'Password@123'
  });
  const adminToken = adminLoginRes.data.token;
  console.log('   ✅ Admin logged in.');

  // 2. Authenticate Team Lead (Team 50)
  console.log('\n2️⃣ Logging in as Team 50 Lead...');
  const teamLoginRes = await axios.post(`${BASE_URL}/teams/login`, {
    teamId: 'ALPHA-050',
    registrationNumber: '9922004050'
  });
  const teamToken = teamLoginRes.data.token;
  console.log('   ✅ Team 50 Lead logged in.');

  // 3. Admin clicks "RELEASE_PROBLEMS" (Manual Problem Release)
  console.log('\n3️⃣ Admin clicking "Manual Problem Release" (RELEASE_PROBLEMS)...');
  const t0 = Date.now();
  const relRes = await axios.post(
    `${BASE_URL}/admin/session-control`,
    { action: 'RELEASE_PROBLEMS' },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  const relDuration = Date.now() - t0;
  console.log(`   ⚡ Admin action finished in ${relDuration}ms.`);
  console.log('   📊 Response state:', {
    currentPhase: relRes.data.currentPhase,
    problemStatementsReleased: relRes.data.state?.problemStatementsReleased,
    selectionScheduledStart: relRes.data.state?.selectionScheduledStart,
    selectionEndsAt: relRes.data.state?.selectionEndsAt
  });

  if (!relRes.data.state?.problemStatementsReleased || relRes.data.currentPhase !== 'RELEASED_LOCKED') {
    throw new Error('❌ RELEASE_PROBLEMS did not transition into RELEASED_LOCKED with released=true!');
  }
  console.log('   ✅ Admin session control returned immediate RELEASED_LOCKED state!');

  // 4. Team Lead fetching problems (simulating initial load & repeated page refreshes)
  console.log('\n4️⃣ Simulating Team Lead page load and refreshes...');
  for (let i = 1; i <= 3; i++) {
    const rfStart = Date.now();
    const probRes = await axios.get(`${BASE_URL}/problems`, {
      headers: { Authorization: `Bearer ${teamToken}` }
    });
    const rfDuration = Date.now() - rfStart;

    const count = probRes.data.problems?.length || 0;
    const released = probRes.data.timerState?.problemStatementsReleased;
    const phase = probRes.data.timerState?.currentPhase;

    console.log(`   🔄 Refresh #${i} (${rfDuration}ms): problems=${count}, released=${released}, phase=${phase}`);

    if (!released) {
      throw new Error(`❌ Refresh #${i} FAILED: problemStatementsReleased is false!`);
    }
    if (count === 0) {
      throw new Error(`❌ Refresh #${i} FAILED: problems array is empty!`);
    }
  }
  console.log('   ✅ ALL page refreshes immediately received full problem statements list with released=true!');

  // 5. Test 2-Minute Manual Selection Countdown
  console.log('\n5️⃣ Admin clicking "Start 2-Min Selection Countdown" (START_SELECTION_2MIN)...');
  const countRes = await axios.post(
    `${BASE_URL}/admin/session-control`,
    { action: 'START_SELECTION_2MIN', countdownMinutes: 2 },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  console.log('   📊 Response state:', {
    currentPhase: countRes.data.currentPhase,
    selectionScheduledStart: countRes.data.state?.selectionScheduledStart,
    timeUntilSelectionStartSeconds: countRes.data.state?.timeUntilSelectionStartSeconds
  });

  // Check Team Lead view during 2-min countdown
  const countdownCheck = await axios.get(`${BASE_URL}/problems`, {
    headers: { Authorization: `Bearer ${teamToken}` }
  });
  console.log('   ⏱️ Team Lead view during countdown:', {
    phase: countdownCheck.data.timerState?.currentPhase,
    released: countdownCheck.data.timerState?.problemStatementsReleased,
    timeUntilSelection: countdownCheck.data.timerState?.timeUntilSelectionStartSeconds
  });

  // 6. Cleanup: Reset session back to clean idle state
  console.log('\n6️⃣ Resetting session state to NOT_RELEASED...');
  await axios.post(
    `${BASE_URL}/admin/session-control`,
    { action: 'RESET' },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  console.log('   ✅ Session successfully reset to initial clean state.');

  console.log('\n🎉 ALL MANUAL RELEASE & REFRESH TESTS PASSED WITH 100% SUCCESS!');
}

main().catch(err => {
  console.error('\n❌ TEST ERROR:', err.response?.data || err.message);
  process.exit(1);
});
