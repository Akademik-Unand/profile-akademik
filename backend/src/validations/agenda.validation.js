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
    sortBy: Joi.string().valid('title', 'slug', 'startsAt', 'createdAt', 'updatedAt', 'status'),
    sortOrder: Joi.string().valid('asc', 'desc'),
    status: Joi.string().valid('draft', 'published'),
    unitId: Joi.number().integer().positive(),
    site: Joi.string().valid('main'),
  }),
};

const idParam = {
  params: Joi.object({ id: Joi.number().integer().positive().required() }),
};

const publicListParams = {
  params: Joi.object({ slug: Joi.string().required() }),
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sortBy: Joi.string().valid('startsAt', 'title', 'createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc'),
  }),
};

const create = {
  body: Joi.object({
    unitId: Joi.number().integer().positive().allow(null),
    title: Joi.string().max(200).required(),
    slug: slug.required(),
    startsAt: Joi.date().iso().required(),
    endsAt: Joi.date().iso().allow(null),
    timeText: Joi.string().max(80).allow('', null),
    location: Joi.string().max(200).allow('', null),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('draft', 'published').default('draft'),
  }),
};

const update = {
  ...idParam,
  body: Joi.object({
    unitId: Joi.number().integer().positive().allow(null),
    title: Joi.string().max(200),
    slug,
    startsAt: Joi.date().iso(),
    endsAt: Joi.date().iso().allow(null),
    timeText: Joi.string().max(80).allow('', null),
    location: Joi.string().max(200).allow('', null),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('draft', 'published'),
  }).min(1),
};

module.exports = { list, idParam, publicListParams, create, update };
