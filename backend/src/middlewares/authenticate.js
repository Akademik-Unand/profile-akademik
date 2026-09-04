const jwtConfig = require('../config/jwt');
const { verifyToken } = require('../utils/auth');
const { User } = require('../models');
const defineAbility = require('../policies/defineAbility');
const AppError = require('../utils/AppError');
const { listByRole } = require('../helpers/loadPermissions');

function serializeAuthUser(user) {
  const json = user.toJSON();
  delete json.passwordHash;
  json.unitIds = (json.units || []).map((unit) => unit.id);
  return json;
}

async function authenticate(req, _res, next) {
  try {
    const token = req.cookies?.[jwtConfig.cookieName];
    if (!token) {
      throw new AppError('Anda belum login', 401);
    }

    const payload = verifyToken(token);
    const user = await User.findByPk(payload.id, {
      include: [{ association: 'units', through: { attributes: [] } }],
    });

    if (!user) {
      throw new AppError('Pengguna tidak ditemukan', 401);
    }

    req.user = serializeAuthUser(user);
    req.user.permissions = await listByRole(req.user.role);
    req.ability = defineAbility(req.user);
    return next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Sesi tidak valid atau telah berakhir', 401));
    }
    return next(err);
  }
}

module.exports = authenticate;
