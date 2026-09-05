import { isPreviewRequest, withPreviewQuery } from './previewHref';

describe('withPreviewQuery', () => {
  it('adds preview=1 to a path', () => {
    expect(withPreviewQuery('/admin/pages/3/preview')).toBe('/admin/pages/3/preview?preview=1');
  });

  it('keeps existing query params', () => {
    expect(withPreviewQuery('/admin/landing/preview?site=main')).toBe(
      '/admin/landing/preview?site=main&preview=1',
    );
  });
});

describe('isPreviewRequest', () => {
  it('reads the preview flag', () => {
    expect(isPreviewRequest(new URLSearchParams('preview=1'))).toBe(true);
    expect(isPreviewRequest(new URLSearchParams(''))).toBe(false);
  });
});
