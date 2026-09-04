const Joi = require('joi');

const list = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    search: Joi.string().allow(''),
    sortBy: Joi.string().valid('name', 'email', 'role', 'createdAt', 'updatedAt'),
    sortOrder: Joi.string().valid('asc', 'desc'),
    role: Joi.string().valid('superadmin', 'admin_unit'),
  }),
};

const idParam = {
  params: Joi.object({ id: Joi.number().integer().positive().required() }),
};

const create = {
  body: Joi.object({
    name: Joi.string().max(150).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(72).required(),
    role: Joi.string().valid('superadmin', 'admin_unit').default('admin_unit'),
    unitIds: Joi.array().items(Joi.number().integer().positive()).default([]),
  }),
};

const update = {
  ...idParam,
  body: Joi.object({
    name: Joi.string().max(150),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(72),
    role: Joi.string().valid('superadmin', 'admin_unit'),
    unitIds: Joi.array().items(Joi.number().integer().positive()),
  }).min(1),
};

module.exports = { list, idParam, create, update };
