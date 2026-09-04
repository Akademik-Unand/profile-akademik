jest.mock('../../../src/models', () => ({
  Agenda: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Unit: { findOne: jest.fn() },
}));

jest.mock('../../../src/utils/logger', () => ({ info: jest.fn(), error: jest.fn() }));

const { Agenda, Unit } = require('../../../src/models');
const agendaService = require('../../../src/services/agenda.service');

describe('agenda.service', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists only published agendas for the public', async () => {
    Unit.findOne.mockResolvedValue({ id: 1, slug: 'akademik' });
    Agenda.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
    await agendaService.listPublic('akademik', { page: 1, limit: 10 });
    expect(Agenda.findAndCountAll.mock.calls[0][0].where.status).toBe('published');
  });
});
