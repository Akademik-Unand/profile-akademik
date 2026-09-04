'use strict';

const SERVICE_ROWS = [
  { label: 'Profil', icon: 'mdi:account-school-outline', url: '/halaman/profil', order: 0 },
  { label: 'Kalender', icon: 'mdi:calendar-month-outline', url: '/halaman/kalender-akademik', order: 1 },
  { label: 'SIMA', icon: 'mdi:open-in-new', url: 'https://sima.unand.ac.id', order: 2 },
  { label: 'UKT', icon: 'mdi:cash-multiple', url: '/halaman/tata-cara-ukt', order: 3 },
  { label: 'iLearn', icon: 'mdi:laptop', url: 'https://ilearn.unand.ac.id', order: 4 },
  { label: 'Organisasi', icon: 'mdi:account-group-outline', url: '/organisasi', order: 5 },
];

const GALLERY_FILES = ['unsplash-kuliah.jpg', 'unsplash-buku.jpg', 'unsplash-belajar.jpg', 'unsplash-rapat.jpg'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const [landings] = await queryInterface.sequelize.query(
      'SELECT id, intro_title FROM landing_pages WHERE unit_id IS NULL LIMIT 1',
    );
    if (!landings[0]) return;
    const landingId = landings[0].id;

    if (!landings[0].intro_title) {
      await queryInterface.bulkUpdate(
        'landing_pages',
        {
          intro_title: 'Tentang Bidang Akademik',
          intro_body:
            'Bidang Akademik Universitas Andalas mengoordinasikan pendidikan, kurikulum, kalender akademik, dan layanan kemahasiswaan. Portal ini memuat pengumuman resmi, agenda kegiatan, serta tautan ke sistem akademik UNAND.',
          show_gallery: true,
          updated_at: now,
        },
        { id: landingId },
      );
    }

    const [serviceRows] = await queryInterface.sequelize.query(
      'SELECT id FROM landing_services WHERE landing_page_id = ? LIMIT 1',
      { replacements: [landingId] },
    );
    if (!serviceRows.length) {
      await queryInterface.bulkInsert(
        'landing_services',
        SERVICE_ROWS.map((item) => ({
          landing_page_id: landingId,
          label: item.label,
          icon: item.icon,
          url: item.url,
          order: item.order,
          created_at: now,
          updated_at: now,
        })),
      );
    }

    const [galleryRows] = await queryInterface.sequelize.query(
      'SELECT id FROM landing_gallery_items WHERE landing_page_id = ? LIMIT 1',
      { replacements: [landingId] },
    );
    if (galleryRows.length) return;

    const [mediaRows] = await queryInterface.sequelize.query(
      `SELECT id, filename FROM media WHERE filename IN ('unsplash-kuliah.jpg', 'unsplash-buku.jpg', 'unsplash-belajar.jpg', 'unsplash-rapat.jpg')`,
    );
    const byFile = Object.fromEntries(mediaRows.map((row) => [row.filename, row.id]));
    const items = GALLERY_FILES.filter((file) => byFile[file]).map((file, index) => ({
      landing_page_id: landingId,
      media_id: byFile[file],
      caption: null,
      order: index,
      created_at: now,
      updated_at: now,
    }));
    if (items.length) await queryInterface.bulkInsert('landing_gallery_items', items);
  },

  async down(queryInterface) {
    const [landings] = await queryInterface.sequelize.query(
      'SELECT id FROM landing_pages WHERE unit_id IS NULL LIMIT 1',
    );
    if (!landings[0]) return;
    await queryInterface.bulkDelete('landing_services', { landing_page_id: landings[0].id });
    await queryInterface.bulkDelete('landing_gallery_items', { landing_page_id: landings[0].id });
  },
};
