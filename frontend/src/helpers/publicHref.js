export function unitPathSlug(unitOrSlug) {
  if (!unitOrSlug) return '';
  if (typeof unitOrSlug === 'object') {
    if (unitOrSlug.isDefault) return '';
    return unitOrSlug.slug || '';
  }
  return unitOrSlug;
}

export function rewriteMainSitePath(href) {
  if (!href || typeof href !== 'string') return href;
  if (/^https?:\/\//i.test(href)) return href;
  if (href === '/akademik' || href === '/akademik/') return '/';
  if (href.startsWith('/akademik/')) return href.slice('/akademik'.length) || '/';
  return href;
}

export function publicHref(unitOrSlug, kind, slug) {
  const prefix = unitPathSlug(unitOrSlug);
  const root = prefix ? `/${prefix}` : '';
  switch (kind) {
    case 'home':
      return root || '/';
    case 'page':
      return `${root}/halaman/${slug}`;
    case 'posts':
      return `${root}/pengumuman`;
    case 'post':
      return `${root}/pengumuman/${slug}`;
    case 'org':
      return `${root}/organisasi`;
    case 'agenda':
      return `${root}/agenda`;
    case 'data':
      return `${root}/data/${slug}`;
    default:
      return root || '/';
  }
}

export function listedUnits(units = []) {
  return units.filter((unit) => unit && !unit.isDefault && unit.slug);
}

export function unitNavEntries(units = [], currentUnit) {
  const others = listedUnits(units);
  if (!others.length) return [];
  const entries = others.map((item) => ({
    key: String(item.id || item.slug),
    label: item.name,
    to: `/${item.slug}`,
  }));
  if (currentUnit && !currentUnit.isDefault) {
    return [{ key: 'main', label: 'Akademik UNAND', to: '/' }, ...entries];
  }
  return entries;
}
