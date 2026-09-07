const {
  BLOCK_TYPES,
  DEFAULT_LAYOUT,
  LAYOUT_CHROME,
  LAYOUT_SIDEBAR,
  BACKGROUNDS,
  SLOT_KEYS,
  SLOT_KEYS_BY_TYPE,
} = require('../constants/builder');
const { sanitizeHtml } = require('./sanitizeHtml');
const { sanitizeBox, sanitizeDisplay, sanitizeMotion } = require('./sanitizeBox');
const AppError = require('../utils/AppError');

const HTML_PROP_KEYS = ['html', 'body', 'quote', 'text'];

function blockId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function emptyBuilder(layout = DEFAULT_LAYOUT) {
  return {
    root: { props: { ...DEFAULT_LAYOUT, ...layout } },
    content: [],
    zones: {},
  };
}

function hasBuilder(doc) {
  return Boolean(doc && Array.isArray(doc.content) && doc.content.length > 0);
}

function isSlotList(value) {
  return Array.isArray(value) && value.some((item) => item && item.type);
}

function walkItems(items, visit) {
  (items || []).forEach((item) => {
    visit(item);
    const props = item?.props || {};
    SLOT_KEYS.forEach((key) => {
      if (isSlotList(props[key])) walkItems(props[key], visit);
    });
  });
}

function collectItems(doc) {
  const items = [];
  walkItems(doc?.content, (item) => items.push(item));
  Object.values(doc?.zones || {}).forEach((zone) => {
    if (Array.isArray(zone)) walkItems(zone, (item) => items.push(item));
  });
  return items;
}

function zonesForComponent(id, zones) {
  if (!id || !zones) return [];
  return Object.entries(zones)
    .filter(([key]) => key.startsWith(`${id}:`))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, rows]) => (Array.isArray(rows) ? rows : []));
}

function liftItem(item, zones) {
  if (!item || !BLOCK_TYPES.includes(item.type)) return item;
  const keys = SLOT_KEYS_BY_TYPE[item.type];
  const props = { ...(item.props || {}) };
  if (keys) {
    const fromZones = zonesForComponent(props.id, zones);
    keys.forEach((key, index) => {
      if (!Array.isArray(props[key])) props[key] = fromZones[index] || [];
    });
  }
  SLOT_KEYS.forEach((key) => {
    if (isSlotList(props[key])) props[key] = props[key].map((child) => liftItem(child, zones));
  });
  return { ...item, props };
}

function liftLegacyZones(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const content = Array.isArray(doc.content) ? doc.content.map((item) => liftItem(item, doc.zones || {})) : [];
  return { ...doc, content, zones: {} };
}

function assertKnownBlocks(doc) {
  const unknown = collectItems(doc)
    .map((item) => item?.type)
    .filter((type) => type && !BLOCK_TYPES.includes(type));
  if (unknown.length) {
    throw new AppError(`Tipe blok tidak diizinkan: ${[...new Set(unknown)].join(', ')}`, 422);
  }
  return doc;
}

function sanitizeItem(item) {
  if (!item || typeof item !== 'object') return item;
  const props = { ...(item.props || {}) };
  HTML_PROP_KEYS.forEach((key) => {
    if (typeof props[key] === 'string') props[key] = sanitizeHtml(props[key]);
  });
  if (Array.isArray(props.items)) {
    props.items = props.items.map((row) => {
      if (!row || typeof row !== 'object') return row;
      const next = { ...row };
      HTML_PROP_KEYS.forEach((key) => {
        if (typeof next[key] === 'string') next[key] = sanitizeHtml(next[key]);
      });
      return next;
    });
  }
  if (props.box !== undefined) {
    const box = sanitizeBox(props.box);
    if (box) props.box = box;
    else delete props.box;
  }
  if (props.display !== undefined) {
    const display = sanitizeDisplay(props.display);
    if (display) props.display = display;
    else delete props.display;
  }
  if (props.motion !== undefined) {
    props.motion = sanitizeMotion(props.motion);
  }
  const dataKeys = ['title', 'date', 'time', 'location', 'description', 'excerpt', 'category', 'cover', 'link'];
  if (item.type === 'DataField') {
    props.field = dataKeys.includes(props.field) ? props.field : 'title';
  }
  if (props.bind !== undefined) {
    props.bind = dataKeys.includes(props.bind) ? props.bind : '';
  }
  SLOT_KEYS.forEach((key) => {
    if (isSlotList(props[key])) props[key] = props[key].map(sanitizeItem);
  });
  return { ...item, props };
}

function sanitizeBuilder(doc) {
  if (!doc || typeof doc !== 'object') return emptyBuilder();
  const lifted = liftLegacyZones(doc);
  const content = Array.isArray(lifted.content) ? lifted.content.map(sanitizeItem) : [];
  const root = {
    props: sanitizeLayout(lifted.root?.props || {}),
  };
  return { root, content, zones: {} };
}

function normalizeBuilder(doc) {
  const clean = sanitizeBuilder(doc);
  assertKnownBlocks(clean);
  return clean;
}

function sanitizeLayout(layout = {}, fallback = DEFAULT_LAYOUT) {
  const raw = { ...DEFAULT_LAYOUT, ...fallback, ...layout };
  return {
    chrome: LAYOUT_CHROME.includes(raw.chrome) ? raw.chrome : DEFAULT_LAYOUT.chrome,
    sidebar: LAYOUT_SIDEBAR.includes(raw.sidebar) ? raw.sidebar : DEFAULT_LAYOUT.sidebar,
    showHero: raw.showHero !== false && raw.showHero !== 'false',
    background: BACKGROUNDS.includes(raw.background) ? raw.background : DEFAULT_LAYOUT.background,
  };
}

function layoutFromBuilder(doc, fallback = DEFAULT_LAYOUT) {
  return sanitizeLayout({ ...fallback, ...(doc?.root?.props || {}) });
}

function htmlToBuilder(html, layout = DEFAULT_LAYOUT) {
  const text = String(html || '').trim();
  const doc = emptyBuilder(layout);
  if (!text) return doc;
  doc.content = [
    {
      type: 'RichText',
      props: { id: blockId('richtext'), html: sanitizeHtml(text) },
    },
  ];
  return doc;
}

function landingToBuilder(landing = {}) {
  const content = [];
  const push = (type, props) => {
    content.push({ type, props: { id: blockId(type.toLowerCase()), ...props } });
  };

  push('Hero', {
    eyebrow: landing.eyebrow || '',
    title: landing.heroTitle || '',
    subtitle: landing.heroSubtitle || '',
    ctaLabel: landing.ctaLabel || '',
    ctaUrl: landing.ctaUrl || '',
    slides: (landing.slides || []).map((slide) => ({
      mediaId: slide.mediaId || slide.media?.id || null,
      url: slide.media?.url || '',
      title: slide.title || '',
      caption: slide.caption || '',
      linkUrl: slide.linkUrl || '',
    })),
  });

  push('Stats', {
    items: [
      { value: '16+', label: 'Fakultas' },
      { value: '50+', label: 'Program studi' },
      { value: '20rb+', label: 'Mahasiswa' },
      { value: '1', label: 'Portal akademik terpadu' },
    ],
  });

  if (landing.showServices !== false) {
    push('Services', {
      title: landing.servicesTitle || 'Akses layanan akademik',
      items: (landing.services || []).map((item) => ({
        label: item.label || '',
        icon: item.icon || 'mdi:link-variant',
        url: item.url || '',
      })),
    });
  }

  if (landing.introTitle || landing.introBody) {
    push('Intro', {
      title: landing.introTitle || '',
      body: landing.introBody || '',
      profileUrl: '/halaman/profil',
    });
  }

  if (landing.showNews !== false) {
    push('NewsFeed', { title: landing.newsTitle || 'Berita terkini', limit: 6, featuredOnly: false });
  }

  if (landing.showNews !== false || landing.showAgenda !== false) {
    const columnA = landing.showNews !== false
      ? [{
          type: 'Announcements',
          props: {
            id: blockId('announcements'),
            title: landing.announcementsTitle || 'Pengumuman',
            limit: 6,
            category: 'pengumuman',
          },
        }]
      : [];
    const columnB = landing.showAgenda !== false
      ? [{
          type: 'AgendaList',
          props: {
            id: blockId('agenda'),
            title: landing.agendaTitle || 'Agenda',
            limit: 4,
          },
        }]
      : [];

    push('Section', {
      background: 'mist',
      padding: 'md',
      margin: 'none',
      width: 'wide',
      align: 'left',
      content: [{
        type: 'Columns',
        props: {
          id: blockId('columns'),
          count: 2,
          gap: 'lg',
          columnA,
          columnB,
          columnC: [],
        },
      }],
    });
  }

  if (landing.showGallery !== false && (landing.gallery || []).length) {
    push('Gallery', {
      title: landing.galleryTitle || 'Kehidupan kampus',
      subtitle: landing.gallerySubtitle || 'Dokumentasi kegiatan, fasilitas, dan suasana akademik.',
      items: (landing.gallery || []).map((item) => ({
        mediaId: item.mediaId || item.media?.id || null,
        url: item.media?.url || '',
        caption: item.caption || '',
        featured: Boolean(item.featured),
      })),
    });
  }

  if (landing.showUnits) {
    push('UnitDirectory', { title: landing.unitsTitle || 'Fakultas dan unit' });
  }

  push('ClosingCta', {
    title: landing.contactTitle || '',
    body: landing.contactBody || '',
    ctaLabel: landing.ctaLabel || 'Lihat pengumuman',
    ctaUrl: landing.ctaUrl || '',
  });

  return {
    root: { props: { chrome: 'full', sidebar: 'hide', showHero: false, background: 'base' } },
    content,
    zones: {},
  };
}

function withBuilderFallback(record, htmlField = 'content') {
  if (!record) return record;
  const json = typeof record.toJSON === 'function' ? record.toJSON() : { ...record };
  if (!hasBuilder(json.builder)) {
    json.builder = htmlToBuilder(json[htmlField], json.layout || DEFAULT_LAYOUT);
  } else {
    json.builder = sanitizeBuilder(json.builder);
  }
  json.layout = json.layout || layoutFromBuilder(json.builder);
  return json;
}

module.exports = {
  emptyBuilder,
  hasBuilder,
  collectItems,
  assertKnownBlocks,
  sanitizeBuilder,
  normalizeBuilder,
  sanitizeLayout,
  layoutFromBuilder,
  htmlToBuilder,
  landingToBuilder,
  withBuilderFallback,
  sanitizeBox,
};
