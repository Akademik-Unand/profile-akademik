import { FONT_OPTIONS, HEIGHT_UNITS, SHADOW_OPTIONS, fillBox } from '../../constants/layoutBox';
import { showPuckField, showStyleSection } from '../../helpers/fieldPanel';
import { useFieldPanel } from '../BuilderFields';
import { BackgroundImageField } from './BackgroundImageField';
import { BorderField } from './BorderField';
import { ColorPaletteField } from './ColorPaletteField';
import { BoxSpacingField } from './BoxSpacingField';
import { MeasureField } from './MeasureField';
import { PlaceField } from './PlaceField';
import { PositionField } from './PositionField';

function StyleSection({ id, title, children }) {
  const { query } = useFieldPanel();
  if (!showStyleSection(id, query)) return null;
  return (
    <div>
      <p className="mb-1 text-xs text-base-content/60">{title}</p>
      {children}
    </div>
  );
}

/**
 * Grup gaya lanjutan: latar, jarak, ukuran, posisi.
 */
export function LayoutBoxField({
  value,
  onChange,
  includeColor = true,
  includeTextColor = false,
  includeWidth = true,
  includeHeight = false,
  includeFont = false,
  includeBorder = true,
  defaultPosition = 'static',
}) {
  const { query } = useFieldPanel();
  const box = fillBox(value, { position: defaultPosition });

  function patch(next) {
    onChange({ ...box, ...next });
  }

  if (!showPuckField('Gaya', query)) return <div data-builder-field-hidden hidden />;

  return (
    <div className="builder-field space-y-3">
      <StyleSection id="place" title="Position">
        <PlaceField
          placeX={box.placeX}
          placeY={box.placeY}
          offset={box.offset}
          rotate={box.rotate}
          flipX={box.flipX}
          flipY={box.flipY}
          onChange={(next) => patch(next)}
        />
        <div className="mt-2">
          <PositionField
            value={{
              position: box.position,
              offset: box.offset,
              zIndex: box.zIndex,
              keepPositionOnMobile: box.keepPositionOnMobile,
            }}
            defaultPosition={defaultPosition}
            onChange={(next) => patch(next)}
          />
        </div>
      </StyleSection>
      <StyleSection id="latar" title="Latar">
        {includeColor ? (
          <div className="mb-2">
            <p className="mb-1 text-[11px] text-base-content/55">Warna</p>
            <ColorPaletteField value={box.backgroundColor} onChange={(backgroundColor) => patch({ backgroundColor })} />
          </div>
        ) : null}
        <BackgroundImageField value={box} onChange={(next) => patch(next)} />
      </StyleSection>
      {includeTextColor ? (
        <StyleSection id="teks" title="Warna teks">
          <ColorPaletteField value={box.color} onChange={(color) => patch({ color })} />
        </StyleSection>
      ) : null}
      <StyleSection id="padding" title="Padding">
        <BoxSpacingField value={box.padding} onChange={(padding) => patch({ padding })} />
      </StyleSection>
      <StyleSection id="margin" title="Margin">
        <BoxSpacingField value={box.margin} onChange={(margin) => patch({ margin })} />
      </StyleSection>
      {includeWidth ? (
        <StyleSection id="lebar" title="Lebar">
          <MeasureField value={box.width} onChange={(width) => patch({ width })} allowAuto label="Lebar" />
        </StyleSection>
      ) : null}
      {includeFont ? (
        <StyleSection id="font" title="Font">
          <select
            className="select select-sm w-full"
            value={box.fontFamily || ''}
            onChange={(event) => patch({ fontFamily: event.target.value })}
          >
            {FONT_OPTIONS.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </StyleSection>
      ) : null}
      {includeBorder ? (
        <StyleSection id="bingkai" title="Bingkai">
          <BorderField
            value={box}
            onChange={(next) =>
              patch({
                borderWidth: next.borderWidth,
                borderStyle: next.borderStyle,
                borderColor: next.borderColor,
                borderRadius: next.borderRadius,
              })
            }
          />
        </StyleSection>
      ) : null}
      {includeHeight ? (
        <StyleSection id="tinggi" title="Tinggi">
          <MeasureField
            allowAuto
            units={HEIGHT_UNITS}
            value={box.height}
            onChange={(height) => patch({ height })}
            label="Tinggi"
          />
        </StyleSection>
      ) : null}
      <StyleSection id="bayangan" title="Bayangan">
        <select className="select select-sm w-full" value={box.shadow || 'none'} onChange={(event) => patch({ shadow: event.target.value })}>
          {SHADOW_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </StyleSection>
      <StyleSection id="opacity" title="Transparansi">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            className="range range-xs flex-1"
            value={box.opacity ?? 100}
            onChange={(event) => patch({ opacity: Number(event.target.value) })}
            aria-label="Transparansi"
          />
          <input
            type="number"
            min="0"
            max="100"
            className="input input-xs w-16"
            value={box.opacity ?? 100}
            onChange={(event) => patch({ opacity: event.target.value })}
            aria-label="Nilai transparansi"
          />
        </div>
      </StyleSection>
    </div>
  );
}
