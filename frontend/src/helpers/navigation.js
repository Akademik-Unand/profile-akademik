import { defineAbility } from '../policies/defineAbility';

function isAllowed(ability, item) {
  if (!item?.permission) return true;
  return ability.can(item.permission.action, item.permission.subject);
}

export function filterNavigation(menu, user) {
  const ability = defineAbility(user);

  return (menu || [])
    .map((item) => {
      if (item.type === 'link') {
        return isAllowed(ability, item) ? item : null;
      }

      if (item.type === 'group') {
        const items = (item.items || [])
          .map((sub) => {
            if (sub.children) {
              const children = sub.children.filter((child) => isAllowed(ability, child));
              if (!children.length) return null;
              return { ...sub, children };
            }
            return isAllowed(ability, sub) ? sub : null;
          })
          .filter(Boolean);

        if (!items.length) return null;
        return { ...item, items };
      }

      return item;
    })
    .filter(Boolean);
}

export function buildNavIndex(menu) {
  const items = [];
  (menu || []).forEach((item) => {
    if (item.type === 'link') {
      items.push({ label: item.label, path: item.path, group: null });
    } else if (item.type === 'group') {
      item.items.forEach((sub) => {
        if (sub.children) {
          sub.children.forEach((child) => {
            items.push({ label: child.label, path: child.path, group: sub.label });
          });
        } else {
          items.push({ label: sub.label, path: sub.path, group: item.title });
        }
      });
    }
  });
  return items;
}
