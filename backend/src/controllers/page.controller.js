const pageService = require('../services/page.service');
const { withBuilderFallback } = require('../helpers/builderDocument');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const listAdmin = asyncHandler(async (req, res) => {
  const data = await pageService.listAdmin(req.query, req.user);
  return success(res, { message: 'Daftar halaman', data });
});

const getById = asyncHandler(async (req, res) => {
  const page = await pageService.getById(Number(req.params.id), req.user);
  return success(res, { message: 'Detail halaman', data: { page: withBuilderFallback(page) } });
});

const getPublic = asyncHandler(async (req, res) => {
  const data = await pageService.getPublicBySlug(req.params.slug, req.params.pageSlug);
  return success(res, { message: 'Detail halaman', data });
});

const create = asyncHandler(async (req, res) => {
  const page = await pageService.create(req.body, req.user);
  return success(res, { message: 'Halaman berhasil dibuat', statusCode: 201, data: { page: withBuilderFallback(page) } });
});

const update = asyncHandler(async (req, res) => {
  const page = await pageService.update(Number(req.params.id), req.body, req.user);
  return success(res, { message: 'Halaman berhasil diperbarui', data: { page } });
});

const remove = asyncHandler(async (req, res) => {
  await pageService.remove(Number(req.params.id), req.user);
  return success(res, { message: 'Halaman berhasil dihapus', data: null });
});

module.exports = { listAdmin, getById, getPublic, create, update, remove };
