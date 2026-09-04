const Joi = require('joi');

const socialUrl = Joi.string().max(500).empty('').uri({ scheme: ['http', 'https'] }).allow(null);

const slug = Joi.string()
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(80)
  .invalid('admin', 'pengumuman', 'halaman', 'organisasi', 'agenda', 'login', 'api')
  .messages({
    'string.pattern.base': 'Slug hanya boleh huruf kecil, angka, dan tanda hubung',
    'any.invalid': 'Slug ini sudah dipakai rute situs utama',
  });

const list = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    search: Joi.string().allow(''),
    sortBy: Joi.string().valid('name', 'slug', 'createdAt', 'updatedAt', 'isActive', 'isDefault'),
    sortOrder: Joi.string().valid('asc', 'desc'),
    isActive: Joi.boolean(),
    isDefault: Joi.boolean(),
  }),
};

const idParam = {
  params: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
};

const slugParam = {
  params: Joi.object({
    slug: Joi.string().required(),
  }),
  query: Joi.object({
    location: Joi.string().valid('header', 'footer'),
  }),
};

const create = {
  body: Joi.object({
    slug: slug.required(),
    name: Joi.string().max(150).required(),
    themeColor: Joi.string().max(30).allow(null, ''),
    customCss: Joi.string().allow(null, ''),
    templateKey: Joi.string().max(50).allow(null, ''),
    isActive: Joi.boolean().default(true),
    isDefault: Joi.boolean().default(false),
    logoMediaId: Joi.number().integer().positive().allow(null),
    coverMediaId: Joi.number().integer().positive().allow(null),
    address: Joi.string().allow('', null),
    phone: Joi.string().max(50).allow('', null),
    fax: Joi.string().max(50).allow('', null),
    email: Joi.string().email().allow('', null),
    facebookUrl: socialUrl,
    instagramUrl: socialUrl,
    twitterUrl: socialUrl,
    youtubeUrl: socialUrl,
    tiktokUrl: socialUrl,
    linkedinUrl: socialUrl,
    description: Joi.string().allow('', null),
    seoTitle: Joi.string().max(160).allow('', null),
    seoDescription: Joi.string().max(300).allow('', null),
    seoKeywords: Joi.string().max(250).allow('', null),
  }),
};

const update = {
  ...idParam,
  body: Joi.object({
    slug,
    name: Joi.string().max(150),
    themeColor: Joi.string().max(30).allow(null, ''),
    customCss: Joi.string().allow(null, ''),
    templateKey: Joi.string().max(50).allow(null, ''),
    isActive: Joi.boolean(),
    isDefault: Joi.boolean(),
    logoMediaId: Joi.number().integer().positive().allow(null),
    coverMediaId: Joi.number().integer().positive().allow(null),
    address: Joi.string().allow('', null),
    phone: Joi.string().max(50).allow('', null),
    fax: Joi.string().max(50).allow('', null),
    email: Joi.string().email().allow('', null),
    facebookUrl: socialUrl,
    instagramUrl: socialUrl,
    twitterUrl: socialUrl,
    youtubeUrl: socialUrl,
    tiktokUrl: socialUrl,
    linkedinUrl: socialUrl,
    description: Joi.string().allow('', null),
    seoTitle: Joi.string().max(160).allow('', null),
    seoDescription: Joi.string().max(300).allow('', null),
    seoKeywords: Joi.string().max(250).allow('', null),
  }).min(1),
};

module.exports = { list, idParam, slugParam, create, update };
