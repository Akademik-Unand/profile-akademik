import { sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('keeps safe markup', () => {
    expect(sanitizeHtml('<p>Halo <strong>UNAND</strong></p>')).toContain('<strong>UNAND</strong>');
  });

  it('strips script tags', () => {
    expect(sanitizeHtml('<p>ok</p><script>alert(1)</script>')).not.toContain('script');
  });

  it('keeps tables', () => {
    expect(sanitizeHtml('<table><tr><td>A</td></tr></table>')).toContain('<table>');
  });

  it('keeps inline font size from the editor', () => {
    expect(sanitizeHtml('<p><span style="font-size: 24px">Halo</span></p>')).toContain('font-size: 24px');
  });
});
