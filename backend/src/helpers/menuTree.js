function buildMenuTree(items = []) {
  const byId = new Map();
  items.forEach((item) => {
    const json = typeof item.toJSON === 'function' ? item.toJSON() : { ...item };
    json.children = [];
    byId.set(json.id, json);
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

module.exports = buildMenuTree;
