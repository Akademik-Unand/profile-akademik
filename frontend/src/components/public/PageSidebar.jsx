import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { MenuLink } from './MenuLink';
import { ROUTES } from '../../constants/routes';
import { menuHref } from '../../helpers/menuHref';
import { formatAddressLines } from '../../helpers/formatAddress';
import { hasUnitContact, isActiveMenuItem } from '../../helpers/menuContext';

function ContactRow({ icon, children }) {
  return (
    <div className="flex items-start gap-3 text-sm leading-relaxed text-neutral-600">
      <Icon icon={icon} className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>{children}</div>
    </div>
  );
}

function ContactPanel({ unit }) {
  const lines = formatAddressLines(unit?.address);

  return (
    <section className="rounded-md border border-neutral-200 bg-surface p-5">
      <p className="font-headline text-sm text-neutral-900">Kontak</p>
      <div className="mt-4 space-y-3">
        {lines.length ? (
          <ContactRow icon="mdi:map-marker-outline">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </ContactRow>
        ) : null}
        {unit?.phone ? <ContactRow icon="mdi:phone-outline">{unit.phone}</ContactRow> : null}
        {unit?.fax ? <ContactRow icon="mdi:fax">{unit.fax}</ContactRow> : null}
        {unit?.email ? (
          <ContactRow icon="mdi:email-outline">
            <a href={`mailto:${unit.email}`} className="break-all hover:text-primary">
              {unit.email}
            </a>
          </ContactRow>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Sidebar halaman dalam: menu saudara + kontak unit.
 */
export function PageSidebar({ unit, unitSlug, group, items = [], currentHref, pageSlug }) {
  const hasRelated = items.length > 0;
  const contact = hasUnitContact(unit);
  if (!hasRelated && !contact) return null;

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      {hasRelated ? (
        <nav className="rounded-md border border-neutral-200 bg-surface p-5" aria-label={group?.label || 'Menu terkait'}>
          <p className="font-headline text-sm text-neutral-900">{group?.label || 'Menu terkait'}</p>
          <ul className="mt-3">
            {items.map((item) => {
              const href = menuHref(item, unitSlug);
              const active = isActiveMenuItem(item, unitSlug, { href: currentHref, pageSlug });
              const className = `flex items-center justify-between gap-2 px-3 py-2 text-sm ${
                active ? 'border-l-2 border-primary bg-mist text-neutral-900' : 'border-l-2 border-transparent text-neutral-600 hover:bg-mist hover:text-neutral-900'
              }`;
              const external = Boolean(href?.startsWith('http'));
              return (
                <li key={item.id || item.label}>
                  {external ? (
                    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
                      {item.label}
                      <Icon icon="mdi:open-in-new" className="size-4 shrink-0 text-neutral-400" />
                    </a>
                  ) : (
                    <MenuLink item={item} unitSlug={unitSlug} className={className} />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
      {contact ? <ContactPanel unit={unit} /> : null}
      <p className="text-sm text-neutral-500">
        <Link to={ROUTES.unit(unitSlug)} className="hover:text-primary">
          Kembali ke beranda
        </Link>
      </p>
    </aside>
  );
}
