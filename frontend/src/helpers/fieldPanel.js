const LABEL_ALIASES = {
  Judul: ['title', 'heading', 'nama'],
  Teks: ['text', 'tulisan'],
  Konten: ['isi', 'artikel'],
  Gambar: ['image', 'foto', 'media'],
  URL: ['tautan', 'link'],
  'URL YouTube': ['embed', 'video', 'youtube'],
  Kerangka: ['layout', 'chrome', 'lebar halaman'],
  Sidebar: ['sisi'],
  'Hero judul': ['banner'],
  Rata: ['align', 'tengah', 'kiri', 'kanan'],
  Position: ['letak', 'rapat', 'atas', 'bawah', 'posisi', 'putar', 'flip'],
  'Tampilan data': ['bentuk', 'kartu', 'daftar', 'field', 'tampilkan'],
  'Field data': ['judul', 'tanggal', 'lokasi', 'isi data'],
  'Tautkan ke data': ['mapping', 'bind', 'judul data', 'gambar data'],
  Padding: ['jarak dalam'],
  Margin: ['jarak luar'],
};

export const STYLE_SECTIONS = [
  { id: 'place', label: 'Position', keywords: ['letak', 'rapat', 'atas', 'bawah', 'tengah', 'kiri', 'kanan', 'posisi', 'position', 'putar', 'flip'] },
  { id: 'latar', label: 'Latar', keywords: ['latar', 'warna', 'background'] },
  { id: 'teks', label: 'Warna teks', keywords: ['teks', 'warna teks'] },
  { id: 'padding', label: 'Padding', keywords: ['padding', 'jarak dalam'] },
  { id: 'margin', label: 'Margin', keywords: ['margin', 'jarak luar'] },
  { id: 'lebar', label: 'Lebar', keywords: ['lebar', 'width'] },
  { id: 'tinggi', label: 'Tinggi', keywords: ['tinggi', 'height'] },
  { id: 'font', label: 'Font', keywords: ['font', 'huruf'] },
  { id: 'bingkai', label: 'Bingkai', keywords: ['bingkai', 'border', 'sudut', 'radius'] },
  { id: 'bayangan', label: 'Bayangan', keywords: ['bayangan', 'shadow'] },
  { id: 'opacity', label: 'Transparansi', keywords: ['transparansi', 'opacity', 'opak'] },
];

export function fieldMatchesQuery(label, query, extras = []) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  const aliases = LABEL_ALIASES[label] || [];
  return [label, ...aliases, ...extras].filter(Boolean).join(' ').toLowerCase().includes(q);
}

export function styleFieldMatches(query) {
  return STYLE_SECTIONS.some((section) => fieldMatchesQuery(section.label, query, section.keywords));
}

export function showStyleSection(sectionId, query) {
  if (!query) return true;
  const section = STYLE_SECTIONS.find((item) => item.id === sectionId);
  return section ? fieldMatchesQuery(section.label, query, section.keywords) : false;
}

export function showPuckField(label, query) {
  if (!query) return true;
  if (label === 'Gaya') return styleFieldMatches(query);
  return fieldMatchesQuery(label, query);
}
