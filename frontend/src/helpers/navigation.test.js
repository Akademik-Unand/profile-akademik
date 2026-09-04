import { filterNavigation } from './navigation';
import { NAVIGATION_MENU } from '../constants/navigation';

const menu = [
  { type: 'link', label: 'Dashboard', path: '/admin' },
  {
    type: 'group',
    title: 'Konten',
    items: [
      {
        label: 'Unit',
        path: '/admin/units',
        permission: { action: 'manage', subject: 'Unit' },
      },
    ],
  },
];

describe('filterNavigation', () => {
  it('keeps unit menu for superadmin', () => {
    const result = filterNavigation(menu, { id: 1, role: 'superadmin', unitIds: [] });
    expect(result).toHaveLength(2);
    expect(result[1].items[0].label).toBe('Unit');
  });

  it('hides unit menu for admin_unit', () => {
    const result = filterNavigation(menu, { id: 2, role: 'admin_unit', unitIds: [3] });
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('Dashboard');
  });
});

describe('NAVIGATION_MENU', () => {
  it('places Situs above Konten', () => {
    const titles = NAVIGATION_MENU.filter((item) => item.type === 'group').map((item) => item.title);
    expect(titles.indexOf('Situs')).toBeLessThan(titles.indexOf('Konten'));
  });
});
