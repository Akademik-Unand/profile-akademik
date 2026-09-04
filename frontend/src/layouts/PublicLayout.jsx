import { SiteHeader } from '../components/public/SiteHeader';
import { SiteFooter } from '../components/public/SiteFooter';
import { SeoHead } from '../components/public/SeoHead';
import { resolvePageSeo } from '../helpers/seo';
import { usePublicUnits } from '../hooks/useUnits';

export function PublicLayout({ children, unit, menus = [], transparent = false, seo }) {
  const unitsQuery = usePublicUnits({ limit: 50, sortBy: 'name', sortOrder: 'asc' });
  const units = unitsQuery.data?.items || [];
  const themeStyle = unit?.themeColor
    ? { '--color-primary': unit.themeColor, '--color-primary-hover': unit.themeColor }
    : undefined;
  const headerMenus = menus.length ? menus : unit?.menus || [];
  const footerMenus = unit?.footerMenus || [];
  const tags = resolvePageSeo({ unit, ...seo });

  return (
    <div className="min-h-svh bg-base font-body text-neutral-800" style={themeStyle}>
      <SeoHead title={tags.title} description={tags.description} keywords={tags.keywords} />
      <SiteHeader unit={unit} menus={headerMenus} units={units} transparent={transparent} />
      <main>{children}</main>
      <SiteFooter unit={unit} menus={footerMenus} units={units} />
    </div>
  );
}
