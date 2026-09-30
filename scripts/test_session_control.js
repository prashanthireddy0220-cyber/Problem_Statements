const BASE = 'http://localhost:5000';

async function run() {
  try {
    const loginRes = await fetch(BASE + '/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    const req = async (url, method = 'GET', body = null) => {
      const opts = {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      if (body) opts.body = JSON.stringify(body);
      const r = await fetch(BASE + url, opts);
      return await r.json();
    };

    console.log('\n--- 1. UNRELEASE_PROBLEMS ---');
    let res = await req('/api/admin/session-control', 'POST', { action: 'UNRELEASE_PROBLEMS' });
    console.log('UNRELEASE_PROBLEMS:', res.currentPhase, 'released:', res.settings.problemStatementsReleased);
    let live = await req('/api/admin/live-activity');
    console.log('live-activity summary:', live.summary?.currentPhase, 'released:', live.summary?.problemStatementsReleased);

    console.log('\n--- 2. RELEASE_PROBLEMS ---');
    res = await req('/api/admin/session-control', 'POST', { action: 'RELEASE_PROBLEMS' });
    console.log('RELEASE_PROBLEMS:', res.currentPhase, 'released:', res.settings.problemStatementsReleased);
    live = await req('/api/admin/live-activity');
    console.log('live-activity summary:', live.summary?.currentPhase, 'released:', live.summary?.problemStatementsReleased);

    console.log('\n--- 3. OPEN_NOW ---');
    res = await req('/api/admin/session-control', 'POST', { action: 'OPEN_NOW' });
    console.log('OPEN_NOW:', res.currentPhase, 'released:', res.settings.problemStatementsReleased);
    live = await req('/api/admin/live-activity');
    console.log('live-activity summary:', live.summary?.currentPhase, 'released:', live.summary?.problemStatementsReleased);

    console.log('\n--- 4. CLOSE ---');
    res = await req('/api/admin/session-control', 'POST', { action: 'CLOSE' });
    console.log('CLOSE:', res.currentPhase, 'released:', res.settings.problemStatementsReleased);
    live = await req('/api/admin/live-activity');
    console.log('live-activity summary:', live.summary?.currentPhase, 'released:', live.summary?.problemStatementsReleased);

    console.log('\n--- 5. RESET ---');
    res = await req('/api/admin/session-control', 'POST', { action: 'RESET' });
    console.log('RESET:', res.currentPhase, 'released:', res.settings.problemStatementsReleased);
    live = await req('/api/admin/live-activity');
    console.log('live-activity summary:', live.summary?.currentPhase, 'released:', live.summary?.problemStatementsReleased);

    console.log('\n--- 6. START_ROUND (4m rel, 2m read, 5m sel) ---');
    res = await req('/api/admin/session-control', 'POST', {
      action: 'START_ROUND',
      releaseDelayMinutes: 4,
      selectionDelayMinutes: 2,
      selectionDurationMinutes: 5
    });
    console.log('START_ROUND:', res.currentPhase, 'released:', res.settings.problemStatementsReleased);
    live = await req('/api/admin/live-activity');
    console.log('live-activity summary:', live.summary?.currentPhase, 'timeUntilRelease:', live.summary?.timeUntilReleaseSeconds);

    console.log('\n--- 7. OVERRIDE TIMED ROUND WITH OPEN_NOW ---');
    res = await req('/api/admin/session-control', 'POST', { action: 'OPEN_NOW' });
    console.log('OPEN_NOW override:', res.currentPhase, 'released:', res.settings.problemStatementsReleased);
    live = await req('/api/admin/live-activity');
    console.log('live-activity summary:', live.summary?.currentPhase, 'timeUntilRelease:', live.summary?.timeUntilReleaseSeconds);

    console.log('\n--- 8. CLOSE AFTER OPEN_NOW ---');
    res = await req('/api/admin/session-control', 'POST', { action: 'CLOSE' });
    console.log('CLOSE after open:', res.currentPhase, 'released:', res.settings.problemStatementsReleased);
    live = await req('/api/admin/live-activity');
    console.log('live-activity summary:', live.summary?.currentPhase);

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
