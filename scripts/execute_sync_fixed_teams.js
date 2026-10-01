const https = require('https');

const BASE_URL = 'https://problem-statements-w7wq.onrender.com';

function request(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + path);
    const postData = data ? JSON.stringify(data) : null;
    const headers = {};
    if (postData) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers,
      timeout: 60000
    }, (res) => {
      let buf = '';
      res.on('data', d => buf += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(buf);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, text: buf });
        }
      });
    });

    req.on('error', err => resolve({ error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }); });
    if (postData) req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🚀 Running Live Synchronization of Fixed Problem Statements...');

  // 1. Admin Login
  console.log('1. Logging in as Admin...');
  const adminLogin = await request('/api/auth/admin/login', 'POST', {
    username: 'Admin',
    password: 'Admin0509'
  });

  if (adminLogin.status !== 200 || !adminLogin.data?.token) {
    console.error('❌ Admin login failed:', adminLogin);
    return;
  }
  const adminToken = adminLogin.data.token;
  console.log('✅ Admin login successful.');

  // 2. Trigger sync-top40-booklet
  console.log('2. Calling POST /api/admin/sync-top40-booklet...');
  const syncRes = await request('/api/admin/sync-top40-booklet', 'POST', {}, adminToken);
  console.log('Sync Response Status:', syncRes.status);
  console.log('Sync Response Data:', syncRes.data);

  // 3. Verify Problem Statements in DB
  console.log('3. Fetching Problem Statements list from live server...');
  const probsRes = await request('/api/problems', 'GET', null, adminToken);
  if (probsRes.status === 200 && Array.isArray(probsRes.data?.problemStatements || probsRes.data)) {
    const list = probsRes.data.problemStatements || probsRes.data;
    console.log(`✅ Total Problem Statements in live DB: ${list.length}`);
    const nonPS = list.filter(p => !p.problemId.startsWith('PS-'));
    if (nonPS.length > 0) {
      console.warn(`⚠️ Found ${nonPS.length} legacy problem statements:`, nonPS.map(p => p.problemId));
    } else {
      console.log('✅ All problem statements follow the PS-001..PS-040 specification.');
    }
  } else {
    console.log('Problems response:', probsRes);
  }

  // 4. Test Team Lead Login & Verification for Key Teams
  const testTeams = [
    { teamId: 'ALPHA-001', regNum: '9924008110', expectedPS: 'PS-013' },
    { teamId: 'ALPHA-002', regNum: '99230041040', expectedPS: 'PS-039' },
    { teamId: 'ALPHA-003', regNum: '9924004033', expectedPS: 'PS-001' },
    { teamId: 'ALPHA-050', regNum: '9824005012', expectedPS: 'PS-007' },
    { teamId: 'ALPHA-060', regNum: '99220040718', expectedPS: 'PS-011' }
  ];

  console.log('4. Verifying Team Lead Dashboard for sample teams...');
  for (const t of testTeams) {
    const leadLogin = await request('/api/auth/team-lead/login', 'POST', {
      registrationNumber: t.regNum
    });

    if (leadLogin.status !== 200 || !leadLogin.data?.token) {
      console.error(`❌ Team lead login failed for ${t.teamId} (${t.regNum}):`, leadLogin);
      continue;
    }
    const leadToken = leadLogin.data.token;

    const myTeamRes = await request('/api/teams/my-team', 'GET', null, leadToken);
    if (myTeamRes.status === 200 && myTeamRes.data?.team) {
      const team = myTeamRes.data.team;
      const match = team.selectedProblemCode === t.expectedPS && team.selectionConfirmed === true;
      console.log(`Team ${t.teamId} (${t.regNum}): Assigned ${team.selectedProblemCode} (Expected: ${t.expectedPS}) | Confirmed: ${team.selectionConfirmed} | Problem Title: "${team.selectedProblem?.title?.slice(0, 35)}..." [${match ? '✅ MATCH' : '❌ MISMATCH'}]`);
    } else {
      console.error(`❌ Failed to fetch my-team for ${t.teamId}:`, myTeamRes);
    }
  }

  console.log('\n🎉 Verification completed!');
}

main().catch(console.error);
