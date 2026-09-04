const postService = require('../services/post.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const listAdmin = asyncHandler(async (req, res) => {
  const data = await postService.listAdmin(req.query, req.user);
  return success(res, { message: 'Daftar pengumuman', data });
});

const listPublic = asyncHandler(async (req, res) => {
  const data = await postService.listPublic(req.params.slug, req.query);
  return success(res, { message: 'Daftar pengumuman', data });
});

const getById = asyncHandler(async (req, res) => {
  const post = await postService.getById(Number(req.params.id), req.user);
  return success(res, { message: 'Detail pengumuman', data: { post } });
});

const getPublic = asyncHandler(async (req, res) => {
  const data = await postService.getPublicBySlug(req.params.slug, req.params.postSlug);
  return success(res, { message: 'Detail pengumuman', data });
});

const create = asyncHandler(async (req, res) => {
  const post = await postService.create(req.body, req.user);
  return success(res, { message: 'Pengumuman berhasil dibuat', statusCode: 201, data: { post } });
});

const update = asyncHandler(async (req, res) => {
  const post = await postService.update(Number(req.params.id), req.body, req.user);
  return success(res, { message: 'Pengumuman berhasil diperbarui', data: { post } });
});

const remove = asyncHandler(async (req, res) => {
  await postService.remove(Number(req.params.id), req.user);
  return success(res, { message: 'Pengumuman berhasil dihapus', data: null });
});

module.exports = { listAdmin, listPublic, getById, getPublic, create, update, remove };
