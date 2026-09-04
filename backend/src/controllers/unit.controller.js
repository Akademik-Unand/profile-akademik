const unitService = require('../services/unit.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const listPublic = asyncHandler(async (req, res) => {
  const data = await unitService.listPublic(req.query);
  return success(res, { message: 'Daftar unit', data });
});

const getBySlug = asyncHandler(async (req, res) => {
  const unit = await unitService.getBySlug(req.params.slug);
  return success(res, { message: 'Detail unit', data: { unit } });
});

const listAdmin = asyncHandler(async (req, res) => {
  const data = await unitService.listAdmin(req.query, req.user);
  return success(res, { message: 'Daftar unit', data });
});

const getById = asyncHandler(async (req, res) => {
  const unit = await unitService.getById(Number(req.params.id), req.user);
  return success(res, { message: 'Detail unit', data: { unit } });
});

const create = asyncHandler(async (req, res) => {
  const unit = await unitService.create(req.body);
  return success(res, { message: 'Unit berhasil dibuat', statusCode: 201, data: { unit } });
});

const update = asyncHandler(async (req, res) => {
  const unit = await unitService.update(Number(req.params.id), req.body, req.user);
  return success(res, { message: 'Unit berhasil diperbarui', data: { unit } });
});

const remove = asyncHandler(async (req, res) => {
  await unitService.remove(Number(req.params.id));
  return success(res, { message: 'Unit berhasil dihapus', data: null });
});

module.exports = {
  listPublic,
  getBySlug,
  listAdmin,
  getById,
  create,
  update,
  remove,
};
