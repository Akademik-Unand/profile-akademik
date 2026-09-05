import { COLOR_PALETTE } from '../../constants/layoutBox';
import { resolveColor } from '../../helpers/layoutStyle';

/**
 * Palet token situs plus hex bebas.
 */
export function ColorPaletteField({ value, onChange, label }) {
  const color = value || '';
  const hex = resolveColor(color) || '#108652';

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PALETTE.map((item) => (
          <button
            key={item.value}
            type="button"
            title={item.label}
            aria-label={item.label}
            className={`size-6 rounded-md border ${color === item.value || color === item.hex ? 'border-neutral' : 'border-base-300'}`}
            style={{ backgroundColor: item.hex }}
            onClick={() => onChange(item.value)}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          className="h-9 w-12 cursor-pointer rounded-md border border-base-300 bg-base-100 p-1"
          value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : '#108652'}
          onChange={(event) => onChange(event.target.value)}
          aria-label={label || 'Warna'}
        />
        <input
          className="input input-sm flex-1"
          placeholder="#108652"
          value={color}
          onChange={(event) => onChange(event.target.value)}
        />
        {color ? (
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => onChange('')}>
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}
