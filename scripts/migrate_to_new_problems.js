const path = require('path');
const mongoose = require(path.join(__dirname, '../server/node_modules/mongoose'));
const dotenv = require(path.join(__dirname, '../server/node_modules/dotenv'));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const { ProblemStatement, ProblemSelection, Team } = require('../server/models/Schema');
const newProblemStatements = require('../server/data/problemStatements');

async function migrate() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hackathon_portal';
  console.log(`Connecting to MongoDB at: ${mongoUri}...`);
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB successfully.');

  console.log('🗑️ Step 1: Deleting legacy problem statements...');
  const deletePsRes = await ProblemStatement.deleteMany({});
  console.log(`Deleted ${deletePsRes.deletedCount} old problem statements.`);

  console.log('🗑️ Step 2: Clearing existing problem selections...');
  const deleteSelRes = await ProblemSelection.deleteMany({});
  console.log(`Deleted ${deleteSelRes.deletedCount} old problem selections.`);

  console.log('🔄 Step 3: Resetting team problem selections in Team collection...');
  const updateTeamsRes = await Team.updateMany({}, {
    $set: {
      selectedProblemId: null,
      selectedProblemCode: 'Not Selected',
      selectionConfirmed: false,
      selectedAt: null
    }
  });
  console.log(`Reset problem selection for ${updateTeamsRes.modifiedCount} teams.`);

  console.log(`🌱 Step 4: Seeding ${newProblemStatements.length} new problem statements...`);
  const preparedData = newProblemStatements.map(p => ({
    ...p,
    maxTeamCapacity: 2,
    selectedCount: 0,
    status: 'PUBLISHED'
  }));

  const insertRes = await ProblemStatement.insertMany(preparedData);
  console.log(`✅ Successfully inserted ${insertRes.length} new problem statements.`);

  // Verification & Domain breakdown
  const domainCounts = await ProblemStatement.aggregate([
    { $group: { _id: '$domain', count: { $sum: 1 } } }
  ]);
  console.log('\n📊 Domain breakdown:');
  domainCounts.forEach(d => console.log(`   - ${d._id}: ${d.count} statements`));

  const total = await ProblemStatement.countDocuments();
  console.log(`\n🎉 Total Problem Statements in DB: ${total}`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB. Migration completed successfully!');
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
