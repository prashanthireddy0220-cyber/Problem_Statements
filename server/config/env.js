const path = require('path');
const dotenv = require('dotenv');

// Load .env file from server directory or root
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'alpha_hackathon_super_secret_jwt_key_2026',
  SESSION_SECRET: process.env.SESSION_SECRET || 'alpha_hackathon_session_secret_key_2026',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  APP_BASE_URL: process.env.APP_BASE_URL || 'http://localhost:5000',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  READING_DURATION_MINUTES: Number(process.env.READING_DURATION_MINUTES) || 30,
  SELECTION_DURATION_MINUTES: Number(process.env.SELECTION_DURATION_MINUTES) || 5,
  MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB) || 10,
  
  // Optional SMTP Configuration
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || '',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@hackathon.edu'
};

// Validate Critical Production Environment Variables
function validateEnv() {
  if (config.NODE_ENV === 'production') {
    const requiredInProduction = ['JWT_SECRET', 'SESSION_SECRET'];
    const missing = requiredInProduction.filter(key => !process.env[key]);
    if (missing.length > 0) {
      console.warn(`⚠️ Warning: Missing recommended production variables: ${missing.join(', ')}`);
    }
  }
}

validateEnv();

module.exports = config;
