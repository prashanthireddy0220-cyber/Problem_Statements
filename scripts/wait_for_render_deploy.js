const https = require('https');

const BASE_HOST = 'problem-statements-w7wq.onrender.com';

function apiRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = https.request(
      { hostname: BASE_HOST, path: `/api${path}`, method, headers, timeout: 25000 },
      (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch (e) {
            resolve({ status: res.statusCode, raw });
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Logging in as Admin...');
  const login = await apiRequest('POST', '/auth/admin/login', { username: 'Admin', password: 'Admin0509' });
  const token = login.data.token;
  console.log('Admin authenticated.');

  console.log('Waiting for Render deployment to become active...');
  for (let attempt = 1; attempt <= 20; attempt++) {
    const res = await apiRequest('POST', '/admin/session-control', { action: 'RELEASE_PROBLEMS' }, token);
    const endsAt = res.data?.state?.selectionEndsAt;
    const phase = res.data?.state?.currentPhase;

    console.log(`[Attempt ${attempt}] selectionEndsAt: ${endsAt}, currentPhase: ${phase}`);

    if (endsAt === null && phase === 'RELEASED_LOCKED') {
      console.log('🎉 RENDER DEPLOYMENT IS NOW ACTIVE WITH LATEST CODE!');
      process.exit(0);
    }

    await new Promise(r => setTimeout(r, 10000));
  }
  console.log('Timeout waiting for deployment.');
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
