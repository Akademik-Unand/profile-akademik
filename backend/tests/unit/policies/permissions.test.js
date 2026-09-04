const { buildCatalog, isAdminUnitDefault } = require('../../../src/constants/permissions');
const defineAbility = require('../../../src/policies/defineAbility');
const { subject } = require('@casl/ability');

describe('permission catalog', () => {
  it('contains unique names and default admin_unit grants without IAM danger', () => {
    const catalog = buildCatalog();
    const names = catalog.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
    const defaults = catalog.filter(isAdminUnitDefault);
    expect(defaults.some((item) => item.group === 'iam')).toBe(false);
    expect(defaults.some((item) => item.subject === 'Page' && item.action === 'create')).toBe(true);
  });
});

describe('defineAbility with stored permissions', () => {
  it('uses granted permissions instead of the default CMS set', () => {
    const ability = defineAbility({
      id: 2,
      role: 'admin_unit',
      unitIds: [5],
      permissions: [{ action: 'read', subject: 'Page' }],
    });
    expect(ability.can('read', 'Page')).toBe(true);
    expect(ability.can('create', 'Page')).toBe(false);
    expect(ability.can('create', 'User')).toBe(false);
  });

  it('still scopes updates to assigned units', () => {
    const ability = defineAbility({
      id: 2,
      role: 'admin_unit',
      unitIds: [5],
      permissions: [{ action: 'update', subject: 'Page' }],
    });
    expect(ability.can('update', subject('Page', { unitId: 5 }))).toBe(true);
    expect(ability.can('update', subject('Page', { unitId: 9 }))).toBe(false);
  });
});
