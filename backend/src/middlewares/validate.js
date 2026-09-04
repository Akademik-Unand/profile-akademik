const Joi = require('joi');
const AppError = require('../utils/AppError');

function validate(schema) {
  return (req, _res, next) => {
    const compiled = Joi.compile(schema);
    const data = {};
    if (schema.body) data.body = req.body;
    if (schema.query) data.query = req.query;
    if (schema.params) data.params = req.params;

    const { error, value } = compiled
      .prefs({ abortEarly: false, stripUnknown: true })
      .validate(data);

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return next(new AppError('Validasi gagal', 422, errors));
    }

    if (value.body) req.body = value.body;
    if (value.query) req.query = value.query;
    if (value.params) req.params = value.params;
    return next();
  };
}

module.exports = validate;
