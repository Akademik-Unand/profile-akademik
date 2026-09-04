const mediaService = require('../services/media.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const data = await mediaService.listAdmin(req.query, req.user);
  return success(res, { message: 'Daftar media', data });
});

const listFolders = asyncHandler(async (req, res) => {
  const data = await mediaService.listFolders(req.query, req.user);
  return success(res, { message: 'Daftar folder media', data });
});

const getById = asyncHandler(async (req, res) => {
  const media = await mediaService.getById(Number(req.params.id), req.user);
  return success(res, { message: 'Detail media', data: { media } });
});

const upload = asyncHandler(async (req, res) => {
  const media = await mediaService.createFromUpload(req.file, req.body, req.user);
  return success(res, { message: 'Media berhasil diunggah', statusCode: 201, data: { media } });
});

const createFolder = asyncHandler(async (req, res) => {
  const folder = await mediaService.createFolder(req.body, req.user);
  return success(res, { message: 'Folder berhasil dibuat', statusCode: 201, data: { folder } });
});

const update = asyncHandler(async (req, res) => {
  const media = await mediaService.update(Number(req.params.id), req.body, req.user);
  return success(res, { message: 'Media berhasil diperbarui', data: { media } });
});

const remove = asyncHandler(async (req, res) => {
  await mediaService.remove(Number(req.params.id), req.user);
  return success(res, { message: 'Media berhasil dihapus', data: null });
});

const removeFolder = asyncHandler(async (req, res) => {
  await mediaService.removeFolder(Number(req.params.id), req.user);
  return success(res, { message: 'Folder berhasil dihapus', data: null });
});

module.exports = { list, listFolders, getById, upload, createFolder, update, remove, removeFolder };
