const { Op } = require('sequelize');
const { applyUnitScope, resolveCreateUnitId, assertUnitAccess, contentWhereForUnit, findPublishedBySlug } = require('../../../src/helpers/unitScope');
const AppError = require('../../../src/utils/AppError');

describe('unitScope', () => {
  it('does not constrain superadmin lists', () => {
    const where = applyUnitScope({}, { role: 'superadmin', unitIds: [] });
    expect(where.unitId).toBeUndefined();
  });

  it('scopes admin_unit lists', () => {
    const where = applyUnitScope({}, { role: 'admin_unit', unitIds: [2, 3] });
    expect(where.unitId).toEqual({ [Op.in]: [2, 3] });
  });

  it('uses first assigned unit when admin omits unitId', () => {
    expect(resolveCreateUnitId({ role: 'admin_unit', unitIds: [8] })).toBe(8);
  });

  it('lets superadmin omit unitId for the main site', () => {
    expect(resolveCreateUnitId({ role: 'superadmin', unitIds: [] })).toBeNull();
    expect(resolveCreateUnitId({ role: 'superadmin', unitIds: [] }, null)).toBeNull();
  });

  it('still resolves a numeric unit for superadmin', () => {
    expect(resolveCreateUnitId({ role: 'superadmin', unitIds: [] }, 4)).toBe(4);
  });

  it('blocks admin_unit from main-site content', () => {
    expect(() => assertUnitAccess({ role: 'admin_unit', unitIds: [2] }, null)).toThrow(AppError);
  });

  it('includes null unitId for the default unit public scope', () => {
    expect(contentWhereForUnit({ id: 1, isDefault: true })).toEqual({
      [Op.or]: [{ unitId: null }, { unitId: 1 }],
    });
  });

  it('scopes a regular unit to its own id', () => {
    expect(contentWhereForUnit({ id: 9, isDefault: false })).toEqual({ unitId: 9 });
  });

  it('picks the newest published twin for the default unit', async () => {
    const newer = { id: 4, updatedAt: '2026-09-05T12:00:00.000Z' };
    const Model = { findAll: jest.fn().mockResolvedValue([newer]) };
    await expect(findPublishedBySlug(Model, { id: 1, isDefault: true }, 'agenda')).resolves.toBe(newer);
    expect(Model.findAll).toHaveBeenCalled();
  });
});
