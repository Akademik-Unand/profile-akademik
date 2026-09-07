import { MediaField } from './MediaField';
import { ColorPaletteField } from './ColorPaletteField';
import {
  BACKGROUND_POSITION_OPTIONS,
  BACKGROUND_SIZE_OPTIONS,
  OVERLAY_DIRECTION_OPTIONS,
  OVERLAY_MODE_OPTIONS,
} from '../../constants/layoutBox';

/**
 * Latar gambar + overlay/gradasi untuk field Gaya.
 */
export function BackgroundImageField({ value, onChange }) {
  const image = value?.backgroundImage || null;
  const overlayOn = value?.overlayEnabled === true;

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-base-content/55">Gambar latar</p>
      <MediaField
        value={image}
        onChange={(next) =>
          onChange({
            backgroundImage: next ? { mediaId: next.mediaId || null, url: next.url || '' } : null,
          })
        }
      />
      {image?.url ? (
        <div className="grid grid-cols-2 gap-2">
          <label className="form-control">
            <span className="label-text text-[11px]">Ukuran</span>
            <select
              className="select select-xs w-full"
              value={value?.backgroundSize || 'cover'}
              onChange={(event) => onChange({ backgroundSize: event.target.value })}
            >
              {BACKGROUND_SIZE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text text-[11px]">Posisi</span>
            <select
              className="select select-xs w-full"
              value={value?.backgroundPosition || 'center'}
              onChange={(event) => onChange({ backgroundPosition: event.target.value })}
            >
              {BACKGROUND_POSITION_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <label className="label cursor-pointer justify-start gap-2 px-0 py-1">
        <input
          type="checkbox"
          className="checkbox checkbox-xs"
          checked={overlayOn}
          onChange={(event) => onChange({ overlayEnabled: event.target.checked })}
        />
        <span className="label-text text-xs">Overlay di atas gambar/warna</span>
      </label>

      {overlayOn ? (
        <div className="space-y-2 rounded-md border border-base-300 p-2">
          <label className="form-control">
            <span className="label-text text-[11px]">Mode</span>
            <select
              className="select select-xs w-full"
              value={value?.overlayMode || 'solid'}
              onChange={(event) => onChange({ overlayMode: event.target.value })}
            >
              {OVERLAY_MODE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <div>
            <p className="mb-1 text-[11px] text-base-content/55">Warna overlay</p>
            <ColorPaletteField value={value?.overlayColor || 'hero'} onChange={(overlayColor) => onChange({ overlayColor })} />
          </div>
          {(value?.overlayMode || 'solid') === 'gradient' ? (
            <>
              <div>
                <p className="mb-1 text-[11px] text-base-content/55">Warna ujung gradasi</p>
                <ColorPaletteField
                  value={value?.overlayGradientTo || ''}
                  onChange={(overlayGradientTo) => onChange({ overlayGradientTo })}
                />
              </div>
              <label className="form-control">
                <span className="label-text text-[11px]">Arah</span>
                <select
                  className="select select-xs w-full"
                  value={value?.overlayDirection || 'to bottom'}
                  onChange={(event) => onChange({ overlayDirection: event.target.value })}
                >
                  {OVERLAY_DIRECTION_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : null}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-base-content/55">Kepakatan</span>
            <input
              type="range"
              min="0"
              max="90"
              className="range range-xs flex-1"
              value={value?.overlayOpacity ?? 45}
              onChange={(event) => onChange({ overlayOpacity: Number(event.target.value) })}
              aria-label="Kepakatan overlay"
            />
            <span className="w-8 text-right text-[11px]">{value?.overlayOpacity ?? 45}%</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
