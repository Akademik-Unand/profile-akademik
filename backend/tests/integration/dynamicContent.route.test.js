const request = require('supertest');
const { sequelize, User, Unit, UserUnit } = require('../../src/models');
const { hashPassword } = require('../../src/utils/auth');
const { syncDb } = require('../helpers/syncDb');
const app = require('../../src/app');

describe('dynamic content routes', () => {
  let cookies; let otherCookies; let unit; let other;
  beforeAll(async () => {
    await sequelize.authenticate(); await syncDb(sequelize);
    const admin = await User.unscoped().create({ name: 'Admin', email: 'dynamic@unand.ac.id', passwordHash: await hashPassword('Admin123!'), role: 'superadmin' });
    const scoped = await User.unscoped().create({ name: 'Scoped', email: 'scoped@unand.ac.id', passwordHash: await hashPassword('Admin123!'), role: 'admin_unit' });
    unit = await Unit.create({ slug: 'dynamic-unit', name: 'Dynamic Unit', isActive: true });
    other = await Unit.create({ slug: 'other-unit', name: 'Other Unit', isActive: true });
    await UserUnit.create({ userId: scoped.id, unitId: unit.id });
    cookies = (await request(app).post('/api/v1/auth/login').send({ email: admin.email, password: 'Admin123!' })).headers['set-cookie'];
    otherCookies = (await request(app).post('/api/v1/auth/login').send({ email: scoped.email, password: 'Admin123!' })).headers['set-cookie'];
  });
  afterAll(async () => sequelize.close());
  it('versions schemas, validates entries, and exposes public fields only', async () => {
    const made = await request(app).post('/api/v1/admin/content-types').set('Cookie', cookies).send({ unitId: unit.id, key: 'prestasi', name: 'Prestasi', schema: { fields: [{ key: 'description', type: 'richtext', required: true, public: true }, { key: 'secret', type: 'text', public: false }] } });
    expect(made.status).toBe(201); const id = made.body.data.contentType.id;
    expect((await request(app).post(`/api/v1/admin/content-types/${id}/versions/1/publish`).set('Cookie', cookies)).status).toBe(200);
    const entry = await request(app).post(`/api/v1/admin/content-types/${id}/entries`).set('Cookie', cookies).send({ title: 'Juara', slug: 'juara', status: 'published', data: { description: '<script>x</script><p>Juara I</p>', secret: 'private' } });
    expect(entry.status).toBe(201);
    const pub = await request(app).get('/api/v1/units/dynamic-unit/data/prestasi/juara');
    expect(pub.status).toBe(200); expect(pub.body.data.entry.data).toEqual({ description: '<p>Juara I</p>' });
  });
  it('rejects cross-unit list filters for admin unit', async () => {
    const result = await request(app).get(`/api/v1/admin/content-types?unitId=${other.id}`).set('Cookie', otherCookies);
    expect(result.status).toBe(403);
  });
});
