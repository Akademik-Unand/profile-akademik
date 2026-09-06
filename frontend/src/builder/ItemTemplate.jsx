import { SLOT_KEYS_BY_TYPE } from '../constants/builder';
import { itemRenders } from './itemTemplateConfig';

/**
 * Ubah array slot jadi fungsi Slot seperti yang diharapkan blok Kartu/Section.
 * Render Puck bersarang tidak melakukan ini, jadi anak (Judul, dll.) hilang.
 */
export function toSlotRender(items) {
  if (!Array.isArray(items) || !items.some((row) => row?.type)) return undefined;

  function SlotRender({ as: Comp = 'div', className, style, ...rest }) {
    return (
      <Comp className={className} style={style} {...rest}>
        <ItemTemplate items={items} />
      </Comp>
    );
  }

  return SlotRender;
}

function blockProps(item) {
  const props = { ...(item.props || {}) };
  (SLOT_KEYS_BY_TYPE[item.type] || []).forEach((key) => {
    if (Array.isArray(props[key])) props[key] = toSlotRender(props[key]);
  });
  return props;
}

/** Cetakan item Agenda/Arsip, tanpa <Render> Puck. */
export function ItemTemplate({ items }) {
  return (items || []).map((item, index) => {
    const Render = itemRenders[item.type];
    if (!Render) return null;
    const props = blockProps(item);
    return <Render key={props.id || `${item.type}-${index}`} {...props} puck={{ isEditing: false }} />;
  });
}
