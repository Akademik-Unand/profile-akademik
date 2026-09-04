import { findMenuContext, isActiveMenuItem, withGroupCrumb, hasUnitContact } from './menuContext';

const menus = [
  {
    id: 1,
    label: 'Profil',
    type: 'page',
    targetPage: { slug: 'profil' },
    children: [],
  },
  {
    id: 2,
    label: 'Layanan',
    type: 'external_url',
    externalUrl: '#',
    children: [
      { id: 3, label: 'Kalender', type: 'page', targetPage: { slug: 'kalender-akademik' }, children: [] },
      { id: 4, label: 'Tata Cara UKT', type: 'page', targetPage: { slug: 'tata-cara-ukt' }, children: [] },
      { id: 5, label: 'SIMA', type: 'external_url', externalUrl: 'https://sima.unand.ac.id', children: [] },
    ],
  },
];

describe('findMenuContext', () => {
  it('returns siblings when the current page is a child', () => {
    const context = findMenuContext(menus, 'akademik', { pageSlug: 'tata-cara-ukt' });
    expect(context.group.label).toBe('Layanan');
    expect(context.current.label).toBe('Tata Cara UKT');
    expect(context.items.map((item) => item.label)).toEqual(['Kalender', 'Tata Cara UKT', 'SIMA']);
  });

  it('matches a child by href', () => {
    const context = findMenuContext(menus, 'akademik', { href: '/akademik/halaman/kalender-akademik?ref=1' });
    expect(context.current.label).toBe('Kalender');
  });

  it('does not treat query-only category links as the same page', () => {
    const posts = [
      {
        id: 10,
        label: 'Berita',
        type: 'post_category',
        targetCategory: { slug: 'berita' },
        children: [
          { id: 11, label: 'Pengumuman', type: 'post_category', targetCategory: { slug: 'pengumuman' }, children: [] },
          { id: 12, label: 'Beasiswa', type: 'post_category', targetCategory: { slug: 'beasiswa' }, children: [] },
        ],
      },
    ];
    const context = findMenuContext(posts, 'akademik', { href: '/akademik/pengumuman' });
    expect(context.group.label).toBe('Berita');
    expect(isActiveMenuItem(context.items[0], 'akademik', { href: '/akademik/pengumuman' })).toBe(false);
    expect(isActiveMenuItem(context.items[0], 'akademik', { href: '/akademik/pengumuman?category=pengumuman' })).toBe(true);
  });

  it('returns empty when nothing matches', () => {
    expect(findMenuContext(menus, 'akademik', { pageSlug: 'tidak-ada' })).toEqual({
      group: null,
      items: [],
      current: null,
    });
  });
});

describe('isActiveMenuItem', () => {
  it('marks the matching page as active', () => {
    expect(isActiveMenuItem(menus[1].children[1], 'akademik', { pageSlug: 'tata-cara-ukt' })).toBe(true);
    expect(isActiveMenuItem(menus[1].children[0], 'akademik', { pageSlug: 'tata-cara-ukt' })).toBe(false);
  });
});

describe('withGroupCrumb', () => {
  it('prepends the parent group when it is not already present', () => {
    const crumbs = withGroupCrumb(menus[1], [{ label: 'Tata Cara Pembayaran UKT' }], 'akademik');
    expect(crumbs.map((item) => item.label)).toEqual(['Layanan', 'Tata Cara Pembayaran UKT']);
  });

  it('does not duplicate an existing group crumb', () => {
    const crumbs = withGroupCrumb(menus[1], [{ label: 'Layanan' }, { label: 'UKT' }], 'akademik');
    expect(crumbs).toHaveLength(2);
  });
});

describe('hasUnitContact', () => {
  it('detects any contact field', () => {
    expect(hasUnitContact({ email: 'a@b.c' })).toBe(true);
    expect(hasUnitContact({})).toBe(false);
  });
});
