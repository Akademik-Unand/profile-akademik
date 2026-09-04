import { Link } from 'react-router-dom';
import { splitFooterMenus } from '../../helpers/menuTree';
import { unitNavEntries, unitPathSlug } from '../../helpers/publicHref';
import { MenuLink } from './MenuLink';
import { FooterBrand } from './FooterBrand';
import { FooterContact } from './FooterContact';

function FooterMenuList({ items, unitSlug }) {
  return (
    <ul className="space-y-2 text-sm text-white/80">
      {items.map((item) => (
        <li key={item.id}>
          <MenuLink item={item} unitSlug={unitSlug} className="hover:text-white" />
          {item.children?.map((child) => (
            <MenuLink
              key={child.id}
              item={child}
              unitSlug={unitSlug}
              className="mt-2 block pl-3 text-xs text-white/70 hover:text-white"
            />
          ))}
        </li>
      ))}
    </ul>
  );
}

function FooterLinks({ title, items, unitSlug, fallback }) {
  return (
    <div className="sm:col-span-1 lg:col-span-2">
      <p className="mb-4 font-headline text-sm tracking-wide">{title}</p>
      {items.length ? <FooterMenuList items={items} unitSlug={unitSlug} /> : fallback}
    </div>
  );
}

function FooterUnitColumn({ entries, extraItems, unitSlug, fallback }) {
  return (
    <div className="sm:col-span-1 lg:col-span-2">
      {entries.length ? (
        <>
          <p className="mb-4 font-headline text-sm tracking-wide">Unit</p>
          <ul className="space-y-2 text-sm text-white/80">
            {entries.map((entry) => (
              <li key={entry.key}>
                <Link to={entry.to} className="hover:text-white">
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {extraItems.length ? (
        <>
          <p className={`font-headline text-sm tracking-wide ${entries.length ? 'mt-8 mb-4' : 'mb-4'}`}>Tautan</p>
          <FooterMenuList items={extraItems} unitSlug={unitSlug} />
        </>
      ) : null}
      {!entries.length && !extraItems.length ? (
        <>
          <p className="mb-4 font-headline text-sm tracking-wide">Tautan</p>
          {fallback}
        </>
      ) : null}
    </div>
  );
}

export function SiteFooter({ unit, menus = [], units = [] }) {
  const { links, resources } = splitFooterMenus(menus);
  const slug = unitPathSlug(unit);
  const unitEntries = unitNavEntries(units, unit);

  return (
    <footer className="bg-hero-footer text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-10 px-4 py-14 sm:grid-cols-2 md:px-6 lg:grid-cols-12">
        <FooterBrand unit={unit} />
        <FooterContact unit={unit} />
        <FooterUnitColumn
          entries={unitEntries}
          extraItems={links}
          unitSlug={slug}
          fallback={<p className="text-sm text-white/75">Layanan akademik dan informasi kemahasiswaan.</p>}
        />
        <FooterLinks
          title="Resources"
          items={resources}
          unitSlug={slug}
          fallback={
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="https://sima.unand.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  SIMA
                </a>
              </li>
              <li>
                <a href="https://ilearn.unand.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  iLearn
                </a>
              </li>
              <li>
                <a href="https://pddikti.kemdiktisaintek.go.id/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Forlap DIKTI
                </a>
              </li>
            </ul>
          }
        />
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Universitas Andalas
      </div>
    </footer>
  );
}
