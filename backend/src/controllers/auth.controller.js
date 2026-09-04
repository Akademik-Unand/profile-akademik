const authService = require('../services/auth.service');
const jwtConfig = require('../config/jwt');
const { cookieOptions } = require('../utils/auth');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  res.cookie(jwtConfig.cookieName, token, cookieOptions());
  return success(res, { message: 'Login berhasil', data: { user } });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(jwtConfig.cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  return success(res, { message: 'Logout berhasil', data: null });
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return success(res, { message: 'Profil pengguna', data: { user } });
});

module.exports = { login, logout, me };
