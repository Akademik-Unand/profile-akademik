const { sanitizeHtml } = require('../../../src/helpers/sanitizeHtml');

describe('sanitizeHtml', () => {
  it('strips script tags and event handlers', () => {
    const clean = sanitizeHtml('<p onclick="alert(1)">Halo</p><script>alert(2)</script>');
    expect(clean).toContain('Halo');
    expect(clean).not.toMatch(/script/i);
    expect(clean).not.toMatch(/onclick/i);
  });
});
