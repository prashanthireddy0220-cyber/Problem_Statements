const bcrypt = require('bcryptjs');

// In-Memory Document Collection Class with Mongoose-compatible API
class Collection {
  constructor(name) {
    this.name = name;
    this.docs = [];
  }

  _generateId() {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  }

  async find(query = {}) {
    let result = [...this.docs];
    if (query.status) result = result.filter(d => d.status === query.status);
    if (query.domain && query.domain !== 'ALL') result = result.filter(d => d.domain === query.domain);
    if (query.difficulty && query.difficulty !== 'ALL') result = result.filter(d => d.difficulty === query.difficulty);
    if (query.role) result = result.filter(d => d.role === query.role);
    if (query.sessionId) result = result.filter(d => d.sessionId === query.sessionId);

    if (query.$or && Array.isArray(query.$or)) {
      result = result.filter(doc => {
        return query.$or.some(condition => {
          return Object.entries(condition).every(([key, val]) => {
            if (val && val.$regex) {
              const reg = new RegExp(val.$regex, val.$options || 'i');
              return reg.test(doc[key] || '');
            }
            return doc[key] === val;
          });
        });
      });
    }

    return {
      sort: (sortObj) => {
        return result.sort((a, b) => {
          const key = Object.keys(sortObj)[0];
          const dir = sortObj[key];
          if (a[key] < b[key]) return dir === -1 ? 1 : -1;
          if (a[key] > b[key]) return dir === -1 ? -1 : 1;
          return 0;
        });
      },
      limit: (n) => result.slice(0, n)
    };
  }

  async findOne(query = {}) {
    return this.docs.find(doc => {
      return Object.entries(query).every(([key, val]) => {
        if (key === '$or' && Array.isArray(val)) {
          return val.some(cond => {
            return Object.entries(cond).every(([k, v]) => {
              if (v && v.$regex) {
                return new RegExp(v.$regex, v.$options || 'i').test(doc[k] || '');
              }
              return doc[k] === v;
            });
          });
        }
        return doc[key] === val;
      });
    }) || null;
  }

  async findById(id) {
    return this.docs.find(d => d._id === id || d.id === id) || null;
  }

  async findByIdAndDelete(id) {
    const idx = this.docs.findIndex(d => d._id === id || d.id === id);
    if (idx !== -1) {
      const removed = this.docs[idx];
      this.docs.splice(idx, 1);
      return removed;
    }
    return null;
  }

  async create(data) {
    if (Array.isArray(data)) {
      const created = data.map(d => ({ _id: this._generateId(), createdAt: new Date(), updatedAt: new Date(), ...d }));
      this.docs.push(...created);
      return created;
    }
    const doc = { _id: this._generateId(), createdAt: new Date(), updatedAt: new Date(), ...data };
    this.docs.push(doc);
    return doc;
  }

  async insertMany(dataArray) {
    return this.create(dataArray);
  }

  // ATOMIC SELECTION FIND ONE AND UPDATE (Prevents Overbooking)
  async findOneAndUpdate(query = {}, update = {}, options = {}) {
    const doc = await this.findOne(query);
    if (!doc) return null;

    if (update.$inc) {
      Object.entries(update.$inc).forEach(([key, val]) => {
        doc[key] = (doc[key] || 0) + val;
      });
    }
    if (update.$set) {
      Object.entries(update.$set).forEach(([key, val]) => {
        doc[key] = val;
      });
    }
    doc.updatedAt = new Date();
    return doc;
  }

  async findByIdAndUpdate(id, update = {}) {
    const doc = await this.findById(id);
    if (!doc) return null;
    if (update.$inc) {
      Object.entries(update.$inc).forEach(([key, val]) => {
        doc[key] = (doc[key] || 0) + val;
      });
    }
    return doc;
  }

  async updateOne(query = {}, update = {}) {
    const doc = await this.findOne(query);
    if (!doc) return null;
    if (update.$set) {
      Object.entries(update.$set).forEach(([key, val]) => {
        doc[key] = val;
      });
    }
    return doc;
  }

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      const count = this.docs.length;
      this.docs = [];
      return { deletedCount: count };
    }
    const initial = this.docs.length;
    this.docs = this.docs.filter(doc => {
      return !Object.entries(query).every(([key, val]) => doc[key] === val);
    });
    return { deletedCount: initial - this.docs.length };
  }

  async countDocuments(query = {}) {
    if (Object.keys(query).length === 0) return this.docs.length;
    const items = await this.find(query);
    return Array.isArray(items) ? items.length : (items.sort ? this.docs.length : 0);
  }
}

// Instantiate Collections
const db = {
  Admin: new Collection('Admin'),
  TeamLead: new Collection('TeamLead'),
  Team: new Collection('Team'),
  Participant: new Collection('Participant'),
  ProblemStatement: new Collection('ProblemStatement'),
  ProblemSelection: new Collection('ProblemSelection'),
  AttendanceSession: new Collection('AttendanceSession'),
  Attendance: new Collection('Attendance'),
  Volunteer: new Collection('Volunteer'),
  ActiveSession: new Collection('ActiveSession'),
  SystemSettings: new Collection('SystemSettings'),
  AuditLog: new Collection('AuditLog')
};

// Auto Seed function
async function seedInstantDb() {
  const passHash = await bcrypt.hash('admin123', 10);
  await db.Admin.create({ username: 'admin', passwordHash: passHash, name: 'Head Organizer (Admin)', role: 'ADMIN' });

  const volPassHash = await bcrypt.hash('vol123', 10);
  await db.Volunteer.create({ username: 'volunteer1', passwordHash: volPassHash, name: 'Sarah Connor (Volunteer)', phone: '+91 9876543210' });

  await db.SystemSettings.create({
    readingDurationMinutes: 30,
    selectionDurationMinutes: 5,
    currentPhase: 'NOT_STARTED',
    teamLeadAccessEnabled: true,
    volunteerAccessEnabled: true,
    problemSelectionEnabled: true,
    attendanceEnabled: true
  });

  await db.ProblemStatement.insertMany([
    {
      problemId: 'PS-001',
      title: 'Smart Campus Waste & Energy Management System',
      description: 'Develop an IoT-integrated AI framework to optimize waste segregation, bin fullness tracking, and dynamic energy conservation across university campus buildings.',
      background: 'College campuses produce tons of unsegregated waste and consume vast power during off-peak hours.',
      expectedSolution: 'A web portal with IoT dashboard, predictive route optimization for collection vans, and automated power usage control.',
      requirements: ['Real-time telemetry chart', 'Alert notifications', 'Role-based access'],
      constraints: ['Latency under 2 seconds', 'Mobile responsive UI'],
      domain: 'IoT & Smart Energy',
      difficulty: 'Medium',
      technologies: ['React', 'Node.js', 'MQTT', 'TensorFlow', 'MongoDB'],
      maxTeamCapacity: 3,
      selectedCount: 0,
      status: 'PUBLISHED'
    },
    {
      problemId: 'PS-002',
      title: 'AI-Powered Deepfake Video & Synthetic Media Detection',
      description: 'Create a deep-learning web platform that analyzes uploaded video frames and audio spectrums to identify manipulated facial expressions and synthetic voice overlays.',
      background: 'Deepfakes pose severe security risks to identity verification and digital journalism.',
      expectedSolution: 'Browser application allowing file upload, visual heatmap analysis, confidence scoring, and cryptographic authenticity verification.',
      requirements: ['Confidence score meter', 'Heatmap overlay generator', 'Report export PDF'],
      constraints: ['Video size up to 100MB', 'Process within 30 seconds'],
      domain: 'AI & Cybersecurity',
      difficulty: 'Hard',
      technologies: ['Python', 'PyTorch', 'OpenCV', 'React', 'FastAPI'],
      maxTeamCapacity: 4,
      selectedCount: 0,
      status: 'PUBLISHED'
    },
    {
      problemId: 'PS-003',
      title: 'Decentralized Academic Credentials Verification Network',
      description: 'Build a tamper-proof blockchain system enabling universities to issue digital degrees and transcript hashes, allowing employers to verify certificates instantly without intermediaries.',
      background: 'Manual certificate verification takes weeks and is prone to counterfeit credentials.',
      expectedSolution: 'Smart contract system with QR-code verification portal for instant employer validation.',
      requirements: ['Metamask integration', 'QR generation', 'Zero-knowledge proof verification'],
      constraints: ['Low gas footprint', 'Instant verification'],
      domain: 'Web3 & Blockchain',
      difficulty: 'Medium',
      technologies: ['Solidity', 'Ethers.js', 'React', 'IPFS'],
      maxTeamCapacity: 5,
      selectedCount: 0,
      status: 'PUBLISHED'
    },
    {
      problemId: 'PS-004',
      title: 'Automated Emergency Traffic Corridor & Ambulance Router',
      description: 'Engineered intelligent traffic management algorithm that clears green corridors for emergency vehicles based on live GPS location and hospital triage urgency.',
      background: 'Traffic congestion delays ambulances, resulting in critical loss of human life.',
      expectedSolution: 'Web dispatch control dashboard for ambulance drivers and traffic authority traffic lights.',
      requirements: ['Live GPS map routing', 'Automated signal control', 'ETA calculator'],
      constraints: ['Failover safety mechanism'],
      domain: 'Smart Cities & AI',
      difficulty: 'Hard',
      technologies: ['Leaflet Map', 'Node.js', 'WebSockets', 'PostGIS'],
      maxTeamCapacity: 3,
      selectedCount: 0,
      status: 'PUBLISHED'
    },
    {
      problemId: 'PS-005',
      title: 'Intelligent Student Mental Health Tracker & Early Support Agent',
      description: 'A privacy-first conversational companion and sentiment analyzer for university students, detecting stress spikes and connecting them to peer counselors anonymously.',
      background: 'Academic pressure leads to anxiety, but students hesitate to seek therapy.',
      expectedSolution: 'Mobile-first web app with secure anonymous mood logging, NLP sentiment dashboard, and counselor booking.',
      requirements: ['End-to-end encryption', 'Anonymous chat', 'Mood analytics chart'],
      constraints: ['Strict data privacy'],
      domain: 'Healthcare & NLP',
      difficulty: 'Easy',
      technologies: ['React', 'Express', 'Tailwind', 'Natural NLP'],
      maxTeamCapacity: 5,
      selectedCount: 0,
      status: 'PUBLISHED'
    }
  ]);

  const authorizedTeams = require('../data/teamsData');

  for (const item of authorizedTeams) {
    const teamDoc = await db.Team.create({
      name: item.teamId,
      teamLeadRegNum: item.regNum,
      college: 'KARE',
      department: 'CSE',
      members: [
        { name: `Team Lead (${item.teamId})`, registrationNumber: item.regNum, role: 'LEAD', phone: '9876543210' },
        { name: `Member 1 (${item.teamId})`, registrationNumber: `${item.regNum}-M1`, role: 'MEMBER', phone: '9876543211' }
      ]
    });

    await db.TeamLead.create({
      registrationNumber: item.regNum,
      name: `Team Lead (${item.teamId})`,
      teamId: teamDoc._id,
      phone: '9876543210',
      email: `${item.teamId.toLowerCase()}@hackathon.edu`
    });

    await db.Participant.create({
      registrationNumber: item.regNum,
      name: `Team Lead (${item.teamId})`,
      teamName: item.teamId,
      college: 'KARE',
      department: 'CSE',
      isTeamLead: true,
      qrCodeData: item.regNum
    });
  }

  await db.AttendanceSession.create({
    sessionId: 'SESS-101',
    sessionName: 'Day 1 Morning Keynote',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    status: 'ACTIVE',
    createdBy: 'admin'
  });
}

seedInstantDb();

module.exports = db;
