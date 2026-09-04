const menuService = require('../services/menu.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const listAdmin = asyncHandler(async (req, res) => {
  const data = await menuService.listAdmin(req.query, req.user);
  return success(res, { message: 'Daftar menu', data });
});

const listPublic = asyncHandler(async (req, res) => {
  const data = await menuService.listPublic(req.params.slug, req.query);
  return success(res, { message: 'Menu unit', data });
});

const getById = asyncHandler(async (req, res) => {
  const menu = await menuService.getById(Number(req.params.id), req.user);
  return success(res, { message: 'Detail menu', data: { menu } });
});

const create = asyncHandler(async (req, res) => {
  const menu = await menuService.create(req.body, req.user);
  return success(res, { message: 'Menu berhasil dibuat', statusCode: 201, data: { menu } });
});

const update = asyncHandler(async (req, res) => {
  const menu = await menuService.update(Number(req.params.id), req.body, req.user);
  return success(res, { message: 'Menu berhasil diperbarui', data: { menu } });
});

const remove = asyncHandler(async (req, res) => {
  await menuService.remove(Number(req.params.id), req.user);
  return success(res, { message: 'Menu berhasil dihapus', data: null });
});

const reorder = asyncHandler(async (req, res) => {
  await menuService.reorder(req.body.items, req.user);
  return success(res, { message: 'Urutan menu berhasil disimpan', data: null });
});

module.exports = { listAdmin, listPublic, getById, create, update, remove, reorder };
