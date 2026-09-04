export function buildMenuTree(items = []) {
  const byId = new Map();
  items.forEach((item) => {
    byId.set(item.id, { ...item, children: [] });
  });

  const roots = [];
  byId.forEach((item) => {
    if (item.parentId && byId.has(item.parentId)) {
      byId.get(item.parentId).children.push(item);
    } else {
      roots.push(item);
    }
  });

  function sortTree(nodes) {
    nodes.sort((a, b) => a.order - b.order || a.id - b.id);
    nodes.forEach((node) => sortTree(node.children));
    return nodes;
  }

  return sortTree(roots);
}

export function flattenMenuTree(nodes = [], depth = 0) {
  return nodes.flatMap((node) => [
    { ...node, depth },
    ...flattenMenuTree(node.children || [], depth + 1),
  ]);
}

export function menusByLocation(items = [], location = 'header') {
  return buildMenuTree(items.filter((item) => !location || item.location === location));
}

export function splitFooterMenus(items = []) {
  const links = [];
  const resources = [];
  items.forEach((item) => {
    const href = item.externalUrl || '';
    const isResource = item.type === 'external_url' && /^https?:\/\//i.test(href);
    if (isResource) resources.push(item);
    else links.push(item);
  });
  return { links, resources };
}
