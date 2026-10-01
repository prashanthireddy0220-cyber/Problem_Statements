const https = require('https');
const http = require('http');

function request(urlStr, options = {}, body = null) {
  return new Promise((resolve) => {
    const url = new URL(urlStr);
    const client = url.protocol === 'https:' ? https : http;

    const reqOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      timeout: 15000
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data, raw: data });
        }
      });
    });

    req.on('error', (err) => resolve({ ok: false, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, error: 'Request timed out' });
    });

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function closeAndHideOnTarget(baseUrl) {
  console.log(`\n======================================================`);
  console.log(`Targeting: ${baseUrl}`);
  console.log(`======================================================`);

  // 1. Login as Admin
  let token = null;
  const passwordsToTry = ['Admin0509', 'admin123', 'admin', 'Admin'];
  for (const pwd of passwordsToTry) {
    const loginRes = await request(`${baseUrl}/auth/admin/login`, { method: 'POST' }, { username: 'Admin', password: pwd });
    if (loginRes.ok && loginRes.data?.token) {
      token = loginRes.data.token;
      console.log(`✅ Admin logged in successfully with password: ${pwd}`);
      break;
    }
    // Also try lowercase admin
    const loginResLower = await request(`${baseUrl}/auth/admin/login`, { method: 'POST' }, { username: 'admin', password: pwd });
    if (loginResLower.ok && loginResLower.data?.token) {
      token = loginResLower.data.token;
      console.log(`✅ Admin logged in successfully with username: admin and password: ${pwd}`);
      break;
    }
  }

  if (!token) {
    console.error(`❌ Failed to login as Admin on ${baseUrl}`);
    return false;
  }

  const authHeader = { 'Authorization': `Bearer ${token}` };

  // 2. Clear all problem selections
  console.log('\n🧹 Clearing all problem selections across all teams...');
  const resetSel1 = await request(`${baseUrl}/admin/reset-all-selections`, { method: 'POST', headers: authHeader }, {});
  console.log('Reset Selections Response:', resetSel1.data?.message || resetSel1.status);

  // 3. Immediately close selection session and unrelease problem statements
  console.log('\n🔒 Closing selection and setting UNRELEASE_PROBLEMS...');
  const unreleaseRes = await request(`${baseUrl}/admin/session-control`, { method: 'POST', headers: authHeader }, {
    action: 'UNRELEASE_PROBLEMS'
  });
  console.log('UNRELEASE_PROBLEMS Response:', unreleaseRes.data?.message || unreleaseRes.status);

  // 4. Update system settings to ensure problemSelectionEnabled is false and problemStatementsReleased is false
  console.log('\n⚙️ Disabling problem selection and un-releasing in settings...');
  const settingsRes = await request(`${baseUrl}/admin/settings`, { method: 'PUT', headers: authHeader }, {
    problemSelectionEnabled: false,
    problemStatementsReleased: false,
    selectionScheduledStart: null
  });
  console.log('Settings Update Response:', settingsRes.data?.message || settingsRes.status);

  // 5. Explicitly call CLOSE session
  const closeRes = await request(`${baseUrl}/admin/session-control`, { method: 'POST', headers: authHeader }, {
    action: 'CLOSE'
  });
  console.log('CLOSE Response:', closeRes.data?.message || closeRes.status);

  // 6. Again ensure reset-all-selections is clean
  await request(`${baseUrl}/admin/reset-all-selections`, { method: 'POST', headers: authHeader }, {});

  // 7. Verify Timer & Problem State
  console.log('\n🔍 Verifying current system timer state:');
  const timerRes = await request(`${baseUrl}/problems/timer-state`);
  console.log('Current Phase:', timerRes.data?.currentPhase);
  console.log('Problem Statements Released:', timerRes.data?.problemStatementsReleased);
  console.log('Problem Selection Enabled:', timerRes.data?.problemSelectionEnabled);

  // 8. Verify problems API response for non-admins (or standard list)
  const problemsRes = await request(`${baseUrl}/problems`, { headers: authHeader });
  console.log('Admin problems count:', problemsRes.data?.problems?.length);

  return true;
}

async function main() {
  const targets = [
    'https://problem-statements-w7wq.onrender.com/api',
    'http://localhost:5000/api'
  ];

  for (const t of targets) {
    await closeAndHideOnTarget(t);
  }
}

main().catch(console.error);
