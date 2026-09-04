require('dotenv').config();

const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-profile-akademik-jwt-secret');

if (!secret) {
  throw new Error('JWT_SECRET wajib diisi');
}

module.exports = {
  secret,
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.COOKIE_NAME || 'pa_token',
};
