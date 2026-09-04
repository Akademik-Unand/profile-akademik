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
    sortBy: Joi.string().valid('title', 'slug', 'createdAt', 'updatedAt', 'publishedAt', 'status'),
    sortOrder: Joi.string().valid('asc', 'desc'),
    status: Joi.string().valid('draft', 'published'),
    unitId: Joi.number().integer().positive(),
    site: Joi.string().valid('main'),
  }),
};

const idParam = {
  params: Joi.object({ id: Joi.number().integer().positive().required() }),
};

const publicParams = {
  params: Joi.object({
    slug: Joi.string().required(),
    pageSlug: Joi.string().required(),
  }),
};

const create = {
  body: Joi.object({
    unitId: Joi.number().integer().positive().allow(null),
    slug: slug.required(),
    title: Joi.string().max(200).required(),
    content: Joi.string().allow('').default(''),
    status: Joi.string().valid('draft', 'published').default('draft'),
    publishedAt: Joi.date().iso().allow(null),
    metaTitle: Joi.string().max(160).allow('', null),
    metaDescription: Joi.string().max(300).allow('', null),
    metaKeywords: Joi.string().max(250).allow('', null),
  }),
};

const update = {
  ...idParam,
  body: Joi.object({
    unitId: Joi.number().integer().positive().allow(null),
    slug,
    title: Joi.string().max(200),
    content: Joi.string().allow(''),
    status: Joi.string().valid('draft', 'published'),
    publishedAt: Joi.date().iso().allow(null),
    metaTitle: Joi.string().max(160).allow('', null),
    metaDescription: Joi.string().max(300).allow('', null),
    metaKeywords: Joi.string().max(250).allow('', null),
  }).min(1),
};

module.exports = { list, idParam, publicParams, create, update };
