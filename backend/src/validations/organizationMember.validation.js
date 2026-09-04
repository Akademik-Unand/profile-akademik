const Joi = require('joi');

const list = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    search: Joi.string().allow(''),
    sortBy: Joi.string().valid('name', 'title', 'order', 'createdAt', 'updatedAt'),
    sortOrder: Joi.string().valid('asc', 'desc'),
    unitId: Joi.number().integer().positive(),
    site: Joi.string().valid('main'),
  }),
};

const idParam = {
  params: Joi.object({ id: Joi.number().integer().positive().required() }),
};

const create = {
  body: Joi.object({
    unitId: Joi.number().integer().positive().allow(null),
    name: Joi.string().max(150).required(),
    title: Joi.string().max(150).required(),
    photoMediaId: Joi.number().integer().positive().allow(null),
    parentId: Joi.number().integer().positive().allow(null),
    order: Joi.number().integer().min(0),
  }),
};

const update = {
  ...idParam,
  body: Joi.object({
    name: Joi.string().max(150),
    title: Joi.string().max(150),
    photoMediaId: Joi.number().integer().positive().allow(null),
    parentId: Joi.number().integer().positive().allow(null),
    order: Joi.number().integer().min(0),
    unitId: Joi.number().integer().positive().allow(null),
  }).min(1),
};

module.exports = { list, idParam, create, update };
