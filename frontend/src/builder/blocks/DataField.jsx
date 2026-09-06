import { Link } from 'react-router-dom';
import { motionAttrs } from '../../helpers/blockMotion';
import { boxToMobileClass, editorBoxStyle } from '../../helpers/layoutStyle';
import { resolveDataField } from '../../helpers/dataItem';
import { showEditorChrome } from '../../helpers/builderChrome';
import { useDataItem } from '../DataItemContext';

function mergeClass(...parts) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Satu field dari item data situs yang sedang diulang.
 */
export function DataFieldBlock({ field = 'title', dynamicField = '', formatter = 'text', box, motion, puck }) {
  const { item, source, pathSlug } = useDataItem();
  const resolved = resolveDataField(item, source?.startsWith('dynamic:') ? (dynamicField || field) : field, { source, pathSlug, formatter });
  const editing = showEditorChrome(puck);
  const style = editorBoxStyle(box, puck);
  const className = mergeClass(boxToMobileClass(box));
  const attrs = motionAttrs(motion);

  if (!item) {
    return (
      <p className={mergeClass('text-sm text-neutral-500', className)} style={style} {...attrs}>
        {editing ? 'Taruh Isi data di dalam Kartu pada blok data situs.' : ''}
      </p>
    );
  }

  if (resolved.type === 'image') {
    if (!resolved.src) {
      return editing ? (
        <div className={mergeClass('rounded-md bg-mist px-3 py-8 text-center text-sm text-neutral-500', className)} style={style} {...attrs}>
          Gambar item
        </div>
      ) : null;
    }
    return <img src={resolved.src} alt={resolved.text} className={mergeClass('max-w-full rounded-md', className)} style={style} {...attrs} />;
  }

  if (resolved.type === 'link') {
    if (!resolved.href) {
      return editing ? (
        <span className={mergeClass('text-sm text-primary', className)} style={style} {...attrs}>
          {resolved.text}
        </span>
      ) : null;
    }
    return (
      <Link to={resolved.href} className={mergeClass('text-sm text-primary', className)} style={style} {...attrs}>
        {resolved.text}
      </Link>
    );
  }

  if (!resolved.text) {
    return editing ? (
      <p className={mergeClass('text-sm text-neutral-400', className)} style={style} {...attrs}>
        (kosong)
      </p>
    ) : null;
  }

  if (field === 'title') {
    return (
      <p className={mergeClass('font-headline text-lg text-neutral-900', className)} style={style} {...attrs}>
        {resolved.text}
      </p>
    );
  }

  return (
    <p className={mergeClass('text-sm text-neutral-600', className)} style={style} {...attrs}>
      {resolved.text}
    </p>
  );
}
