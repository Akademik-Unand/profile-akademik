const Joi = require('joi');

const list = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    search: Joi.string().allow(''),
    sortBy: Joi.string().valid('name', 'group', 'subject', 'action', 'createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc'),
    group: Joi.string().max(40),
  }),
};

const syncRole = {
  params: Joi.object({ role: Joi.string().valid('admin_unit').required() }),
  body: Joi.object({
    permissionIds: Joi.array().items(Joi.number().integer().positive()).required(),
  }),
};

module.exports = { list, syncRole };
