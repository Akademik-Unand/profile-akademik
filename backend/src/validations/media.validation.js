const Joi = require('joi');

const list = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    search: Joi.string().allow(''),
    sortBy: Joi.string().valid('filename', 'createdAt', 'sizeBytes'),
    sortOrder: Joi.string().valid('asc', 'desc'),
    unitId: Joi.number().integer().positive(),
    site: Joi.string().valid('main'),
    folderId: Joi.number().integer().positive(),
    mimeType: Joi.string().max(80),
  }),
};

const idParam = {
  params: Joi.object({ id: Joi.number().integer().positive().required() }),
};

const createFolder = {
  body: Joi.object({
    unitId: Joi.number().integer().positive().allow(null),
    name: Joi.string().max(120).required(),
  }),
};

const update = {
  ...idParam,
  body: Joi.object({
    altText: Joi.string().max(200).allow('', null),
    folderId: Joi.number().integer().positive().allow(null),
  }).min(1),
};

module.exports = { list, idParam, createFolder, update };
