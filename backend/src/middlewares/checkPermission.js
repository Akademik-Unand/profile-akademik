const AppError = require('../utils/AppError');

function checkPermission(action, subject) {
  return (req, _res, next) => {
    if (!req.ability || !req.ability.can(action, subject)) {
      return next(new AppError('Anda tidak memiliki izin untuk aksi ini', 403));
    }
    return next();
  };
}

module.exports = checkPermission;
