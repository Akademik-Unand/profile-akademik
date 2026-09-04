const { subject } = require('@casl/ability');
const defineAbility = require('../../../src/policies/defineAbility');

describe('defineAbility', () => {
  it('gives superadmin manage-all', () => {
    const ability = defineAbility({ id: 1, role: 'superadmin', unitIds: [] });
    expect(ability.can('manage', 'all')).toBe(true);
    expect(ability.can('create', 'Unit')).toBe(true);
    expect(ability.can('delete', 'Unit')).toBe(true);
  });

  it('limits admin_unit to reading assigned units', () => {
    const ability = defineAbility({ id: 2, role: 'admin_unit', unitIds: [5] });
    expect(ability.can('create', 'Unit')).toBe(false);
    expect(ability.can('update', subject('Unit', { id: 5 }))).toBe(true);
    expect(ability.can('update', subject('Unit', { id: 9 }))).toBe(false);
    expect(ability.can('read', 'Unit')).toBe(true);
    expect(ability.can('read', subject('Unit', { id: 5 }))).toBe(true);
    expect(ability.can('read', subject('Unit', { id: 9 }))).toBe(false);
  });

  it('lets admin_unit manage pages in assigned units', () => {
    const ability = defineAbility({ id: 2, role: 'admin_unit', unitIds: [5] });
    expect(ability.can('create', 'Page')).toBe(true);
    expect(ability.can('update', subject('Page', { unitId: 5 }))).toBe(true);
    expect(ability.can('update', subject('Page', { unitId: 9 }))).toBe(false);
    expect(ability.can('create', 'OrganizationMember')).toBe(true);
    expect(ability.can('create', 'Agenda')).toBe(true);
    expect(ability.can('create', 'Landing')).toBe(true);
    expect(ability.can('update', subject('Landing', { unitId: 5 }))).toBe(true);
    expect(ability.can('update', subject('Landing', { unitId: 9 }))).toBe(false);
  });

  it('returns empty ability when user is missing', () => {
    const ability = defineAbility(null);
    expect(ability.can('read', 'Unit')).toBe(false);
  });
});
