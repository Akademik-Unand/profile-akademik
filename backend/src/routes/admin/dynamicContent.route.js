const express = require('express');
const controller = require('../../controllers/dynamicContent.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const validation = require('../../validations/dynamicContent.validation');
const router = express.Router();
router.use(authenticate);
/**
 * @openapi
 * /admin/content-types:
 *   get:
 *     tags: [Dynamic Content]
 *     summary: Daftar jenis data situs
 *     security: [{ cookieAuth: [] }]
 *   post:
 *     tags: [Dynamic Content]
 *     summary: Buat jenis data beserta draft schema pertama
 *     security: [{ cookieAuth: [] }]
 */
router.get('/', checkPermission('read', 'ContentType'), validate(validation.list), controller.listTypes);
router.post('/', checkPermission('create', 'ContentType'), validate(validation.createType), controller.createType);
router.get('/:id', checkPermission('read', 'ContentType'), validate(validation.typeId), controller.getType);
router.put('/:id', checkPermission('update', 'ContentType'), validate(validation.updateType), controller.updateType);
router.post('/:id/versions', checkPermission('update', 'ContentType'), validate(validation.createVersion), controller.createVersion);
router.post('/:id/versions/:version/publish', checkPermission('update', 'ContentType'), validate(validation.publishVersion), controller.publishVersion);
/**
 * @openapi
 * /admin/content-types/{typeId}/entries:
 *   get:
 *     tags: [Dynamic Content]
 *     summary: Daftar entri jenis data
 *     security: [{ cookieAuth: [] }]
 *   post:
 *     tags: [Dynamic Content]
 *     summary: Buat entri tervalidasi schema aktif
 *     security: [{ cookieAuth: [] }]
 */
router.get('/:typeId/entries', checkPermission('read', 'ContentEntry'), validate({ params: validation.createEntry.params, query: validation.list.query }), controller.listEntries);
router.post('/:typeId/entries', checkPermission('create', 'ContentEntry'), validate(validation.createEntry), controller.createEntry);
router.get('/:typeId/entries/:id', checkPermission('read', 'ContentEntry'), validate(validation.typeEntryId), controller.getEntry);
router.put('/:typeId/entries/:id', checkPermission('update', 'ContentEntry'), validate(validation.updateEntry), controller.updateEntry);
router.delete('/:typeId/entries/:id', checkPermission('delete', 'ContentEntry'), validate(validation.typeEntryId), controller.removeEntry);
module.exports = router;
