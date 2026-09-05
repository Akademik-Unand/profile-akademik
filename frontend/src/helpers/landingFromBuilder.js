export function extractLandingLegacy(builder) {
  const items = [...(builder?.content || [])];
  const propsOf = (type) => items.find((item) => item.type === type)?.props || {};
  const hero = propsOf('Hero');
  const services = propsOf('Services');
  const intro = propsOf('Intro');
  const news = propsOf('NewsFeed');
  const announcements = propsOf('Announcements');
  const agenda = propsOf('AgendaList');
  const gallery = propsOf('Gallery');
  const units = propsOf('UnitDirectory');
  const cta = propsOf('ClosingCta');

  return {
    eyebrow: hero.eyebrow || '',
    heroTitle: hero.title || '',
    heroSubtitle: hero.subtitle || '',
    ctaLabel: hero.ctaLabel || cta.ctaLabel || '',
    ctaUrl: hero.ctaUrl || cta.ctaUrl || '',
    introTitle: intro.title || '',
    introBody: intro.body || '',
    newsTitle: news.title || '',
    announcementsTitle: announcements.title || '',
    agendaTitle: agenda.title || '',
    servicesTitle: services.title || '',
    galleryTitle: gallery.title || '',
    gallerySubtitle: gallery.subtitle || '',
    unitsTitle: units.title || '',
    contactTitle: cta.title || '',
    contactBody: cta.body || '',
    showNews: items.some((item) => item.type === 'NewsFeed' || item.type === 'Announcements'),
    showAgenda: items.some((item) => item.type === 'AgendaList'),
    showServices: items.some((item) => item.type === 'Services'),
    showUnits: items.some((item) => item.type === 'UnitDirectory'),
    showGallery: items.some((item) => item.type === 'Gallery'),
    slides: (hero.slides || []).map((slide, index) => ({
      mediaId: slide.image?.mediaId || slide.mediaId || null,
      title: slide.title || '',
      caption: slide.caption || '',
      linkUrl: slide.linkUrl || '',
      order: index,
    })),
    services: (services.items || []).map((item, index) => ({
      label: item.label || '',
      icon: item.icon || 'mdi:link-variant',
      url: item.url || '',
      order: index,
    })),
    gallery: (gallery.items || [])
      .map((item, index) => ({
        mediaId: item.image?.mediaId || item.mediaId || null,
        caption: item.caption || '',
        featured: Boolean(item.featured),
        order: index,
      }))
      .filter((item) => item.mediaId),
  };
}
