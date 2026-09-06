import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/public/SiteHeader';
import { SiteFooter } from '../components/public/SiteFooter';
import { SeoHead } from '../components/public/SeoHead';
import { resolvePageSeo } from '../helpers/seo';
import { unitThemeStyle } from '../helpers/unitTheme';
import { usePublicMotion } from '../hooks/usePublicMotion';
import { usePublicSiteUnit, usePublicUnits } from '../hooks/useUnits';

export function PublicLayout({
  children,
  unit,
  menus = [],
  transparent = false,
  seo,
  preview = false,
  previewBackTo,
}) {
  usePublicMotion();
  const unitsQuery = usePublicUnits({ limit: 50, sortBy: 'name', sortOrder: 'asc' });
  const units = unitsQuery.data?.items || [];
  const site = usePublicSiteUnit(unit && !unit.isDefault ? unit.slug : '');
  const chromeUnit = site.data || unit;
  const themeStyle = unitThemeStyle(chromeUnit?.themeColor);
  const headerMenus = menus.length ? menus : chromeUnit?.menus || [];
  const footerMenus = chromeUnit?.footerMenus || [];
  const tags = resolvePageSeo({ unit: chromeUnit, ...seo });

  return (
    <div className="min-h-svh bg-base font-body text-neutral-800" style={themeStyle}>
      <SeoHead title={tags.title} description={tags.description} keywords={tags.keywords} />
      <SiteHeader unit={chromeUnit} menus={headerMenus} units={units} transparent={transparent} />
      {preview ? (
        <p className="public-preview-note fixed right-4 z-50 rounded-md bg-warning px-3 py-1.5 text-sm text-neutral-900 shadow-md">
          Pratinjau draf
          {previewBackTo ? (
            <>
              {' · '}
              <Link to={previewBackTo} className="font-medium text-neutral-900 underline">
                Kembali ke editor
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
      <main>{children}</main>
      <SiteFooter unit={chromeUnit} menus={footerMenus} units={units} />
    </div>
  );
}
