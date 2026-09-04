const request = require('supertest');
const { sequelize, User } = require('../../src/models');
const { hashPassword } = require('../../src/utils/auth');
const { syncDb } = require('../helpers/syncDb');
const app = require('../../src/app');

describe('auth routes', () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await syncDb(sequelize);
    await User.unscoped().create({
      name: 'Superadmin',
      email: 'admin@unand.ac.id',
      passwordHash: await hashPassword('Admin123!'),
      role: 'superadmin',
    });
  });

  afterAll(async () => {
    // Connection is reused by other integration files in this Jest run.
  });

  it('rejects invalid login payload', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'bukan-email' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@unand.ac.id', password: 'salah123' });
    expect(res.status).toBe(401);
  });

  it('logs in, reads /me, then logs out', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@unand.ac.id', password: 'Admin123!' });
    expect(login.status).toBe(200);
    expect(login.body.data.user.email).toBe('admin@unand.ac.id');
    const cookies = login.headers['set-cookie'];
    expect(cookies).toBeDefined();

    const me = await request(app).get('/api/v1/auth/me').set('Cookie', cookies);
    expect(me.status).toBe(200);
    expect(me.body.data.user.role).toBe('superadmin');

    const logout = await request(app).post('/api/v1/auth/logout').set('Cookie', cookies);
    expect(logout.status).toBe(200);
  });

  it('blocks /me without cookie', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});
