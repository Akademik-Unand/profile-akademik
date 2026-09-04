const express = require('express');
const menuController = require('../../controllers/menu.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const menuValidation = require('../../validations/menu.validation');

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /admin/menus:
 *   get:
 *     tags: [Admin Menus]
 *     summary: Daftar menu
 *     security: [{ cookieAuth: [] }]
 */
router.get('/', checkPermission('read', 'Menu'), validate(menuValidation.list), menuController.listAdmin);
router.post('/', checkPermission('create', 'Menu'), validate(menuValidation.create), menuController.create);
router.put('/reorder', checkPermission('read', 'Menu'), validate(menuValidation.reorder), menuController.reorder);
router.get('/:id', checkPermission('read', 'Menu'), validate(menuValidation.idParam), menuController.getById);
router.put('/:id', checkPermission('read', 'Menu'), validate(menuValidation.update), menuController.update);
router.delete('/:id', checkPermission('read', 'Menu'), validate(menuValidation.idParam), menuController.remove);

module.exports = router;
