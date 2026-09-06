import {
  ALIGN_OPTIONS,
  ALIGN_PLACE_OPTIONS,
  BACKGROUND_OPTIONS,
  BUILDER_BLOCK_LABELS,
  slotDefaults,
  slotFields,
  PADDING_OPTIONS,
  TITLE_SIZE_OPTIONS,
  WIDTH_OPTIONS,
} from '../constants/builder';
import { BAND_PADDING, BUTTON_BORDER, BUTTON_PADDING, BUTTON_VARIANTS, CARD_BORDER, CARD_PADDING, SECTION_PADDING } from '../constants/layoutBox';
import { AGENDA_DISPLAY_FIELDS, POST_DISPLAY_FIELDS, defaultAgendaDisplay, defaultPostDisplay } from '../constants/dataDisplay';
import { BUTTON_BIND_OPTIONS, DATA_FIELD_OPTIONS, IMAGE_BIND_OPTIONS, TEXT_BIND_OPTIONS } from '../constants/dataFields';
import { IMAGE_ALIGN_OPTIONS, IMAGE_SIZE_OPTIONS } from '../helpers/contentImage';
import { alignField, dataBindField, dataDisplayField, gapSizeField, layoutDefaults, layoutFields } from './layoutFields';
import { MediaField } from './fields/MediaField';
import { RichTextField } from './fields/RichTextField';
import { PageRoot } from './blocks/PageRoot';
import { puckRenders } from './puckRenders';

const tokenSelect = (options, label) => ({ type: 'select', options, ...(label ? { label } : {}) });

export const puckConfig = {
  categories: {
    layout: {
      title: 'Tata letak',
      components: ['Section', 'Card', 'Band', 'Columns', 'Columns3', 'Split', 'Spacer', 'Divider', 'Heading'],
    },
    content: { title: 'Konten', components: ['RichText', 'Image', 'Gallery', 'Button', 'Quote', 'Accordion', 'Embed', 'Stats'] },
    data: {
      title: 'Data situs',
      components: [
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
      ],
    },
  },
  root: {
    fields: {
      chrome: { type: 'radio', label: 'Kerangka', options: [
        { label: 'Artikel + sidebar', value: 'shell' },
        { label: 'Penuh lebar', value: 'full' },
      ] },
      sidebar: { type: 'radio', label: 'Sidebar', options: [
        { label: 'Otomatis', value: 'auto' },
        { label: 'Tampil', value: 'show' },
        { label: 'Sembunyi', value: 'hide' },
      ] },
      showHero: { type: 'radio', label: 'Hero judul', options: [
        { label: 'Tampil', value: true },
        { label: 'Sembunyi', value: false },
      ] },
      background: { type: 'select', label: 'Latar halaman', options: BACKGROUND_OPTIONS },
    },
    defaultProps: { chrome: 'shell', sidebar: 'auto', showHero: true, background: 'base' },
    render: PageRoot,
  },
  components: {
    Section: {
      label: BUILDER_BLOCK_LABELS.Section,
      fields: {
        ...slotFields('Section'),
        background: { type: 'select', label: 'Latar tema', options: BACKGROUND_OPTIONS },
        width: { type: 'select', label: 'Lebar isi', options: WIDTH_OPTIONS },
        align: alignField(ALIGN_OPTIONS),
        ...layoutFields({ defaultPosition: 'relative', includeFont: true, includeColor: false }),
      },
      defaultProps: {
        ...slotDefaults('Section'),
        background: 'surface',
        padding: 'md',
        margin: 'none',
        width: 'wide',
        align: 'left',
        ...layoutDefaults({ position: 'relative', padding: SECTION_PADDING }),
      },
      render: puckRenders.Section,
    },
    Card: {
      label: BUILDER_BLOCK_LABELS.Card,
      fields: { ...slotFields('Card'), ...layoutFields() },
      defaultProps: {
        ...slotDefaults('Card'),
        ...layoutDefaults({
          padding: CARD_PADDING,
          borderWidth: CARD_BORDER.width,
          borderStyle: CARD_BORDER.style,
          borderColor: CARD_BORDER.color,
          borderRadius: CARD_BORDER.radius,
        }),
      },
      render: puckRenders.Card,
    },
    Band: {
      label: BUILDER_BLOCK_LABELS.Band,
      fields: {
        ...slotFields('Band'),
        background: { type: 'select', label: 'Latar tema', options: BACKGROUND_OPTIONS },
        ...layoutFields({ includeColor: false }),
      },
      defaultProps: { ...slotDefaults('Band'), background: 'mist', ...layoutDefaults({ padding: BAND_PADDING }) },
      render: puckRenders.Band,
    },
    Columns: {
      label: BUILDER_BLOCK_LABELS.Columns,
      fields: {
        ...slotFields('Columns'),
        count: tokenSelect([
          { label: '2 kolom', value: 2 },
          { label: '3 kolom', value: 3 },
        ], 'Jumlah kolom'),
        gap: tokenSelect([
          { label: 'Rapat', value: 'sm' },
          { label: 'Sedang', value: 'md' },
          { label: 'Longgar', value: 'lg' },
        ], 'Jarak kolom'),
        gapSize: gapSizeField,
        ...layoutFields({ includeWidth: false }),
      },
      defaultProps: { ...slotDefaults('Columns'), count: 2, gap: 'md', gapSize: { value: 32, unit: 'px' }, ...layoutDefaults() },
      render: puckRenders.Columns,
    },
    Columns3: {
      label: BUILDER_BLOCK_LABELS.Columns3,
      fields: {
        ...slotFields('Columns3'),
        gap: tokenSelect([
          { label: 'Rapat', value: 'sm' },
          { label: 'Sedang', value: 'md' },
          { label: 'Longgar', value: 'lg' },
        ], 'Jarak kolom'),
        gapSize: gapSizeField,
        ...layoutFields({ includeWidth: false }),
      },
      defaultProps: { ...slotDefaults('Columns3'), count: 3, gap: 'md', gapSize: { value: 32, unit: 'px' }, ...layoutDefaults() },
      render: puckRenders.Columns3,
    },
    Split: {
      label: BUILDER_BLOCK_LABELS.Split,
      fields: { ...slotFields('Split'), ...layoutFields({ includeWidth: false }) },
      defaultProps: { ...slotDefaults('Split'), ...layoutDefaults() },
      render: puckRenders.Split,
    },
    Spacer: {
      label: BUILDER_BLOCK_LABELS.Spacer,
      fields: {
        size: { type: 'select', label: 'Ukuran', options: PADDING_OPTIONS },
        ...layoutFields({ includeColor: false, includeWidth: false, includeHeight: true }),
      },
      defaultProps: { size: 'md', ...layoutDefaults({ width: { value: '', unit: 'auto' }, height: { value: 64, unit: 'px' } }) },
      render: puckRenders.Spacer,
    },
    Divider: {
      label: BUILDER_BLOCK_LABELS.Divider,
      fields: layoutFields({ includeColor: false, includeFont: false, includeHeight: false }),
      defaultProps: { ...layoutDefaults({ height: { value: '', unit: 'auto' } }) },
      render: puckRenders.Divider,
    },
    Heading: {
      label: BUILDER_BLOCK_LABELS.Heading,
      fields: {
        title: { type: 'text', label: 'Teks' },
        ...dataBindField(TEXT_BIND_OPTIONS),
        size: { type: 'select', label: 'Ukuran', options: TITLE_SIZE_OPTIONS },
        align: alignField(ALIGN_OPTIONS),
        ...layoutFields({ includeColor: false, includeTextColor: true, includeFont: true }),
      },
      defaultProps: { title: 'Judul section', bind: '', size: 'xl', align: 'left', ...layoutDefaults() },
      render: puckRenders.Heading,
    },
    RichText: {
      label: BUILDER_BLOCK_LABELS.RichText,
      fields: {
        html: { type: 'custom', label: 'Konten', render: RichTextField },
        ...dataBindField(TEXT_BIND_OPTIONS),
        ...layoutFields({ includeColor: false, includeTextColor: true, includeFont: true }),
      },
      defaultProps: { html: '<p>Tulis konten di sini.</p>', bind: '', ...layoutDefaults() },
      render: puckRenders.RichText,
    },
    Image: {
      label: BUILDER_BLOCK_LABELS.Image,
      fields: {
        image: { type: 'custom', label: 'Gambar', render: MediaField },
        ...dataBindField(IMAGE_BIND_OPTIONS),
        caption: { type: 'text', label: 'Keterangan' },
        alt: { type: 'text', label: 'Teks alt' },
        size: { type: 'select', label: 'Ukuran', options: IMAGE_SIZE_OPTIONS },
        align: alignField(IMAGE_ALIGN_OPTIONS),
        ...layoutFields({ includeColor: false }),
      },
      defaultProps: { image: null, bind: '', caption: '', alt: '', size: 'md', align: 'center', ...layoutDefaults() },
      render: puckRenders.Image,
    },
    Gallery: {
      label: BUILDER_BLOCK_LABELS.Gallery,
      fields: {
        title: { type: 'text', label: 'Judul' },
        subtitle: { type: 'text', label: 'Subjudul' },
        items: {
          type: 'array',
          label: 'Foto',
          arrayFields: {
            image: { type: 'custom', label: 'Gambar', render: MediaField },
            caption: { type: 'text', label: 'Keterangan' },
            featured: {
              type: 'radio',
              label: 'Foto unggulan',
              options: [
                { label: 'Ya', value: true },
                { label: 'Tidak', value: false },
              ],
            },
          },
          getItemSummary: (item, index) => item.caption || item.image?.url || `Foto ${index + 1}`,
        },
        ...layoutFields({ includeColor: false }),
      },
      defaultProps: { title: 'Galeri', subtitle: '', items: [], ...layoutDefaults() },
      render: puckRenders.Gallery,
    },
    Button: {
      label: BUILDER_BLOCK_LABELS.Button,
      fields: {
        label: { type: 'text', label: 'Teks' },
        url: { type: 'text', label: 'URL' },
        ...dataBindField(BUTTON_BIND_OPTIONS),
        align: alignField(ALIGN_PLACE_OPTIONS),
        variant: { type: 'radio', label: 'Jenis', options: BUTTON_VARIANTS },
        ...layoutFields({ includeTextColor: true, includeFont: true }),
      },
      defaultProps: {
        label: 'Baca selengkapnya',
        url: '/pengumuman',
        bind: '',
        align: 'left',
        variant: 'outline',
        ...layoutDefaults({
          padding: BUTTON_PADDING,
          width: { value: '', unit: 'auto' },
          height: { value: '', unit: 'auto' },
          color: 'primary',
          borderWidth: BUTTON_BORDER.width,
          borderStyle: BUTTON_BORDER.style,
          borderColor: BUTTON_BORDER.color,
          borderRadius: BUTTON_BORDER.radius,
        }),
      },
      render: puckRenders.Button,
    },
    Quote: {
      label: BUILDER_BLOCK_LABELS.Quote,
      fields: {
        quote: { type: 'textarea', label: 'Kutipan' },
        cite: { type: 'text', label: 'Sumber' },
        ...dataBindField(TEXT_BIND_OPTIONS),
        ...layoutFields({ includeTextColor: true, includeFont: true }),
      },
      defaultProps: { quote: 'Kalimat kutipan', cite: 'Sumber', bind: '', ...layoutDefaults() },
      render: puckRenders.Quote,
    },
    Accordion: {
      label: BUILDER_BLOCK_LABELS.Accordion,
      fields: {
        items: {
          type: 'array',
          label: 'Butir',
          arrayFields: {
            title: { type: 'text', label: 'Judul' },
            body: { type: 'textarea', label: 'Isi' },
          },
        },
        ...layoutFields(),
      },
      defaultProps: { items: [{ title: 'Pertanyaan', body: '' }], ...layoutDefaults() },
      render: puckRenders.Accordion,
    },
    Embed: {
      label: BUILDER_BLOCK_LABELS.Embed,
      fields: { url: { type: 'text', label: 'URL YouTube' }, ...layoutFields({ includeColor: false }) },
      defaultProps: { url: '', ...layoutDefaults() },
      render: puckRenders.Embed,
    },
    DynamicCollection: {
      label: 'Koleksi dinamis',
      fields: {
        typeKey: { type: 'text', label: 'Key jenis data' },
        title: { type: 'text', label: 'Judul' },
        limit: { type: 'number', label: 'Jumlah' },
        ...slotFields('DynamicCollection'),
        ...layoutFields(),
      },
      defaultProps: { typeKey: '', title: '', limit: 6, ...slotDefaults('DynamicCollection'), ...layoutDefaults() },
      render: puckRenders.DynamicCollection,
    },
    DataField: {
      label: BUILDER_BLOCK_LABELS.DataField,
      fields: {
        field: { type: 'select', label: 'Field data', options: DATA_FIELD_OPTIONS },
        dynamicField: { type: 'text', label: 'Key field dinamis' },
        formatter: { type: 'select', label: 'Format aman', options: [{ label: 'Teks', value: 'text' }, { label: 'Huruf besar', value: 'uppercase' }, { label: 'Angka', value: 'number' }, { label: 'Tanggal', value: 'date' }, { label: 'Tanggal & waktu', value: 'datetime' }, { label: 'Ya/Tidak', value: 'boolean' }] },
        ...layoutFields({ includeColor: false, includeTextColor: true, includeFont: true }),
      },
      defaultProps: { field: 'title', ...layoutDefaults({ width: { value: '', unit: 'auto' }, padding: { top: 0, right: 0, bottom: 0, left: 0, unit: 'px' } }) },
      render: puckRenders.DataField,
    },
    Stats: {
      label: BUILDER_BLOCK_LABELS.Stats,
      fields: {
        items: {
          type: 'array',
          label: 'Statistik',
          arrayFields: {
            value: { type: 'text', label: 'Angka' },
            label: { type: 'text', label: 'Label' },
          },
        },
        ...layoutFields(),
      },
      defaultProps: { items: [{ value: '16', label: 'Fakultas' }], ...layoutDefaults() },
      render: puckRenders.Stats,
    },
    Hero: {
      label: BUILDER_BLOCK_LABELS.Hero,
      fields: {
        eyebrow: { type: 'text', label: 'Label kecil' },
        title: { type: 'text', label: 'Judul' },
        subtitle: { type: 'textarea', label: 'Kalimat' },
        ctaLabel: { type: 'text', label: 'Teks tombol' },
        ctaUrl: { type: 'text', label: 'URL tombol' },
        slides: {
          type: 'array',
          label: 'Slide',
          arrayFields: {
            image: { type: 'custom', label: 'Gambar', render: MediaField },
            title: { type: 'text', label: 'Judul slide' },
            caption: { type: 'text', label: 'Keterangan' },
            linkUrl: { type: 'text', label: 'Tautan' },
          },
        },
        ...layoutFields(),
      },
      defaultProps: {
        eyebrow: 'Portal akademik',
        title: 'Layanan akademik yang andal dan transparan',
        subtitle: 'Informasi pengumuman, pendaftaran, dan kalender akademik dalam satu portal.',
        ctaLabel: 'Baca selengkapnya',
        ctaUrl: '/pengumuman',
        slides: [],
        ...layoutDefaults(),
      },
      render: puckRenders.Hero,
    },
    Intro: {
      label: BUILDER_BLOCK_LABELS.Intro,
      fields: {
        title: { type: 'text', label: 'Judul' },
        body: { type: 'textarea', label: 'Teks' },
        profileUrl: { type: 'text', label: 'URL tautan' },
        ...layoutFields(),
      },
      defaultProps: { title: 'Pengantar', body: 'Tulis pengantar singkat unit di sini.', profileUrl: '/halaman/profil', ...layoutDefaults() },
      render: puckRenders.Intro,
    },
    Services: {
      label: BUILDER_BLOCK_LABELS.Services,
      fields: {
        title: { type: 'text', label: 'Judul' },
        items: {
          type: 'array',
          label: 'Tautan',
          arrayFields: {
            label: { type: 'text', label: 'Label' },
            icon: { type: 'text', label: 'Ikon Iconify' },
            url: { type: 'text', label: 'URL' },
          },
        },
        ...layoutFields(),
      },
      defaultProps: {
        title: 'Layanan',
        items: [{ label: 'Pengumuman', icon: 'mdi:bullhorn-outline', url: '/pengumuman' }],
        ...layoutDefaults(),
      },
      render: puckRenders.Services,
    },
    NewsFeed: {
      label: BUILDER_BLOCK_LABELS.NewsFeed,
      fields: {
        title: { type: 'text', label: 'Judul' },
        limit: { type: 'number', label: 'Jumlah', min: 1, max: 12 },
        featuredOnly: {
          type: 'radio',
          label: 'Hanya unggulan',
          options: [
            { label: 'Ya', value: true },
            { label: 'Tidak', value: false },
          ],
        },
        ...layoutFields(),
      },
      defaultProps: { title: 'Berita utama', limit: 6, featuredOnly: false, ...layoutDefaults() },
      render: puckRenders.NewsFeed,
    },
    Announcements: {
      label: BUILDER_BLOCK_LABELS.Announcements,
      fields: {
        title: { type: 'text', label: 'Judul' },
        category: { type: 'text', label: 'Slug kategori' },
        limit: { type: 'number', label: 'Jumlah', min: 1, max: 12 },
        ...layoutFields(),
      },
      defaultProps: { title: 'Pengumuman', category: 'pengumuman', limit: 6, ...layoutDefaults() },
      render: puckRenders.Announcements,
    },
    AgendaList: {
      label: BUILDER_BLOCK_LABELS.AgendaList,
      fields: {
        ...slotFields('AgendaList'),
        title: { type: 'text', label: 'Judul' },
        limit: { type: 'number', label: 'Jumlah', min: 1, max: 12 },
        ...dataDisplayField(AGENDA_DISPLAY_FIELDS),
        ...layoutFields(),
      },
      defaultProps: { ...slotDefaults('AgendaList'), title: 'Agenda', limit: 4, display: defaultAgendaDisplay(), ...layoutDefaults() },
      render: puckRenders.AgendaList,
    },
    UnitDirectory: {
      label: BUILDER_BLOCK_LABELS.UnitDirectory,
      fields: { title: { type: 'text', label: 'Judul' }, ...layoutFields() },
      defaultProps: { title: 'Unit', ...layoutDefaults() },
      render: puckRenders.UnitDirectory,
    },
    ClosingCta: {
      label: BUILDER_BLOCK_LABELS.ClosingCta,
      fields: {
        title: { type: 'text', label: 'Judul' },
        body: { type: 'textarea', label: 'Teks' },
        ctaLabel: { type: 'text', label: 'Teks tombol' },
        ctaUrl: { type: 'text', label: 'URL tombol' },
        ...layoutFields(),
      },
      defaultProps: {
        title: 'Akses layanan akademik',
        body: 'Pengumuman, pendaftaran, dan kalender akademik dalam satu portal.',
        ctaLabel: 'Lihat pengumuman',
        ctaUrl: '/pengumuman',
        ...layoutDefaults(),
      },
      render: puckRenders.ClosingCta,
    },
    OrganizationTree: {
      label: BUILDER_BLOCK_LABELS.OrganizationTree,
      fields: { title: { type: 'text', label: 'Judul' }, ...layoutFields() },
      defaultProps: { title: 'Struktur organisasi', ...layoutDefaults() },
      render: puckRenders.OrganizationTree,
    },
    PostArchive: {
      label: BUILDER_BLOCK_LABELS.PostArchive,
      fields: {
        ...slotFields('PostArchive'),
        title: { type: 'text', label: 'Judul' },
        ...dataDisplayField(POST_DISPLAY_FIELDS),
        ...layoutFields(),
      },
      defaultProps: { ...slotDefaults('PostArchive'), title: 'Arsip konten', display: defaultPostDisplay(), ...layoutDefaults() },
      render: puckRenders.PostArchive,
    },
    AgendaArchive: {
      label: BUILDER_BLOCK_LABELS.AgendaArchive,
      fields: {
        ...slotFields('AgendaArchive'),
        title: { type: 'text', label: 'Judul' },
        ...dataDisplayField(AGENDA_DISPLAY_FIELDS),
        ...layoutFields(),
      },
      defaultProps: { ...slotDefaults('AgendaArchive'), title: 'Arsip agenda', display: defaultAgendaDisplay(), ...layoutDefaults() },
      render: puckRenders.AgendaArchive,
    },
    CategoryFeed: {
      label: BUILDER_BLOCK_LABELS.CategoryFeed,
      fields: {
        ...slotFields('CategoryFeed'),
        title: { type: 'text', label: 'Judul' },
        category: { type: 'text', label: 'Slug kategori' },
        limit: { type: 'number', label: 'Jumlah', min: 1, max: 12 },
        featuredOnly: {
          type: 'radio',
          label: 'Hanya unggulan',
          options: [
            { label: 'Ya', value: true },
            { label: 'Tidak', value: false },
          ],
        },
        ...dataDisplayField(POST_DISPLAY_FIELDS),
        ...layoutFields(),
      },
      defaultProps: {
        ...slotDefaults('CategoryFeed'),
        title: 'Konten',
        category: '',
        limit: 6,
        featuredOnly: false,
        display: defaultPostDisplay(),
        ...layoutDefaults(),
      },
      render: puckRenders.CategoryFeed,
    },
  },
};
