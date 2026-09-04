const { LandingPage, LandingSlide, LandingService, LandingGalleryItem, Media, sequelize } = require('../models');
const AppError = require('../utils/AppError');
const { applyUnitScope, applyListUnitFilter, assertUnitAccess, resolveCreateUnitId } = require('../helpers/unitScope');
const logger = require('../utils/logger');

const MEDIA = { model: Media, as: 'media', attributes: ['id', 'url', 'thumbnailUrl', 'altText'] };

const DEFAULTS = {
  eyebrow: 'Bidang Akademik Universitas Andalas',
  heroTitle: 'Layanan akademik yang andal dan transparan',
  heroSubtitle: 'Informasi pengumuman, pendaftaran, dan kalender akademik dalam satu portal.',
  ctaLabel: 'Baca selengkapnya',
  ctaUrl: '',
  introTitle: '',
  introBody: '',
  newsTitle: '',
  announcementsTitle: '',
  agendaTitle: '',
  servicesTitle: '',
  galleryTitle: '',
  gallerySubtitle: '',
  unitsTitle: '',
  contactTitle: '',
  contactBody: '',
  showNews: true,
  showAgenda: true,
  showServices: true,
  showUnits: false,
  showGallery: true,
};

function orderedChildren(model, as, include) {
  const spec = {
    model,
    as,
    separate: true,
    order: [
      ['order', 'ASC'],
      ['id', 'ASC'],
    ],
  };
  if (include) spec.include = include;
  return spec;
}

function landingInclude() {
  return [
    orderedChildren(LandingSlide, 'slides', [MEDIA]),
    orderedChildren(LandingService, 'services'),
    orderedChildren(LandingGalleryItem, 'gallery', [MEDIA]),
  ];
}

function emptyLanding(unitId) {
  return {
    id: null,
    unitId,
    ...DEFAULTS,
    showUnits: unitId == null,
    slides: [],
    services: [],
    gallery: [],
  };
}

function resolveScope(query, currentUser) {
  if (query.site === 'main' || query.unitId === null) {
    assertUnitAccess(currentUser, null);
    return null;
  }
  return resolveCreateUnitId(currentUser, query.unitId);
}

async function findLanding(where, transaction) {
  return LandingPage.findOne({
    where,
    include: landingInclude(),
    transaction,
  });
}

async function replaceRows(Model, landingPageId, items, mapRow, transaction) {
  await Model.destroy({ where: { landingPageId }, transaction });
  if (!items.length) return;
  await Model.bulkCreate(items.map(mapRow), { transaction });
}

async function getCurrent(query, currentUser) {
  const unitId = resolveScope(query, currentUser);
  const landing = await findLanding({ unitId });
  return landing || emptyLanding(unitId);
}

async function getPublicForUnit(unit) {
  if (unit.isDefault) {
    const main = await findLanding({ unitId: null });
    if (main) return main;
  }
  return findLanding({ unitId: unit.id });
}

async function listAdmin(query, currentUser) {
  const extraWhere = applyListUnitFilter(applyUnitScope({}, currentUser), query, currentUser);
  const items = await LandingPage.findAll({
    where: extraWhere,
    include: landingInclude(),
    order: [['id', 'ASC']],
  });
  return { items, page: 1, limit: items.length, total: items.length };
}

async function upsert(payload, currentUser) {
  const unitId = resolveScope(payload, currentUser);

  const id = await sequelize.transaction(async (transaction) => {
    const fields = {
      eyebrow: payload.eyebrow ?? DEFAULTS.eyebrow,
      heroTitle: payload.heroTitle ?? DEFAULTS.heroTitle,
      heroSubtitle: payload.heroSubtitle ?? DEFAULTS.heroSubtitle,
      ctaLabel: payload.ctaLabel ?? DEFAULTS.ctaLabel,
      ctaUrl: payload.ctaUrl ?? DEFAULTS.ctaUrl,
      introTitle: payload.introTitle ?? DEFAULTS.introTitle,
      introBody: payload.introBody ?? DEFAULTS.introBody,
      newsTitle: payload.newsTitle ?? DEFAULTS.newsTitle,
      announcementsTitle: payload.announcementsTitle ?? DEFAULTS.announcementsTitle,
      agendaTitle: payload.agendaTitle ?? DEFAULTS.agendaTitle,
      servicesTitle: payload.servicesTitle ?? DEFAULTS.servicesTitle,
      galleryTitle: payload.galleryTitle ?? DEFAULTS.galleryTitle,
      gallerySubtitle: payload.gallerySubtitle ?? DEFAULTS.gallerySubtitle,
      unitsTitle: payload.unitsTitle ?? DEFAULTS.unitsTitle,
      contactTitle: payload.contactTitle ?? DEFAULTS.contactTitle,
      contactBody: payload.contactBody ?? DEFAULTS.contactBody,
      showNews: payload.showNews ?? true,
      showAgenda: payload.showAgenda ?? true,
      showServices: payload.showServices ?? true,
      showUnits: payload.showUnits ?? unitId == null,
      showGallery: payload.showGallery ?? true,
    };

    let landing = await LandingPage.findOne({ where: { unitId }, transaction });
    if (landing) {
      await landing.update(fields, { transaction });
    } else {
      landing = await LandingPage.create({ ...fields, unitId }, { transaction });
    }

    if (Array.isArray(payload.slides)) {
      await replaceRows(
        LandingSlide,
        landing.id,
        payload.slides,
        (slide, index) => ({
          landingPageId: landing.id,
          mediaId: slide.mediaId || null,
          title: slide.title || null,
          caption: slide.caption || null,
          linkUrl: slide.linkUrl || null,
          order: slide.order ?? index,
        }),
        transaction,
      );
    }

    if (Array.isArray(payload.services)) {
      await replaceRows(
        LandingService,
        landing.id,
        payload.services.filter((item) => item.label && item.url),
        (item, index) => ({
          landingPageId: landing.id,
          label: item.label,
          icon: item.icon || 'mdi:link-variant',
          url: item.url,
          order: item.order ?? index,
        }),
        transaction,
      );
    }

    if (Array.isArray(payload.gallery)) {
      await replaceRows(
        LandingGalleryItem,
        landing.id,
        payload.gallery.filter((item) => item.mediaId),
        (item, index) => ({
          landingPageId: landing.id,
          mediaId: item.mediaId,
          caption: item.caption || null,
          featured: Boolean(item.featured),
          order: item.order ?? index,
        }),
        transaction,
      );
    }

    logger.info({ landingId: landing.id, unitId }, 'Landing page saved');
    return landing.id;
  });

  const saved = await findLanding({ id });
  if (!saved) throw new AppError('Landing page gagal disimpan', 500);
  return saved;
}

module.exports = { getCurrent, getPublicForUnit, listAdmin, upsert, emptyLanding, DEFAULTS };
