const express = require('express');
const landingController = require('../../controllers/landing.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const landingValidation = require('../../validations/landing.validation');

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /admin/landings:
 *   get:
 *     tags: [Admin Landings]
 *     summary: Daftar landing page
 *     security: [{ cookieAuth: [] }]
 *   put:
 *     tags: [Admin Landings]
 *     summary: Simpan landing page, termasuk slide, layanan, dan galeri
 *     security: [{ cookieAuth: [] }]
 */
router.get('/', checkPermission('read', 'Landing'), landingController.listAdmin);
router.get('/current', checkPermission('read', 'Landing'), validate(landingValidation.current), landingController.getCurrent);
router.put('/', checkPermission('read', 'Landing'), validate(landingValidation.upsert), landingController.upsert);

module.exports = router;
