const { Permission, RolePermission } = require('../models');

async function listByRole(role) {
  if (!role || role === 'superadmin') return [];
  const grants = await RolePermission.findAll({
    where: { role },
    include: [{ model: Permission, as: 'permission' }],
  });
  return grants.map((row) => row.permission).filter(Boolean);
}

module.exports = { listByRole };
