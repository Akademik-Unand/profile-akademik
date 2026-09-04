import { socialUnit, unitSocialLinks } from './unitSocial';

describe('unitSocialLinks', () => {
  it('returns only filled networks', () => {
    expect(
      unitSocialLinks({
        instagramUrl: 'https://www.instagram.com/unand_official/',
        facebookUrl: '',
      }).map((item) => item.key),
    ).toEqual(['instagramUrl']);
  });

  it('is empty without a unit', () => {
    expect(unitSocialLinks()).toEqual([]);
  });

  it('uses a TikTok icon that exists in Iconify', () => {
    const [tiktok] = unitSocialLinks({ tiktokUrl: 'https://www.tiktok.com/@unand' });
    expect(tiktok.icon).toBe('ri:tiktok-fill');
  });
});

describe('socialUnit', () => {
  it('prefers the default unit for site-wide chrome', () => {
    const units = [
      { slug: 'perpustakaan', isDefault: false, instagramUrl: 'https://instagram.com/lib' },
      { slug: 'akademik', isDefault: true, instagramUrl: 'https://instagram.com/unand' },
    ];
    expect(socialUnit({ slug: 'perpustakaan' }, units).slug).toBe('akademik');
  });
});
