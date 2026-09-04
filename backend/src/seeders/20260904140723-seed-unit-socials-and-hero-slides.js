'use strict';

const HERO_FILES = ['unsplash-kampus.jpg', 'unsplash-mahasiswa.jpg', 'unsplash-wisuda.jpg'];

const SOCIALS = {
  facebook_url: 'https://www.facebook.com/universitasandalas',
  instagram_url: 'https://www.instagram.com/unand_official/',
  twitter_url: 'https://x.com/unand_official',
  youtube_url: 'https://www.youtube.com/@universitasandalas',
  tiktok_url: 'https://www.tiktok.com/@unand_official',
  linkedin_url: 'https://www.linkedin.com/school/universitas-andalas/',
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkUpdate('units', { ...SOCIALS, updated_at: now }, { slug: 'akademik' });

    const [landings] = await queryInterface.sequelize.query(
      'SELECT id FROM landing_pages WHERE unit_id IS NULL LIMIT 1',
    );
    if (!landings[0]) return;
    const landingId = landings[0].id;

    const [existing] = await queryInterface.sequelize.query(
      'SELECT id FROM landing_slides WHERE landing_page_id = ? LIMIT 1',
      { replacements: [landingId] },
    );
    if (existing.length) return;

    const [mediaRows] = await queryInterface.sequelize.query(
      `SELECT id, filename FROM media WHERE filename IN ('unsplash-kampus.jpg', 'unsplash-mahasiswa.jpg', 'unsplash-wisuda.jpg')`,
    );
    const byFile = Object.fromEntries(mediaRows.map((row) => [row.filename, row.id]));
    const rows = HERO_FILES.filter((file) => byFile[file]).map((file, index) => ({
      landing_page_id: landingId,
      media_id: byFile[file],
      title: null,
      caption: null,
      link_url: null,
      order: index,
      created_at: now,
      updated_at: now,
    }));
    if (rows.length) await queryInterface.bulkInsert('landing_slides', rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkUpdate(
      'units',
      {
        facebook_url: null,
        instagram_url: null,
        twitter_url: null,
        youtube_url: null,
        tiktok_url: null,
        linkedin_url: null,
      },
      { slug: 'akademik' },
    );
    const [landings] = await queryInterface.sequelize.query(
      'SELECT id FROM landing_pages WHERE unit_id IS NULL LIMIT 1',
    );
    if (!landings[0]) return;
    await queryInterface.bulkDelete('landing_slides', { landing_page_id: landings[0].id });
  },
};
