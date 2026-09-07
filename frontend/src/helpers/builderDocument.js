import { BACKGROUND_OPTIONS, BLOCK_TYPES, DEFAULT_LAYOUT } from '../constants/builder';
import { filterSlotTree, migrateBuilderDocument } from './puckSlots';

const CHROMES = ['shell', 'full'];
const SIDEBARS = ['auto', 'show', 'hide'];
const BACKGROUNDS = BACKGROUND_OPTIONS.map((item) => item.value);

export function sanitizeLayout(layout = {}, fallback = DEFAULT_LAYOUT) {
  const raw = { ...DEFAULT_LAYOUT, ...fallback, ...layout };
  return {
    chrome: CHROMES.includes(raw.chrome) ? raw.chrome : DEFAULT_LAYOUT.chrome,
    sidebar: SIDEBARS.includes(raw.sidebar) ? raw.sidebar : DEFAULT_LAYOUT.sidebar,
    showHero: raw.showHero !== false && raw.showHero !== 'false',
    background: BACKGROUNDS.includes(raw.background) ? raw.background : DEFAULT_LAYOUT.background,
  };
}

export function isBuilderDocument(value) {
  return Boolean(value && typeof value === 'object' && Array.isArray(value.content));
}

export function publishDocument(next, current) {
  return isBuilderDocument(next) ? next : current;
}

export function blockId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyBuilder(layout = DEFAULT_LAYOUT) {
  return {
    root: { props: { ...DEFAULT_LAYOUT, ...layout } },
    content: [],
    zones: {},
  };
}

export function hasBuilder(doc) {
  return Boolean(doc && Array.isArray(doc.content) && doc.content.length > 0);
}

export function safeBuilderDocument(doc) {
  if (!doc || typeof doc !== 'object') return emptyBuilder();
  const migrated = migrateBuilderDocument(doc);
  const allow = (item) => item && BLOCK_TYPES.includes(item.type);
  return {
    root: { props: { ...DEFAULT_LAYOUT, ...(migrated.root?.props || {}) } },
    content: filterSlotTree(Array.isArray(migrated.content) ? migrated.content : [], allow),
    zones: {},
  };
}

export function layoutFromRecord(page) {
  return sanitizeLayout({ ...(page?.layout || {}), ...(page?.builder?.root?.props || {}) });
}

export function htmlToBuilder(html, layout = DEFAULT_LAYOUT) {
  const text = String(html || '').trim();
  const doc = emptyBuilder(layout);
  if (!text) return doc;
  doc.content = [{ type: 'RichText', props: { id: blockId('richtext'), html: text } }];
  return doc;
}

export function landingToBuilder(landing = {}) {
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
        caption: item.caption || item.media?.altText || '',
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

export function resolvePageDocument(page) {
  if (hasBuilder(page?.builder)) return safeBuilderDocument(page.builder);
  return htmlToBuilder(page?.content, page?.layout);
}

export function resolveLandingDocument(landing) {
  if (hasBuilder(landing?.builder)) return safeBuilderDocument(landing.builder);
  return landingToBuilder(landing || {});
}
