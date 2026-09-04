jest.mock('../../../src/models', () => ({
  OrganizationMember: {
    findAndCountAll: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Unit: { findOne: jest.fn() },
  Media: {},
}));

jest.mock('../../../src/utils/logger', () => ({ info: jest.fn(), error: jest.fn() }));

const { OrganizationMember, Unit } = require('../../../src/models');
const organizationMemberService = require('../../../src/services/organizationMember.service');

describe('organizationMember.service', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a member for the actor unit', async () => {
    OrganizationMember.create.mockResolvedValue({ id: 1, unitId: 3, name: 'A' });
    const member = await organizationMemberService.create(
      { name: 'A', title: 'Direktur' },
      { id: 2, role: 'admin_unit', unitIds: [3] },
    );
    expect(OrganizationMember.create).toHaveBeenCalledWith(expect.objectContaining({ unitId: 3, name: 'A' }));
    expect(member.id).toBe(1);
  });

  it('returns 404 when public unit is missing', async () => {
    Unit.findOne.mockResolvedValue(null);
    await expect(organizationMemberService.listPublic('x')).rejects.toMatchObject({ statusCode: 404 });
  });
});
