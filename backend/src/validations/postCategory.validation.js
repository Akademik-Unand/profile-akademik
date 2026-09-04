const Joi = require('joi');

const slug = Joi.string()
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(80)
  .messages({ 'string.pattern.base': 'Slug hanya boleh huruf kecil, angka, dan tanda hubung' });

const list = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    search: Joi.string().allow(''),
    sortBy: Joi.string().valid('name', 'slug', 'createdAt', 'updatedAt'),
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
    name: Joi.string().max(120).required(),
    slug: slug.required(),
  }),
};

const update = {
  ...idParam,
  body: Joi.object({
    name: Joi.string().max(120),
    slug,
    unitId: Joi.number().integer().positive().allow(null),
  }).min(1),
};

module.exports = { list, idParam, create, update };
