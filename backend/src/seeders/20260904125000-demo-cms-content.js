'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const [units] = await queryInterface.sequelize.query(
      "SELECT id FROM units WHERE slug = 'akademik' LIMIT 1",
    );
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@unand.ac.id' LIMIT 1",
    );
    if (!units[0] || !users[0]) return;

    const unitId = units[0].id;
    const userId = users[0].id;

    await queryInterface.bulkInsert('pages', [
      {
        unit_id: unitId,
        slug: 'profil',
        title: 'Profil Bidang Akademik',
        content:
          '<p>Bidang Akademik Universitas Andalas mengelola urusan akademik, kurikulum, dan layanan kemahasiswaan akademik.</p>',
        status: 'published',
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        slug: 'visi-misi',
        title: 'Visi dan Misi',
        content:
          '<p>Mewujudkan layanan akademik yang transparan, andal, dan berorientasi pada mutu pendidikan tinggi.</p>',
        status: 'published',
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('post_categories', [
      {
        unit_id: unitId,
        name: 'Pengumuman',
        slug: 'pengumuman',
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        name: 'Pendaftaran',
        slug: 'pendaftaran',
        created_at: now,
        updated_at: now,
      },
    ]);

    const [pages] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM pages WHERE unit_id = ${unitId}`,
    );
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM post_categories WHERE unit_id = ${unitId}`,
    );
    const profil = pages.find((item) => item.slug === 'profil');
    const visi = pages.find((item) => item.slug === 'visi-misi');
    const pengumuman = categories.find((item) => item.slug === 'pengumuman');
    const pendaftaran = categories.find((item) => item.slug === 'pendaftaran');

    await queryInterface.bulkInsert('posts', [
      {
        unit_id: unitId,
        category_id: pengumuman?.id || null,
        title: 'Kalender akademik semester gasal tersedia',
        slug: 'kalender-akademik-semester-gasal',
        excerpt: 'Unduh kalender akademik terbaru untuk perencanaan perkuliahan dan ujian.',
        content: '<p>Kalender akademik semester gasal telah diterbitkan. Silakan unduh pada laman terkait.</p>',
        status: 'published',
        cover_media_id: null,
        is_featured: true,
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        category_id: pendaftaran?.id || null,
        title: 'Prosedur registrasi mahasiswa baru',
        slug: 'prosedur-registrasi-mahasiswa-baru',
        excerpt: 'Panduan registrasi melalui SIMA UNAND untuk mahasiswa baru.',
        content: '<p>Mahasiswa baru wajib menyelesaikan registrasi melalui SIMA sesuai jadwal yang diumumkan.</p>',
        status: 'published',
        cover_media_id: null,
        is_featured: false,
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        category_id: pengumuman?.id || null,
        title: 'Pengumuman hasil seleksi SMMPTN',
        slug: 'pengumuman-hasil-seleksi-smmptn',
        excerpt: 'Hasil seleksi SMMPTN dapat dilihat pada portal akademik.',
        content: '<p>Peserta seleksi dapat memeriksa hasil melalui portal yang tercantum pada pengumuman resmi.</p>',
        status: 'published',
        cover_media_id: null,
        is_featured: false,
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('menus', [
      {
        unit_id: unitId,
        parent_id: null,
        label: 'Beranda',
        type: 'external_url',
        target_page_id: null,
        target_category_id: null,
        external_url: '/',
        order: 0,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: null,
        label: 'Profil',
        type: 'page',
        target_page_id: profil?.id || null,
        target_category_id: null,
        external_url: null,
        order: 1,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: null,
        label: 'Visi & Misi',
        type: 'page',
        target_page_id: visi?.id || null,
        target_category_id: null,
        external_url: null,
        order: 2,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: null,
        label: 'Pengumuman',
        type: 'post_category',
        target_page_id: null,
        target_category_id: pengumuman?.id || null,
        external_url: null,
        order: 3,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    const [units] = await queryInterface.sequelize.query(
      "SELECT id FROM units WHERE slug = 'akademik' LIMIT 1",
    );
    if (!units[0]) return;
    const unitId = units[0].id;
    await queryInterface.bulkDelete('menus', { unit_id: unitId });
    await queryInterface.bulkDelete('posts', { unit_id: unitId });
    await queryInterface.bulkDelete('post_categories', { unit_id: unitId });
    await queryInterface.bulkDelete('pages', { unit_id: unitId });
  },
};
