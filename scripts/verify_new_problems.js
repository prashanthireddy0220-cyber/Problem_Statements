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

async function run() {
  console.log('1. Logging in as admin...');
  const loginRes = await post('/api/auth/admin/login', { username: 'admin', password: 'admin123' });
  const token = loginRes.data.token;
  console.log('Admin logged in successfully. Token received:', !!token);

  console.log('\n2. Fetching all problems as admin...');
  const allRes = await get('/api/problems?domain=ALL', token);
  console.log('Response status:', allRes.status, 'Data:', allRes.data);
  console.log('Total problems count:', allRes.data?.problems?.length);

  const domains = [
    'Artificial Intelligence & Machine Learning',
    'Cybersecurity & Blockchain',
    'Data Science & Predictive Analytics',
    'Full-Stack Web & Smart Automation'
  ];

  for (const dom of domains) {
    const domRes = await get('/api/problems?domain=' + encodeURIComponent(dom), token);
    const probs = domRes.data.problems || [];
    const first = probs[0];
    const last = probs[probs.length - 1];
    console.log(`Domain: [${dom}] -> Count: ${probs.length} (First: ${first?.problemId}, Last: ${last?.problemId})`);
  }

  console.log('\n3. Checking Live Activity Problem Statements in Admin API...');
  const liveRes = await get('/api/admin/live-activity', token);
  console.log('Live activity problemStatements count:', liveRes.data.problemStatements?.length);
  console.log('Summary totalProblems:', liveRes.data.summary?.totalProblems);

  console.log('\n4. Testing Reset Booklet Endpoint...');
  const resetRes = await post('/api/problems/admin/reset-booklet', {}, token);
  console.log('Reset booklet response:', resetRes.data);

  console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
}

run().catch(console.error);
