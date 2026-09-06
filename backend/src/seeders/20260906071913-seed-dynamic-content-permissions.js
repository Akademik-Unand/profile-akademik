'use strict';
const { buildCatalog, isAdminUnitDefault } = require('../constants/permissions');
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const catalog = buildCatalog().filter((item) => ['content-type', 'content-entry'].includes(item.key));
    const [existing] = await queryInterface.sequelize.query("SELECT name FROM permissions WHERE name LIKE 'content-type.%' OR name LIKE 'content-entry.%'");
    const have = new Set(existing.map((row) => row.name));
    const rows = catalog.filter((item) => !have.has(item.name)).map(({ key, ...item }) => ({ ...item, created_at: now, updated_at: now }));
    if (rows.length) await queryInterface.bulkInsert('permissions', rows);
    const [permissions] = await queryInterface.sequelize.query("SELECT id, name FROM permissions WHERE name LIKE 'content-type.%' OR name LIKE 'content-entry.%'");
    const byName = Object.fromEntries(permissions.map((row) => [row.name, row.id]));
    const [existingGrants] = await queryInterface.sequelize.query("SELECT permission_id FROM role_permissions WHERE role = 'admin_unit'");
    const granted = new Set(existingGrants.map((row) => row.permission_id));
    const grants = catalog.filter(isAdminUnitDefault).map((item) => ({ role: 'admin_unit', permission_id: byName[item.name], created_at: now, updated_at: now })).filter((row) => row.permission_id && !granted.has(row.permission_id));
    if (grants.length) await queryInterface.bulkInsert('role_permissions', grants);
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query("DELETE FROM role_permissions WHERE permission_id IN (SELECT id FROM permissions WHERE name LIKE 'content-type.%' OR name LIKE 'content-entry.%')");
    await queryInterface.sequelize.query("DELETE FROM permissions WHERE name LIKE 'content-type.%' OR name LIKE 'content-entry.%'");
  },
};
