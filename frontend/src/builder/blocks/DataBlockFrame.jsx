import { motionAttrs } from '../../helpers/blockMotion';
import { boxToMobileClass, boxToPlaceClass, editorBoxStyle } from '../../helpers/layoutStyle';

function mergeClass(...parts) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Bingkai gaya bersama untuk blok yang menarik data situs.
 */
export function DataBlockFrame({ box, motion, puck, className, children }) {
  return (
    <div
      className={mergeClass('px-4 py-6 md:px-6', boxToPlaceClass(box), boxToMobileClass(box), className)}
      style={editorBoxStyle(box, puck)}
      {...motionAttrs(motion)}
    >
      {children}
    </div>
  );
}
