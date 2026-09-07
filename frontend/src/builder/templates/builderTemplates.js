import { blockId } from '../helpers/builderDocument';
import { BAND_PADDING, CARD_BORDER, CARD_PADDING, SECTION_PADDING, defaultBox } from '../constants/layoutBox';
import { defaultMotion } from '../constants/blockMotion';
import { defaultAgendaDisplay } from '../constants/dataDisplay';

function node(type, props = {}) {
  return { type, props: { id: blockId(type.toLowerCase()), motion: defaultMotion(), ...props } };
}

function withBox(overrides = {}) {
  return defaultBox({ padding: SECTION_PADDING, ...overrides });
}

/**
 * Salin node builder dengan id baru (rekursif untuk slot).
 */
export function cloneBuilderNodes(nodes) {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((item) => cloneBuilderNode(item)).filter(Boolean);
}

function cloneBuilderNode(item) {
  if (!item || typeof item !== 'object' || !item.type) return null;
  const props = { ...(item.props || {}), id: blockId(String(item.type).toLowerCase()) };
  Object.keys(props).forEach((key) => {
    if (Array.isArray(props[key]) && props[key].some((row) => row?.type)) {
      props[key] = cloneBuilderNodes(props[key]);
    }
  });
  return { type: item.type, props };
}

export const BUILDER_TEMPLATES = [
  {
    id: 'hero',
    title: 'Hero beranda',
    description: 'Judul besar, teks, tombol, dan slot slide.',
    icon: 'mdi:panorama-wide-angle-outline',
    category: 'Beranda',
    nodes: [
      node('Hero', {
        eyebrow: 'Portal akademik',
        title: 'Layanan akademik yang andal dan transparan',
        subtitle: 'Informasi pengumuman, pendaftaran, dan kalender akademik dalam satu portal.',
        ctaLabel: 'Baca selengkapnya',
        ctaUrl: '/pengumuman',
        slides: [],
        box: withBox(),
      }),
    ],
  },
  {
    id: 'news',
    title: 'Berita utama',
    description: 'Feed berita terbaru dari unit.',
    icon: 'mdi:newspaper-variant-outline',
    category: 'Konten',
    nodes: [node('NewsFeed', { title: 'Berita utama', limit: 6, featuredOnly: false, box: withBox() })],
  },
  {
    id: 'gallery',
    title: 'Galeri foto',
    description: 'Blok galeri siap diisi gambar.',
    icon: 'mdi:image-multiple-outline',
    category: 'Konten',
    nodes: [node('Gallery', { title: 'Galeri', subtitle: 'Dokumentasi kegiatan', items: [], box: withBox() })],
  },
  {
    id: 'announce-agenda',
    title: 'Pengumuman + Agenda',
    description: 'Dua kolom: pengumuman dan agenda.',
    icon: 'mdi:view-column-outline',
    category: 'Beranda',
    nodes: [
      node('Section', {
        background: 'mist',
        padding: 'md',
        margin: 'none',
        width: 'wide',
        align: 'left',
        box: withBox({ position: 'relative', padding: SECTION_PADDING }),
        content: [
          node('Columns', {
            count: 2,
            gap: 'lg',
            columnA: [
              node('Announcements', {
                title: 'Pengumuman',
                limit: 6,
                category: 'pengumuman',
                box: withBox({ padding: CARD_PADDING }),
              }),
            ],
            columnB: [
              node('AgendaList', {
                title: 'Agenda',
                limit: 4,
                display: defaultAgendaDisplay(),
                item: [],
                box: withBox({ padding: CARD_PADDING }),
              }),
            ],
            columnC: [],
            box: withBox({ padding: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' } }),
          }),
        ],
      }),
    ],
  },
  {
    id: 'stats',
    title: 'Angka penting',
    description: 'Deretan statistik singkat.',
    icon: 'mdi:counter',
    category: 'Konten',
    nodes: [
      node('Stats', {
        items: [
          { value: '16+', label: 'Fakultas' },
          { value: '50+', label: 'Program studi' },
          { value: '20rb+', label: 'Mahasiswa' },
          { value: '1', label: 'Portal akademik terpadu' },
        ],
        box: withBox(),
      }),
    ],
  },
  {
    id: 'intro',
    title: 'Pengantar unit',
    description: 'Judul, teks, dan tautan profil.',
    icon: 'mdi:text-box-outline',
    category: 'Konten',
    nodes: [
      node('Intro', {
        title: 'Tentang kami',
        body: 'Tulis pengantar singkat unit di sini.',
        profileUrl: '/halaman/profil',
        box: withBox(),
      }),
    ],
  },
  {
    id: 'cta',
    title: 'Ajakan penutup',
    description: 'Band CTA di bagian bawah halaman.',
    icon: 'mdi:message-text-outline',
    category: 'Beranda',
    nodes: [
      node('ClosingCta', {
        title: 'Akses layanan akademik',
        body: 'Pengumuman, pendaftaran, dan kalender akademik dalam satu portal.',
        ctaLabel: 'Lihat pengumuman',
        ctaUrl: '/pengumuman',
        box: withBox({ padding: BAND_PADDING }),
      }),
    ],
  },
  {
    id: 'content-card',
    title: 'Kartu konten',
    description: 'Section berisi kartu: judul, teks, tombol.',
    icon: 'mdi:card-text-outline',
    category: 'Tata letak',
    nodes: [
      node('Section', {
        background: 'surface',
        padding: 'md',
        margin: 'none',
        width: 'wide',
        align: 'left',
        box: withBox({ position: 'relative' }),
        content: [
          node('Card', {
            box: withBox({
              padding: CARD_PADDING,
              borderWidth: CARD_BORDER.width,
              borderStyle: CARD_BORDER.style,
              borderColor: CARD_BORDER.color,
              borderRadius: CARD_BORDER.radius,
            }),
            content: [
              node('Heading', { title: 'Judul bagian', size: 'xl', align: 'left', box: withBox({ padding: { top: 0, right: 0, bottom: 8, left: 0, unit: 'px' } }) }),
              node('RichText', {
                html: '<p>Isi singkat. Ganti teks ini sesuai kebutuhan.</p>',
                box: withBox({ padding: { top: 0, right: 0, bottom: 12, left: 0, unit: 'px' } }),
              }),
              node('Button', {
                label: 'Pelajari lebih lanjut',
                url: '#',
                variant: 'fill',
                box: withBox({ padding: { top: 10, right: 20, bottom: 10, left: 20, unit: 'px' } }),
              }),
            ],
          }),
        ],
      }),
    ],
  },
];
