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
      timeout: 25000
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
  console.log('Testing live server responsiveness on Render...');
  
  const t0 = Date.now();
  const timerRes = await request(`${baseUrl}/problems/timer-state`);
  const t1 = Date.now();
  console.log(`Timer state latency: ${t1 - t0}ms, status: ${timerRes.status}`);
  console.log('Current Phase:', timerRes.data?.currentPhase);
  console.log('Problem Statements Released:', timerRes.data?.problemStatementsReleased);
}

verify().catch(console.error);
