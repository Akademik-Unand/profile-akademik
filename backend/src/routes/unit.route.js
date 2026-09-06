const express = require('express');
const unitController = require('../controllers/unit.controller');
const pageController = require('../controllers/page.controller');
const postController = require('../controllers/post.controller');
const menuController = require('../controllers/menu.controller');
const organizationMemberController = require('../controllers/organizationMember.controller');
const agendaController = require('../controllers/agenda.controller');
const postCategoryController = require('../controllers/postCategory.controller');
const validate = require('../middlewares/validate');
const unitValidation = require('../validations/unit.validation');
const pageValidation = require('../validations/page.validation');
const postValidation = require('../validations/post.validation');
const agendaValidation = require('../validations/agenda.validation');
const dynamicContentRoutes = require('./dynamicContent.route');

const router = express.Router();

router.get('/', validate(unitValidation.list), unitController.listPublic);

/**
 * @openapi
 * /units/{slug}/pages/{pageSlug}:
 *   get:
 *     tags: [Units]
 *     summary: Halaman publik unit
 */
router.get('/:slug/pages/:pageSlug', validate(pageValidation.publicParams), pageController.getPublic);

/**
 * @openapi
 * /units/{slug}/posts:
 *   get:
 *     tags: [Units]
 *     summary: Daftar pengumuman publik
 */
router.get('/:slug/posts', validate(postValidation.publicListParams), postController.listPublic);
router.get('/:slug/post-categories', validate(unitValidation.slugParam), postCategoryController.listPublic);

/**
 * @openapi
 * /units/{slug}/posts/{postSlug}:
 *   get:
 *     tags: [Units]
 *     summary: Detail pengumuman publik
 */
router.get('/:slug/posts/:postSlug', validate(postValidation.publicParams), postController.getPublic);

/**
 * @openapi
 * /units/{slug}/menus:
 *   get:
 *     tags: [Units]
 *     summary: Menu navigasi unit
 */
router.get('/:slug/menus', validate(unitValidation.slugParam), menuController.listPublic);

/**
 * @openapi
 * /units/{slug}/organization:
 *   get:
 *     tags: [Units]
 *     summary: Struktur organisasi unit
 */
router.get('/:slug/organization', validate(unitValidation.slugParam), organizationMemberController.listPublic);

/**
 * @openapi
 * /units/{slug}/agendas:
 *   get:
 *     tags: [Units]
 *     summary: Agenda kegiatan publik
 */
router.get('/:slug/agendas', validate(agendaValidation.publicListParams), agendaController.listPublic);
router.use('/:slug/data', dynamicContentRoutes);

router.get('/:slug', validate(unitValidation.slugParam), unitController.getBySlug);

module.exports = router;
