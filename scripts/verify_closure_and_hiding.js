const https = require('https');

function request(urlStr, options = {}, body = null) {
  return new Promise((resolve) => {
    const url = new URL(urlStr);
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(options.headers || {})
      },
      timeout: 15000
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
    req.on('error', err => resolve({ ok: false, error: err.message }));
    if (data) req.write(data);
    req.end();
  });
}

async function verify() {
  const baseUrl = 'https://problem-statements-w7wq.onrender.com/api';

  // 1. Admin login
  const adminLogin = await request(`${baseUrl}/auth/admin/login`, { method: 'POST' }, { username: 'Admin', password: 'Admin0509' });
  const adminToken = adminLogin.data?.token;
  console.log('Admin login:', adminLogin.status, 'Token acquired:', Boolean(adminToken));

  // 2. Set problemSelectionEnabled: false in settings
  const settingsRes = await request(`${baseUrl}/admin/settings`, { 
    method: 'POST', 
    headers: { 'Authorization': `Bearer ${adminToken}` } 
  }, {
    problemSelectionEnabled: false,
    problemStatementsReleased: false
  });
  console.log('Settings update:', settingsRes.status, settingsRes.data?.message);

  // 3. Team Lead login (Team 50)
  const teamLogin = await request(`${baseUrl}/auth/team-lead/login`, { method: 'POST' }, {
    teamId: 'ALPHA-050',
    registrationNumber: '9824005012'
  });
  console.log('Team 50 login:', teamLogin.status, 'User team selected problem:', teamLogin.data?.user?.team?.selectedProblemCode);

  const teamToken = teamLogin.data?.token;

  // 4. Test GET /api/problems as Team Lead
  const teamProblemsRes = await request(`${baseUrl}/problems`, {
    headers: { 'Authorization': `Bearer ${teamToken}` }
  });
  console.log('\n--- Team Lead Problems View ---');
  console.log('Status:', teamProblemsRes.status);
  console.log('Message:', teamProblemsRes.data?.message);
  console.log('Current Phase:', teamProblemsRes.data?.phase);
  console.log('Number of Problems Visible to Team:', teamProblemsRes.data?.problems?.length);

  // 5. Try selecting a problem as Team Lead
  const selectRes = await request(`${baseUrl}/problems/select`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${teamToken}` }
  }, {
    problemId: 'dummy_id'
  });
  console.log('\n--- Attempted Selection Result ---');
  console.log('Select Status:', selectRes.status);
  console.log('Select Response:', selectRes.data);

  // 6. Check Live Activity from Admin
  const liveRes = await request(`${baseUrl}/admin/live-activity`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const selectedTeams = (liveRes.data?.teams || []).filter(t => t.selectedProblemCode && t.selectedProblemCode !== 'Not Selected');
  console.log('\n--- All Teams Status ---');
  console.log('Total Teams:', liveRes.data?.teams?.length);
  console.log('Teams with Problem Selected:', selectedTeams.length);
  console.log('Allocated count:', liveRes.data?.summary?.totalAllocated);
}

verify().catch(console.error);
