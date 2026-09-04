import { menuHref } from './menuHref';

function stripHash(href) {
  return String(href || '').split('#')[0];
}

function splitHref(href) {
  const [pathPart, query = ''] = stripHash(href).split('?');
  const path = pathPart !== '/' && pathPart.endsWith('/') ? pathPart.slice(0, -1) : pathPart;
  return { path: path || '', query };
}

function normalizeHref(href) {
  const { path, query } = splitHref(href);
  return query ? `${path}?${query}` : path;
}

function isExactMatch(item, unitSlug, { href, pageSlug } = {}) {
  if (pageSlug && item.type === 'page' && item.targetPage?.slug === pageSlug) return true;
  if (!href) return false;
  const itemHref = menuHref(item, unitSlug);
  if (item.type === 'page') {
    const path = splitHref(href).path;
    return Boolean(path) && splitHref(itemHref).path === path;
  }
  return normalizeHref(itemHref) === normalizeHref(href);
}

function isPathMatch(item, unitSlug, href) {
  const target = splitHref(href).path;
  if (!target) return false;
  return splitHref(menuHref(item, unitSlug)).path === target;
}

function searchNode(node, unitSlug, query) {
  const children = node.children || [];
  if (children.length && (isExactMatch(node, unitSlug, query) || isPathMatch(node, unitSlug, query.href))) {
    const current = children.find((child) => isExactMatch(child, unitSlug, query)) || node;
    return { group: node, items: children, current };
  }
  const found = children.find((child) => isExactMatch(child, unitSlug, query));
  if (found) return { group: node, items: children, current: found };
  for (const child of children) {
    const nested = searchNode(child, unitSlug, query);
    if (nested.current) return nested;
  }
  return { group: null, items: [], current: null };
}

/**
 * Mencari grup menu (parent + saudara) yang memuat halaman/tautan aktif.
 */
export function findMenuContext(menus = [], unitSlug, query = {}) {
  for (const root of menus) {
    const match = searchNode(root, unitSlug, query);
    if (match.current) return match;
  }
  return { group: null, items: [], current: null };
}

export function isActiveMenuItem(item, unitSlug, query = {}) {
  return isExactMatch(item, unitSlug, query);
}

export function withGroupCrumb(group, crumbs = [], unitSlug) {
  if (!group?.label) return crumbs;
  if (crumbs.some((item) => item.label === group.label)) return crumbs;
  const href = menuHref(group, unitSlug);
  const to = href && href !== '#' ? href : undefined;
  return [{ label: group.label, to }, ...crumbs];
}

export function hasUnitContact(unit) {
  return Boolean(unit?.address || unit?.phone || unit?.fax || unit?.email);
}
