export const DATA_FIELD_KEYS = ['title', 'date', 'time', 'location', 'description', 'excerpt', 'category', 'cover', 'link'];

export const DATA_FIELD_OPTIONS = [
  { label: 'Judul', value: 'title' },
  { label: 'Tanggal', value: 'date' },
  { label: 'Waktu', value: 'time' },
  { label: 'Lokasi', value: 'location' },
  { label: 'Deskripsi', value: 'description' },
  { label: 'Ringkasan', value: 'excerpt' },
  { label: 'Kategori', value: 'category' },
  { label: 'Gambar', value: 'cover' },
  { label: 'Tautan', value: 'link' },
];

const none = { label: 'Tidak ditautkan (teks/file sendiri)', value: '' };

export const TEXT_BIND_OPTIONS = [
  none,
  { label: 'Judul data', value: 'title' },
  { label: 'Tanggal data', value: 'date' },
  { label: 'Waktu data', value: 'time' },
  { label: 'Lokasi data', value: 'location' },
  { label: 'Deskripsi data', value: 'description' },
  { label: 'Ringkasan data', value: 'excerpt' },
  { label: 'Kategori data', value: 'category' },
];

export const IMAGE_BIND_OPTIONS = [none, { label: 'Gambar item data', value: 'cover' }];

export const LINK_BIND_OPTIONS = [none, { label: 'Tautan item data', value: 'link' }];

export const BUTTON_BIND_OPTIONS = [
  none,
  { label: 'Judul data (teks tombol)', value: 'title' },
  { label: 'Tautan item data', value: 'link' },
];

export const DATA_SOURCES = ['agenda', 'post'];
