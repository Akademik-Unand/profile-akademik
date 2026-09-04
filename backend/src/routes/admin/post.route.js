const express = require('express');
const postController = require('../../controllers/post.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const postValidation = require('../../validations/post.validation');

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /admin/posts:
 *   get:
 *     tags: [Admin Posts]
 *     summary: Daftar pengumuman
 *     security: [{ cookieAuth: [] }]
 *   post:
 *     tags: [Admin Posts]
 *     summary: Buat pengumuman
 *     security: [{ cookieAuth: [] }]
 */
router.get('/', checkPermission('read', 'Post'), validate(postValidation.list), postController.listAdmin);
router.post('/', checkPermission('create', 'Post'), validate(postValidation.create), postController.create);
router.get('/:id', checkPermission('read', 'Post'), validate(postValidation.idParam), postController.getById);
router.put('/:id', checkPermission('read', 'Post'), validate(postValidation.update), postController.update);
router.delete('/:id', checkPermission('read', 'Post'), validate(postValidation.idParam), postController.remove);

module.exports = router;
