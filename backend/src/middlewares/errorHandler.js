const { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require('sequelize');
const logger = require('../utils/logger');
const { error: errorResponse } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return errorResponse(res, {
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors,
    });
  }

  if (err.isJoi) {
    const errors = err.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    return errorResponse(res, {
      message: 'Validasi gagal',
      statusCode: 422,
      errors,
    });
  }

  if (err instanceof UniqueConstraintError) {
    const errors = err.errors.map((item) => ({
      field: item.path,
      message: `${item.path} sudah digunakan`,
    }));
    return errorResponse(res, {
      message: 'Data duplikat',
      statusCode: 409,
      errors,
    });
  }

  if (err instanceof ValidationError) {
    const errors = err.errors.map((item) => ({
      field: item.path,
      message: item.message,
    }));
    return errorResponse(res, {
      message: 'Validasi gagal',
      statusCode: 422,
      errors,
    });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return errorResponse(res, {
      message: 'Referensi data tidak valid',
      statusCode: 409,
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return errorResponse(res, {
      message: 'Sesi tidak valid atau telah berakhir',
      statusCode: 401,
    });
  }

  logger.error({ err }, 'Unhandled error');
  return errorResponse(res, {
    message: process.env.NODE_ENV === 'production' ? 'Terjadi kesalahan server' : err.message,
    statusCode: 500,
  });
}

module.exports = errorHandler;
