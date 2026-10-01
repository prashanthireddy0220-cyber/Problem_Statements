const https = require('https');

function post(urlStr, body) {
  return new Promise((resolve) => {
    const url = new URL(urlStr);
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 30000
    }, (res) => {
      let buf = '';
      res.on('data', d => buf += d);
      res.on('end', () => resolve({ status: res.statusCode, body: buf }));
    });
    req.on('error', err => resolve({ error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

async function test() {
  console.log('Testing Admin login on Render...');
  console.log('1. Admin / Admin0509:');
  const r1 = await post('https://problem-statements-w7wq.onrender.com/api/auth/admin/login', { username: 'Admin', password: 'Admin0509' });
  console.log(r1);

  console.log('2. admin / admin123:');
  const r2 = await post('https://problem-statements-w7wq.onrender.com/api/auth/admin/login', { username: 'admin', password: 'admin123' });
  console.log(r2);

  console.log('3. Checking timer-state:');
  https.get('https://problem-statements-w7wq.onrender.com/api/problems/timer-state', (res) => {
    let buf = '';
    res.on('data', d => buf += d);
    res.on('end', () => console.log('Timer state:', res.statusCode, buf));
  });
}

test();
