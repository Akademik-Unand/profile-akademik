import { IMAGE_ALIGN_OPTIONS, IMAGE_SIZE_OPTIONS, imageClass, parseImageClass } from '../../../helpers/contentImage';
import { EditorToolbarButton } from './EditorToolbarButton';

/**
 * Kontrol ukuran dan posisi saat gambar di artikel sedang dipilih.
 */
export function ImageToolbar({ editor }) {
  const { size, align } = parseImageClass(editor.getAttributes('image').class);

  function apply(next) {
    editor
      .chain()
      .focus()
      .updateAttributes('image', { class: imageClass({ size: next.size ?? size, align: next.align ?? align }) })
      .run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-base-300 bg-base-100 px-2 py-1">
      <span className="mr-1 text-xs text-base-content/60">Gambar</span>
      <select
        className="select select-xs w-28"
        value={size}
        onChange={(event) => apply({ size: event.target.value })}
        aria-label="Ukuran gambar"
      >
        {IMAGE_SIZE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <EditorToolbarButton
        icon="mdi:format-align-left"
        label="Gambar kiri"
        active={align === 'left'}
        onClick={() => apply({ align: 'left' })}
      />
      <EditorToolbarButton
        icon="mdi:format-align-center"
        label="Gambar tengah"
        active={align === 'center'}
        onClick={() => apply({ align: 'center' })}
      />
      <EditorToolbarButton
        icon="mdi:format-align-right"
        label="Gambar kanan"
        active={align === 'right'}
        onClick={() => apply({ align: 'right' })}
      />
    </div>
  );
}
