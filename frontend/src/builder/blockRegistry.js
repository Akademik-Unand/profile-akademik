import { createElement } from 'react';

const renders = {};

export function registerBlockRenders(map) {
  Object.assign(renders, map);
}

/** Anak slot yang masih berupa array (sering terjadi di dalam Kartu saat <Render>). */
export function renderSlotItems(items) {
  return (items || []).map((item, index) => {
    const Render = renders[item?.type];
    if (!Render) return null;
    const props = item.props || {};
    return createElement(Render, {
      ...props,
      key: props.id || `${item.type}-${index}`,
      puck: props.puck || { isEditing: false },
    });
  });
}
