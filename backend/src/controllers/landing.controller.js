const landingService = require('../services/landing.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const getCurrent = asyncHandler(async (req, res) => {
  const landing = await landingService.getCurrent(req.query, req.user);
  return success(res, { message: 'Landing page', data: { landing } });
});

const listAdmin = asyncHandler(async (req, res) => {
  const data = await landingService.listAdmin(req.query, req.user);
  return success(res, { message: 'Daftar landing page', data });
});

const upsert = asyncHandler(async (req, res) => {
  const landing = await landingService.upsert(req.body, req.user);
  return success(res, { message: 'Landing page berhasil disimpan', data: { landing } });
});

module.exports = { getCurrent, listAdmin, upsert };
