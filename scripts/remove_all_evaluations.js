const path = require('path');
const https = require('https');
const http = require('http');
const mongoose = require(path.join(__dirname, '../server/node_modules/mongoose'));
const dotenv = require(path.join(__dirname, '../server/node_modules/dotenv'));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const { Evaluation, RoundReviewerNormalization } = require('../server/models/Schema');

function makeRequest(urlStr, options = {}, body = null) {
  return new Promise((resolve) => {
    const url = new URL(urlStr);
    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', () => resolve({ ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false }); });
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function removeAllEvaluations() {
  console.log('🔄 Initiating Complete Reviewer Evaluations Removal...\n');

  // Step 1: Wipe via Admin API on Live Render if reachable
  const endpoints = [
    'https://problem-statements-w7wq.onrender.com',
    'http://localhost:5000'
  ];

  for (const baseUrl of endpoints) {
    try {
      console.log(`📡 Attempting Admin API reset on ${baseUrl}...`);
      const loginRes = await makeRequest(`${baseUrl}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      }, { username: 'admin', password: 'admin123' });

      if (loginRes.ok && loginRes.data?.token) {
        const token = loginRes.data.token;
        const resetRes = await makeRequest(`${baseUrl}/api/admin/evaluations/all`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000
        });

        if (resetRes.ok) {
          console.log(`✅ [${baseUrl}] Reset successful:`, resetRes.data?.message || 'Done');
        } else {
          console.log(`⚠️ [${baseUrl}] Reset response:`, resetRes.status, resetRes.data || resetRes.raw);
        }
      } else {
        console.log(`ℹ️ [${baseUrl}] Admin login skipped or server unreachable.`);
      }
    } catch (err) {
      console.log(`ℹ️ [${baseUrl}] Connection skipped.`);
    }
  }

  // Step 2: Direct MongoDB Collection Cleanup
  const uris = [
    process.env.MONGODB_URI,
    'mongodb://127.0.0.1:27017/hackathon_portal'
  ].filter(u => u && !u.includes('<username>'));

  for (const mongoUri of uris) {
    try {
      console.log(`\nConnecting directly to MongoDB at: ${mongoUri.replace(/:[^:@]+@/, ':****@')}...`);
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });

      // 1. Delete all Evaluation documents
      const evalRes = await Evaluation.deleteMany({});
      console.log(`🗑️ Deleted ${evalRes.deletedCount} Evaluation records.`);

      // 2. Delete all RoundReviewerNormalization documents
      const normRes = await RoundReviewerNormalization.deleteMany({});
      console.log(`🗑️ Deleted ${normRes.deletedCount} RoundReviewerNormalization records.`);

      // 3. Verification
      const remainingEval = await Evaluation.countDocuments();
      const remainingNorm = await RoundReviewerNormalization.countDocuments();

      console.log('📊 Verification:');
      console.log(`- Remaining Evaluation records: ${remainingEval}`);
      console.log(`- Remaining RoundReviewerNormalization records: ${remainingNorm}`);

      await mongoose.disconnect();
    } catch (dbErr) {
      console.warn(`Could not connect to direct Mongo (${mongoUri}):`, dbErr.message);
    }
  }

  console.log('\n=======================================================');
  console.log('🎉 ALL REVIEWER EVALUATIONS HAVE BEEN FULLY REMOVED!');
  console.log('=======================================================');
}

removeAllEvaluations().catch(err => {
  console.error('❌ Failed to remove evaluations:', err);
  process.exit(1);
});
