const postCategoryService = require('../services/postCategory.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const listAdmin = asyncHandler(async (req, res) => {
  const data = await postCategoryService.listAdmin(req.query, req.user);
  return success(res, { message: 'Daftar kategori', data });
});

const getById = asyncHandler(async (req, res) => {
  const category = await postCategoryService.getById(Number(req.params.id), req.user);
  return success(res, { message: 'Detail kategori', data: { category } });
});

const create = asyncHandler(async (req, res) => {
  const category = await postCategoryService.create(req.body, req.user);
  return success(res, { message: 'Kategori berhasil dibuat', statusCode: 201, data: { category } });
});

const update = asyncHandler(async (req, res) => {
  const category = await postCategoryService.update(Number(req.params.id), req.body, req.user);
  return success(res, { message: 'Kategori berhasil diperbarui', data: { category } });
});

const remove = asyncHandler(async (req, res) => {
  await postCategoryService.remove(Number(req.params.id), req.user);
  return success(res, { message: 'Kategori berhasil dihapus', data: null });
});

module.exports = { listAdmin, getById, create, update, remove };
