const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/env');

const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/adminRoutes');

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
app.use('/api/problems', problemRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'College Hackathon ALPHA Server Running', time: new Date() });
});

// Serve frontend static build if dist exists
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Seed helper
async function triggerAutoSeed() {
  try {
    const { Admin, Volunteer, SystemSettings, ProblemStatement, Team, TeamLead, Participant, AttendanceSession } = require('./models/Schema');
    const bcrypt = require('bcryptjs');

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
    console.log(`🌱 Ensuring all ${authorizedTeams.length} authorized Teams & Team Leads exist (ALPHA-001 to ALPHA-060)...`);

    for (const item of authorizedTeams) {
      let teamDoc = await Team.findOne({ name: item.teamId });
      if (!teamDoc) {
        teamDoc = await Team.create({
          name: item.teamId,
          teamLeadRegNum: item.regNum,
          college: 'KARE',
          department: 'CSE',
          members: [
            { name: `Team Lead (${item.teamId})`, registrationNumber: item.regNum, role: 'LEAD', phone: '9876543210' },
            { name: `Member 1 (${item.teamId})`, registrationNumber: `${item.regNum}-M1`, role: 'MEMBER', phone: '9876543211' }
          ]
        });
      }

      let leadDoc = await TeamLead.findOne({ registrationNumber: item.regNum });
      if (!leadDoc) {
        await TeamLead.create({
          registrationNumber: item.regNum,
          name: `Team Lead (${item.teamId})`,
          teamId: teamDoc._id,
          phone: '9876543210',
          email: `${item.teamId.toLowerCase()}@hackathon.edu`
        });
      }

      let partDoc = await Participant.findOne({ registrationNumber: item.regNum });
      if (!partDoc) {
        await Participant.create({
          registrationNumber: item.regNum,
          name: `Team Lead (${item.teamId})`,
          teamName: item.teamId,
          college: 'KARE',
          department: 'CSE',
          isTeamLead: true,
          qrCodeData: item.regNum
        });
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
