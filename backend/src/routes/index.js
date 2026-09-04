const express = require('express');
const authRoutes = require('./auth.route');
const unitRoutes = require('./unit.route');
const adminUnitRoutes = require('./admin/unit.route');
const adminPageRoutes = require('./admin/page.route');
const adminPostRoutes = require('./admin/post.route');
const adminPostCategoryRoutes = require('./admin/postCategory.route');
const adminMediaRoutes = require('./admin/media.route');
const adminMenuRoutes = require('./admin/menu.route');
const adminOrganizationRoutes = require('./admin/organizationMember.route');
const adminAgendaRoutes = require('./admin/agenda.route');
const adminUserRoutes = require('./admin/user.route');
const adminPermissionRoutes = require('./admin/permission.route');
const adminLandingRoutes = require('./admin/landing.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/units', unitRoutes);
router.use('/admin/units', adminUnitRoutes);
router.use('/admin/pages', adminPageRoutes);
router.use('/admin/posts', adminPostRoutes);
router.use('/admin/post-categories', adminPostCategoryRoutes);
router.use('/admin/media', adminMediaRoutes);
router.use('/admin/menus', adminMenuRoutes);
router.use('/admin/organization-members', adminOrganizationRoutes);
router.use('/admin/agendas', adminAgendaRoutes);
router.use('/admin/users', adminUserRoutes);
router.use('/admin/permissions', adminPermissionRoutes);
router.use('/admin/landings', adminLandingRoutes);

module.exports = router;
