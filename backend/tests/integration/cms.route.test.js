const request = require('supertest');
const { sequelize, User, Unit, UserUnit, Page, Post, PostCategory } = require('../../src/models');
const { hashPassword } = require('../../src/utils/auth');
const { syncDb } = require('../helpers/syncDb');
const app = require('../../src/app');

async function loginAs(email, password) {
  const res = await request(app).post('/api/v1/auth/login').send({ email, password });
  return res.headers['set-cookie'];
}

describe('cms content routes', () => {
  let akademik;
  let cookies;

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
      isActive: true,
      isDefault: true,
    });
    const perpustakaan = await Unit.create({
      slug: 'perpustakaan',
      name: 'Perpustakaan',
      isActive: true,
      isDefault: false,
    });
    await UserUnit.create({ userId: librarian.id, unitId: perpustakaan.id });
    cookies = await loginAs('admin@unand.ac.id', 'Admin123!');
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('creates and publishes a page', async () => {
    const res = await request(app)
      .post('/api/v1/admin/pages')
      .set('Cookie', cookies)
      .send({
        unitId: akademik.id,
        slug: 'profil',
        title: 'Profil',
        content: '<p>Halo</p>',
        status: 'published',
      });
    expect(res.status).toBe(201);
    const pub = await request(app).get('/api/v1/units/akademik/pages/profil');
    expect(pub.status).toBe(200);
    expect(pub.body.data.page.title).toBe('Profil');
  });

  it('creates a post and lists it publicly', async () => {
    const category = await PostCategory.create({
      unitId: akademik.id,
      name: 'Pengumuman',
      slug: 'pengumuman',
    });
    const res = await request(app)
      .post('/api/v1/admin/posts')
      .set('Cookie', cookies)
      .send({
        unitId: akademik.id,
        categoryId: category.id,
        slug: 'kalender',
        title: 'Kalender akademik',
        content: '<p>Isi</p>',
        status: 'published',
        isFeatured: true,
      });
    expect(res.status).toBe(201);
    const list = await request(app).get('/api/v1/units/akademik/posts?featured=true');
    expect(list.status).toBe(200);
    expect(list.body.data.items[0].slug).toBe('kalender');
  });

  it('hides draft pages from the public', async () => {
    await Page.create({
      unitId: akademik.id,
      slug: 'draft-only',
      title: 'Draft',
      content: 'x',
      status: 'draft',
    });
    const res = await request(app).get('/api/v1/units/akademik/pages/draft-only');
    expect(res.status).toBe(404);
  });

  it('creates a menu and returns a tree', async () => {
    const res = await request(app)
      .post('/api/v1/admin/menus')
      .set('Cookie', cookies)
      .send({
        unitId: akademik.id,
        label: 'Beranda',
        type: 'external_url',
        externalUrl: '/',
        location: 'header',
        order: 0,
      });
    expect(res.status).toBe(201);
    const pub = await request(app).get('/api/v1/units/akademik/menus?location=header');
    expect(pub.status).toBe(200);
    expect(pub.body.data.items[0].label).toBe('Beranda');
  });

  it('creates organization members and publishes agendas', async () => {
    const member = await request(app)
      .post('/api/v1/admin/organization-members')
      .set('Cookie', cookies)
      .send({
        unitId: akademik.id,
        name: 'WR I',
        title: 'Wakil Rektor I',
        order: 0,
      });
    expect(member.status).toBe(201);
    const org = await request(app).get('/api/v1/units/akademik/organization');
    expect(org.status).toBe(200);
    expect(org.body.data.items[0].name).toBe('WR I');

    const agenda = await request(app)
      .post('/api/v1/admin/agendas')
      .set('Cookie', cookies)
      .send({
        unitId: akademik.id,
        title: 'Masa kuliah',
        slug: 'masa-kuliah',
        startsAt: '2026-08-18T00:00:00.000Z',
        timeText: '08.00 - selesai',
        location: 'Universitas Andalas',
        status: 'published',
      });
    expect(agenda.status).toBe(201);
    const list = await request(app).get('/api/v1/units/akademik/agendas');
    expect(list.status).toBe(200);
    expect(list.body.data.items[0].slug).toBe('masa-kuliah');
  });

  it('forbids admin_unit from creating pages in another unit', async () => {
    const libCookies = await loginAs('perpustakaan@unand.ac.id', 'Admin123!');
    const res = await request(app)
      .post('/api/v1/admin/pages')
      .set('Cookie', libCookies)
      .send({
        unitId: akademik.id,
        slug: 'ilegal',
        title: 'Ilegal',
        content: 'x',
      });
    expect(res.status).toBe(403);
  });

  it('lets superadmin publish main-site content without a unit', async () => {
    const res = await request(app)
      .post('/api/v1/admin/pages')
      .set('Cookie', cookies)
      .send({
        unitId: null,
        slug: 'visi',
        title: 'Visi',
        content: '<p>Visi</p>',
        status: 'published',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.page.unitId).toBeNull();
    const pub = await request(app).get('/api/v1/units/akademik/pages/visi');
    expect(pub.status).toBe(200);
    expect(pub.body.data.page.title).toBe('Visi');
  });

  it('saves the main landing page', async () => {
    const res = await request(app)
      .put('/api/v1/admin/landings')
      .set('Cookie', cookies)
      .send({
        unitId: null,
        eyebrow: 'Universitas Andalas',
        heroTitle: 'Portal akademik',
        heroSubtitle: 'Informasi resmi',
        ctaLabel: 'Pengumuman',
        ctaUrl: '/pengumuman',
        showNews: true,
        showAgenda: true,
        showServices: true,
        showUnits: true,
        slides: [],
      });
    expect(res.status).toBe(200);
    expect(res.body.data.landing.heroTitle).toBe('Portal akademik');
    const unit = await request(app).get('/api/v1/units/akademik');
    expect(unit.status).toBe(200);
    expect(unit.body.data.unit.landing.heroTitle).toBe('Portal akademik');
  });

  it('forbids admin_unit from saving the main landing', async () => {
    const libCookies = await loginAs('perpustakaan@unand.ac.id', 'Admin123!');
    const res = await request(app)
      .put('/api/v1/admin/landings')
      .set('Cookie', libCookies)
      .send({ site: 'main', heroTitle: 'Tidak boleh' });
    expect(res.status).toBe(403);
  });
});
