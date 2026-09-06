jest.mock('../../../src/models', () => ({
  Menu: { findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn() },
  Page: {},
  PostCategory: {},
  ContentType: { findByPk: jest.fn() },
  Unit: { findOne: jest.fn() },
}));

jest.mock('../../../src/utils/logger', () => ({ info: jest.fn(), error: jest.fn() }));

const { Menu, ContentType } = require('../../../src/models');
const menuService = require('../../../src/services/menu.service');

const superadmin = { id: 1, role: 'superadmin', units: [] };

describe('menu.service Dynamic Site Data target', () => {
  beforeEach(() => jest.clearAllMocks());

  it('includes the content type target in menu queries', async () => {
    Menu.findAll.mockResolvedValue([]);
    await menuService.listByUnitId(7, 'header');
    expect(Menu.findAll.mock.calls[0][0].include).toEqual(expect.arrayContaining([
      expect.objectContaining({ as: 'targetContentType' }),
    ]));
  });

  it('creates a menu when its content type belongs to the same unit', async () => {
    ContentType.findByPk.mockResolvedValue({ id: 9, unitId: 7 });
    Menu.create.mockResolvedValue({ id: 3 });
    await menuService.create({ unitId: 7, label: 'Direktori', type: 'dynamic_content', targetContentTypeId: 9 }, superadmin);
    expect(Menu.create).toHaveBeenCalledWith(expect.objectContaining({ unitId: 7, targetContentTypeId: 9 }));
  });

  it('rejects a content type from another unit', async () => {
    ContentType.findByPk.mockResolvedValue({ id: 9, unitId: 8 });
    await expect(menuService.create({ unitId: 7, label: 'Direktori', type: 'dynamic_content', targetContentTypeId: 9 }, superadmin))
      .rejects.toMatchObject({ statusCode: 422 });
    expect(Menu.create).not.toHaveBeenCalled();
  });

  it('requires an explicit content type target', async () => {
    await expect(menuService.create({ unitId: 7, label: 'Direktori', type: 'dynamic_content' }, superadmin))
      .rejects.toMatchObject({ statusCode: 422 });
  });
});
