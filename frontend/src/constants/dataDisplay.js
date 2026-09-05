export const DATA_LAYOUTS = [
  { label: 'Daftar', value: 'list' },
  { label: 'Kartu', value: 'cards' },
];

export const AGENDA_DISPLAY_FIELDS = [
  { key: 'title', label: 'Judul' },
  { key: 'date', label: 'Tanggal' },
  { key: 'time', label: 'Waktu' },
  { key: 'location', label: 'Lokasi' },
  { key: 'description', label: 'Deskripsi' },
];

export const POST_DISPLAY_FIELDS = [
  { key: 'title', label: 'Judul' },
  { key: 'date', label: 'Tanggal' },
  { key: 'category', label: 'Kategori' },
  { key: 'excerpt', label: 'Ringkasan' },
  { key: 'cover', label: 'Gambar' },
];

export const DISPLAY_BOOL_KEYS = [
  ...new Set([...AGENDA_DISPLAY_FIELDS, ...POST_DISPLAY_FIELDS].map((item) => item.key)),
];

export function defaultAgendaDisplay() {
  return { layout: 'list', title: true, date: true, time: true, location: true, description: true };
}

export function defaultPostDisplay() {
  return { layout: 'list', title: true, date: true, category: true, excerpt: true, cover: false };
}

export const SAMPLE_AGENDAS = [
  {
    id: 'sample-agenda-1',
    title: 'Contoh agenda unit',
    startsAt: '2026-09-12T02:00:00.000Z',
    timeText: '09.00–11.00',
    location: 'Auditorium',
    description: 'Ini contoh tampilan. Agenda sungguhan muncul setelah ada yang terbit.',
  },
];

export const SAMPLE_POSTS = [
  {
    id: 'sample-post-1',
    slug: 'contoh-konten',
    title: 'Contoh judul konten',
    excerpt: 'Ini contoh tampilan. Konten sungguhan muncul setelah ada yang terbit.',
    publishedAt: '2026-09-01T00:00:00.000Z',
    category: { name: 'Pengumuman' },
    cover: null,
  },
];
