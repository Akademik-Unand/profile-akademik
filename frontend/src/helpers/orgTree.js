import { buildMenuTree, flattenMenuTree } from './menuTree';

export function buildOrgTree(members = []) {
  return buildMenuTree(members);
}

export function flattenOrgTree(nodes = [], depth = 0) {
  return flattenMenuTree(nodes, depth);
}
