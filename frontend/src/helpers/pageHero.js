/** Jangan ulangi judul halaman di jejak — judul sudah jadi heading. */
export function pageHeroCrumbs(crumbs = [], title) {
  if (!title) return crumbs;
  return crumbs.filter((item) => item.label !== title);
}
