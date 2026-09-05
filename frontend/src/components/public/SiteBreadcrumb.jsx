import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

/**
 * Jejak halaman publik. `tone="light"` untuk banner hero gelap.
 */
export function SiteBreadcrumb({ unitSlug, items = [], tone = 'dark' }) {
  const light = tone === 'light';
  const linkClass = light ? 'text-white/55 hover:text-white' : 'hover:text-primary';
  const currentClass = light ? 'text-white/70' : 'text-neutral-800';
  const sepClass = light ? 'text-white/30' : 'text-neutral-400';

  return (
    <nav aria-label="Breadcrumb" className="text-xs tracking-wide">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to={unitSlug ? ROUTES.unit(unitSlug) : ROUTES.home} className={linkClass}>
            Beranda
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span className={sepClass} aria-hidden="true">
              /
            </span>
            {item.to ? (
              <Link to={item.to} className={linkClass}>
                {item.label}
              </Link>
            ) : (
              <span className={currentClass}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
