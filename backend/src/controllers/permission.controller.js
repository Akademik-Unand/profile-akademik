const permissionService = require('../services/permission.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const data = await permissionService.list(req.query);
  return success(res, { message: 'Daftar permission', data });
});

const matrix = asyncHandler(async (_req, res) => {
  const data = await permissionService.getMatrix();
  return success(res, { message: 'Matriks permission', data });
});

const syncRole = asyncHandler(async (req, res) => {
  const data = await permissionService.syncRole(req.params.role, req.body.permissionIds);
  return success(res, { message: 'Permission peran berhasil disimpan', data });
});

module.exports = { list, matrix, syncRole };
