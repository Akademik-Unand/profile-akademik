import { Outlet } from 'react-router-dom';
import { useUiStore } from '../store/ui.store';
import { Sidebar } from './admin/Sidebar';
import { Navbar } from './admin/Navbar';
import { Footer } from './admin/Footer';

export function AdminLayout() {
  const theme = useUiStore((state) => state.theme);

  return (
    <div id="admin-app" data-theme={theme} className="flex min-h-svh bg-base-200 text-base-content antialiased">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="min-w-0 w-full flex-1 p-4 md:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
