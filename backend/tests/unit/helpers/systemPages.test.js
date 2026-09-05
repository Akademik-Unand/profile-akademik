const { isSystemPageSlug, systemPageDocument, systemPageSpec, SYSTEM_PAGE_SLUGS } = require('../../../src/helpers/systemPages');
const { normalizeBuilder } = require('../../../src/helpers/builderDocument');

describe('systemPages', () => {
  it('lists pengumuman, organisasi, and agenda', () => {
    expect(SYSTEM_PAGE_SLUGS).toEqual(['pengumuman', 'organisasi', 'agenda']);
    expect(isSystemPageSlug('pengumuman')).toBe(true);
    expect(isSystemPageSlug('profil')).toBe(false);
  });

  it('builds a document with the matching archive block', () => {
    const doc = systemPageDocument(systemPageSpec('pengumuman'));
    expect(doc.content).toHaveLength(1);
    expect(doc.content[0].type).toBe('PostArchive');
    expect(doc.root.props.chrome).toBe('shell');
  });

  it('uses a full chrome layout for organisasi and agenda', () => {
    expect(systemPageDocument('organisasi').content[0].type).toBe('OrganizationTree');
    expect(systemPageDocument('organisasi').root.props.chrome).toBe('full');
    expect(systemPageDocument('agenda').content[0].type).toBe('AgendaArchive');
  });
});

describe('normalizeBuilder archive blocks', () => {
  it.each(['OrganizationTree', 'PostArchive', 'AgendaArchive', 'CategoryFeed'])('allows %s', (type) => {
    const doc = normalizeBuilder({
      content: [{ type, props: { title: 'Arsip' } }],
      zones: {},
    });
    expect(doc.content[0].type).toBe(type);
  });
});
