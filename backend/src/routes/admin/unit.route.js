const express = require('express');
const unitController = require('../../controllers/unit.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const unitValidation = require('../../validations/unit.validation');

const router = express.Router();

router.use(authenticate);

/**
 * @openapi
 * /admin/units:
 *   get:
 *     tags: [Admin Units]
 *     summary: Daftar unit (admin, ter-scope CASL)
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: Daftar unit terpaginasi
 *   post:
 *     tags: [Admin Units]
 *     summary: Buat unit baru (superadmin)
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       201:
 *         description: Unit dibuat
 */
router.get('/', checkPermission('read', 'Unit'), validate(unitValidation.list), unitController.listAdmin);
router.post('/', checkPermission('create', 'Unit'), validate(unitValidation.create), unitController.create);

/**
 * @openapi
 * /admin/units/{id}:
 *   get:
 *     tags: [Admin Units]
 *     summary: Detail unit (admin)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detail unit
 *   put:
 *     tags: [Admin Units]
 *     summary: Perbarui unit, termasuk tautan media sosial
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Unit diperbarui
 *   delete:
 *     tags: [Admin Units]
 *     summary: Hapus unit (superadmin)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Unit dihapus
 */
router.get('/:id', checkPermission('read', 'Unit'), validate(unitValidation.idParam), unitController.getById);
router.put('/:id', checkPermission('update', 'Unit'), validate(unitValidation.update), unitController.update);
router.delete('/:id', checkPermission('delete', 'Unit'), validate(unitValidation.idParam), unitController.remove);

module.exports = router;
