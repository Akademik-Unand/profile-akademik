import { filterSlotTree, migrateBuilderDocument } from './puckSlots';

describe('migrateBuilderDocument', () => {
  it('moves a DropZone zone onto the Section content slot', () => {
    const doc = migrateBuilderDocument({
      content: [{ type: 'Section', props: { id: 'Section-1', background: 'surface' } }],
      zones: {
        'Section-1:section-Section-1': [{ type: 'Heading', props: { id: 'h1', title: 'Halo' } }],
      },
    });
    expect(doc.zones).toEqual({});
    expect(doc.content[0].props.content).toEqual([{ type: 'Heading', props: { id: 'h1', title: 'Halo' } }]);
  });

  it('maps Split main/side zones in key order', () => {
    const doc = migrateBuilderDocument({
      content: [{ type: 'Split', props: { id: 'Split-1' } }],
      zones: {
        'Split-1:split-Split-1-main': [{ type: 'Heading', props: { id: 'a' } }],
        'Split-1:split-Split-1-side': [{ type: 'Heading', props: { id: 'b' } }],
      },
    });
    expect(doc.content[0].props.main[0].props.id).toBe('a');
    expect(doc.content[0].props.side[0].props.id).toBe('b');
  });
});

describe('filterSlotTree', () => {
  it('drops unknown nested blocks', () => {
    const items = filterSlotTree(
      [
        {
          type: 'Section',
          props: {
            content: [
              { type: 'Heading', props: { title: 'Ada' } },
              { type: 'Hack', props: {} },
            ],
          },
        },
      ],
      (item) => item.type !== 'Hack',
    );
    expect(items[0].props.content).toHaveLength(1);
  });
});
