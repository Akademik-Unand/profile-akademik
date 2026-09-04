import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { ROUTES } from '../../constants/routes';

/**
 * Breadcrumb admin. Item terakhir tampil sebagai teks; sisanya tautan.
 * @param {{ items?: Array<{ label: string, path?: string }> }} props
 */
export function Breadcrumb({ items = [] }) {
  return (
    <nav className="max-w-full py-0 text-xs text-base-content/60" aria-label="Breadcrumb">
      <ul className="flex flex-wrap items-center gap-x-1 gap-y-1">
        <li>
          <Link
            to={ROUTES.adminDashboard}
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            <Icon icon="mdi:home-outline" className="size-3.5" />
            Dashboard
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.path || ''}-${item.label}`} className="flex items-center gap-1 before:content-['/'] before:text-base-content/30">
              {isLast || !item.path ? (
                <span className="text-base-content">{item.label}</span>
              ) : (
                <Link to={item.path} className="hover:text-primary">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
