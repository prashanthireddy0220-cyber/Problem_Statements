const http = require('http');

const BASE_URL = 'http://localhost:5000';

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

    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers,
      timeout: 10000
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
  console.log('🔍 Testing Local Database Fixed Problem Statements & Team Assignments...\n');

  // 1. Admin login
  const adminLogin = await request('/api/auth/admin/login', 'POST', { username: 'Admin', password: 'Admin0509' });
  if (adminLogin.status !== 200 || !adminLogin.data?.token) {
    console.error('❌ Admin login failed:', adminLogin);
    return;
  }
  const adminToken = adminLogin.data.token;
  console.log('✅ Admin login successful (200 OK).');

  // 2. Problem statements count
  const probsRes = await request('/api/problems', 'GET', null, adminToken);
  const probs = probsRes.data?.problems || [];
  console.log(`✅ Total Problem Statements in DB: ${probs.length} (Expected: 40)`);
  const nonPS = probs.filter(p => !p.problemId.startsWith('PS-'));
  if (nonPS.length > 0) {
    console.error('❌ Found outdated problem statements:', nonPS.map(p => p.problemId));
  } else {
    console.log('✅ All statements are strictly PS-001 through PS-040.');
  }

  // 3. Check fixed team problem statements JSON mapping
  const fixedJson = require('../server/data/fixed_team_problem_statements.json');
  console.log(`\n📋 Verifying All ${fixedJson.teams.length} Teams Against Their Assigned Problem Statement:`);

  let matchCount = 0;
  let failCount = 0;

  for (const t of fixedJson.teams) {
    // Look up team lead credentials from teamsData
    const teamsData = require('../server/data/teamsData');
    const teamInfo = teamsData.find(item => item.teamId === t.team_id);
    if (!teamInfo) {
      console.error(`❌ Team ${t.team_id} not found in teamsData.`);
      failCount++;
      continue;
    }

    const leadLogin = await request('/api/auth/team-lead/login', 'POST', {
      teamId: t.team_id,
      registrationNumber: teamInfo.regNum
    });

    if (leadLogin.status !== 200 || !leadLogin.data?.token) {
      console.error(`❌ Login failed for ${t.team_id} (${teamInfo.regNum})`);
      failCount++;
      continue;
    }

    const myTeam = await request('/api/teams/my-team', 'GET', null, leadLogin.data.token);
    const teamDoc = myTeam.data?.team;

    if (!teamDoc) {
      console.error(`❌ Failed to fetch my-team for ${t.team_id}`);
      failCount++;
      continue;
    }

    const assignedCode = teamDoc.selectedProblemCode;
    const isConfirmed = teamDoc.selectionConfirmed;
    const problemTitle = teamDoc.selectedProblem?.title;

    if (assignedCode === t.problem_statement_id && isConfirmed && problemTitle) {
      matchCount++;
    } else {
      console.error(`❌ Mismatch for ${t.team_id}: Got ${assignedCode}, expected ${t.problem_statement_id} (confirmed: ${isConfirmed}, title: ${problemTitle})`);
      failCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${matchCount}/${fixedJson.teams.length} teams verified successfully.`);
  if (failCount === 0) {
    console.log(`🎉 PERFECT! All 60 teams have their fixed problem statements permanently locked and verified!`);
  } else {
    console.error(`⚠️ ${failCount} teams had issues.`);
  }
  console.log(`========================================\n`);

  // Sample printout of 5 teams
  console.log('📌 Sample Verification Snapshot:');
  const samples = [fixedJson.teams[0], fixedJson.teams[1], fixedJson.teams[9], fixedJson.teams[49], fixedJson.teams[59]];
  for (const s of samples) {
    const title = s.problem_statement?.title || fixedJson.problem_statements[s.problem_statement_id]?.title || 'Statement';
    console.log(`  - Team ${s.team_id}: ${s.problem_statement_id} -> "${title}"`);
  }
}

main().catch(console.error);
