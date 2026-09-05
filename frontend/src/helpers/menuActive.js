import { menuHref } from './menuHref';

export function isHrefActive(href, pathname, search = '') {
  if (!href || href === '#' || href.startsWith('http')) return false;
  const url = href.startsWith('/') ? href : `/${href}`;
  const [path, query = ''] = url.split('?');
  if (path === '/') return pathname === '/';
  if (pathname !== path && !pathname.startsWith(`${path}/`)) return false;
  if (!query) return true;
  const wanted = new URLSearchParams(query);
  const current = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  return [...wanted.entries()].every(([key, value]) => current.get(key) === value);
}

export function isMenuItemActive(item, unitSlug, pathname, search = '') {
  if (isHrefActive(menuHref(item, unitSlug), pathname, search)) return true;
  return (item.children || []).some((child) => isMenuItemActive(child, unitSlug, pathname, search));
}
