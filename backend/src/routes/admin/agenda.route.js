const express = require('express');
const agendaController = require('../../controllers/agenda.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const checkPermission = require('../../middlewares/checkPermission');
const agendaValidation = require('../../validations/agenda.validation');

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /admin/agendas:
 *   get:
 *     tags: [Admin Agendas]
 *     summary: Daftar agenda
 *     security: [{ cookieAuth: [] }]
 *   post:
 *     tags: [Admin Agendas]
 *     summary: Buat agenda
 *     security: [{ cookieAuth: [] }]
 */
router.get('/', checkPermission('read', 'Agenda'), validate(agendaValidation.list), agendaController.listAdmin);
router.post('/', checkPermission('create', 'Agenda'), validate(agendaValidation.create), agendaController.create);
router.get('/:id', checkPermission('read', 'Agenda'), validate(agendaValidation.idParam), agendaController.getById);
router.put('/:id', checkPermission('read', 'Agenda'), validate(agendaValidation.update), agendaController.update);
router.delete('/:id', checkPermission('read', 'Agenda'), validate(agendaValidation.idParam), agendaController.remove);

module.exports = router;
