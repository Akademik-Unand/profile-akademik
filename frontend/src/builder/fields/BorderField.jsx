import { BORDER_STYLES, RADIUS_PRESETS } from '../../constants/layoutBox';
import { ColorPaletteField } from './ColorPaletteField';

/**
 * Ketebalan, jenis, warna, dan radius bingkai.
 */
export function BorderField({ value = {}, onChange }) {
  const border = {
    borderWidth: value.borderWidth ?? 0,
    borderStyle: value.borderStyle || 'none',
    borderColor: value.borderColor || '',
    borderRadius: value.borderRadius ?? 0,
  };

  function patch(next) {
    onChange({ ...border, ...next });
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-0.5 block text-[10px] text-base-content/50">Jenis</span>
          <select
            className="select select-xs w-full"
            value={border.borderStyle}
            onChange={(event) => patch({ borderStyle: event.target.value })}
          >
            {BORDER_STYLES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-0.5 block text-[10px] text-base-content/50">Tebal (px)</span>
          <input
            type="number"
            min="0"
            max="16"
            className="input input-xs w-full"
            value={border.borderWidth}
            onChange={(event) => patch({ borderWidth: event.target.value })}
          />
        </label>
      </div>
      <div>
        <p className="mb-1 text-[10px] text-base-content/50">Warna garis</p>
        <ColorPaletteField value={border.borderColor} onChange={(borderColor) => patch({ borderColor })} label="Warna garis" />
      </div>
      <div>
        <p className="mb-1 text-[10px] text-base-content/50">Sudut (px)</p>
        <div className="mb-1 flex flex-wrap gap-1">
          {RADIUS_PRESETS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`btn btn-ghost btn-xs ${Number(border.borderRadius) === item.value ? 'btn-active' : ''}`}
              onClick={() => patch({ borderRadius: item.value })}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input
          type="number"
          min="0"
          max="999"
          className="input input-xs w-24"
          value={border.borderRadius}
          onChange={(event) => patch({ borderRadius: event.target.value })}
          aria-label="Radius"
        />
      </div>
    </div>
  );
}
