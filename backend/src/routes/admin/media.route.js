const express = require('express');
const mediaController = require('../../controllers/media.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const { upload } = require('../../middlewares/upload');
const mediaValidation = require('../../validations/media.validation');

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /admin/media:
 *   get:
 *     tags: [Admin Media]
 *     summary: Daftar media
 *     security: [{ cookieAuth: [] }]
 *   post:
 *     tags: [Admin Media]
 *     summary: Unggah media
 *     security: [{ cookieAuth: [] }]
 */
router.get('/', checkPermission('read', 'Media'), validate(mediaValidation.list), mediaController.list);
router.post('/', checkPermission('create', 'Media'), upload.single('file'), mediaController.upload);
router.get('/folders', checkPermission('read', 'MediaFolder'), mediaController.listFolders);
router.post('/folders', checkPermission('create', 'MediaFolder'), validate(mediaValidation.createFolder), mediaController.createFolder);
router.delete('/folders/:id', checkPermission('delete', 'MediaFolder'), validate(mediaValidation.idParam), mediaController.removeFolder);
router.get('/:id', checkPermission('read', 'Media'), validate(mediaValidation.idParam), mediaController.getById);
router.put('/:id', checkPermission('read', 'Media'), validate(mediaValidation.update), mediaController.update);
router.delete('/:id', checkPermission('read', 'Media'), validate(mediaValidation.idParam), mediaController.remove);

module.exports = router;
