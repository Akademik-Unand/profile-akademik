const { normalizeSchema, validateEntryData, assertCompatibleSchema, publicData } = require('../../../src/helpers/dynamicSchema');

describe('dynamicSchema', () => {
  const schema = { fields: [
    { key: 'summary', label: 'Ringkasan', type: 'richtext', required: true, public: true, searchable: true },
    { key: 'internalNote', label: 'Catatan', type: 'text', public: false },
    { key: 'score', label: 'Nilai', type: 'number', required: true, filterable: true, sortable: true },
  ] };
  it('normalizes and validates supported data safely', () => {
    const value = validateEntryData(schema, { summary: '<script>x</script><p onclick="x">A</p>', score: '4', internalNote: 'secret' });
    expect(value.summary).toBe('<p>A</p>');
    expect(value.score).toBe(4);
    expect(publicData(schema, value)).toEqual({ summary: '<p>A</p>', score: 4 });
  });
  it('rejects unknown and dangerous keys', () => {
    expect(() => normalizeSchema({ fields: [{ key: 'constructor', type: 'text' }] })).toThrow();
    expect(() => validateEntryData(schema, { summary: 'A', score: 1, injected: true })).toThrow();
  });
  it('prevents destructive schema changes', () => {
    expect(() => assertCompatibleSchema(schema, { fields: [{ key: 'summary', type: 'text' }] })).toThrow();
  });
});
