import { LAYOUT_UNITS, emptySides } from '../../constants/layoutBox';
import { applyAnchor, readAnchorXY } from '../../helpers/positionAnchor';
import { Icon } from '../../components/ui/Icon';

const HORIZONTAL = [
  { value: 'left', label: 'Rapat kiri', icon: 'mdi:align-horizontal-left' },
  { value: 'center', label: 'Rata tengah', icon: 'mdi:align-horizontal-center' },
  { value: 'right', label: 'Rapat kanan', icon: 'mdi:align-horizontal-right' },
];

const VERTICAL = [
  { value: 'top', label: 'Rapat atas', icon: 'mdi:align-vertical-top' },
  { value: 'middle', label: 'Rata tengah vertikal', icon: 'mdi:align-vertical-center' },
  { value: 'bottom', label: 'Rapat bawah', icon: 'mdi:align-vertical-bottom' },
];

function IconBtn({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex size-8 items-center justify-center rounded-md ${active ? 'bg-base-300' : ''}`}
      onClick={onClick}
    >
      <Icon icon={icon} className="size-4" />
    </button>
  );
}

function AxisInput({ label, icon, value, onChange, suffix }) {
  return (
    <label className="flex min-w-0 items-center gap-1.5 rounded-md bg-base-200 px-2">
      {icon ? <Icon icon={icon} className="size-3.5 shrink-0 text-base-content/50" /> : <span className="text-xs text-base-content/60">{label}</span>}
      <input
        type="number"
        className="input input-ghost input-xs h-8 min-w-0 flex-1 border-0 px-0"
        value={value === '' || value == null ? 0 : value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
      />
      {suffix ? <span className="text-[10px] text-base-content/45">{suffix}</span> : null}
    </label>
  );
}

/**
 * Panel Position seperti Figma: rata H/V, X/Y, putar, dan balik.
 */
export function PlaceField({
  placeX = 'stretch',
  placeY = 'top',
  offset = emptySides(),
  rotate = 0,
  flipX = false,
  flipY = false,
  onChange,
}) {
  const { x, y, unit, anchor } = readAnchorXY(offset);

  function setOffset(nextX, nextY, nextUnit = unit) {
    onChange({
      placeX,
      placeY,
      rotate,
      flipX,
      flipY,
      position: 'relative',
      offset: applyAnchor(anchor, nextX, nextY, nextUnit),
    });
  }

  return (
    <div className="builder-pos space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex rounded-md bg-base-200 p-0.5">
          {HORIZONTAL.map((item) => (
            <IconBtn
              key={item.value}
              icon={item.icon}
              label={item.label}
              active={placeX === item.value}
              onClick={() => onChange({ placeX: item.value, placeY })}
            />
          ))}
        </div>
        <div className="flex rounded-md bg-base-200 p-0.5">
          {VERTICAL.map((item) => (
            <IconBtn
              key={item.value}
              icon={item.icon}
              label={item.label}
              active={placeY === item.value}
              onClick={() => onChange({ placeX, placeY: item.value })}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <AxisInput label="X" value={x} onChange={(next) => setOffset(next, y)} />
        <AxisInput label="Y" value={y} onChange={(next) => setOffset(x, next)} />
      </div>

      <div className="flex items-center gap-1.5">
        <AxisInput label="Putar" icon="mdi:angle-acute" value={rotate} suffix="°" onChange={(next) => onChange({ rotate: next })} />
        <div className="flex rounded-md bg-base-200 p-0.5">
          <IconBtn
            icon="mdi:flip-horizontal"
            label="Balik horizontal"
            active={flipX}
            onClick={() => onChange({ flipX: !flipX })}
          />
          <IconBtn
            icon="mdi:flip-vertical"
            label="Balik vertikal"
            active={flipY}
            onClick={() => onChange({ flipY: !flipY })}
          />
        </div>
        <select
          className="select select-xs w-16"
          value={unit}
          onChange={(event) => setOffset(x, y, event.target.value)}
          aria-label="Satuan"
        >
          {LAYOUT_UNITS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
