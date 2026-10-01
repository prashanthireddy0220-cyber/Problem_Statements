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

async function execute() {
  console.log('1. Admin logging in...');
  const loginRes = await post('/api/auth/admin/login', { username: 'Admin', password: 'Admin0509' });
  const token = loginRes.data.token;
  console.log('Admin login status:', loginRes.status);

  console.log('\n2. Calling POST /api/admin/reset-all-selections...');
  const resetRes = await post('/api/admin/reset-all-selections', {}, token);
  console.log('Reset response:', resetRes.data);

  console.log('\n3. Verifying all Problem Statements have selectedCount === 0...');
  const psRes = await get('/api/problems?domain=ALL', token);
  const nonZero = (psRes.data.problems || []).filter(p => p.selectedCount > 0);
  console.log(`Total Problem Statements: ${psRes.data.problems?.length}, Non-zero selectedCount: ${nonZero.length}`);

  console.log('\n4. Verifying Teams in Live Activity have no selected problems...');
  const liveRes = await get('/api/admin/live-activity', token);
  const selectedTeams = (liveRes.data.teams || []).filter(t => t.selectedProblemCode && t.selectedProblemCode !== 'Not Selected');
  console.log(`Total Teams: ${liveRes.data.teams?.length}, Selected Teams: ${selectedTeams.length}`);
  console.log('Summary stats:', {
    totalAllocated: liveRes.data.summary?.totalAllocated,
    totalRemaining: liveRes.data.summary?.totalRemaining,
    totalProblems: liveRes.data.summary?.totalProblems
  });

  if (nonZero.length === 0 && selectedTeams.length === 0) {
    console.log('\n✅ ALL PROBLEM STATEMENT SELECTIONS HAVE BEEN SUCCESSFULLY DELETED!');
  } else {
    console.error('\n❌ Warning: some selections still exist!');
  }
}

execute().catch(console.error);
