const userService = require('../services/user.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const data = await userService.list(req.query);
  return success(res, { message: 'Daftar pengguna', data });
});

const getById = asyncHandler(async (req, res) => {
  const user = await userService.getById(Number(req.params.id));
  return success(res, { message: 'Detail pengguna', data: { user } });
});

const create = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  return success(res, { message: 'Pengguna berhasil dibuat', statusCode: 201, data: { user } });
});

const update = asyncHandler(async (req, res) => {
  const user = await userService.update(Number(req.params.id), req.body, req.user);
  return success(res, { message: 'Pengguna berhasil diperbarui', data: { user } });
});

const remove = asyncHandler(async (req, res) => {
  await userService.remove(Number(req.params.id), req.user);
  return success(res, { message: 'Pengguna berhasil dihapus', data: null });
});

module.exports = { list, getById, create, update, remove };
