const mongoose = require('mongoose');

// 1. Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Administrator' },
  role: { type: String, default: 'ADMIN' }
}, { timestamps: true });

// 2. Team Lead Schema
const TeamLeadSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  phone: { type: String },
  email: { type: String },
  activeSessionId: { type: String, default: null },
  revoked: { type: Boolean, default: false }
}, { timestamps: true });

// 3. Team Schema
const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  teamId: { type: String },
  teamLeadRegNum: { type: String, required: true },
  college: { type: String, default: 'KARE' },
  department: { type: String, default: 'CSE' },
  members: [{
    name: String,
    registrationNumber: String,
    role: String,
    phone: String,
    email: String
  }],
  selectedProblemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProblemStatement', default: null },
  selectedProblemCode: { type: String, default: null },
  selectionConfirmed: { type: Boolean, default: false },
  selectedAt: { type: Date, default: null },
  teamQrToken: { type: String, unique: true, sparse: true },
  registrationStatus: { type: String, default: 'CONFIRMED' },
  eventPassStatus: { type: String, default: 'ISSUED' },
  eventPassQrToken: { type: String, sparse: true }
}, { timestamps: true });

// 4. Participant Schema
const ParticipantSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  teamName: { type: String, required: true },
  college: { type: String, default: 'KARE' },
  department: { type: String, default: 'CSE' },
  isTeamLead: { type: Boolean, default: false },
  qrCodeData: { type: String }
}, { timestamps: true });

// 5. Problem Statement Schema
const ProblemStatementSchema = new mongoose.Schema({
  problemId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  background: { type: String, default: '' },
  expectedSolution: { type: String, default: '' },
  requirements: [{ type: String }],
  constraints: [{ type: String }],
  domain: { type: String, default: 'General' },
  difficulty: { type: String, default: 'Medium' },
  technologies: [{ type: String }],
  maxTeamCapacity: { type: Number, default: 2 },
  selectedCount: { type: Number, default: 0 },
  pdfUrl: { type: String, default: '' },
  status: { type: String, default: 'PUBLISHED' }
}, { timestamps: true });

// 6. Problem Selection Schema
const ProblemSelectionSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamLeadRegNum: { type: String, required: true },
  problemStatementId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProblemStatement', required: true },
  selectedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'CONFIRMED' }
}, { timestamps: true });
ProblemSelectionSchema.index({ teamId: 1 }, { unique: true });

// 7. Attendance Session Schema
const AttendanceSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  sessionName: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, default: 'UPCOMING' },
  createdBy: { type: String, default: 'Admin' }
}, { timestamps: true });

// 8. Attendance Record Schema
const AttendanceSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  sessionName: { type: String, required: true },
  participantRegNum: { type: String, required: true, index: true },
  participantName: { type: String, required: true },
  teamName: { type: String, required: true },
  teamId: { type: String },
  college: { type: String },
  status: { type: String, enum: ['PRESENT', 'ABSENT'], default: 'PRESENT' },
  markedByVolunteer: { type: String, required: true },
  markedAt: { type: Date, default: Date.now }
}, { timestamps: true });
AttendanceSchema.index({ sessionId: 1, participantRegNum: 1 }, { unique: true });

// 9. Volunteer Schema
const VolunteerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String }
}, { timestamps: true });

// 10. Active Sessions Schema
const ActiveSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  registrationNumber: { type: String },
  role: { type: String, required: true },
  sessionId: { type: String, required: true, unique: true, index: true },
  deviceId: { type: String, default: 'default-device' },
  loginTime: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, { timestamps: true });

// 11. System Settings Schema
const SystemSettingsSchema = new mongoose.Schema({
  readingDurationMinutes: { type: Number, default: 30 },
  selectionDurationMinutes: { type: Number, default: 5 },
  readingStartedAt: { type: Date, default: null },
  readingEndsAt: { type: Date, default: null },
  selectionStartedAt: { type: Date, default: null },
  selectionEndsAt: { type: Date, default: null },
  problemStatementsReleased: { type: Boolean, default: false },
  selectionScheduledStart: { type: Date, default: null },
  selectionManualState: { type: String, enum: ['NONE', 'OPEN', 'CLOSED'], default: 'NONE' },
  currentPhase: { 
    type: String, 
    enum: ['NOT_RELEASED', 'RELEASED_LOCKED', 'SELECTION_OPEN', 'SELECTION_CLOSED', 'NOT_STARTED', 'READING', 'SELECTION', 'CLOSED'], 
    default: 'NOT_RELEASED' 
  },
  teamLeadAccessEnabled: { type: Boolean, default: true },
  volunteerAccessEnabled: { type: Boolean, default: true },
  problemSelectionEnabled: { type: Boolean, default: true },
  attendanceEnabled: { type: Boolean, default: true }
}, { timestamps: true });

// 12. Audit Log Schema
const AuditLogSchema = new mongoose.Schema({
  actor: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

// 13. Reviewer Schema
const ReviewerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  role: { type: String, default: 'REVIEWER' }
}, { timestamps: true });

// 14. Evaluation Round Schema (Configurable Evaluation Criteria per Round)
const EvaluationRoundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true, unique: true, index: true }, // 1, 2, 3
  roundName: { type: String, required: true },
  description: { type: String, default: '' },
  criteria: [{
    key: { type: String, required: true },
    name: { type: String, required: true },
    maxMarks: { type: Number, required: true, default: 10 },
    description: { type: String, default: '' }
  }],
  maximumMarks: { type: Number, required: true, default: 60 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// 15. Evaluation Schema (Team Marks entered by Reviewers)
const EvaluationSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
  teamCode: { type: String, required: true, index: true },
  teamName: { type: String, required: true },
  roundNumber: { type: Number, required: true, index: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reviewer', required: true, index: true },
  reviewerUsername: { type: String, required: true },
  reviewerName: { type: String, required: true },
  criteriaMarks: [{
    criteriaKey: { type: String, required: true },
    name: { type: String, required: true },
    mark: { type: Number, required: true },
    maxMark: { type: Number, required: true }
  }],
  totalMarks: { type: Number, required: true },
  comments: { type: String, default: '' },
  status: { type: String, enum: ['DRAFT', 'SUBMITTED'], default: 'SUBMITTED' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

EvaluationSchema.index({ teamId: 1, roundNumber: 1, reviewerId: 1 }, { unique: true });

module.exports = {
  Admin: mongoose.model('Admin', AdminSchema),
  TeamLead: mongoose.model('TeamLead', TeamLeadSchema),
  Team: mongoose.model('Team', TeamSchema),
  Participant: mongoose.model('Participant', ParticipantSchema),
  ProblemStatement: mongoose.model('ProblemStatement', ProblemStatementSchema),
  ProblemSelection: mongoose.model('ProblemSelection', ProblemSelectionSchema),
  AttendanceSession: mongoose.model('AttendanceSession', AttendanceSessionSchema),
  Attendance: mongoose.model('Attendance', AttendanceSchema),
  Volunteer: mongoose.model('Volunteer', VolunteerSchema),
  ActiveSession: mongoose.model('ActiveSession', ActiveSessionSchema),
  SystemSettings: mongoose.model('SystemSettings', SystemSettingsSchema),
  AuditLog: mongoose.model('AuditLog', AuditLogSchema),
  Reviewer: mongoose.model('Reviewer', ReviewerSchema),
  EvaluationRound: mongoose.model('EvaluationRound', EvaluationRoundSchema),
  Evaluation: mongoose.model('Evaluation', EvaluationSchema)
};

