'use strict';

const { buildCatalog, isAdminUnitDefault } = require('../constants/permissions');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const catalog = buildCatalog().filter((item) => item.key === 'landing');
    const [existing] = await queryInterface.sequelize.query(
      "SELECT name FROM permissions WHERE name LIKE 'landing.%'",
    );
    const have = new Set(existing.map((row) => row.name));
    const toInsert = catalog
      .filter((item) => !have.has(item.name))
      .map(({ key, ...rest }) => ({ ...rest, created_at: now, updated_at: now }));
    if (toInsert.length) await queryInterface.bulkInsert('permissions', toInsert);

    const [rows] = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions WHERE name LIKE 'landing.%'",
    );
    const byName = Object.fromEntries(rows.map((row) => [row.name, row.id]));
    const [grants] = await queryInterface.sequelize.query(
      "SELECT permission_id FROM role_permissions WHERE role = 'admin_unit'",
    );
    const granted = new Set(grants.map((row) => row.permission_id));
    const nextGrants = catalog
      .filter(isAdminUnitDefault)
      .map((item) => ({
        role: 'admin_unit',
        permission_id: byName[item.name],
        created_at: now,
        updated_at: now,
      }))
      .filter((item) => item.permission_id && !granted.has(item.permission_id));
    if (nextGrants.length) await queryInterface.bulkInsert('role_permissions', nextGrants);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query("DELETE FROM role_permissions WHERE permission_id IN (SELECT id FROM permissions WHERE name LIKE 'landing.%')");
    await queryInterface.bulkDelete('permissions', { name: ['landing.read', 'landing.create', 'landing.update', 'landing.delete'] });
  },
};
