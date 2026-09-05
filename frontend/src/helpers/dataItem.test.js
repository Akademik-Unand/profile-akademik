import { findBuilderNode, pickBuilderDocument, readTemplateItems, resolveDataField, sanitizeBindKey, sanitizeDataFieldKey } from './dataItem';

describe('sanitizeBindKey', () => {
  it('allows empty bind and drops illegal keys', () => {
    expect(sanitizeBindKey('')).toBe('');
    expect(sanitizeBindKey('title')).toBe('title');
    expect(sanitizeBindKey('hack')).toBe('');
  });
});

describe('sanitizeDataFieldKey', () => {
  it('keeps known fields and falls back to title', () => {
    expect(sanitizeDataFieldKey('location')).toBe('location');
    expect(sanitizeDataFieldKey('hack; url(x)')).toBe('title');
  });
});

describe('findBuilderNode', () => {
  it('finds a nested archive by id', () => {
    const doc = {
      content: [
        {
          type: 'Section',
          props: {
            id: 'sec',
            content: [{ type: 'AgendaArchive', props: { id: 'arch-1', item: [{ type: 'Card', props: {} }] } }],
          },
        },
      ],
    };
    expect(findBuilderNode(doc, 'arch-1')?.type).toBe('AgendaArchive');
  });
});

describe('pickBuilderDocument', () => {
  it('prefers the published render document over the Puck store', () => {
    const published = { content: [{ type: 'AgendaArchive', props: { id: 'a', item: [{ type: 'Card', props: {} }] } }] };
    const puckStore = { content: [{ type: 'AgendaArchive', props: { id: 'a', item: [] } }] };
    expect(pickBuilderDocument(published, puckStore)).toBe(published);
    expect(pickBuilderDocument(null, puckStore)).toBe(puckStore);
  });
});

describe('readTemplateItems', () => {
  it('prefers a slot array and otherwise reads the document', () => {
    expect(readTemplateItems([{ type: 'Card', props: {} }], null, 'x')).toHaveLength(1);
    expect(readTemplateItems(undefined, { content: [{ type: 'AgendaArchive', props: { id: 'a', item: [{ type: 'Card', props: {} }] } }] }, 'a')).toHaveLength(1);
    expect(readTemplateItems(() => null, { content: [{ type: 'AgendaArchive', props: { id: 'a', item: [{ type: 'Card', props: {} }] } }] }, 'a')).toHaveLength(1);
    expect(readTemplateItems(undefined, { content: [] }, 'a')).toEqual([]);
  });
});

describe('resolveDataField', () => {
  it('reads agenda title and date', () => {
    const item = { title: 'Rapat', startsAt: '2026-09-12T02:00:00.000Z', location: 'Aula' };
    expect(resolveDataField(item, 'title').text).toBe('Rapat');
    expect(resolveDataField(item, 'location').text).toBe('Aula');
    expect(resolveDataField(item, 'date').text).toMatch(/2026/);
  });
});
