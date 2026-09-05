const { DEFAULT_LAYOUT } = require('../constants/builder');
const { hasBuilder } = require('./builderDocument');

const SYSTEM_PAGES = [
  {
    slug: 'pengumuman',
    title: 'Pengumuman',
    description: 'Pengumuman, surat edaran, dan informasi akademik terbaru.',
    blockType: 'PostArchive',
    layout: { ...DEFAULT_LAYOUT, chrome: 'shell', sidebar: 'auto', showHero: true },
  },
  {
    slug: 'organisasi',
    title: 'Struktur organisasi',
    description: 'Susunan pejabat dan unit kerja yang dipublikasikan pada portal ini.',
    blockType: 'OrganizationTree',
    layout: { ...DEFAULT_LAYOUT, chrome: 'full', sidebar: 'hide', showHero: true },
  },
  {
    slug: 'agenda',
    title: 'Agenda kegiatan',
    description: 'Jadwal kegiatan akademik dan kemahasiswaan yang dipublikasikan unit ini.',
    blockType: 'AgendaArchive',
    layout: { ...DEFAULT_LAYOUT, chrome: 'shell', sidebar: 'auto', showHero: true },
  },
];

const SYSTEM_PAGE_SLUGS = SYSTEM_PAGES.map((item) => item.slug);

function isSystemPageSlug(slug) {
  return SYSTEM_PAGE_SLUGS.includes(slug);
}

function systemPageSpec(slug) {
  return SYSTEM_PAGES.find((item) => item.slug === slug) || null;
}

function systemPageDocument(spec) {
  const page = spec.slug ? spec : systemPageSpec(spec);
  if (!page) {
    return {
      root: { props: { ...DEFAULT_LAYOUT } },
      content: [],
      zones: {},
    };
  }
  return {
    root: { props: { ...page.layout } },
    content: [{ type: page.blockType, props: { id: `sys-${page.slug}`, title: '' } }],
    zones: {},
  };
}

function models() {
  return require('../models');
}

async function ensureSystemPages({ unitId = null, createdBy = null } = {}) {
  const { Page } = models();
  const results = [];
  for (const spec of SYSTEM_PAGES) {
    const where = { slug: spec.slug, unitId: unitId ?? null };
    let page = await Page.findOne({ where });
    if (!page) {
      const builder = systemPageDocument(spec);
      page = await Page.create({
        unitId: unitId ?? null,
        slug: spec.slug,
        title: spec.title,
        content: '',
        builder,
        layout: spec.layout,
        status: 'published',
        createdBy,
        publishedAt: new Date(),
        metaDescription: spec.description,
      });
    } else if (!hasBuilder(page.builder)) {
      const builder = systemPageDocument(spec);
      await page.update({
        builder,
        layout: spec.layout,
        status: 'published',
        publishedAt: page.publishedAt || new Date(),
        metaDescription: page.metaDescription || spec.description,
      });
    }
    results.push(page);
  }
  return results;
}

async function ensureSystemPagesForAllScopes({ createdBy = null } = {}) {
  const { Unit } = models();
  const created = await ensureSystemPages({ unitId: null, createdBy });
  const units = await Unit.findAll({ attributes: ['id', 'isDefault'] });
  for (const unit of units) {
    created.push(...(await ensureSystemPages({ unitId: unit.id, createdBy })));
  }
  return created;
}

module.exports = {
  SYSTEM_PAGES,
  SYSTEM_PAGE_SLUGS,
  isSystemPageSlug,
  systemPageSpec,
  systemPageDocument,
  ensureSystemPages,
  ensureSystemPagesForAllScopes,
};
