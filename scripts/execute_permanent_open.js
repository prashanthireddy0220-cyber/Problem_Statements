const https = require('https');

function post(path, body, token) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'problem-statements-w7wq.onrender.com',
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      timeout: 20000
    }, (res) => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(b); } catch (e) {}
        resolve({ status: res.statusCode, body: b, json });
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'problem-statements-w7wq.onrender.com',
      path,
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      timeout: 20000
    }, (res) => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(b); } catch (e) {}
        resolve({ status: res.statusCode, body: b, json });
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }); });
    req.end();
  });
}

async function run() {
  console.log('1. Logging in as Admin...');
  let adminRes = null;
  let attempts = 0;
  while (attempts < 15) {
    attempts++;
    adminRes = await post('/api/auth/admin/login', { username: 'Admin', password: 'Admin0509' });
    if (adminRes.status === 200 && adminRes.json?.token) break;
    console.log(`Attempt ${attempts}: status=${adminRes.status}, error=${adminRes.error}, msg=${adminRes.json?.message || adminRes.body?.slice(0, 100)}`);
    await new Promise(r => setTimeout(r, 4000));
  }
  console.log('Admin login status:', adminRes.status, adminRes.json?.message || adminRes.body?.slice(0, 100));

  if (!adminRes.json?.token) {
    console.error('Failed to get admin token.');
    return;
  }

  const token = adminRes.json.token;

  console.log('2. Triggering session-control OPEN_NOW (Permanently Open)...');
  const sessionRes = await post('/api/admin/session-control', { action: 'OPEN_NOW' }, token);
  console.log('Session control response status:', sessionRes.status, sessionRes.json || sessionRes.body?.slice(0, 150));

  console.log('3. Checking timer-state after open...');
  const stateRes = await get('/api/problems/timer-state', token);
  console.log('Timer State status:', stateRes.status, 'Current Phase:', stateRes.json?.currentPhase, 'Released:', stateRes.json?.problemStatementsReleased, 'Selection Enabled:', stateRes.json?.problemSelectionEnabled);

  console.log('4. Checking problems list...');
  const probRes = await get('/api/problems', token);
  console.log('Problems returned:', probRes.json?.problems?.length);
  if (probRes.json?.problems?.length > 0) {
    console.log('Sample problem IDs:', probRes.json.problems.slice(0, 5).map(p => p.problemId));
  }
}

run();
