export const SERVICE_ICONS = [
  { value: 'mdi:account-school-outline', label: 'Profil' },
  { value: 'mdi:calendar-month-outline', label: 'Kalender' },
  { value: 'mdi:cash-multiple', label: 'UKT' },
  { value: 'mdi:open-in-new', label: 'Tautan luar' },
  { value: 'mdi:laptop', label: 'Sistem' },
  { value: 'mdi:account-group-outline', label: 'Organisasi' },
  { value: 'mdi:file-document-outline', label: 'Dokumen' },
  { value: 'mdi:book-open-page-variant-outline', label: 'Buku' },
  { value: 'mdi:email-outline', label: 'Email' },
  { value: 'mdi:link-variant', label: 'Lainnya' },
];

export function defaultLandingServices(unitSlug) {
  const root = unitSlug ? `/${unitSlug}` : '';
  return [
    { label: 'Profil', icon: 'mdi:account-school-outline', url: `${root}/halaman/profil` },
    { label: 'Kalender', icon: 'mdi:calendar-month-outline', url: `${root}/halaman/kalender-akademik` },
    { label: 'SIMA', icon: 'mdi:open-in-new', url: 'https://sima.unand.ac.id' },
    { label: 'UKT', icon: 'mdi:cash-multiple', url: `${root}/halaman/tata-cara-ukt` },
    { label: 'iLearn', icon: 'mdi:laptop', url: 'https://ilearn.unand.ac.id' },
    { label: 'Organisasi', icon: 'mdi:account-group-outline', url: `${root}/organisasi` },
  ];
}

export function defaultLandingStats() {
  return [
    { value: '16+', label: 'Fakultas' },
    { value: '50+', label: 'Program studi' },
    { value: '20rb+', label: 'Mahasiswa' },
    { value: '1', label: 'Portal akademik terpadu' },
  ];
}

export function landingServiceItems(services, unitSlug) {
  const configured = (services || []).filter((item) => item.label && item.url);
  const source = configured.length ? configured : defaultLandingServices(unitSlug);
  return source.map((item, index) => ({
    key: item.id || `${item.label}-${index}`,
    label: item.label,
    icon: item.icon || 'mdi:link-variant',
    url: item.url,
    external: /^https?:\/\//i.test(item.url),
  }));
}

export function sectionTitle(value, fallback) {
  const text = String(value || '').trim();
  return text || fallback;
}

export function introParagraphs(body) {
  const text = String(body || '').trim();
  if (!text) return [];
  const blocks = text
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (blocks.length > 1) return blocks;
  const sentence = text.match(/^(.+?[.!?])\s+([\s\S]+)$/);
  if (sentence) return [sentence[1], sentence[2].trim()].filter(Boolean);
  return [text];
}

const STALE_CLOSING_TITLES = new Set(['hubungi kami', 'kontak']);

export function closingCtaCopy(landing, unitName) {
  const title = String(landing?.contactTitle || '').trim();
  const body = String(landing?.contactBody || '').trim();
  const staleTitle = !title || STALE_CLOSING_TITLES.has(title.toLowerCase());
  const staleBody = !body || /^layanan dan informasi resmi/i.test(body);
  return {
    title: staleTitle ? 'Akses layanan akademik' : title,
    body: staleBody
      ? `Temukan pengumuman resmi, agenda kegiatan, dan tautan sistem di portal ${unitName || 'akademik'}.`
      : body,
  };
}

export function landingGalleryItems(gallery = []) {
  return gallery
    .filter((item) => item.media?.url)
    .map((item) => ({
      key: item.id,
      url: item.media.url,
      caption: item.caption || item.media.altText || '',
      featured: Boolean(item.featured),
    }));
}

export function splitGalleryMosaic(items = []) {
  if (!items.length) return { featured: null, rest: [] };
  const featuredIndex = items.findIndex((item) => item.featured);
  const index = featuredIndex >= 0 ? featuredIndex : 0;
  return {
    featured: items[index],
    rest: items.filter((_, itemIndex) => itemIndex !== index),
  };
}
