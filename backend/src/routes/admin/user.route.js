const express = require('express');
const userController = require('../../controllers/user.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const userValidation = require('../../validations/user.validation');

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin Users]
 *     summary: Daftar pengguna
 *     security: [{ cookieAuth: [] }]
 *   post:
 *     tags: [Admin Users]
 *     summary: Buat pengguna
 *     security: [{ cookieAuth: [] }]
 */
router.get('/', checkPermission('read', 'User'), validate(userValidation.list), userController.list);
router.post('/', checkPermission('create', 'User'), validate(userValidation.create), userController.create);
router.get('/:id', checkPermission('read', 'User'), validate(userValidation.idParam), userController.getById);
router.put('/:id', checkPermission('update', 'User'), validate(userValidation.update), userController.update);
router.delete('/:id', checkPermission('delete', 'User'), validate(userValidation.idParam), userController.remove);

module.exports = router;
