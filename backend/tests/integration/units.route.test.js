const request = require('supertest');
const { sequelize, User, Unit, UserUnit } = require('../../src/models');
const { hashPassword } = require('../../src/utils/auth');
const { syncDb } = require('../helpers/syncDb');
const app = require('../../src/app');

async function loginAs(email, password) {
  const res = await request(app).post('/api/v1/auth/login').send({ email, password });
  return res.headers['set-cookie'];
}

describe('unit routes', () => {
  let akademik;
  let perpustakaan;

  beforeAll(async () => {
    await sequelize.authenticate();
    await syncDb(sequelize);

    await User.unscoped().create({
      name: 'Superadmin',
      email: 'admin@unand.ac.id',
      passwordHash: await hashPassword('Admin123!'),
      role: 'superadmin',
    });
    const librarian = await User.unscoped().create({
      name: 'Admin Perpustakaan',
      email: 'perpustakaan@unand.ac.id',
      passwordHash: await hashPassword('Admin123!'),
      role: 'admin_unit',
    });

    akademik = await Unit.create({
      slug: 'akademik',
      name: 'Bidang Akademik',
      themeColor: '#166534',
      isActive: true,
      isDefault: true,
    });
    perpustakaan = await Unit.create({
      slug: 'perpustakaan',
      name: 'Perpustakaan',
      themeColor: '#1e3a8a',
      isActive: true,
      isDefault: false,
    });
    await UserUnit.create({ userId: librarian.id, unitId: perpustakaan.id });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('lists active public units', async () => {
    const res = await request(app).get('/api/v1/units');
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThanOrEqual(2);
  });

  it('returns unit by slug', async () => {
    const res = await request(app).get('/api/v1/units/perpustakaan');
    expect(res.status).toBe(200);
    expect(res.body.data.unit.slug).toBe('perpustakaan');
  });

  it('returns 404 for unknown slug', async () => {
    const res = await request(app).get('/api/v1/units/tidak-ada');
    expect(res.status).toBe(404);
  });

  it('allows superadmin to create a unit', async () => {
    const cookies = await loginAs('admin@unand.ac.id', 'Admin123!');
    const res = await request(app)
      .post('/api/v1/admin/units')
      .set('Cookie', cookies)
      .send({ slug: 'lab-bahasa', name: 'Lab Bahasa', isActive: true });
    expect(res.status).toBe(201);
    expect(res.body.data.unit.slug).toBe('lab-bahasa');
  });

  it('forbids admin_unit from creating units', async () => {
    const cookies = await loginAs('perpustakaan@unand.ac.id', 'Admin123!');
    const res = await request(app)
      .post('/api/v1/admin/units')
      .set('Cookie', cookies)
      .send({ slug: 'baru', name: 'Unit Baru' });
    expect(res.status).toBe(403);
  });

  it('allows superadmin to save social urls', async () => {
    const cookies = await loginAs('admin@unand.ac.id', 'Admin123!');
    const res = await request(app)
      .put(`/api/v1/admin/units/${akademik.id}`)
      .set('Cookie', cookies)
      .send({ instagramUrl: 'https://www.instagram.com/unand_official/' });
    expect(res.status).toBe(200);
    expect(res.body.data.unit.instagramUrl).toBe('https://www.instagram.com/unand_official/');
  });

  it('refuses deleting the default unit', async () => {
    const cookies = await loginAs('admin@unand.ac.id', 'Admin123!');
    const res = await request(app).delete(`/api/v1/admin/units/${akademik.id}`).set('Cookie', cookies);
    expect(res.status).toBe(422);
  });
});
