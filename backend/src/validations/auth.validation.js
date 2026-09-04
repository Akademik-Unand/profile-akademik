const Joi = require('joi');

const login = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email tidak valid',
      'any.required': 'Email wajib diisi',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password minimal 6 karakter',
      'any.required': 'Password wajib diisi',
    }),
  }),
};

module.exports = { login };
