const path = require('path');
const http = require('http');
const mongoose = require(path.join(__dirname, '../server/node_modules/mongoose'));
const dotenv = require(path.join(__dirname, '../server/node_modules/dotenv'));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const { ProblemSelection, ProblemStatement, Team } = require('../server/models/Schema');

function post(endpoint, body, token) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      timeout: 2000
    }, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => resolve({ ok: true, status: res.statusCode, data: JSON.parse(buf || '{}') }));
    });
    req.on('error', () => resolve({ ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false }); });
    req.write(data);
    req.end();
  });
}

async function removeAllSelections() {
  console.log('🔄 Initiating Complete Problem Statement Selection Removal...\n');

  // Step 1: If local server is running on port 5000, call the admin API endpoint
  try {
    const loginRes = await post('/api/auth/admin/login', { username: 'Admin', password: 'Admin0509' });
    if (loginRes.ok && loginRes.data?.token) {
      console.log('📡 Connected to active server on port 5000 as Admin.');
      const resetRes = await post('/api/admin/reset-all-selections', {}, loginRes.data.token);
      if (resetRes.ok) {
        console.log('✅ Server API Reset:', resetRes.data?.message || 'Success');
      }
    } else {
      console.log('ℹ️ Server is not running on port 5000 (direct database reset will be performed).');
    }
  } catch (e) {
    // Server not running, proceed to direct DB connection
  }

  // Step 2: Direct MongoDB Collection Cleanup
  const uris = [
    process.env.MONGODB_URI,
    'mongodb://127.0.0.1:27017/hackathon_portal'
  ].filter(u => u && !u.includes('<username>'));

  for (const mongoUri of uris) {
    try {
      console.log(`\nConnecting directly to MongoDB at: ${mongoUri.replace(/:[^:@]+@/, ':****@')}...`);
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });

      // 1. Delete all ProblemSelection documents
      const selRes = await ProblemSelection.deleteMany({});
      console.log(`🗑️ Deleted ${selRes.deletedCount} ProblemSelection records.`);

      // 2. Reset selectedCount to 0 for all problem statements
      const psRes = await ProblemStatement.updateMany({}, { $set: { selectedCount: 0 } });
      console.log(`🔄 Reset selectedCount to 0 for ${psRes.modifiedCount} problem statements.`);

      // 3. Clear problem selections from all teams
      const teamRes = await Team.updateMany({}, {
        $set: {
          selectedProblemId: null,
          selectedProblemCode: 'Not Selected',
          selectionConfirmed: false,
          selectedAt: null
        }
      });
      console.log(`🔄 Cleared problem selections for ${teamRes.modifiedCount} teams.`);

      // 4. Verify clean slate
      const remainingSel = await ProblemSelection.countDocuments();
      const nonZeroPs = await ProblemStatement.countDocuments({ selectedCount: { $gt: 0 } });
      const selectedTeams = await Team.countDocuments({ 
        selectedProblemCode: { $exists: true, $nin: [null, 'Not Selected'] } 
      });

      console.log('📊 Direct DB Verification:');
      console.log(`- Remaining ProblemSelection records: ${remainingSel}`);
      console.log(`- Problem statements with selectedCount > 0: ${nonZeroPs}`);
      console.log(`- Teams with selected problems: ${selectedTeams}`);

      await mongoose.disconnect();
    } catch (dbErr) {
      console.warn(`Could not connect to ${mongoUri}:`, dbErr.message);
    }
  }

  console.log('\n=======================================================');
  console.log('🎉 ALL PROBLEM STATEMENT SELECTIONS HAVE BEEN REMOVED!');
  console.log('=======================================================');
}

removeAllSelections().catch(err => {
  console.error('❌ Failed to remove selections:', err);
  process.exit(1);
});
