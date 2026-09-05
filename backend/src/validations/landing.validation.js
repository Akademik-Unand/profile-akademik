const Joi = require('joi');
const { BLOCK_TYPES } = require('../constants/builder');

const current = {
  query: Joi.object({
    unitId: Joi.number().integer().positive(),
    site: Joi.string().valid('main'),
  }),
};

const slide = Joi.object({
  id: Joi.number().integer().positive(),
  mediaId: Joi.number().integer().positive().allow(null),
  title: Joi.string().max(200).allow('', null),
  caption: Joi.string().max(500).allow('', null),
  linkUrl: Joi.string().max(500).allow('', null),
  order: Joi.number().integer().min(0),
});

const service = Joi.object({
  id: Joi.number().integer().positive(),
  label: Joi.string().max(80).allow('', null),
  icon: Joi.string().max(80).allow('', null),
  url: Joi.string().max(500).allow('', null),
  order: Joi.number().integer().min(0),
});

const galleryItem = Joi.object({
  id: Joi.number().integer().positive(),
  mediaId: Joi.number().integer().positive().allow(null),
  caption: Joi.string().max(200).allow('', null),
  featured: Joi.boolean(),
  order: Joi.number().integer().min(0),
});

const upsert = {
  body: Joi.object({
    unitId: Joi.number().integer().positive().allow(null),
    site: Joi.string().valid('main'),
    eyebrow: Joi.string().max(120).allow('', null),
    heroTitle: Joi.string().max(200).allow('', null),
    heroSubtitle: Joi.string().max(500).allow('', null),
    ctaLabel: Joi.string().max(80).allow('', null),
    ctaUrl: Joi.string().max(500).allow('', null),
    introTitle: Joi.string().max(200).allow('', null),
    introBody: Joi.string().allow('', null),
    newsTitle: Joi.string().max(200).allow('', null),
    announcementsTitle: Joi.string().max(200).allow('', null),
    agendaTitle: Joi.string().max(200).allow('', null),
    servicesTitle: Joi.string().max(200).allow('', null),
    galleryTitle: Joi.string().max(200).allow('', null),
    gallerySubtitle: Joi.string().max(500).allow('', null),
    unitsTitle: Joi.string().max(200).allow('', null),
    contactTitle: Joi.string().max(200).allow('', null),
    contactBody: Joi.string().allow('', null),
    showNews: Joi.boolean(),
    showAgenda: Joi.boolean(),
    showServices: Joi.boolean(),
    showUnits: Joi.boolean(),
    showGallery: Joi.boolean(),
    slides: Joi.array().items(slide),
    services: Joi.array().items(service),
    gallery: Joi.array().items(galleryItem),
    builder: Joi.object({
      root: Joi.object().unknown(true),
      content: Joi.array().items(
        Joi.object({
          type: Joi.string().valid(...BLOCK_TYPES).required(),
          props: Joi.object().unknown(true).default({}),
        }).unknown(true),
      ),
      zones: Joi.object().pattern(
        Joi.string(),
        Joi.array().items(
          Joi.object({
            type: Joi.string().valid(...BLOCK_TYPES).required(),
            props: Joi.object().unknown(true).default({}),
          }).unknown(true),
        ),
      ),
    })
      .unknown(true)
      .allow(null),
  }),
};

module.exports = { current, upsert };
