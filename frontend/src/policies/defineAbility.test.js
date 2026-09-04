import { subject } from '@casl/ability';
import { defineAbility } from '../policies/defineAbility';

describe('defineAbility', () => {
  it('allows superadmin to manage units', () => {
    const ability = defineAbility({ id: 1, role: 'superadmin', unitIds: [] });
    expect(ability.can('manage', 'Unit')).toBe(true);
  });

  it('prevents admin_unit from creating units', () => {
    const ability = defineAbility({ id: 2, role: 'admin_unit', unitIds: [3] });
    expect(ability.can('create', 'Unit')).toBe(false);
    expect(ability.can('read', subject('Unit', { id: 3 }))).toBe(true);
  });

  it('lets admin_unit update assigned units', () => {
    const ability = defineAbility({ id: 2, role: 'admin_unit', unitIds: [3] });
    expect(ability.can('update', subject('Unit', { id: 3 }))).toBe(true);
    expect(ability.can('update', subject('Unit', { id: 9 }))).toBe(false);
    expect(ability.can('create', 'Unit')).toBe(false);
  });

  it('lets admin_unit create pages', () => {
    const ability = defineAbility({ id: 2, role: 'admin_unit', unitIds: [3] });
    expect(ability.can('create', 'Page')).toBe(true);
    expect(ability.can('update', subject('Page', { unitId: 3 }))).toBe(true);
  });

  it('scopes menu and media updates to unit', () => {
    const ability = defineAbility({ id: 2, role: 'admin_unit', unitIds: [3] });
    expect(ability.can('create', 'Menu')).toBe(true);
    expect(ability.can('update', subject('Menu', { unitId: 3 }))).toBe(true);
    expect(ability.can('update', subject('Menu', { unitId: 9 }))).toBe(false);
    expect(ability.can('create', 'Media')).toBe(true);
    expect(ability.can('create', 'OrganizationMember')).toBe(true);
    expect(ability.can('create', 'Agenda')).toBe(true);
    expect(ability.can('read', 'Landing')).toBe(true);
    expect(ability.can('update', subject('Landing', { unitId: 3 }))).toBe(true);
    expect(ability.can('update', subject('Landing', { unitId: 9 }))).toBe(false);
  });
});
