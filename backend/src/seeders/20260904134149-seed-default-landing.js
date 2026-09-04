'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const [existing] = await queryInterface.sequelize.query(
      'SELECT id FROM landing_pages WHERE unit_id IS NULL LIMIT 1',
    );
    if (existing.length) return;
    await queryInterface.bulkInsert('landing_pages', [
      {
        unit_id: null,
        eyebrow: 'Bidang Akademik Universitas Andalas',
        hero_title: 'Layanan akademik yang andal dan transparan',
        hero_subtitle: 'Informasi pengumuman, pendaftaran, dan kalender akademik dalam satu portal.',
        cta_label: 'Lihat pengumuman',
        cta_url: '/pengumuman',
        intro_title: '',
        intro_body: '',
        show_news: true,
        show_agenda: true,
        show_services: true,
        show_units: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('landing_pages', { unit_id: null });
  },
};
