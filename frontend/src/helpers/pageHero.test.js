import { pageHeroCrumbs } from './pageHero';

describe('pageHeroCrumbs', () => {
  it('drops the current page title so the heading is not repeated', () => {
    expect(
      pageHeroCrumbs(
        [{ label: 'Profil', to: '/halaman/profil' }, { label: 'Tugas Pokok dan Fungsi' }],
        'Tugas Pokok dan Fungsi',
      ).map((item) => item.label),
    ).toEqual(['Profil']);
  });
});
