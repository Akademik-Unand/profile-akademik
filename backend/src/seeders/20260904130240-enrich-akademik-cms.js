'use strict';

const now = new Date();

function html(paragraphs) {
  return paragraphs.map((text) => `<p>${text}</p>`).join('');
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [units] = await queryInterface.sequelize.query(
      "SELECT id FROM units WHERE slug = 'akademik' LIMIT 1",
    );
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@unand.ac.id' LIMIT 1",
    );
    if (!units[0] || !users[0]) return;

    const unitId = units[0].id;
    const userId = users[0].id;

    await queryInterface.bulkUpdate(
      'units',
      {
        theme_color: '#108652',
        address:
          'Lantai Dasar Gedung Rektorat Kampus Universitas Andalas, Jl. Dr. Mohammad Hatta, Limau Manis, Padang, Sumatera Barat, Indonesia',
        phone: '+62-751-71301',
        fax: '+62-751-71301',
        email: 'sekre.wr1@adm.unand.ac.id',
        description:
          'Bidang Akademik Universitas Andalas mengelola pendidikan, kurikulum, kalender akademik, dan layanan kemahasiswaan akademik.',
        updated_at: now,
      },
      { id: unitId },
    );

    await queryInterface.sequelize.query('UPDATE menus SET parent_id = NULL WHERE unit_id = ?', {
      replacements: [unitId],
    });
    await queryInterface.bulkDelete('menus', { unit_id: unitId });
    await queryInterface.bulkDelete('posts', { unit_id: unitId });
    await queryInterface.sequelize.query('UPDATE organization_members SET parent_id = NULL WHERE unit_id = ?', {
      replacements: [unitId],
    });
    await queryInterface.bulkDelete('organization_members', { unit_id: unitId });
    await queryInterface.bulkDelete('agendas', { unit_id: unitId });
    await queryInterface.bulkDelete('post_categories', { unit_id: unitId });
    await queryInterface.bulkDelete('pages', { unit_id: unitId });
    await queryInterface.sequelize.query(
      "DELETE FROM media WHERE unit_id = ? AND filename LIKE 'unsplash-%'",
      { replacements: [unitId] },
    );

    const covers = [
      {
        filename: 'unsplash-kampus.jpg',
        url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
        alt: 'Kampus universitas',
      },
      {
        filename: 'unsplash-mahasiswa.jpg',
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
        alt: 'Mahasiswa di kampus',
      },
      {
        filename: 'unsplash-kuliah.jpg',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
        alt: 'Ruang kuliah',
      },
      {
        filename: 'unsplash-buku.jpg',
        url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80',
        alt: 'Buku akademik',
      },
      {
        filename: 'unsplash-wisuda.jpg',
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
        alt: 'Wisuda',
      },
      {
        filename: 'unsplash-belajar.jpg',
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80',
        alt: 'Mahasiswa belajar',
      },
      {
        filename: 'unsplash-rapat.jpg',
        url: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80',
        alt: 'Kegiatan akademik',
      },
      {
        filename: 'unsplash-dokumen.jpg',
        url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
        alt: 'Dokumen akademik',
      },
      {
        filename: 'unsplash-pimpinan.jpg',
        url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
        alt: 'Potret pimpinan',
      },
      {
        filename: 'unsplash-direktur.jpg',
        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        alt: 'Potret direktur',
      },
      {
        filename: 'unsplash-kasubdit.jpg',
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
        alt: 'Potret kasubdit',
      },
    ];

    await queryInterface.bulkInsert(
      'media',
      covers.map((item) => ({
        unit_id: unitId,
        folder_id: null,
        filename: item.filename,
        url: item.url,
        thumbnail_url: item.url,
        mime_type: 'image/jpeg',
        size_bytes: 0,
        width: 1600,
        height: 900,
        alt_text: item.alt,
        uploaded_by: userId,
        created_at: now,
        updated_at: now,
      })),
    );

    const [mediaRows] = await queryInterface.sequelize.query(
      `SELECT id, filename FROM media WHERE unit_id = ${unitId}`,
    );
    const mediaByFile = Object.fromEntries(mediaRows.map((row) => [row.filename, row.id]));

    await queryInterface.bulkInsert('pages', [
      {
        unit_id: unitId,
        slug: 'profil',
        title: 'Profil Bidang Akademik',
        content: html([
          'Bidang Akademik Universitas Andalas merupakan unit kerja di bawah Wakil Rektor I yang mengoordinasikan penyelenggaraan pendidikan, kurikulum, dan layanan kemahasiswaan akademik.',
          'Portal ini menyediakan informasi resmi tentang pengumuman, surat edaran, kalender akademik, tata cara pembayaran UKT, serta tautan ke SIMA UNAND.',
          'Alamat layanan: Lantai Dasar Gedung Rektorat, Kampus Universitas Andalas, Limau Manis, Padang.',
        ]),
        status: 'published',
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        slug: 'tupoksi',
        title: 'Tugas Pokok dan Fungsi',
        content: html([
          'Bidang Akademik bertugas merumuskan dan mengoordinasikan kebijakan pendidikan, pembelajaran, dan administrasi akademik di lingkungan Universitas Andalas.',
          'Fungsi utama meliputi pengelolaan kalender akademik, layanan registrasi dan wisuda, pendataan mahasiswa, serta fasilitasi akreditasi program studi.',
          'Pelaksanaan tugas dilakukan bersama fakultas, program studi, dan unit pendukung seperti UPT TIK serta Direktorat Pendidikan dan Pembelajaran.',
        ]),
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
        content: html([
          'Visi: mewujudkan layanan akademik yang transparan, andal, dan berorientasi pada mutu pendidikan tinggi.',
          'Misi: menyediakan informasi akademik yang mudah diakses; menjamin proses registrasi, perkuliahan, dan wisuda berjalan tertib; serta mendukung penjaminan mutu pendidikan.',
          'Nilai kerja: integritas, pelayanan publik, dan kolaborasi antarunit.',
        ]),
        status: 'published',
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        slug: 'struktur-organisasi',
        title: 'Struktur Organisasi',
        content: html([
          'Struktur organisasi Bidang Akademik mengikuti susunan kelembagaan Universitas Andalas di bawah Wakil Rektor I Bidang Akademik.',
          'Halaman ini merangkum pejabat dan unit pelaksana. Daftar lengkap pimpinan ditampilkan pada laman Struktur Organisasi.',
        ]),
        status: 'published',
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        slug: 'akreditasi',
        title: 'Akreditasi',
        content: html([
          'Universitas Andalas mengelola informasi akreditasi institusi dan program studi, termasuk akreditasi unggul dan pengakuan internasional.',
          'Informasi rinci program studi dapat dilihat melalui laman resmi fakultas dan pangkalan data pendidikan tinggi.',
        ]),
        status: 'published',
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        slug: 'kalender-akademik',
        title: 'Kalender Akademik',
        content: html([
          'Kalender akademik mengatur masa registrasi, perkuliahan, ujian, dan wisuda untuk setiap tahun akademik.',
          'Untuk Tahun Akademik 2026/2027, masa kuliah dan praktikum semester ganjil berlangsung 18 Agustus sampai 4 Desember 2026.',
          'Dokumen kalender resmi diunggah pada galeri dokumen dan diumumkan melalui laman pengumuman.',
        ]),
        status: 'published',
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        slug: 'tata-cara-ukt',
        title: 'Tata Cara Pembayaran UKT',
        content: html([
          'Pembayaran UKT/SPP/PI mahasiswa Universitas Andalas dilakukan melalui kanal yang ditetapkan rektorat dan bank mitra.',
          'Mahasiswa wajib menyelesaikan pembayaran sesuai jadwal pada kalender akademik sebelum registrasi ulang atau pengisian KRS.',
          'Petunjuk teknis tersedia pada portal SIMA dan pengumuman resmi Bidang Akademik.',
        ]),
        status: 'published',
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        slug: 'produk-hukum',
        title: 'Produk Hukum',
        content: html([
          'Produk hukum akademik mencakup peraturan rektor, surat keputusan, dan pedoman operasional standar (POS) pendataan mahasiswa.',
          'Dokumen POS meliputi profil mahasiswa, KRS, KHS, aktivitas kuliah mahasiswa, dan status keluar-lulus.',
        ]),
        status: 'published',
        created_by: userId,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('post_categories', [
      { unit_id: unitId, name: 'Berita', slug: 'berita', created_at: now, updated_at: now },
      { unit_id: unitId, name: 'Pengumuman', slug: 'pengumuman', created_at: now, updated_at: now },
      { unit_id: unitId, name: 'Surat Edaran', slug: 'surat-edaran', created_at: now, updated_at: now },
      { unit_id: unitId, name: 'Beasiswa', slug: 'beasiswa', created_at: now, updated_at: now },
    ]);

    const [pages] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM pages WHERE unit_id = ${unitId}`,
    );
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM post_categories WHERE unit_id = ${unitId}`,
    );
    const pageId = (slug) => pages.find((item) => item.slug === slug)?.id || null;
    const catId = (slug) => categories.find((item) => item.slug === slug)?.id || null;

    const posts = [
      {
        slug: 'kalender-akademik-semester-gasal',
        title: 'Kalender akademik semester gasal tersedia',
        excerpt: 'Unduh kalender akademik terbaru untuk perencanaan perkuliahan dan ujian.',
        category: 'pengumuman',
        cover: 'unsplash-kampus.jpg',
        featured: true,
        daysAgo: 2,
      },
      {
        slug: 'hasil-seleksi-smmptn-barat-2026',
        title: 'Pengumuman hasil seleksi SMMPTN Barat 2026',
        excerpt: 'Peserta yang lulus SMMPTN Barat dapat melihat tahapan registrasi mahasiswa baru.',
        category: 'pengumuman',
        cover: 'unsplash-wisuda.jpg',
        featured: true,
        daysAgo: 40,
      },
      {
        slug: 'registrasi-sima-disabilitas-2026',
        title: 'Tata cara registrasi mahasiswa baru lulus SIMA Disabilitas 2026',
        excerpt: 'Panduan registrasi bagi peserta yang dinyatakan lulus SIMA UNAND penyandang disabilitas.',
        category: 'surat-edaran',
        cover: 'unsplash-mahasiswa.jpg',
        featured: true,
        daysAgo: 5,
      },
      {
        slug: 'layanan-bss-semester-ganjil',
        title: 'Layanan BSS semester ganjil tahun akademik 2026/2027',
        excerpt: 'Jadwal dan ketentuan layanan Bantuan Studi Semester bagi mahasiswa.',
        category: 'surat-edaran',
        cover: 'unsplash-dokumen.jpg',
        featured: false,
        daysAgo: 12,
      },
      {
        slug: 'pendaftaran-ulang-mahasiswa-lama',
        title: 'Pendaftaran ulang mahasiswa lama 2026/2027',
        excerpt: 'Mahasiswa lama wajib menyelesaikan registrasi ulang sesuai kalender akademik.',
        category: 'surat-edaran',
        cover: 'unsplash-kuliah.jpg',
        featured: false,
        daysAgo: 20,
      },
      {
        slug: 'dies-natalis-unand-riset-masyarakat',
        title: 'Dies Natalis UNAND hadirkan riset dan layanan untuk masyarakat',
        excerpt: 'Rangkaian dies natalis menampilkan kontribusi riset dan pengabdian Universitas Andalas.',
        category: 'berita',
        cover: 'unsplash-rapat.jpg',
        featured: false,
        daysAgo: 8,
      },
      {
        slug: 'lemhannas-goes-to-campus',
        title: 'Lemhannas Goes to Campus di UNAND',
        excerpt: 'Program penguatan ketahanan nasional dan peran generasi muda di kampus Limau Manis.',
        category: 'berita',
        cover: 'unsplash-belajar.jpg',
        featured: false,
        daysAgo: 1,
      },
      {
        slug: 'beasiswa-unggulan-semester-gasal',
        title: 'Pendaftaran beasiswa unggulan semester gasal',
        excerpt: 'Mahasiswa dapat mengajukan beasiswa sesuai kuota dan persyaratan yang diumumkan.',
        category: 'beasiswa',
        cover: 'unsplash-buku.jpg',
        featured: false,
        daysAgo: 15,
      },
      {
        slug: 'prosedur-registrasi-mahasiswa-baru',
        title: 'Prosedur registrasi mahasiswa baru melalui SIMA',
        excerpt: 'Mahasiswa baru wajib menyelesaikan registrasi melalui SIMA sesuai jadwal resmi.',
        category: 'pengumuman',
        cover: 'unsplash-mahasiswa.jpg',
        featured: false,
        daysAgo: 25,
      },
    ];

    await queryInterface.bulkInsert(
      'posts',
      posts.map((item) => {
        const published = new Date(now);
        published.setDate(published.getDate() - item.daysAgo);
        return {
          unit_id: unitId,
          category_id: catId(item.category),
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: html([item.excerpt, 'Informasi lengkap mengikuti ketentuan resmi Bidang Akademik Universitas Andalas.']),
          status: 'published',
          cover_media_id: mediaByFile[item.cover] || null,
          is_featured: item.featured,
          created_by: userId,
          published_at: published,
          created_at: now,
          updated_at: now,
        };
      }),
    );

    await queryInterface.bulkInsert('organization_members', [
      {
        unit_id: unitId,
        name: 'Prof. Dr. (contoh) Wakil Rektor I',
        title: 'Wakil Rektor I Bidang Akademik',
        photo_media_id: mediaByFile['unsplash-pimpinan.jpg'] || null,
        parent_id: null,
        order: 0,
        created_at: now,
        updated_at: now,
      },
    ]);
    const [leaders] = await queryInterface.sequelize.query(
      `SELECT id FROM organization_members WHERE unit_id = ${unitId} AND parent_id IS NULL LIMIT 1`,
    );
    const parentId = leaders[0]?.id || null;
    await queryInterface.bulkInsert('organization_members', [
      {
        unit_id: unitId,
        name: 'Direktur Pendidikan dan Pembelajaran',
        title: 'Direktur',
        photo_media_id: mediaByFile['unsplash-direktur.jpg'] || null,
        parent_id: parentId,
        order: 1,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        name: 'Kasubdit Administrasi Akademik',
        title: 'Kepala Subdirektorat',
        photo_media_id: mediaByFile['unsplash-kasubdit.jpg'] || null,
        parent_id: parentId,
        order: 2,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('agendas', [
      {
        unit_id: unitId,
        title: 'Masa Kuliah dan Praktikum Semester Ganjil',
        slug: 'masa-kuliah-praktikum-ganjil',
        starts_at: new Date('2026-08-18T01:00:00Z'),
        ends_at: new Date('2026-12-04T10:00:00Z'),
        time_text: 'Pukul 08.00 - selesai',
        location: 'Universitas Andalas',
        description: 'Masa kuliah dan praktikum semester ganjil Tahun Akademik 2026/2027.',
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        title: 'Anugerah Alumni Inspiratif Universitas Andalas 2026',
        slug: 'anugerah-alumni-inspiratif-2026',
        starts_at: new Date('2026-09-20T01:00:00Z'),
        ends_at: null,
        time_text: 'Pukul 09.00 WIB',
        location: 'Gedung Rektorat UNAND',
        description: 'Penghargaan bagi alumni yang berkontribusi bagi almamater dan masyarakat.',
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        title: 'Layanan BSS Semester Ganjil',
        slug: 'layanan-bss-ganjil',
        starts_at: new Date('2026-09-01T01:00:00Z'),
        ends_at: new Date('2026-09-30T10:00:00Z'),
        time_text: 'Hari kerja 08.00 - 16.00',
        location: 'Bagian Akademik, Gedung Rektorat',
        description: 'Layanan Bantuan Studi Semester bagi mahasiswa yang memenuhi syarat.',
        status: 'published',
        created_at: now,
        updated_at: now,
      },
    ]);

    const headerParents = [
      { label: 'Beranda', type: 'external_url', external_url: '/', order: 0 },
      { label: 'Profil', type: 'external_url', external_url: '/halaman/profil', order: 1 },
      { label: 'Berita', type: 'post_category', target_category_id: catId('berita'), order: 2 },
      { label: 'Layanan', type: 'external_url', external_url: '/halaman/kalender-akademik', order: 3 },
      { label: 'Akreditasi', type: 'page', target_page_id: pageId('akreditasi'), order: 4 },
    ];

    await queryInterface.bulkInsert(
      'menus',
      headerParents.map((item) => ({
        unit_id: unitId,
        parent_id: null,
        label: item.label,
        type: item.type,
        target_page_id: item.target_page_id || null,
        target_category_id: item.target_category_id || null,
        external_url: item.external_url || null,
        location: 'header',
        order: item.order,
        created_at: now,
        updated_at: now,
      })),
    );

    const [headerRows] = await queryInterface.sequelize.query(
      `SELECT id, label FROM menus WHERE unit_id = ${unitId} AND location = 'header' AND parent_id IS NULL`,
    );
    const headerId = (label) => headerRows.find((item) => item.label === label)?.id || null;

    await queryInterface.bulkInsert('menus', [
      {
        unit_id: unitId,
        parent_id: headerId('Profil'),
        label: 'Tugas Pokok & Fungsi',
        type: 'page',
        target_page_id: pageId('tupoksi'),
        target_category_id: null,
        external_url: null,
        location: 'header',
        order: 0,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: headerId('Profil'),
        label: 'Visi & Misi',
        type: 'page',
        target_page_id: pageId('visi-misi'),
        target_category_id: null,
        external_url: null,
        location: 'header',
        order: 1,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: headerId('Profil'),
        label: 'Struktur Organisasi',
        type: 'external_url',
        target_page_id: null,
        target_category_id: null,
        external_url: '/organisasi',
        location: 'header',
        order: 2,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: headerId('Berita'),
        label: 'Surat Edaran',
        type: 'post_category',
        target_page_id: null,
        target_category_id: catId('surat-edaran'),
        external_url: null,
        location: 'header',
        order: 0,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: headerId('Berita'),
        label: 'Berita',
        type: 'post_category',
        target_page_id: null,
        target_category_id: catId('berita'),
        external_url: null,
        location: 'header',
        order: 1,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: headerId('Berita'),
        label: 'Pengumuman',
        type: 'post_category',
        target_page_id: null,
        target_category_id: catId('pengumuman'),
        external_url: null,
        location: 'header',
        order: 2,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: headerId('Berita'),
        label: 'Beasiswa',
        type: 'post_category',
        target_page_id: null,
        target_category_id: catId('beasiswa'),
        external_url: null,
        location: 'header',
        order: 3,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: headerId('Layanan'),
        label: 'Kalender Akademik',
        type: 'page',
        target_page_id: pageId('kalender-akademik'),
        target_category_id: null,
        external_url: null,
        location: 'header',
        order: 0,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: headerId('Layanan'),
        label: 'Tata Cara UKT',
        type: 'page',
        target_page_id: pageId('tata-cara-ukt'),
        target_category_id: null,
        external_url: null,
        location: 'header',
        order: 1,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: headerId('Layanan'),
        label: 'SIMA UNAND',
        type: 'external_url',
        target_page_id: null,
        target_category_id: null,
        external_url: 'https://sima.unand.ac.id',
        location: 'header',
        order: 2,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('menus', [
      {
        unit_id: unitId,
        parent_id: null,
        label: 'SIMA',
        type: 'external_url',
        target_page_id: null,
        target_category_id: null,
        external_url: 'https://sima.unand.ac.id',
        location: 'footer',
        order: 0,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: null,
        label: 'iLearn',
        type: 'external_url',
        target_page_id: null,
        target_category_id: null,
        external_url: 'https://ilearn.unand.ac.id',
        location: 'footer',
        order: 1,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: null,
        label: 'Forlap DIKTI',
        type: 'external_url',
        target_page_id: null,
        target_category_id: null,
        external_url: 'https://pddikti.kemdiktisaintek.go.id/',
        location: 'footer',
        order: 2,
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: unitId,
        parent_id: null,
        label: 'Kalender Akademik',
        type: 'page',
        target_page_id: pageId('kalender-akademik'),
        target_category_id: null,
        external_url: null,
        location: 'footer',
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
    await queryInterface.sequelize.query('UPDATE menus SET parent_id = NULL WHERE unit_id = ?', {
      replacements: [unitId],
    });
    await queryInterface.bulkDelete('menus', { unit_id: unitId });
    await queryInterface.bulkDelete('posts', { unit_id: unitId });
    await queryInterface.sequelize.query('UPDATE organization_members SET parent_id = NULL WHERE unit_id = ?', {
      replacements: [unitId],
    });
    await queryInterface.bulkDelete('organization_members', { unit_id: unitId });
    await queryInterface.bulkDelete('agendas', { unit_id: unitId });
    await queryInterface.bulkDelete('post_categories', { unit_id: unitId });
    await queryInterface.bulkDelete('pages', { unit_id: unitId });
  },
};
