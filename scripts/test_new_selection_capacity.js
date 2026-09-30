const http = require('http');

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    }, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(buf || '{}') }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    }, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(buf || '{}') }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function testCapacity() {
  console.log('1. Admin logs in and opens Problem Selection Phase...');
  const adminLogin = await post('/api/auth/admin/login', { username: 'admin', password: 'admin123' });
  const adminToken = adminLogin.data.token;

  // Release problem statements & open selection manually
  await post('/api/admin/session-control', { action: 'RELEASE_NOW' }, adminToken);
  await post('/api/admin/session-control', { action: 'OPEN_NOW' }, adminToken);

  console.log('2. Fetching KARE-AI-01...');
  const psRes = await get('/api/problems?search=KARE-AI-01', adminToken);
  const kareAi1 = psRes.data.problems.find(p => p.problemId === 'KARE-AI-01');
  console.log(`Found: ${kareAi1.problemId} (_id: ${kareAi1._id}, maxCapacity: ${kareAi1.maxTeamCapacity}, selectedCount: ${kareAi1.selectedCount})`);

  console.log('3. Logging in Team ALPHA-001 (POLANKI VYSHNAVI, 9924008110)...');
  const t1Login = await post('/api/auth/team-lead/login', { teamId: 'ALPHA-001', registrationNumber: '9924008110' });
  const t1Token = t1Login.data.token;

  console.log('4. Team ALPHA-001 selecting KARE-AI-01...');
  const sel1 = await post('/api/problems/select', { problemId: kareAi1._id }, t1Token);
  console.log('Team 1 selection result:', sel1.status, sel1.data.message || sel1.data.error);

  console.log('5. Logging in Team ALPHA-002 (SATHRASALA MUKESH, 99230041040)...');
  const t2Login = await post('/api/auth/team-lead/login', { teamId: 'ALPHA-002', registrationNumber: '99230041040' });
  const t2Token = t2Login.data.token;

  console.log('6. Team ALPHA-002 selecting KARE-AI-01...');
  const sel2 = await post('/api/problems/select', { problemId: kareAi1._id }, t2Token);
  console.log('Team 2 selection result:', sel2.status, sel2.data.message || sel2.data.error);

  console.log('7. Logging in Team ALPHA-003 (THALARI BHAVYA SREE, 9924005337)...');
  const t3Login = await post('/api/auth/team-lead/login', { teamId: 'ALPHA-003', registrationNumber: '9924005337' });
  const t3Token = t3Login.data.token;

  console.log('8. Team ALPHA-003 attempting to select KARE-AI-01 (should fail as capacity is 2)...');
  const sel3 = await post('/api/problems/select', { problemId: kareAi1._id }, t3Token);
  console.log('Team 3 selection result:', sel3.status, sel3.data.error || sel3.data.message);

  if (sel3.status === 400 && (sel3.data.code === 'PROBLEM_FULL' || sel3.data.error?.includes('full'))) {
    console.log('✅ CAPACITY STRICT ENFORCEMENT VERIFIED (Limit of 2 teams per problem statement)!');
  } else {
    console.error('❌ Capacity enforcement unexpected result:', sel3);
  }

  console.log('9. Resetting test selections...');
  await post('/api/admin/session-control', { action: 'RESET', resetAllocations: true }, adminToken);
  console.log('Cleaned up test selections.');
}

testCapacity().catch(console.error);
