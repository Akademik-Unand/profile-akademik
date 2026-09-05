import { showEditorChrome } from '../../helpers/builderChrome';
import { renderSlotItems } from '../blockRegistry';
import { useBoundField } from '../DataItemContext';
import { boxToMobileClass, boxToPlaceClass, editorBoxStyle, hasBoxSides, hasMeasure, measureToCss } from '../../helpers/layoutStyle';
import { ALIGN_CLASS, ALIGN_PLACE_CLASS, BG_CLASS, TITLE_CLASS, WIDTH_CLASS, isCustomColor, sectionClass } from '../tokens';

function mergeBoxClass(...parts) {
  return parts.filter(Boolean).join(' ');
}

/** Slot Puck sebagai elemen itu sendiri (`as`), supaya overlay = kotak blok. */
export function Slot({ slot, as, className, style }) {
  if (!slot) return null;
  if (typeof slot === 'function') {
    const SlotRender = slot;
    return <SlotRender as={as} className={className} style={style} />;
  }
  if (Array.isArray(slot) && slot.some((row) => row?.type)) {
    const Comp = as || 'div';
    return (
      <Comp className={className} style={style}>
        {renderSlotItems(slot)}
      </Comp>
    );
  }
  return null;
}

export function SectionBlock({ content, background, backgroundColor, padding, margin, width, align, box, puck }) {
  const boxToken = box?.backgroundColor && BG_CLASS[box.backgroundColor] ? box.backgroundColor : '';
  const hexBg = isCustomColor(backgroundColor) || (box?.backgroundColor && !boxToken);
  const tokenPad = hasBoxSides(box?.padding) ? 'none' : padding;
  const tokenMar = hasBoxSides(box?.margin) ? 'none' : margin;
  const style = {
    ...editorBoxStyle(box, puck, { defaultPosition: 'relative' }),
    ...(isCustomColor(backgroundColor) && !box?.backgroundColor ? { backgroundColor } : {}),
    ...(hasMeasure(box?.width) ? { width: measureToCss(box.width), maxWidth: '100%' } : {}),
  };
  const inner = hasMeasure(box?.width) ? '' : WIDTH_CLASS[width] || WIDTH_CLASS.wide;

  return (
    <Slot
      slot={content}
      as="section"
      className={mergeBoxClass(
        sectionClass(boxToken || (hexBg ? 'base' : background), tokenPad, tokenMar),
        'builder-frame',
        inner,
        ALIGN_CLASS[align] || '',
        ALIGN_PLACE_CLASS[align] || '',
        boxToPlaceClass(box),
        boxToMobileClass(box),
      )}
      style={style}
    />
  );
}

export function CardBlock({ content, box, puck }) {
  return (
    <Slot
      slot={content}
      className={mergeBoxClass('builder-frame bg-surface', boxToPlaceClass(box), boxToMobileClass(box))}
      style={editorBoxStyle(box, puck)}
    />
  );
}

export function BandBlock({ content, background, box, puck }) {
  const boxToken = box?.backgroundColor && BG_CLASS[box.backgroundColor] ? box.backgroundColor : '';
  return (
    <Slot
      slot={content}
      className={mergeBoxClass(
        'builder-frame',
        sectionClass(boxToken || background || 'mist', 'none', 'none'),
        WIDTH_CLASS.wide,
        boxToPlaceClass(box),
        boxToMobileClass(box),
      )}
      style={editorBoxStyle(box, puck)}
    />
  );
}

export function SplitBlock({ main, side, box, puck }) {
  return (
    <div className={mergeBoxClass('builder-frame mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3 md:px-6', boxToPlaceClass(box), boxToMobileClass(box))} style={editorBoxStyle(box, puck)}>
      <Slot slot={main} className="md:col-span-2" />
      <Slot slot={side} />
    </div>
  );
}

export function ColumnsBlock({ columnA, columnB, columnC, count, gap, gapSize, box, puck }) {
  const cols = Number(count) === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  const tokenGap = hasMeasure(gapSize) ? '' : { sm: 'gap-4', md: 'gap-8', lg: 'gap-12' }[gap] || 'gap-8';
  const style = {
    ...editorBoxStyle(box, puck),
    ...(hasMeasure(gapSize) ? { gap: measureToCss(gapSize) } : {}),
  };
  return (
    <div className={mergeBoxClass('builder-frame grid', cols, tokenGap, boxToPlaceClass(box), boxToMobileClass(box))} style={style}>
      <Slot slot={columnA} />
      <Slot slot={columnB} />
      {Number(count) === 3 ? <Slot slot={columnC} /> : null}
    </div>
  );
}

export function SpacerBlock({ size, box, puck }) {
  const style = editorBoxStyle(box, puck);
  const tokenHeight = style.height ? '' : { none: 'h-2', sm: 'h-8', md: 'h-16', lg: 'h-24', xl: 'h-36' }[size] || 'h-16';
  return <div className={mergeBoxClass(tokenHeight, boxToPlaceClass(box), boxToMobileClass(box))} style={style} aria-hidden="true" />;
}

export function DividerBlock() {
  return <hr className="border-neutral-200" />;
}

export function HeadingBlock({ title, bind, size, align, box, puck }) {
  const bound = useBoundField(bind);
  const style = editorBoxStyle(box, puck);
  const titleClass = TITLE_CLASS[size] || TITLE_CLASS.xl;
  const text = bound?.text || title || (showEditorChrome(puck) ? 'Judul' : '');
  const mark = align === 'center' || align === 'justify' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div className={mergeBoxClass('py-4', ALIGN_CLASS[align] || '', boxToPlaceClass(box), boxToMobileClass(box))} style={style}>
      <h2 className={`${style.fontFamily ? titleClass.replace('font-headline', '').trim() : titleClass} ${style.color ? '' : 'text-neutral-900'}`}>
        {text}
      </h2>
      <span className={`mt-4 block h-1 w-16 bg-primary ${mark}`} aria-hidden="true" />
    </div>
  );
}
