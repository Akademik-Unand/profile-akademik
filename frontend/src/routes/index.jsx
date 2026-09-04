import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout } from '../layouts/AdminLayout';
import PublicHomePage from '../pages/public/PublicHomePage';
import PublicUnitPage from '../pages/public/PublicUnitPage';
import PublicPagePage from '../pages/public/PublicPagePage';
import PublicPostListPage from '../pages/public/PublicPostListPage';
import PublicPostPage from '../pages/public/PublicPostPage';
import LoginPage from '../pages/admin/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import UnitListPage from '../pages/admin/units/UnitListPage';
import UnitFormPage from '../pages/admin/units/UnitFormPage';
import PageListPage from '../pages/admin/pages/PageListPage';
import PageFormPage from '../pages/admin/pages/PageFormPage';
import PostListPage from '../pages/admin/posts/PostListPage';
import PostFormPage from '../pages/admin/posts/PostFormPage';
import CategoryListPage from '../pages/admin/categories/CategoryListPage';
import MediaLibraryPage from '../pages/admin/media/MediaLibraryPage';
import MenuBuilderPage from '../pages/admin/menus/MenuBuilderPage';
import OrganizationListPage from '../pages/admin/organization/OrganizationListPage';
import AgendaListPage from '../pages/admin/agendas/AgendaListPage';
import AgendaFormPage from '../pages/admin/agendas/AgendaFormPage';
import PublicOrganizationPage from '../pages/public/PublicOrganizationPage';
import PublicAgendaPage from '../pages/public/PublicAgendaPage';
import UserListPage from '../pages/admin/users/UserListPage';
import UserFormPage from '../pages/admin/users/UserFormPage';
import PermissionMatrixPage from '../pages/admin/permissions/PermissionMatrixPage';
import SeoSettingsPage from '../pages/admin/seo/SeoSettingsPage';
import LandingEditorPage from '../pages/admin/landing/LandingEditorPage';

function cmsRoute(action, subject, element) {
  return <ProtectedRoute action={action} subject={subject}>{element}</ProtectedRoute>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="units" element={cmsRoute('manage', 'Unit', <UnitListPage />)} />
        <Route path="units/new" element={cmsRoute('create', 'Unit', <UnitFormPage />)} />
        <Route path="units/:id/edit" element={cmsRoute('update', 'Unit', <UnitFormPage />)} />
        <Route path="pages" element={cmsRoute('create', 'Page', <PageListPage />)} />
        <Route path="pages/new" element={cmsRoute('create', 'Page', <PageFormPage />)} />
        <Route path="pages/:id/edit" element={cmsRoute('create', 'Page', <PageFormPage />)} />
        <Route path="posts" element={cmsRoute('create', 'Post', <PostListPage />)} />
        <Route path="posts/new" element={cmsRoute('create', 'Post', <PostFormPage />)} />
        <Route path="posts/:id/edit" element={cmsRoute('create', 'Post', <PostFormPage />)} />
        <Route path="categories" element={cmsRoute('create', 'PostCategory', <CategoryListPage />)} />
        <Route path="media" element={cmsRoute('create', 'Media', <MediaLibraryPage />)} />
        <Route path="menus" element={cmsRoute('create', 'Menu', <MenuBuilderPage />)} />
        <Route path="organization" element={cmsRoute('create', 'OrganizationMember', <OrganizationListPage />)} />
        <Route path="agendas" element={cmsRoute('create', 'Agenda', <AgendaListPage />)} />
        <Route path="agendas/new" element={cmsRoute('create', 'Agenda', <AgendaFormPage />)} />
        <Route path="agendas/:id/edit" element={cmsRoute('create', 'Agenda', <AgendaFormPage />)} />
        <Route path="seo" element={cmsRoute('update', 'Unit', <SeoSettingsPage />)} />
        <Route path="landing" element={cmsRoute('read', 'Landing', <LandingEditorPage />)} />
        <Route path="users" element={cmsRoute('read', 'User', <UserListPage />)} />
        <Route path="users/new" element={cmsRoute('create', 'User', <UserFormPage />)} />
        <Route path="users/:id/edit" element={cmsRoute('update', 'User', <UserFormPage />)} />
        <Route path="permissions" element={cmsRoute('read', 'Permission', <PermissionMatrixPage />)} />
      </Route>
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/halaman/:pageSlug" element={<PublicPagePage />} />
      <Route path="/pengumuman/:postSlug" element={<PublicPostPage />} />
      <Route path="/pengumuman" element={<PublicPostListPage />} />
      <Route path="/organisasi" element={<PublicOrganizationPage />} />
      <Route path="/agenda" element={<PublicAgendaPage />} />
      <Route path="/:unitSlug/halaman/:pageSlug" element={<PublicPagePage />} />
      <Route path="/:unitSlug/pengumuman/:postSlug" element={<PublicPostPage />} />
      <Route path="/:unitSlug/pengumuman" element={<PublicPostListPage />} />
      <Route path="/:unitSlug/organisasi" element={<PublicOrganizationPage />} />
      <Route path="/:unitSlug/agenda" element={<PublicAgendaPage />} />
      <Route path="/:unitSlug" element={<PublicUnitPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
