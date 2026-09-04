const organizationMemberService = require('../services/organizationMember.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const listAdmin = asyncHandler(async (req, res) => {
  const data = await organizationMemberService.listAdmin(req.query, req.user);
  return success(res, { message: 'Daftar struktur organisasi', data });
});

const listPublic = asyncHandler(async (req, res) => {
  const data = await organizationMemberService.listPublic(req.params.slug);
  return success(res, { message: 'Struktur organisasi', data });
});

const getById = asyncHandler(async (req, res) => {
  const member = await organizationMemberService.getById(Number(req.params.id), req.user);
  return success(res, { message: 'Detail anggota', data: { member } });
});

const create = asyncHandler(async (req, res) => {
  const member = await organizationMemberService.create(req.body, req.user);
  return success(res, { message: 'Anggota organisasi berhasil dibuat', statusCode: 201, data: { member } });
});

const update = asyncHandler(async (req, res) => {
  const member = await organizationMemberService.update(Number(req.params.id), req.body, req.user);
  return success(res, { message: 'Anggota organisasi berhasil diperbarui', data: { member } });
});

const remove = asyncHandler(async (req, res) => {
  await organizationMemberService.remove(Number(req.params.id), req.user);
  return success(res, { message: 'Anggota organisasi berhasil dihapus', data: null });
});

module.exports = { listAdmin, listPublic, getById, create, update, remove };
