import { useEffect, useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { ROUTES } from '../../constants/routes';
import { roleLabel } from '../../constants/roles';
import { getInitials } from '../../utils/initials';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import { useLogout } from '../../hooks/useAuth';
import { AccessibilityMenu } from '../../components/common/AccessibilityMenu';
import { NavSearchModal } from './NavSearchModal';

export function Navbar() {
  const { toggleSidebar, toggleMobileSidebar } = useUiStore();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      const tag = document.activeElement?.tagName;
      const inField = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
      const slash = event.key === '/' && !inField;
      const commandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if ((slash || commandK) && !searchOpen) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-base-300 bg-base-100/90 px-4 backdrop-blur-md md:px-6">
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="btn btn-ghost btn-square btn-sm lg:hidden"
          aria-label="Buka menu"
        >
          <Icon icon="mdi:menu" className="size-5" />
        </button>
        <button
          type="button"
          onClick={toggleSidebar}
          className="btn btn-ghost btn-square btn-sm hidden lg:inline-flex"
          aria-label="Ciutkan sidebar"
        >
          <Icon icon="mdi:menu" className="size-5" />
        </button>
        <div className="hidden sm:block">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex w-72 items-center gap-2.5 rounded-md border border-base-300 bg-base-200 px-3.5 py-2 text-sm text-base-content/50 hover:border-base-content/20 hover:text-base-content/70"
          >
            <Icon icon="mdi:magnify" className="size-4 shrink-0" />
            <span className="flex-1 text-left">Cari...</span>
            <kbd className="hidden rounded border border-base-300 bg-base-100 px-1.5 text-[10px] text-base-content/40 md:inline-block">
              /
            </kbd>
          </button>
        </div>
        <a
          href={ROUTES.home}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm gap-1.5"
          aria-label="Lihat website"
        >
          <Icon icon="mdi:open-in-new" className="size-4" />
          <span className="hidden sm:inline">Lihat website</span>
        </a>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="btn btn-ghost btn-square btn-sm sm:hidden"
          aria-label="Cari"
        >
          <Icon icon="mdi:magnify" className="size-[18px]" />
        </button>

        <AccessibilityMenu />

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm relative">
            <Icon icon="mdi:bell-outline" className="size-[18px]" />
          </div>
          <div tabIndex={0} className="dropdown-content card card-sm z-50 mt-2 w-72 border border-base-300 bg-base-100 p-0 shadow-xl">
            <div className="card-body p-4">
              <h3 className="border-b border-base-200 pb-2 text-sm font-medium">Notifikasi</h3>
              <p className="py-4 text-center text-xs text-base-content/60">Belum ada notifikasi.</p>
            </div>
          </div>
        </div>

        <div className="divider divider-horizontal mx-0.5 h-6" />

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2 pr-2 pl-1">
            <div className="avatar avatar-placeholder">
              <div className="w-8 rounded-full bg-primary text-xs text-primary-content">
                <span>{getInitials(user?.name)}</span>
              </div>
            </div>
            <div className="hidden flex-col text-left md:flex">
              <span className="text-xs leading-tight font-medium">{user?.name}</span>
              <span className="text-[10px] leading-tight text-base-content/60">{roleLabel(user?.role)}</span>
            </div>
            <Icon icon="mdi:chevron-down" className="hidden size-3.5 opacity-60 md:inline-block" />
          </div>
          <ul tabIndex={0} className="dropdown-content menu z-50 mt-2 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
            <li className="mb-1 border-b border-base-200 px-3 py-2">
              <div className="flex flex-col p-0 hover:bg-transparent">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-base-content/60">{user?.email}</p>
              </div>
            </li>
            <li>
              <button type="button" className="py-2 text-xs font-medium text-error hover:bg-error/10" onClick={() => logout.mutate()}>
                <Icon icon="mdi:logout" className="size-[15px]" />
                Keluar
              </button>
            </li>
          </ul>
        </div>
      </div>

      <NavSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
