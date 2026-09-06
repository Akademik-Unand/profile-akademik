const express = require('express');
const controller = require('../controllers/dynamicContent.controller');
const validate = require('../middlewares/validate');
const validation = require('../validations/dynamicContent.validation');
const router = express.Router({ mergeParams: true });
/**
 * @openapi
 * /units/{slug}/data/{key}:
 *   get:
 *     tags: [Dynamic Content]
 *     summary: Daftar entri publik untuk jenis data
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *       - { in: path, name: key, required: true, schema: { type: string } }
 */
router.get('/:key', validate(validation.publicList), controller.listPublic);
/**
 * @openapi
 * /units/{slug}/data/{key}/{entrySlug}:
 *   get:
 *     tags: [Dynamic Content]
 *     summary: Detail entri publik
 */
router.get('/:key/:entrySlug', validate(validation.publicDetail), controller.getPublic);
module.exports = router;
