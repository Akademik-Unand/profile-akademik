import { defaultLandingServices, landingGalleryItems, landingServiceItems, sectionTitle, splitGalleryMosaic, introParagraphs, closingCtaCopy } from './landingBlocks';

describe('landingServiceItems', () => {
  it('uses CMS services when present', () => {
    const items = landingServiceItems([{ id: 1, label: 'SIMA', url: 'https://sima.unand.ac.id', icon: 'mdi:open-in-new' }], '');
    expect(items).toEqual([
      { key: 1, label: 'SIMA', icon: 'mdi:open-in-new', url: 'https://sima.unand.ac.id', external: true },
    ]);
  });

  it('falls back to default tiles', () => {
    expect(landingServiceItems([], '').map((item) => item.label)).toEqual(['Profil', 'Kalender', 'SIMA', 'UKT']);
    expect(defaultLandingServices('perpustakaan')[0].url).toBe('/perpustakaan/halaman/profil');
  });
});

describe('landingGalleryItems', () => {
  it('drops items without media', () => {
    expect(
      landingGalleryItems([
        { id: 1, media: { url: 'https://img.test/a.jpg', altText: 'Kampus' }, featured: true },
        { id: 2, media: null },
      ]),
    ).toEqual([{ key: 1, url: 'https://img.test/a.jpg', caption: 'Kampus', featured: true }]);
  });
});

describe('sectionTitle', () => {
  it('uses CMS copy when present and falls back otherwise', () => {
    expect(sectionTitle(' Berita utama ', 'Berita')).toBe('Berita utama');
    expect(sectionTitle('', 'Galeri')).toBe('Galeri');
  });
});

describe('introParagraphs', () => {
  it('splits a two-sentence intro into lead and rest', () => {
    expect(
      introParagraphs(
        'Bidang Akademik mengoordinasikan pendidikan. Portal ini memuat pengumuman resmi.',
      ),
    ).toEqual([
      'Bidang Akademik mengoordinasikan pendidikan.',
      'Portal ini memuat pengumuman resmi.',
    ]);
  });

  it('keeps a short single sentence intact', () => {
    expect(introParagraphs('Portal akademik UNAND.')).toEqual(['Portal akademik UNAND.']);
  });
});

describe('closingCtaCopy', () => {
  it('replaces leftover contact copy', () => {
    expect(
      closingCtaCopy(
        { contactTitle: 'Hubungi kami', contactBody: 'Layanan dan informasi resmi Bidang Akademik.' },
        'Bidang Akademik',
      ),
    ).toEqual({
      title: 'Akses layanan akademik',
      body: 'Temukan pengumuman resmi, agenda kegiatan, dan tautan sistem di portal Bidang Akademik.',
    });
  });

  it('keeps custom closing copy', () => {
    expect(closingCtaCopy({ contactTitle: 'Masuk ke SIMA', contactBody: 'Registrasi mahasiswa baru dibuka.' })).toEqual({
      title: 'Masuk ke SIMA',
      body: 'Registrasi mahasiswa baru dibuka.',
    });
  });
});

describe('splitGalleryMosaic', () => {
  it('prefers the featured item for the large cell', () => {
    const items = [
      { key: 1, featured: false },
      { key: 2, featured: true },
      { key: 3, featured: false },
    ];
    expect(splitGalleryMosaic(items)).toEqual({
      featured: items[1],
      rest: [items[0], items[2]],
    });
  });

  it('uses the first item when none is featured', () => {
    const items = [{ key: 1, featured: false }, { key: 2, featured: false }];
    expect(splitGalleryMosaic(items).featured.key).toBe(1);
  });
});
