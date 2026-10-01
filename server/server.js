const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/env');

const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teamRoutes = require('./routes/teamRoutes');
const reviewerRoutes = require('./routes/reviewerRoutes');

const app = express();
const PORT = config.PORT;

// Protect against unhandled crashes to keep Render web service online
process.on('uncaughtException', (err) => {
  console.error('🚨 UNCAUGHT EXCEPTION (Process kept alive):', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION (Process kept alive):', reason);
});

// Enable CORS with full preflight support
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (Logos, backgrounds, uploads)
app.use('/assets', express.static(path.join(__dirname, '../client/public')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Health check endpoint (Registered BEFORE any route handlers)
app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'OK',
    version: '1.0.8-alpha-top40-sync',
    message: 'College Hackathon ALPHA Server Running',
    dbState: dbStates[mongoose.connection.readyState] || 'unknown',
    hasMongoUri: Boolean(config.MONGODB_URI),
    time: new Date()
  });
});

// Mount API Routes (Specific path prefixes registered first)
app.use('/api/auth', authRoutes);
app.use('/api/reviewer', reviewerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team', teamRoutes);

const fs = require('fs');

// Serve frontend static build if dist exists
const clientDistPath = path.join(__dirname, '../client/dist');
const indexPath = path.join(clientDistPath, 'index.html');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head><title>College Hackathon ALPHA Server</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 3rem; background: #0f172a; color: #f8fafc;">
        <h1 style="color: #00f2fe;">🚀 EVENT ALPHA HACKATHON SERVER ACTIVE</h1>
        <p>Backend API server is running successfully.</p>
      </body>
    </html>
  `);
});

// Seed helper
async function triggerAutoSeed() {
  try {
    const { Admin, Volunteer, Reviewer, EvaluationRound, SystemSettings, ProblemStatement, ProblemSelection, Team, TeamLead, Participant, AttendanceSession, Attendance } = require('./models/Schema');
    const bcrypt = require('bcryptjs');

    // Clean up all legacy indexes on teams collection
    try {
      const indexes = await Team.collection.indexes();
      for (const idx of indexes) {
        if (idx.name !== '_id_' && idx.name !== 'name_1') {
          await Team.collection.dropIndex(idx.name).catch(() => {});
          console.log(`🧹 Dropped legacy index '${idx.name}' from teams collection.`);
        }
      }
    } catch (e) {}

    // Clean up legacy index regNo_1_checkpoint_1 on attendances collection
    try {
      const attIndexes = await Attendance.collection.indexes();
      for (const idx of attIndexes) {
        if (idx.name.includes('checkpoint') || idx.name.includes('regNo_1')) {
          await Attendance.collection.dropIndex(idx.name).catch(() => {});
          console.log(`🧹 Dropped legacy index '${idx.name}' from attendances collection.`);
        }
      }
    } catch (e) {}

    const adminPassHash = await bcrypt.hash('Admin0509', 10);
    let adminDoc = await Admin.findOne({ 
      $or: [
        { username: 'Admin' },
        { username: 'admin' },
        { username: { $regex: /^admin$/i } }
      ] 
    });
    if (!adminDoc) {
      console.log('🌱 Seeding Admin (Admin / Admin0509)...');
      await Admin.create({ username: 'Admin', passwordHash: adminPassHash, name: 'Head Organizer (Admin)', role: 'ADMIN' });
    } else {
      console.log('🔐 Syncing Admin credentials to Admin / Admin0509...');
      adminDoc.username = 'Admin';
      adminDoc.passwordHash = adminPassHash;
      await adminDoc.save();
    }

    const volExists = await Volunteer.findOne({ username: 'volunteer1' });
    if (!volExists) {
      console.log('🌱 Seeding default Volunteer (volunteer1 / vol123)...');
      const volPassHash = await bcrypt.hash('vol123', 10);
      await Volunteer.create({ username: 'volunteer1', passwordHash: volPassHash, name: 'Event Volunteer', phone: '+91 9876543210' });
    }

    // Seed / Sync Default Reviewers (reviewer1: GEETHA, reviewer2: DINESH, reviewer3: CHINNASAMY / rev123)
    console.log('🌱 Seeding / Syncing Reviewers (reviewer1: GEETHA, reviewer2: DINESH, reviewer3: CHINNASAMY)...');
    const reviewerData = [
      { username: 'reviewer1', name: 'GEETHA', email: 'reviewer1@hackathon.edu' },
      { username: 'reviewer2', name: 'DINESH', email: 'reviewer2@hackathon.edu' },
      { username: 'reviewer3', name: 'CHINNASAMY', email: 'reviewer3@hackathon.edu' }
    ];
    for (const rData of reviewerData) {
      let rDoc = await Reviewer.findOne({ username: rData.username });
      if (!rDoc) {
        const revPassHash = await bcrypt.hash('rev123', 10);
        rDoc = await Reviewer.create({
          username: rData.username,
          passwordHash: revPassHash,
          name: rData.name,
          email: rData.email,
          role: 'REVIEWER'
        });
      } else if (rDoc.name !== rData.name) {
        rDoc.name = rData.name;
        await rDoc.save();
      }
    }

    // Update reviewerName in any existing evaluations and normalization documents
    try {
      const { Evaluation, RoundReviewerNormalization } = require('./models/Schema');
      await Evaluation.updateMany({ reviewerUsername: 'reviewer1' }, { $set: { reviewerName: 'GEETHA' } });
      await Evaluation.updateMany({ reviewerUsername: 'reviewer2' }, { $set: { reviewerName: 'DINESH' } });
      await Evaluation.updateMany({ reviewerUsername: 'reviewer3' }, { $set: { reviewerName: 'CHINNASAMY' } });

      await RoundReviewerNormalization.updateMany({ reviewerUsername: 'reviewer1' }, { $set: { reviewerName: 'GEETHA' } });
      await RoundReviewerNormalization.updateMany({ reviewerUsername: 'reviewer2' }, { $set: { reviewerName: 'DINESH' } });
      await RoundReviewerNormalization.updateMany({ reviewerUsername: 'reviewer3' }, { $set: { reviewerName: 'CHINNASAMY' } });
    } catch (e) {}

    // Seed / Update Evaluation Rounds (100 Marks per round)
    const defaultRoundsConfig = [
      {
        roundNumber: 1,
        roundName: 'Round 1 - Ideation & Architecture',
        description: 'Evaluation of team problem understanding, innovation, feasibility, and presentation.',
        maximumMarks: 100,
        active: true,
        criteria: [
          { key: 'innovation', name: 'Innovation & Originality', maxMarks: 20, description: 'Novelty & uniqueness of solution' },
          { key: 'tech_approach', name: 'Technical Approach & Architecture', maxMarks: 20, description: 'System design & technical planning' },
          { key: 'problem_understanding', name: 'Problem Understanding', maxMarks: 20, description: 'Clarity on problem domain & scope' },
          { key: 'feasibility', name: 'Feasibility & Practicality', maxMarks: 15, description: 'Practical execution capability' },
          { key: 'presentation', name: 'Presentation & Defense', maxMarks: 15, description: 'Team communication & clarity' },
          { key: 'overall_impact', name: 'Overall Impact & Scalability', maxMarks: 10, description: 'Potential value & scalability' }
        ]
      },
      {
        roundNumber: 2,
        roundName: 'Round 2 - Implementation & Coding',
        description: 'Evaluation of codebase quality, complexity, and working demo.',
        maximumMarks: 100,
        active: false,
        status: 'CLOSED',
        criteria: [
          { key: 'code_quality', name: 'Code Quality & Structure', maxMarks: 25, description: 'Clean code & architectural standards' },
          { key: 'tech_complexity', name: 'Technical Complexity & Depth', maxMarks: 25, description: 'Algorithmic & engineering complexity' },
          { key: 'functionality', name: 'Functionality & Working Demo', maxMarks: 25, description: 'Working features & execution' },
          { key: 'ui_ux', name: 'UI/UX & User Interface', maxMarks: 25, description: 'Design quality & user experience' }
        ]
      },
      {
        roundNumber: 3,
        roundName: 'Round 3 - Final Demo & Pitch',
        description: 'Evaluation of project completeness, business viability, and live pitch.',
        maximumMarks: 100,
        active: false,
        status: 'CLOSED',
        criteria: [
          { key: 'completeness', name: 'Project Completeness & Stability', maxMarks: 35, description: 'Finished product & system stability' },
          { key: 'business_value', name: 'Business Value & Viability', maxMarks: 35, description: 'Market utility & real-world value' },
          { key: 'final_pitch', name: 'Final Presentation & Q/A Defense', maxMarks: 30, description: 'Pitch defense & Q/A answers' }
        ]
      }
    ];

    for (const rd of defaultRoundsConfig) {
      let rDoc = await EvaluationRound.findOne({ roundNumber: rd.roundNumber });
      if (!rDoc) {
        await EvaluationRound.create({
          ...rd,
          active: rd.roundNumber === 1,
          status: rd.roundNumber === 1 ? 'ACTIVE' : 'CLOSED'
        });
      } else {
        rDoc.maximumMarks = 100;
        rDoc.criteria = rd.criteria;
        rDoc.roundName = rd.roundName;
        await rDoc.save();
      }
    }

    let settings = await SystemSettings.findOne();
    if (!settings) {
      await SystemSettings.create({
        readingDurationMinutes: 30,
        selectionDurationMinutes: 5,
        currentPhase: 'NOT_RELEASED',
        problemStatementsReleased: false,
        releaseManualState: 'UNRELEASED',
        selectionManualState: 'CLOSED',
        teamLeadAccessEnabled: true,
        volunteerAccessEnabled: true,
        problemSelectionEnabled: false,
        attendanceEnabled: true
      });
    }

    // Synchronize Fixed Problem Statements (PS-001 to PS-040) & Lock Team Assignments
    const { syncFixedTeamProblemStatements } = require('./services/fixedTeamAssignmentService');
    await syncFixedTeamProblemStatements();

    // Always ensure Team 50 (9824005012) and Team 61 (9824005007) are properly separated and synchronized
    const team50Members = [
      { name: 'BOPADALA NAGA SANJAY', registrationNumber: '9824005012', role: 'LEAD' },
      { name: 'MORUMPALLI BHANUPRAKASH REDDY', registrationNumber: '9824005010', role: 'MEMBER' },
      { name: 'CHEMBETI VINAY HARSHA', registrationNumber: '9923005067', role: 'MEMBER' },
      { name: 'Y.PATHIV', registrationNumber: '9923005315', role: 'MEMBER' }
    ];
    const team61Members = [
      { name: 'VUTAKANTI SREEKANTH REDDY', registrationNumber: '9824005007', role: 'LEAD' },
      { name: 'RAAVULA VINAY', registrationNumber: '9923005124', role: 'MEMBER' },
      { name: 'KOLA ADARSH', registrationNumber: '9923005097', role: 'MEMBER' },
      { name: 'GORLA UPENDRA', registrationNumber: '9923005005', role: 'MEMBER' }
    ];

    // Free up any conflicting tokens
    await Team.updateMany(
      { teamQrToken: 'TQ-ALPHA-050-5012', $and: [{ teamId: { $ne: 'ALPHA-050' } }, { name: { $ne: 'ALPHA-050' } }] },
      { $set: { teamQrToken: 'TQ-ALPHA-061-5007', eventPassQrToken: 'EP-ALPHA-061-5007' } }
    ).catch(() => {});

    let t50 = await Team.findOne({ $or: [{ teamId: 'ALPHA-050' }, { name: 'ALPHA-050' }] });
    if (!t50) {
      t50 = await Team.create({
        name: 'ALPHA-050',
        teamId: 'ALPHA-050',
        teamName: 'STRANGER THINGS',
        teamLeadRegNum: '9824005012',
        college: 'KARE',
        department: 'CSE',
        members: team50Members,
        teamQrToken: 'TQ-ALPHA-050-5012',
        eventPassQrToken: 'EP-ALPHA-050-5012',
        registrationStatus: 'CONFIRMED',
        eventPassStatus: 'ISSUED'
      });
    } else {
      t50.name = 'ALPHA-050';
      t50.teamId = 'ALPHA-050';
      t50.teamName = 'STRANGER THINGS';
      t50.teamLeadRegNum = '9824005012';
      t50.members = team50Members;
      t50.teamQrToken = 'TQ-ALPHA-050-5012';
      t50.eventPassQrToken = 'EP-ALPHA-050-5012';
      await t50.save();
    }

    let t61 = await Team.findOne({ $or: [{ teamId: 'ALPHA-061' }, { name: 'ALPHA-061' }] });
    if (!t61 || (t50 && t61._id.toString() === t50._id.toString())) {
      t61 = await Team.create({
        name: 'ALPHA-061',
        teamId: 'ALPHA-061',
        teamName: 'TEAM 61',
        teamLeadRegNum: '9824005007',
        college: 'KARE',
        department: 'CSE',
        members: team61Members,
        teamQrToken: 'TQ-ALPHA-061-5007',
        eventPassQrToken: 'EP-ALPHA-061-5007',
        registrationStatus: 'CONFIRMED',
        eventPassStatus: 'ISSUED'
      });
    } else {
      t61.name = 'ALPHA-061';
      t61.teamId = 'ALPHA-061';
      t61.teamName = 'TEAM 61';
      t61.teamLeadRegNum = '9824005007';
      t61.members = team61Members;
      t61.teamQrToken = 'TQ-ALPHA-061-5007';
      t61.eventPassQrToken = 'EP-ALPHA-061-5007';
      await t61.save();
    }

    if (t50) {
      await TeamLead.findOneAndUpdate(
        { registrationNumber: '9824005012' },
        { name: 'BOPADALA NAGA SANJAY', teamId: t50._id, registrationNumber: '9824005012', phone: '9876543210', email: 'alpha-050@hackathon.edu' },
        { upsert: true }
      );
    }
    if (t61) {
      await TeamLead.findOneAndUpdate(
        { registrationNumber: '9824005007' },
        { name: 'VUTAKANTI SREEKANTH REDDY', teamId: t61._id, registrationNumber: '9824005007', phone: '9876543210', email: 'alpha-061@hackathon.edu' },
        { upsert: true }
      );
    }

    const existingTeamsCount = await Team.countDocuments();
    if (existingTeamsCount >= 60) {
      console.log(`✅ All ${existingTeamsCount} teams already initialized in database. Fast boot enabled.`);
      return;
    }

    const authorizedTeams = require('./data/teamsData');
    console.log(`🌱 Initializing ${authorizedTeams.length} authorized Teams & Team Leads in bulk...`);

    const teamOps = authorizedTeams.map(item => ({
      updateOne: {
        filter: { name: item.teamId },
        update: {
          $setOnInsert: {
            name: item.teamId,
            teamId: item.teamId,
            teamName: item.teamName || item.teamId,
            teamLeadRegNum: item.regNum,
            college: 'KARE',
            department: 'CSE',
            members: item.members || [],
            teamQrToken: `TQ-${item.teamId}-${item.regNum.slice(-4)}`,
            eventPassQrToken: `EP-${item.teamId}-${item.regNum.slice(-4)}`,
            registrationStatus: 'CONFIRMED',
            eventPassStatus: 'ISSUED'
          }
        },
        upsert: true
      }
    }));

    const leadOps = authorizedTeams.map(item => ({
      updateOne: {
        filter: { registrationNumber: item.regNum },
        update: {
          $setOnInsert: {
            registrationNumber: item.regNum,
            name: item.leadName || `Team Lead (${item.teamId})`,
            phone: '9876543210',
            email: `${item.teamId.toLowerCase()}@hackathon.edu`
          }
        },
        upsert: true
      }
    }));

    await Promise.all([Team.bulkWrite(teamOps), TeamLead.bulkWrite(leadOps)]);
    console.log(`✅ Bulk initialized ${authorizedTeams.length} Teams and Team Leads.`);
  } catch (e) {
    console.error('Auto-seed error:', e);
  }
}

// Global Express Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('🚨 Express Error Handler caught:', err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || 'An unexpected internal server error occurred.'
    });
  }
});

// Start Express listening immediately on 0.0.0.0 so Render port binding and health checks succeed instantly
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 EVENT ALPHA HACKATHON SERVER ACTIVE ON PORT: ${PORT}`);
  console.log(`   Header Logo: KARE IEEE Education Society`);
  console.log(`   Binding: 0.0.0.0:${PORT}`);
  console.log(`=======================================================`);
});

// Global Database Connection Strategy
async function connectDatabase() {
  let mongoUri = config.MONGODB_URI;

  if (mongoUri) {
    try {
      console.log('Connecting to configured MONGODB_URI...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 20000 });
      console.log('✅ Connected to MongoDB database via Mongoose.');
      return;
    } catch (connErr) {
      console.warn('⚠️ Could not connect to remote MONGODB_URI:', connErr.message);
    }
  }

  try {
    console.log('⚡ Initializing embedded MongoDB server engine...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({ instance: { dbName: 'hackathon_alpha_db' } });
    mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
    console.log(`✅ Embedded MongoDB Server started at: ${mongoUri}`);
  } catch (memErr) {
    console.error('⚠️ Embedded MongoDB failed to initialize:', memErr.message);
  }
}

// Connect database and run auto-seed asynchronously
connectDatabase()
  .then(() => {
    triggerAutoSeed().catch(err => console.error('Auto-seed error:', err));
  })
  .catch(err => {
    console.error('Database connection process error:', err);
  });

