require('dotenv').config();

const path = require('path');

const frontendOrigin = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '..', '..', 'uploads');
const publicUploadUrl = process.env.PUBLIC_UPLOAD_URL || `http://localhost:${process.env.PORT || 3000}/uploads`;

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  frontendOrigin,
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || 'Admin123!',
  uploadDir,
  publicUploadUrl,
  maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES) || 10 * 1024 * 1024,
};
