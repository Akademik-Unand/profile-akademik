'use strict';

const { buildCatalog, isAdminUnitDefault } = require('../constants/permissions');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const catalog = buildCatalog().map(({ key, ...rest }) => ({ ...rest, created_at: now, updated_at: now }));
    await queryInterface.bulkInsert('permissions', catalog);

    const [rows] = await queryInterface.sequelize.query('SELECT id, name FROM permissions');
    const byName = Object.fromEntries(rows.map((row) => [row.name, row.id]));
    const grants = buildCatalog()
      .filter(isAdminUnitDefault)
      .map((item) => ({
        role: 'admin_unit',
        permission_id: byName[item.name],
        created_at: now,
        updated_at: now,
      }))
      .filter((item) => item.permission_id);
    if (grants.length) await queryInterface.bulkInsert('role_permissions', grants);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
