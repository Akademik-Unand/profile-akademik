const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const authValidation = require('../validations/auth.validation');
const { error: errorResponse } = require('../utils/apiResponse');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    errorResponse(res, { message: 'Terlalu banyak percobaan login, coba lagi nanti', statusCode: 429 });
  },
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: admin@unand.ac.id }
 *               password: { type: string, example: Admin123! }
 *     responses:
 *       200:
 *         description: Login berhasil, JWT disimpan di httpOnly cookie
 *       401:
 *         description: Kredensial salah
 */
router.post('/login', loginLimiter, validate(authValidation.login), authController.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout dan hapus cookie
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: Logout berhasil
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Profil pengguna yang sedang login
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: Data user + units
 */
router.get('/me', authenticate, authController.me);

module.exports = router;
