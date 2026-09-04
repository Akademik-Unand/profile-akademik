const express = require('express');
const organizationMemberController = require('../../controllers/organizationMember.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const organizationMemberValidation = require('../../validations/organizationMember.validation');

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /admin/organization-members:
 *   get:
 *     tags: [Admin Organization]
 *     summary: Daftar struktur organisasi
 *     security: [{ cookieAuth: [] }]
 *   post:
 *     tags: [Admin Organization]
 *     summary: Tambah anggota organisasi
 *     security: [{ cookieAuth: [] }]
 */
router.get(
  '/',
  checkPermission('read', 'OrganizationMember'),
  validate(organizationMemberValidation.list),
  organizationMemberController.listAdmin,
);
router.post(
  '/',
  checkPermission('create', 'OrganizationMember'),
  validate(organizationMemberValidation.create),
  organizationMemberController.create,
);
router.get(
  '/:id',
  checkPermission('read', 'OrganizationMember'),
  validate(organizationMemberValidation.idParam),
  organizationMemberController.getById,
);
router.put(
  '/:id',
  checkPermission('read', 'OrganizationMember'),
  validate(organizationMemberValidation.update),
  organizationMemberController.update,
);
router.delete(
  '/:id',
  checkPermission('read', 'OrganizationMember'),
  validate(organizationMemberValidation.idParam),
  organizationMemberController.remove,
);

module.exports = router;
