const express = require('express');
const pageController = require('../../controllers/page.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const pageValidation = require('../../validations/page.validation');

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /admin/pages:
 *   get:
 *     tags: [Admin Pages]
 *     summary: Daftar halaman
 *     security: [{ cookieAuth: [] }]
 *   post:
 *     tags: [Admin Pages]
 *     summary: Buat halaman
 *     security: [{ cookieAuth: [] }]
 */
router.get('/', checkPermission('read', 'Page'), validate(pageValidation.list), pageController.listAdmin);
router.post('/', checkPermission('create', 'Page'), validate(pageValidation.create), pageController.create);
router.get('/:id', checkPermission('read', 'Page'), validate(pageValidation.idParam), pageController.getById);
router.put('/:id', checkPermission('read', 'Page'), validate(pageValidation.update), pageController.update);
router.delete('/:id', checkPermission('read', 'Page'), validate(pageValidation.idParam), pageController.remove);

module.exports = router;
