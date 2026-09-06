export const BLOCK_TYPES = [
  'Section',
  'Card',
  'Band',
  'Columns',
  'Columns3',
  'Split',
  'Spacer',
  'Divider',
  'Heading',
  'RichText',
  'Image',
  'Gallery',
  'Button',
  'Quote',
  'Accordion',
  'Embed',
  'Stats',
  'Hero',
  'Services',
  'Intro',
  'NewsFeed',
  'Announcements',
  'AgendaList',
  'UnitDirectory',
  'ClosingCta',
  'OrganizationTree',
  'PostArchive',
  'AgendaArchive',
  'CategoryFeed',
  'DynamicCollection',
  'DataField',
];

/** Label resmi Puck (drawer, outline, action bar, chrome kanvas). */
export const BUILDER_BLOCK_LABELS = {
  Section: 'Section',
  Card: 'Kartu',
  Band: 'Pita',
  Columns: 'Dua kolom',
  Columns3: 'Tiga kolom',
  Split: 'Dua sisi',
  Spacer: 'Jarak',
  Divider: 'Garis',
  Heading: 'Judul',
  RichText: 'Teks kaya',
  Image: 'Gambar',
  Gallery: 'Galeri',
  Button: 'Tombol',
  Quote: 'Kutipan',
  Accordion: 'Akordeon',
  Embed: 'Video YouTube',
  Stats: 'Angka',
  Hero: 'Hero',
  Services: 'Layanan',
  Intro: 'Pengantar',
  NewsFeed: 'Berita',
  Announcements: 'Pengumuman',
  AgendaList: 'Agenda',
  UnitDirectory: 'Daftar unit',
  ClosingCta: 'Penutup',
  OrganizationTree: 'Struktur organisasi',
  PostArchive: 'Arsip konten',
  AgendaArchive: 'Arsip agenda',
  CategoryFeed: 'Umpan kategori',
  DynamicCollection: 'Koleksi dinamis',
  DataField: 'Isi data',
};

export const BUILDER_BLOCK_META = {
  Section: { icon: 'mdi:view-agenda-outline', description: 'Wadah penuh lebar untuk mengelompokkan blok.' },
  Card: { icon: 'mdi:card-outline', description: 'Kotak berbingkai untuk mengelompokkan isi.' },
  Band: { icon: 'mdi:minus-box-outline', description: 'Pita tipis selebar layar, cocok untuk pengumuman singkat.' },
  Columns: { icon: 'mdi:view-column-outline', description: 'Dua kolom sejajar di dalam section.' },
  Columns3: { icon: 'mdi:view-week-outline', description: 'Tiga kolom sejajar untuk kartu atau tautan.' },
  Split: { icon: 'mdi:view-split-vertical', description: 'Kolom lebar plus sisi sempit, seperti artikel dan menu.' },
  Spacer: { icon: 'mdi:arrow-expand-vertical', description: 'Jarak kosong antar blok.' },
  Divider: { icon: 'mdi:minus', description: 'Garis pemisah horizontal.' },
  Heading: { icon: 'mdi:format-title', description: 'Judul section dengan garis aksen.' },
  RichText: { icon: 'mdi:text-box-outline', description: 'Paragraf, daftar, dan format teks.' },
  Image: { icon: 'mdi:image-outline', description: 'Satu gambar dari pustaka media.' },
  Gallery: { icon: 'mdi:image-multiple-outline', description: 'Beberapa foto dalam kisi.' },
  Button: { icon: 'mdi:button-cursor', description: 'Tombol tautan ke halaman lain.' },
  Quote: { icon: 'mdi:format-quote-close', description: 'Kalimat kutipan dengan sumber.' },
  Accordion: { icon: 'mdi:chevron-down-box-outline', description: 'Daftar buka-tutup, misalnya FAQ.' },
  Embed: { icon: 'mdi:youtube', description: 'Video YouTube lewat URL.' },
  Stats: { icon: 'mdi:counter', description: 'Angka penting, misalnya jumlah fakultas.' },
  Hero: { icon: 'mdi:panorama-outline', description: 'Banner besar di puncak beranda.' },
  Services: { icon: 'mdi:apps', description: 'Kisi tautan layanan unit.' },
  Intro: { icon: 'mdi:text-short', description: 'Pengantar singkat plus tautan profil.' },
  NewsFeed: { icon: 'mdi:newspaper-variant-outline', description: 'Daftar berita terbaru dari unit.' },
  Announcements: { icon: 'mdi:bullhorn-outline', description: 'Daftar pengumuman dari kategori.' },
  AgendaList: { icon: 'mdi:calendar-outline', description: 'Beberapa agenda terdekat.' },
  UnitDirectory: { icon: 'mdi:office-building-outline', description: 'Daftar unit di bawah situs ini.' },
  ClosingCta: { icon: 'mdi:message-text-outline', description: 'Ajakan di bagian bawah halaman.' },
  OrganizationTree: { icon: 'mdi:file-tree-outline', description: 'Bagan struktur organisasi unit.' },
  PostArchive: { icon: 'mdi:archive-outline', description: 'Arsip semua konten unit.' },
  AgendaArchive: { icon: 'mdi:calendar-clock-outline', description: 'Arsip agenda unit.' },
  CategoryFeed: { icon: 'mdi:shape-outline', description: 'Konten dari satu kategori.' },
  DynamicCollection: { icon: 'mdi:database-sync-outline', description: 'Koleksi dari jenis data situs.' },
  DataField: { icon: 'mdi:database-outline', description: 'Judul, tanggal, atau field lain dari item data situs.' },
};

export const DEFAULT_LAYOUT = {
  chrome: 'shell',
  sidebar: 'auto',
  showHero: true,
  background: 'base',
};

export const BACKGROUND_OPTIONS = [
  { label: 'Dasar', value: 'base' },
  { label: 'Putih', value: 'surface' },
  { label: 'Hijau muda', value: 'mist' },
  { label: 'Hijau gelap', value: 'hero' },
  { label: 'Hijau primer', value: 'primary' },
];

export const PADDING_OPTIONS = [
  { label: 'Tidak ada', value: 'none' },
  { label: 'Kecil', value: 'sm' },
  { label: 'Sedang', value: 'md' },
  { label: 'Lebar', value: 'lg' },
  { label: 'Sangat lebar', value: 'xl' },
];

export const MARGIN_OPTIONS = [
  { label: 'Tidak ada', value: 'none' },
  { label: 'Kecil', value: 'sm' },
  { label: 'Sedang', value: 'md' },
  { label: 'Lebar', value: 'lg' },
];

export const WIDTH_OPTIONS = [
  { label: 'Penuh layar', value: 'full' },
  { label: 'Lebar', value: 'wide' },
  { label: 'Konten', value: 'content' },
  { label: 'Sempit', value: 'narrow' },
];

export const ALIGN_OPTIONS = [
  { label: 'Kiri', value: 'left', icon: 'mdi:format-align-left' },
  { label: 'Tengah', value: 'center', icon: 'mdi:format-align-center' },
  { label: 'Kanan', value: 'right', icon: 'mdi:format-align-right' },
  { label: 'Rata kiri-kanan', value: 'justify', icon: 'mdi:format-align-justify' },
];

export const ALIGN_PLACE_OPTIONS = ALIGN_OPTIONS.filter((item) => item.value !== 'justify');

/** Nama field slot Puck — menggantikan DropZone + data.zones. */
export const SLOT_KEYS_BY_TYPE = {
  Section: ['content'],
  Card: ['content'],
  Band: ['content'],
  Split: ['main', 'side'],
  Columns: ['columnA', 'columnB', 'columnC'],
  Columns3: ['columnA', 'columnB', 'columnC'],
  AgendaList: ['item'],
  PostArchive: ['item'],
  AgendaArchive: ['item'],
  CategoryFeed: ['item'],
  DynamicCollection: ['item'],
};

export const SLOT_KEYS = [...new Set(Object.values(SLOT_KEYS_BY_TYPE).flat())];

export function slotFields(type) {
  return Object.fromEntries((SLOT_KEYS_BY_TYPE[type] || []).map((key) => [key, { type: 'slot' }]));
}

export function slotDefaults(type) {
  return Object.fromEntries((SLOT_KEYS_BY_TYPE[type] || []).map((key) => [key, []]));
}

export const TITLE_SIZE_OPTIONS = [
  { label: 'Sedang', value: 'md' },
  { label: 'Besar', value: 'lg' },
  { label: 'Lebih besar', value: 'xl' },
  { label: 'Sangat besar', value: '5xl' },
];
