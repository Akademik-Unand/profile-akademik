const agendaService = require('../services/agenda.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const listAdmin = asyncHandler(async (req, res) => {
  const data = await agendaService.listAdmin(req.query, req.user);
  return success(res, { message: 'Daftar agenda', data });
});

const listPublic = asyncHandler(async (req, res) => {
  const data = await agendaService.listPublic(req.params.slug, req.query);
  return success(res, { message: 'Daftar agenda', data });
});

const getById = asyncHandler(async (req, res) => {
  const agenda = await agendaService.getById(Number(req.params.id), req.user);
  return success(res, { message: 'Detail agenda', data: { agenda } });
});

const create = asyncHandler(async (req, res) => {
  const agenda = await agendaService.create(req.body, req.user);
  return success(res, { message: 'Agenda berhasil dibuat', statusCode: 201, data: { agenda } });
});

const update = asyncHandler(async (req, res) => {
  const agenda = await agendaService.update(Number(req.params.id), req.body, req.user);
  return success(res, { message: 'Agenda berhasil diperbarui', data: { agenda } });
});

const remove = asyncHandler(async (req, res) => {
  await agendaService.remove(Number(req.params.id), req.user);
  return success(res, { message: 'Agenda berhasil dihapus', data: null });
});

module.exports = { listAdmin, listPublic, getById, create, update, remove };
