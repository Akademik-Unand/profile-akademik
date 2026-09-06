const {
  emptyBuilder,
  hasBuilder,
  htmlToBuilder,
  landingToBuilder,
  normalizeBuilder,
  assertKnownBlocks,
  layoutFromBuilder,
} = require('../../../src/helpers/builderDocument');

describe('layoutFromBuilder', () => {
  it('lets root props override a seeded full-width layout', () => {
    const layout = layoutFromBuilder(
      { root: { props: { chrome: 'shell', sidebar: 'show', showHero: true, background: 'base' } } },
      { chrome: 'full', sidebar: 'hide', showHero: true, background: 'base' },
    );
    expect(layout.chrome).toBe('shell');
    expect(layout.sidebar).toBe('show');
  });
});

describe('htmlToBuilder', () => {
  it('wraps HTML as a single RichText block', () => {
    const doc = htmlToBuilder('<p>Profil unit</p>');
    expect(doc.content).toHaveLength(1);
    expect(doc.content[0].type).toBe('RichText');
    expect(doc.content[0].props.html).toContain('Profil unit');
  });

  it('strips script tags', () => {
    const doc = htmlToBuilder('<p>Aman</p><script>alert(1)</script>');
    expect(doc.content[0].props.html).not.toMatch(/script/i);
  });

  it('returns an empty document for blank HTML', () => {
    expect(hasBuilder(htmlToBuilder(''))).toBe(false);
    expect(emptyBuilder().content).toEqual([]);
  });
});

describe('landingToBuilder', () => {
  it('builds hero, news, and closing blocks from legacy landing fields', () => {
    const doc = landingToBuilder({
      heroTitle: 'Portal akademik',
      showServices: false,
      showNews: true,
      showAgenda: false,
      showGallery: false,
      showUnits: false,
      contactTitle: 'Akses layanan',
    });
    expect(doc.content.map((item) => item.type)).toEqual(['Hero', 'NewsFeed', 'Section', 'ClosingCta']);
    expect(doc.root.props.chrome).toBe('full');
  });

  it('keeps announcements and agenda inside one two-column section', () => {
    const doc = landingToBuilder({ showServices: false, showGallery: false, showUnits: false });
    const section = doc.content.find((item) => item.type === 'Section');
    const columns = section.props.content[0];

    expect(section.props.background).toBe('mist');
    expect(columns).toMatchObject({ type: 'Columns', props: { count: 2, gap: 'lg' } });
    expect(columns.props.columnA[0].type).toBe('Announcements');
    expect(columns.props.columnB[0].type).toBe('AgendaList');
  });
});

describe('normalizeBuilder', () => {
  it('rejects unknown block types', () => {
    expect(() =>
      normalizeBuilder({
        content: [{ type: 'MysteryWidget', props: {} }],
        zones: {},
      }),
    ).toThrow(/tidak diizinkan/);
  });

  it('keeps known types', () => {
    const doc = normalizeBuilder({
      content: [{ type: 'Heading', props: { title: 'Halo' } }],
      zones: {},
    });
    expect(doc.content[0].type).toBe('Heading');
  });

  it('sanitizes box style and keeps token padding fallbacks', () => {
    const doc = normalizeBuilder({
      content: [
        {
          type: 'Section',
          props: {
            padding: 'md',
            box: {
              backgroundColor: 'primary',
              width: { value: '100vh; background: url(x)', unit: 'px' },
              padding: { top: 32, unit: 'px' },
            },
          },
        },
      ],
      zones: {},
    });
    expect(doc.content[0].props.padding).toBe('md');
    expect(doc.content[0].props.box.backgroundColor).toBe('primary');
    expect(doc.content[0].props.box.width.value).toBe('');
    expect(doc.content[0].props.box.padding.top).toBe(32);
  });

  it('sanitizes data display on archive blocks', () => {
    const doc = normalizeBuilder({
      content: [
        {
          type: 'AgendaArchive',
          props: { display: { layout: 'cards', title: false, hack: true } },
        },
      ],
      zones: {},
    });
    expect(doc.content[0].props.display).toEqual({ layout: 'cards', title: false });
  });

  it('sanitizes motion on content blocks', () => {
    const doc = normalizeBuilder({
      content: [
        {
          type: 'Heading',
          props: { motion: { effect: 'zoom-in', delay: 80, duration: 600, once: true, hack: true } },
        },
      ],
      zones: {},
    });
    expect(doc.content[0].props.motion).toEqual({
      effect: 'zoom-in',
      delay: 80,
      duration: 600,
      once: true,
    });
  });

  it('keeps a safe DataField key', () => {
    const doc = normalizeBuilder({
      content: [{ type: 'DataField', props: { field: 'hack; url(x)' } }],
      zones: {},
    });
    expect(doc.content[0].props.field).toBe('title');
  });

  it('keeps a safe bind on Heading', () => {
    const doc = normalizeBuilder({
      content: [{ type: 'Heading', props: { bind: 'title' } }],
      zones: {},
    });
    expect(doc.content[0].props.bind).toBe('title');
    expect(normalizeBuilder({ content: [{ type: 'Heading', props: { bind: 'hack' } }], zones: {} }).content[0].props.bind).toBe('');
  });
});

describe('assertKnownBlocks', () => {
  it('scans nested slot children', () => {
    expect(() =>
      assertKnownBlocks({
        content: [{ type: 'Section', props: { content: [{ type: 'Hack', props: {} }] } }],
        zones: {},
      }),
    ).toThrow(/Hack/);
  });

  it('lifts legacy DropZone zones into slots before scanning', () => {
    const doc = normalizeBuilder({
      content: [{ type: 'Section', props: { id: 'Section-1' } }],
      zones: { 'Section-1:section-Section-1': [{ type: 'Heading', props: { title: 'Dalam' } }] },
    });
    expect(doc.content[0].props.content[0].type).toBe('Heading');
    expect(doc.zones).toEqual({});
  });
});
