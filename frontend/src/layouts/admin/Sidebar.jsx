import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '../../components/ui/Icon';
import { NAVIGATION_MENU } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';
import { filterNavigation } from '../../helpers/navigation';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';

export function Sidebar() {
  const { isSidebarOpen, isMobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const user = useAuthStore((state) => state.user);
  const menu = filterNavigation(NAVIGATION_MENU, user);
  const location = useLocation();

  function renderMenu(expanded) {
    return (
      <div className="flex h-full flex-col border-r border-base-300 bg-base-100 select-none">
        <div className="relative flex h-16 items-center border-b border-base-300 px-3">
          <NavLink
            to={ROUTES.adminDashboard}
            className="flex h-full items-center gap-2"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <img src="/images/unand.png" alt="Universitas Andalas" className="size-10 object-contain" />
            {expanded ? (
              <span className="text-sm font-medium leading-tight">
                Profil Akademik
                <span className="block text-[10px] font-normal text-base-content/50">UNAND</span>
              </span>
            ) : null}
          </NavLink>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="btn btn-ghost btn-square btn-xs absolute right-2 lg:hidden"
            aria-label="Tutup menu"
          >
            <Icon icon="mdi:close" className="size-4" />
          </button>
        </div>

        <nav className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {menu.map((item) => {
            if (item.type === 'link') {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === ROUTES.adminDashboard}
                  onClick={() => setMobileSidebarOpen(false)}
                  title={item.label}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-content'
                      : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'
                  }`}
                >
                  <Icon icon={item.icon} className="size-[18px] shrink-0" />
                  {expanded ? <span>{item.label}</span> : null}
                </NavLink>
              );
            }

            if (item.type === 'group') {
              return (
                <div key={item.title} className="space-y-1">
                  {expanded ? (
                    <p className="px-3 text-[10px] font-medium tracking-wider uppercase text-base-content/40">
                      {item.title}
                    </p>
                  ) : null}
                  <div className="space-y-0.5">
                    {item.items.map((subItem) => {
                      const isActive = location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`);
                      return (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setMobileSidebarOpen(false)}
                          title={subItem.label}
                          className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-primary text-primary-content'
                              : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'
                          }`}
                        >
                          <Icon icon={subItem.icon} className="size-[18px] shrink-0" />
                          {expanded ? <span>{subItem.label}</span> : null}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </nav>
      </div>
    );
  }

  return (
    <>
      <aside className={`hidden shrink-0 transition-all duration-300 lg:block ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="sticky top-0 h-svh overflow-hidden">{renderMenu(isSidebarOpen)}</div>
      </aside>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Tutup menu"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 z-10 w-72 max-w-[80vw] shadow-xl">{renderMenu(true)}</div>
        </div>
      ) : null}
    </>
  );
}
