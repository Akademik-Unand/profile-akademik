jest.mock('../../../src/models', () => ({
  LandingPage: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
  },
  LandingSlide: {
    destroy: jest.fn(),
    bulkCreate: jest.fn(),
  },
  LandingService: {
    destroy: jest.fn(),
    bulkCreate: jest.fn(),
  },
  LandingGalleryItem: {
    destroy: jest.fn(),
    bulkCreate: jest.fn(),
  },
  Media: {},
  sequelize: {
    transaction: jest.fn((fn) => fn({})),
  },
}));

jest.mock('../../../src/utils/logger', () => ({ info: jest.fn(), error: jest.fn() }));

const { LandingPage, LandingSlide, LandingService, LandingGalleryItem } = require('../../../src/models');
const landingService = require('../../../src/services/landing.service');

describe('landing.service', () => {
  const superadmin = { id: 1, role: 'superadmin', unitIds: [] };
  const adminUnit = { id: 2, role: 'admin_unit', unitIds: [5] };

  beforeEach(() => jest.clearAllMocks());

  it('returns empty main-site landing for superadmin', async () => {
    LandingPage.findOne.mockResolvedValue(null);
    const landing = await landingService.getCurrent({ site: 'main' }, superadmin);
    expect(landing.unitId).toBeNull();
    expect(landing.heroTitle).toBeTruthy();
    expect(landing.showUnits).toBe(true);
  });

  it('forbids admin_unit from editing the main landing', async () => {
    await expect(landingService.upsert({ site: 'main', heroTitle: 'X' }, adminUnit)).rejects.toThrow(
      'Hanya superadmin yang dapat mengelola konten situs utama',
    );
  });

  it('upserts a unit landing for admin_unit', async () => {
    const saved = { id: 3, unitId: 5, toJSON: () => ({ id: 3, unitId: 5 }) };
    LandingPage.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(saved);
    LandingPage.create.mockResolvedValue({ id: 3, unitId: 5 });
    LandingSlide.destroy.mockResolvedValue(0);
    LandingSlide.bulkCreate.mockResolvedValue([]);
    LandingService.destroy.mockResolvedValue(0);
    LandingService.bulkCreate.mockResolvedValue([]);
    LandingGalleryItem.destroy.mockResolvedValue(0);
    LandingGalleryItem.bulkCreate.mockResolvedValue([]);
    const result = await landingService.upsert(
      {
        heroTitle: 'Perpustakaan',
        newsTitle: 'Berita kampus',
        slides: [],
        services: [{ label: 'SIMA', url: 'https://sima.unand.ac.id' }],
        gallery: [{ mediaId: 9, caption: 'Aula', featured: true }],
      },
      adminUnit,
    );
    expect(LandingPage.create).toHaveBeenCalled();
    expect(LandingPage.create.mock.calls[0][0].newsTitle).toBe('Berita kampus');
    expect(LandingService.bulkCreate).toHaveBeenCalled();
    expect(LandingGalleryItem.bulkCreate).toHaveBeenCalledWith(
      [expect.objectContaining({ mediaId: 9, featured: true, caption: 'Aula' })],
      expect.any(Object),
    );
    expect(result.unitId).toBe(5);
  });
});
