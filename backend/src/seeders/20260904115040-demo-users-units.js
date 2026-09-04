'use strict';

const { hashPassword } = require('../utils/auth');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await hashPassword(process.env.SEED_ADMIN_PASSWORD || 'Admin123!');

    await queryInterface.bulkInsert('users', [
      {
        name: 'Superadmin',
        email: 'admin@unand.ac.id',
        password_hash: passwordHash,
        role: 'superadmin',
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Admin Perpustakaan',
        email: 'perpustakaan@unand.ac.id',
        password_hash: passwordHash,
        role: 'admin_unit',
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('units', [
      {
        slug: 'akademik',
        name: 'Bidang Akademik',
        theme_color: '#166534',
        custom_css: null,
        template_key: 'classic',
        is_active: true,
        is_default: true,
        created_at: now,
        updated_at: now,
      },
      {
        slug: 'perpustakaan',
        name: 'Perpustakaan',
        theme_color: '#1e3a8a',
        custom_css: null,
        template_key: 'classic',
        is_active: true,
        is_default: false,
        created_at: now,
        updated_at: now,
      },
      {
        slug: 'upt-pdk',
        name: 'UPT Pengembangan Pembelajaran dan Penjaminan Mutu',
        theme_color: '#9a3412',
        custom_css: null,
        template_key: 'classic',
        is_active: true,
        is_default: false,
        created_at: now,
        updated_at: now,
      },
    ]);

    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'perpustakaan@unand.ac.id' LIMIT 1",
    );
    const [units] = await queryInterface.sequelize.query(
      "SELECT id FROM units WHERE slug = 'perpustakaan' LIMIT 1",
    );

    if (users[0] && units[0]) {
      await queryInterface.bulkInsert('user_units', [
        {
          user_id: users[0].id,
          unit_id: units[0].id,
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_units', null, {});
    await queryInterface.bulkDelete('units', {
      slug: ['akademik', 'perpustakaan', 'upt-pdk'],
    });
    await queryInterface.bulkDelete('users', {
      email: ['admin@unand.ac.id', 'perpustakaan@unand.ac.id'],
    });
  },
};
