import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { ROUTES } from '../../constants/routes';
import { MenuLink } from './MenuLink';
import { SiteLogo } from './SiteLogo';
import { SiteTopBar } from './SiteTopBar';
import { unitNavEntries, unitPathSlug } from '../../helpers/publicHref';
import { socialUnit, unitSocialLinks } from '../../helpers/unitSocial';

const MAIN_SECTIONS = new Set(['pengumuman', 'halaman', 'organisasi', 'agenda']);

function dropdownFrame(alignRight) {
  return `invisible absolute top-full z-50 w-[min(36rem,calc(100vw-2rem))] max-w-[min(36rem,calc(100vw-2rem))] pt-1 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 ${
    alignRight ? 'right-0 left-auto translate-x-0' : 'left-0'
  }`;
}

function MegaDropdown({ item, unitSlug, alignRight, triggerClass }) {
  const wide = (item.children?.length || 0) > 3;

  return (
    <div className="group relative">
      <span className={`inline-flex cursor-default items-center gap-1 py-2 font-headline text-sm tracking-tight ${triggerClass}`}>
        {item.label}
        <Icon icon="mdi:chevron-down" className="size-4" />
      </span>
      <div className={dropdownFrame(alignRight)}>
        <div
          className={`public-dropdown rounded-md bg-surface p-3 text-neutral-800 shadow-md ${wide ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-1'}`}
        >
          {item.children.map((child) => (
            <MenuLink
              key={child.id}
              item={child}
              unitSlug={unitSlug}
              className="rounded-md px-3 py-2 text-sm text-neutral-800 hover:bg-mist"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UnitsDropdown({ entries, alignRight, triggerClass }) {
  return (
    <div className="group relative">
      <span className={`inline-flex cursor-default items-center gap-1 py-2 font-headline text-sm tracking-tight ${triggerClass}`}>
        Unit
        <Icon icon="mdi:chevron-down" className="size-4" />
      </span>
      <div className={dropdownFrame(alignRight)}>
        <div className="public-dropdown flex flex-col gap-1 rounded-md bg-surface p-3 text-neutral-800 shadow-md">
          {entries.map((entry) => (
            <Link key={entry.key} to={entry.to} className="rounded-md px-3 py-2 text-sm text-neutral-800 hover:bg-mist">
              {entry.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader({ unit, menus = [], units = [], transparent }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const parts = location.pathname.split('/').filter(Boolean);
  const inner = parts.length > 1 || MAIN_SECTIONS.has(parts[0]);
  const solid = !transparent || scrolled || inner;
  const slug = unitPathSlug(unit);
  const unitEntries = unitNavEntries(units, unit);
  const socialLinks = unitSocialLinks(socialUnit(unit, units));

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`public-header fixed top-0 z-40 w-full ${solid ? 'is-solid' : ''}`}>
      <SiteTopBar links={socialLinks} />
      <div
        className={`public-bar h-16 w-full md:h-[4.5rem] ${
          solid ? 'bg-surface text-neutral-900 shadow-sm' : 'bg-transparent text-white'
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <Link to={slug ? ROUTES.unit(slug) : ROUTES.home} className="public-brand flex min-w-0 items-center gap-3">
            <SiteLogo unit={unit} />
            <span className="min-w-0 leading-tight">
              <span
                className={`public-brand-title block font-headline text-sm md:text-base ${
                  solid ? 'text-neutral-900' : 'text-white'
                }`}
              >
                Universitas Andalas
              </span>
              <span
                className={`public-brand-sub block font-body text-xs font-normal ${
                  solid ? 'text-neutral-600' : 'text-white/80'
                }`}
              >
                {unit?.name}
              </span>
            </span>
          </Link>
          <nav className="public-nav hidden items-center gap-8 lg:flex">
            {menus.map((item, index) =>
              item.children?.length ? (
                <MegaDropdown
                  key={item.id}
                  item={item}
                  unitSlug={slug}
                  alignRight={index >= menus.length / 2}
                  triggerClass=""
                />
              ) : (
                <MenuLink
                  key={item.id}
                  item={item}
                  unitSlug={slug}
                  className="py-2 font-headline text-sm tracking-tight hover:opacity-80"
                />
              ),
            )}
            {unitEntries.length ? <UnitsDropdown entries={unitEntries} alignRight triggerClass="" /> : null}
          </nav>
          <button type="button" className="lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Menu">
            <Icon icon={mobileOpen ? 'mdi:close' : 'mdi:menu'} className="size-6" />
          </button>
        </div>
      </div>
      {mobileOpen ? (
        <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto bg-surface px-4 py-4 text-neutral-800 shadow-sm lg:hidden">
          {menus.map((item) => (
            <div key={item.id} className="border-b border-neutral-200 py-2">
              <MenuLink item={item} unitSlug={slug} className="font-headline" onClick={() => setMobileOpen(false)} />
              {item.children?.map((child) => (
                <MenuLink
                  key={child.id}
                  item={child}
                  unitSlug={slug}
                  className="mt-1 block pl-3 text-sm text-neutral-600"
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
          ))}
          {unitEntries.length ? (
            <div className="border-b border-neutral-200 py-2">
              <p className="font-headline">Unit</p>
              {unitEntries.map((entry) => (
                <Link
                  key={entry.key}
                  to={entry.to}
                  className="mt-1 block pl-3 text-sm text-neutral-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {entry.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
