const express = require('express');
const permissionController = require('../../controllers/permission.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const permissionValidation = require('../../validations/permission.validation');

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /admin/permissions:
 *   get:
 *     tags: [Admin Permissions]
 *     summary: Katalog permission
 *     security: [{ cookieAuth: [] }]
 * /admin/permissions/matrix:
 *   get:
 *     tags: [Admin Permissions]
 *     summary: Matriks permission peran
 *     security: [{ cookieAuth: [] }]
 */
router.get('/', checkPermission('read', 'Permission'), validate(permissionValidation.list), permissionController.list);
router.get('/matrix', checkPermission('read', 'Permission'), permissionController.matrix);
router.put(
  '/roles/:role',
  checkPermission('sync-permissions', 'Role'),
  validate(permissionValidation.syncRole),
  permissionController.syncRole,
);

module.exports = router;
