const BLOCK_TYPES = [
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
  'DataField',
];

const LAYOUT_CHROME = ['shell', 'full'];
const LAYOUT_SIDEBAR = ['auto', 'show', 'hide'];
const BACKGROUNDS = ['base', 'surface', 'mist', 'hero', 'primary'];
const PADDINGS = ['sm', 'md', 'lg', 'xl'];
const TITLE_SIZES = ['md', 'lg', 'xl', '5xl'];
const ALIGNS = ['left', 'center'];

const DEFAULT_LAYOUT = {
  chrome: 'shell',
  sidebar: 'auto',
  showHero: true,
  background: 'base',
};

const SLOT_KEYS_BY_TYPE = {
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
};

const SLOT_KEYS = [...new Set(Object.values(SLOT_KEYS_BY_TYPE).flat())];

module.exports = {
  BLOCK_TYPES,
  LAYOUT_CHROME,
  LAYOUT_SIDEBAR,
  BACKGROUNDS,
  PADDINGS,
  TITLE_SIZES,
  ALIGNS,
  DEFAULT_LAYOUT,
  SLOT_KEYS_BY_TYPE,
  SLOT_KEYS,
};
