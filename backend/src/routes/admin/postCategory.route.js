const express = require('express');
const postCategoryController = require('../../controllers/postCategory.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const postCategoryValidation = require('../../validations/postCategory.validation');

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /admin/post-categories:
 *   get:
 *     tags: [Admin Post Categories]
 *     summary: Daftar kategori pengumuman
 *     security: [{ cookieAuth: [] }]
 */
router.get('/', checkPermission('read', 'PostCategory'), validate(postCategoryValidation.list), postCategoryController.listAdmin);
router.post('/', checkPermission('create', 'PostCategory'), validate(postCategoryValidation.create), postCategoryController.create);
router.get('/:id', checkPermission('read', 'PostCategory'), validate(postCategoryValidation.idParam), postCategoryController.getById);
router.put('/:id', checkPermission('read', 'PostCategory'), validate(postCategoryValidation.update), postCategoryController.update);
router.delete('/:id', checkPermission('read', 'PostCategory'), validate(postCategoryValidation.idParam), postCategoryController.remove);

module.exports = router;
