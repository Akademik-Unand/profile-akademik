import { hasBuilder, htmlToBuilder, landingToBuilder, layoutFromRecord, publishDocument, safeBuilderDocument, sanitizeLayout } from './builderDocument';

describe('sanitizeLayout', () => {
  it('keeps sidebar show and drops illegal chrome', () => {
    expect(sanitizeLayout({ chrome: 'full; url(x)', sidebar: 'show' })).toEqual({
      chrome: 'shell',
      sidebar: 'show',
      showHero: true,
      background: 'base',
    });
  });
});

describe('publishDocument', () => {
  it('prefers the document Puck sends on publish', () => {
    const next = { content: [{ type: 'Heading', props: {} }], root: { props: { sidebar: 'show' } } };
    expect(publishDocument(next, { content: [] })).toBe(next);
    expect(publishDocument(undefined, { content: [] }).content).toEqual([]);
  });

  it('ignores a click event so Simpan still uses the live canvas', () => {
    const current = { content: [{ type: 'Heading', props: {} }] };
    expect(publishDocument({ type: 'click' }, current)).toBe(current);
  });
});

describe('layoutFromRecord', () => {
  it('lets builder root props override a seeded full layout', () => {
    const layout = layoutFromRecord({
      layout: { chrome: 'full', sidebar: 'hide', showHero: true, background: 'base' },
      builder: { root: { props: { chrome: 'shell', sidebar: 'show', showHero: true, background: 'base' } } },
    });
    expect(layout.chrome).toBe('shell');
    expect(layout.sidebar).toBe('show');
  });
});

describe('htmlToBuilder', () => {
  it('wraps existing page HTML', () => {
    const doc = htmlToBuilder('<p>Tata cara UKT</p>');
    expect(doc.content[0]).toMatchObject({ type: 'RichText' });
    expect(doc.content[0].props.html).toContain('Tata cara UKT');
  });
});

describe('landingToBuilder', () => {
  it('includes hero and closing by default', () => {
    const types = landingToBuilder({ showGallery: false, showUnits: false }).content.map((item) => item.type);
    expect(types[0]).toBe('Hero');
    expect(types.at(-1)).toBe('ClosingCta');
  });
});

describe('safeBuilderDocument', () => {
  it('keeps archive blocks', () => {
    const doc = safeBuilderDocument({
      content: [{ type: 'PostArchive', props: { title: '' } }],
      zones: {},
    });
    expect(doc.content[0].type).toBe('PostArchive');
  });

  it('drops unknown blocks so public render does not crash', () => {
    const doc = safeBuilderDocument({
      content: [
        { type: 'Heading', props: { title: 'Ada' } },
        { type: 'UnknownEvil', props: {} },
      ],
      zones: {},
    });
    expect(doc.content).toHaveLength(1);
    expect(hasBuilder(doc)).toBe(true);
  });

  it('lifts legacy DropZone zones into Section slots', () => {
    const doc = safeBuilderDocument({
      content: [{ type: 'Section', props: { id: 'Section-1' } }],
      zones: { 'Section-1:section-Section-1': [{ type: 'Heading', props: { title: 'Dalam' } }] },
    });
    expect(doc.content[0].props.content[0].type).toBe('Heading');
    expect(doc.zones).toEqual({});
  });
});
