const path = require('path');
const mongoose = require(path.join(__dirname, '../server/node_modules/mongoose'));
const dotenv = require(path.join(__dirname, '../server/node_modules/dotenv'));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const { ProblemStatement } = require('../server/models/Schema');
const problemStatements = require('../server/data/problemStatements');

async function sync() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hackathon_portal';
  console.log(`Connecting to MongoDB at: ${mongoUri}...`);
  await mongoose.connect(mongoUri);

  for (const p of problemStatements) {
    await ProblemStatement.updateOne(
      { problemId: p.problemId },
      {
        $setOnInsert: {
          ...p,
          maxTeamCapacity: 2,
          selectedCount: 0,
          status: 'PUBLISHED'
        }
      },
      { upsert: true }
    );
  }

  const total = await ProblemStatement.countDocuments();
  console.log('Total Problem Statements in MongoDB now:', total);
  const ps41_42 = await ProblemStatement.find({ problemId: { $in: ['PS-041', 'PS-042'] } });
  console.log('Added Problem Statements:');
  ps41_42.forEach(p => {
    console.log(`- ${p.problemId}: ${p.title} (${p.domain})`);
    console.log(`  Technologies: ${p.technologies.join(', ')}`);
  });

  await mongoose.disconnect();
}

sync().catch(err => {
  console.error('Sync error:', err);
  process.exit(1);
});
