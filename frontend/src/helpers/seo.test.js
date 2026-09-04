import { resolvePageSeo } from './seo';

describe('resolvePageSeo', () => {
  it('prefers page meta over unit seo', () => {
    const result = resolvePageSeo({
      unit: { name: 'Akademik', seoTitle: 'Unit SEO', seoDescription: 'Unit desc', seoKeywords: 'unand' },
      title: 'Profil',
      metaTitle: 'Profil meta',
      metaDescription: 'Halaman profil',
      metaKeywords: 'profil',
    });
    expect(result.title).toBe('Profil meta');
    expect(result.description).toBe('Halaman profil');
    expect(result.keywords).toBe('profil');
  });

  it('falls back to title plus unit name', () => {
    const result = resolvePageSeo({ unit: { name: 'Akademik' }, title: 'Organisasi' });
    expect(result.title).toBe('Organisasi | Akademik');
  });
});
