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

const app = express();
const PORT = config.PORT;

// Enable CORS using FRONTEND_URL environment variable configuration
const allowedOrigins = [
  config.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || config.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (Logos, backgrounds, uploads)
app.use('/assets', express.static(path.join(__dirname, '../client/public')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team', teamRoutes);
app.use('/api', teamRoutes);
app.use('/api', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'College Hackathon ALPHA Server Running', time: new Date() });
});

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
    const { Admin, Volunteer, SystemSettings, ProblemStatement, Team, TeamLead, Participant, AttendanceSession } = require('./models/Schema');
    const bcrypt = require('bcryptjs');

    // Clean up all legacy indexes on teams collection (e.g. payment.utr_1, teamId_1) except _id_ and name_1
    try {
      const indexes = await Team.collection.indexes();
      for (const idx of indexes) {
        if (idx.name !== '_id_' && idx.name !== 'name_1') {
          await Team.collection.dropIndex(idx.name).catch(() => {});
          console.log(`🧹 Dropped legacy index '${idx.name}' from teams collection.`);
        }
      }
    } catch (e) {
      // Ignore if collection does not exist yet
    }

    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      console.log('🌱 Seeding default Admin (admin / admin123)...');
      const passHash = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', passwordHash: passHash, name: 'Head Organizer (Admin)', role: 'ADMIN' });
    }

    const volExists = await Volunteer.findOne({ username: 'volunteer1' });
    if (!volExists) {
      console.log('🌱 Seeding default Volunteer (volunteer1 / vol123)...');
      const volPassHash = await bcrypt.hash('vol123', 10);
      await Volunteer.create({ username: 'volunteer1', passwordHash: volPassHash, name: 'Sarah Connor (Volunteer)', phone: '+91 9876543210' });
    }

    let settings = await SystemSettings.findOne();
    if (!settings) {
      await SystemSettings.create({
        readingDurationMinutes: 30,
        selectionDurationMinutes: 5,
        currentPhase: 'NOT_STARTED',
        teamLeadAccessEnabled: true,
        volunteerAccessEnabled: true,
        problemSelectionEnabled: true,
        attendanceEnabled: true
      });
    }

    const psCount = await ProblemStatement.countDocuments();
    if (psCount === 0) {
      console.log('🌱 Seeding Problem Statements (PS-001 to PS-043 with 2-Team capacity limit)...');
      const problemStatementsData = require('./data/problemStatements');
      const preparedData = problemStatementsData.map(p => ({ ...p, maxTeamCapacity: 2 }));
      await ProblemStatement.insertMany(preparedData);
    } else {
      // Ensure all existing problem statements have maxTeamCapacity: 2 as per requirement
      await ProblemStatement.updateMany({ maxTeamCapacity: { $ne: 2 } }, { $set: { maxTeamCapacity: 2 } });
    }

    const authorizedTeams = require('./data/teamsData');
    const validTeamIds = authorizedTeams.map(t => t.teamId);
    const validRegNums = authorizedTeams.map(t => t.regNum);

    console.log(`🧹 Purging legacy/invalid team records from database...`);

    // 1. Delete Team documents where name is NOT in validTeamIds OR teamLeadRegNum is NOT in validRegNums OR teamLeadRegNum is missing
    await Team.deleteMany({
      $or: [
        { name: { $nin: validTeamIds } },
        { teamLeadRegNum: { $nin: validRegNums } },
        { teamLeadRegNum: { $exists: false } },
        { teamLeadRegNum: null },
        { teamLeadRegNum: '' }
      ]
    });

    // 2. Delete TeamLead documents where registrationNumber is NOT in validRegNums OR missing
    await TeamLead.deleteMany({
      $or: [
        { registrationNumber: { $nin: validRegNums } },
        { registrationNumber: { $exists: false } },
        { registrationNumber: null },
        { registrationNumber: '' }
      ]
    });

    // 3. Delete Participant documents where registrationNumber is NOT in validRegNums
    await Participant.deleteMany({
      $or: [
        { registrationNumber: { $nin: validRegNums } },
        { registrationNumber: { $exists: false } },
        { registrationNumber: null }
      ]
    });

    console.log(`🌱 Ensuring all ${authorizedTeams.length} authorized Teams & Team Leads exist (ALPHA-001 to ALPHA-060)...`);

    for (const item of authorizedTeams) {
      // Find team doc by name / teamId
      let teamDoc = await Team.findOne({ $or: [{ name: item.teamId }, { name: item.teamName }, { teamId: item.teamId }] });

      const qrToken = `TQ-${item.teamId}-${item.regNum.slice(-4)}`;
      const passToken = `EP-${item.teamId}-${item.regNum.slice(-4)}`;

      if (!teamDoc) {
        teamDoc = await Team.create({
          name: item.teamId,
          teamId: item.teamId,
          teamName: item.teamName || item.teamId,
          teamLeadRegNum: item.regNum,
          college: 'KARE',
          department: 'CSE',
          members: item.members || [],
          teamQrToken: qrToken,
          eventPassQrToken: passToken,
          registrationStatus: 'CONFIRMED',
          eventPassStatus: 'ISSUED'
        });
      } else {
        teamDoc.name = item.teamId;
        teamDoc.teamId = item.teamId;
        teamDoc.teamName = item.teamName || item.teamId;
        teamDoc.teamLeadRegNum = item.regNum;
        teamDoc.members = item.members || teamDoc.members;
        if (!teamDoc.college) teamDoc.college = 'KARE';
        if (!teamDoc.teamQrToken) teamDoc.teamQrToken = qrToken;
        if (!teamDoc.eventPassQrToken) teamDoc.eventPassQrToken = passToken;
        await teamDoc.save();
      }

      // Ensure TeamLead doc exists with exact lead name
      const leadDocs = await TeamLead.find({ registrationNumber: item.regNum });
      let leadDoc = null;
      if (leadDocs.length > 0) {
        leadDoc = leadDocs[0];
        for (const doc of leadDocs) {
          if (doc._id.toString() !== leadDoc._id.toString()) {
            await TeamLead.findByIdAndDelete(doc._id);
          }
        }
      }

      if (!leadDoc) {
        leadDoc = await TeamLead.create({
          registrationNumber: item.regNum,
          name: item.leadName || `Team Lead (${item.teamId})`,
          teamId: teamDoc._id,
          phone: '9876543210',
          email: `${item.teamId.toLowerCase()}@hackathon.edu`
        });
      } else {
        leadDoc.teamId = teamDoc._id;
        leadDoc.name = item.leadName || leadDoc.name;
        await leadDoc.save();
      }

      // Ensure Participant doc exists
      let partDoc = await Participant.findOne({ registrationNumber: item.regNum });
      if (!partDoc) {
        await Participant.create({
          registrationNumber: item.regNum,
          name: item.leadName || `Team Lead (${item.teamId})`,
          teamName: item.teamName || item.teamId,
          college: 'KARE',
          department: 'CSE',
          isTeamLead: true,
          qrCodeData: item.regNum
        });
      } else {
        partDoc.teamName = item.teamName || item.teamId;
        partDoc.name = item.leadName || partDoc.name;
        await partDoc.save();
      }
    }

    const sessCount = await AttendanceSession.countDocuments();
    if (sessCount === 0) {
      await AttendanceSession.create({
        sessionId: 'SESS-101',
        sessionName: 'Day 1 Morning Keynote',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00 AM',
        endTime: '10:30 AM',
        status: 'ACTIVE',
        createdBy: 'admin'
      });
    }
  } catch (e) {
    console.error('Auto-seed error:', e);
  }
}

// Global Database Connection Strategy
async function startServer() {
  try {
    let mongoUri = config.MONGODB_URI;

    if (mongoUri) {
      try {
        console.log('Connecting to configured MONGODB_URI...');
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
        console.log('✅ Connected to MongoDB database via Mongoose.');
      } catch (connErr) {
        console.warn('⚠️ Could not connect to remote MONGODB_URI:', connErr.message);
        console.log('⚡ Falling back to embedded MongoDB server engine...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create({ instance: { dbName: 'hackathon_alpha_db' } });
        mongoUri = mongod.getUri();
        await mongoose.connect(mongoUri);
        console.log(`✅ Embedded MongoDB Server started at: ${mongoUri}`);
      }
    } else {
      console.log('⚡ MONGODB_URI not configured in .env. Initializing embedded MongoDB server engine...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({ instance: { dbName: 'hackathon_alpha_db' } });
      mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log(`✅ Embedded MongoDB Server started at: ${mongoUri}`);
    }

    await triggerAutoSeed();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 EVENT ALPHA HACKATHON SERVER ACTIVE ON PORT: ${PORT}`);
      console.log(`   Header Logo: KARE IEEE Education Society`);
      console.log(`   Web App URL: http://localhost:${PORT}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();
