import { Icon } from '../ui/Icon';
import { Skeleton } from '../ui/Skeleton';
import { PageHero } from './PageHero';
import { PageSidebar } from './PageSidebar';
import { formatDateId } from '../../helpers/cmsDisplay';
import { findMenuContext, hasUnitContact, withGroupCrumb } from '../../helpers/menuContext';
import { BG_CLASS } from '../../builder/tokens';

export function InnerPageSkeleton({ wide = false }) {
  return (
    <div className="bg-base">
      <div className="bg-hero px-4 pt-chrome pb-10 md:px-6 md:pb-12">
        <div className="mx-auto max-w-7xl space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-2/3 max-w-xl" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className={wide ? '' : 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]'}>
          <Skeleton className="h-80 w-full" />
          {wide ? null : <Skeleton className="h-56 w-full" />}
        </div>
      </div>
    </div>
  );
}

function ArticleFrame({ framed, updatedAt, children }) {
  const body = (
    <>
      {updatedAt ? (
        <p className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
          <Icon icon="mdi:calendar-blank-outline" className="size-4" />
          Diperbarui {formatDateId(updatedAt, { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      ) : null}
      {children}
    </>
  );

  if (!framed) return body;
  return (
    <article className="rounded-md border border-neutral-200 bg-surface px-6 py-10 md:px-10 md:py-12">
      <div className="max-w-3xl">{body}</div>
    </article>
  );
}

/**
 * Kerangka halaman dalam: hero, artikel, dan sidebar menu terkait.
 */
export function InnerPageShell({
  unit,
  unitSlug,
  title,
  description,
  eyebrow,
  crumbs = [],
  wide = false,
  chrome = 'shell',
  sidebar = 'auto',
  showHero = true,
  background = 'base',
  currentHref,
  pageSlug,
  updatedAt,
  children,
}) {
  const slug = unitSlug ?? unit?.slug;
  const menus = unit?.menus || [];
  const context = findMenuContext(menus, slug, { href: currentHref, pageSlug });
  const trail = withGroupCrumb(context.group, crumbs, slug);
  const full = chrome === 'full' || wide;
  const autoSidebar = context.items.length > 0 || hasUnitContact(unit);
  const showSidebar = sidebar === 'show' || (sidebar === 'auto' && !full && autoSidebar);

  return (
    <div className={BG_CLASS[background] || BG_CLASS.base}>
      {showHero !== false ? (
        <PageHero
          unitSlug={slug}
          unitName={eyebrow || unit?.name}
          title={title}
          description={description}
          crumbs={trail}
        />
      ) : null}
      {full && !showSidebar ? (
        children
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          {showSidebar ? (
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
              <ArticleFrame framed={!full} updatedAt={updatedAt}>
                {children}
              </ArticleFrame>
              <PageSidebar
                unit={unit}
                unitSlug={slug}
                group={context.group}
                items={context.items}
                currentHref={currentHref}
                pageSlug={pageSlug}
                force={sidebar === 'show'}
              />
            </div>
          ) : (
            <div className={full ? '' : 'mx-auto max-w-3xl'}>
              <ArticleFrame framed={!full} updatedAt={updatedAt}>
                {children}
              </ArticleFrame>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
