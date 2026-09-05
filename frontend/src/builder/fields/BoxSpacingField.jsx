import { useState } from 'react';
import { LAYOUT_UNITS, emptySides } from '../../constants/layoutBox';
import { Icon } from '../../components/ui/Icon';

const SIDES = [
  { key: 'top', label: 'Atas' },
  { key: 'right', label: 'Kanan' },
  { key: 'bottom', label: 'Bawah' },
  { key: 'left', label: 'Kiri' },
];

function isLinked(sides) {
  return SIDES.every(({ key }) => String(sides[key] ?? '') === String(sides.top ?? ''));
}

/**
 * Margin/padding 4 sisi dengan angka, satuan, dan tautan sisi.
 */
export function BoxSpacingField({ value, onChange }) {
  const sides = { ...emptySides(), ...value };
  const [linked, setLinked] = useState(() => isLinked(sides));

  function setSide(key, nextValue) {
    if (linked) {
      onChange({ ...sides, top: nextValue, right: nextValue, bottom: nextValue, left: nextValue });
      return;
    }
    onChange({ ...sides, [key]: nextValue });
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_auto] items-end gap-2">
        <div className="grid grid-cols-4 gap-1">
          {SIDES.map(({ key, label }) => (
            <label key={key} className="block">
              <span className="mb-0.5 block text-[10px] text-base-content/50">{label}</span>
              <input
                type="number"
                className="input input-xs w-full"
                value={sides[key]}
                onChange={(event) => setSide(key, event.target.value)}
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          className={`btn btn-ghost btn-xs btn-square ${linked ? 'btn-active' : ''}`}
          title={linked ? 'Lepas tautan sisi' : 'Tautkan sisi'}
          onClick={() => setLinked((current) => !current)}
        >
          <Icon icon={linked ? 'mdi:link-variant' : 'mdi:link-variant-off'} className="size-4" />
        </button>
      </div>
      <select className="select select-xs w-24" value={sides.unit} onChange={(event) => onChange({ ...sides, unit: event.target.value })}>
        {LAYOUT_UNITS.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
    </div>
  );
}
