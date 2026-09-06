const Joi = require('joi');

const list = {
  query: Joi.object({
    unitId: Joi.number().integer().positive(),
    site: Joi.string().valid('main'),
    location: Joi.string().valid('header', 'footer'),
  }),
};

const idParam = {
  params: Joi.object({ id: Joi.number().integer().positive().required() }),
};

const create = {
  body: Joi.object({
    unitId: Joi.number().integer().positive().allow(null),
    parentId: Joi.number().integer().positive().allow(null),
    label: Joi.string().max(120).required(),
    type: Joi.string().valid('page', 'post_category', 'external_url', 'archive', 'dynamic_content').required(),
    targetPageId: Joi.number().integer().positive().allow(null),
    targetCategoryId: Joi.number().integer().positive().allow(null),
    targetContentTypeId: Joi.number().integer().positive().allow(null),
    externalUrl: Joi.string().max(500).allow('', null),
    location: Joi.string().valid('header', 'footer').default('header'),
    order: Joi.number().integer().min(0),
  }),
};

const update = {
  ...idParam,
  body: Joi.object({
    parentId: Joi.number().integer().positive().allow(null),
    label: Joi.string().max(120),
    type: Joi.string().valid('page', 'post_category', 'external_url', 'archive', 'dynamic_content'),
    targetPageId: Joi.number().integer().positive().allow(null),
    targetCategoryId: Joi.number().integer().positive().allow(null),
    targetContentTypeId: Joi.number().integer().positive().allow(null),
    externalUrl: Joi.string().max(500).allow('', null),
    location: Joi.string().valid('header', 'footer'),
    order: Joi.number().integer().min(0),
    unitId: Joi.number().integer().positive().allow(null),
  }).min(1),
};

const reorder = {
  body: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().integer().positive().required(),
          parentId: Joi.number().integer().positive().allow(null),
          order: Joi.number().integer().min(0).required(),
        }),
      )
      .min(1)
      .required(),
  }),
};

module.exports = { list, idParam, create, update, reorder };
