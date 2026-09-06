import { useEffect, useRef } from 'react';
import { MOTION_EFFECTS, defaultMotion } from '../../constants/blockMotion';
import { playBuilderMotion } from '../../helpers/builderMotionPreview';
import { showPuckField } from '../../helpers/fieldPanel';
import { useFieldPanel } from '../BuilderFields';

/**
 * Reveal gulir per blok: efek, jeda, durasi, sekali saja.
 */
export function AnimationField({ value, onChange }) {
  const { query } = useFieldPanel();
  const motion = defaultMotion(value && typeof value === 'object' ? value : {});
  const lastEffect = useRef(motion.effect);
  const visible = showPuckField('Animasi', query);

  function patch(next) {
    onChange({ ...motion, ...next });
  }

  function play() {
    playBuilderMotion(motion.effect, motion.duration);
  }

  useEffect(() => {
    if (!visible) return undefined;
    if (motion.effect === 'none' || motion.effect === lastEffect.current) {
      lastEffect.current = motion.effect;
      return undefined;
    }
    lastEffect.current = motion.effect;
    playBuilderMotion(motion.effect, motion.duration);
    return undefined;
  }, [motion.effect, motion.duration, visible]);

  if (!visible) return <div data-builder-field-hidden hidden />;

  return (
    <div className="builder-field space-y-3">
      <div>
        <p className="mb-1 text-xs text-base-content/60">Efek</p>
        <select
          className="select select-bordered select-sm w-full"
          value={motion.effect}
          onChange={(event) => patch({ effect: event.target.value })}
        >
          {MOTION_EFFECTS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {motion.effect !== 'none' ? (
        <>
          <label className="block">
            <span className="mb-1 block text-xs text-base-content/60">Jeda (ms)</span>
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              min={0}
              max={800}
              step={50}
              value={motion.delay}
              onChange={(event) => patch({ delay: Number(event.target.value) })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-base-content/60">Durasi (ms)</span>
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              min={400}
              max={1200}
              step={50}
              value={motion.duration}
              onChange={(event) => patch({ duration: Number(event.target.value) })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={motion.once !== false}
              onChange={(event) => patch({ once: event.target.checked })}
            />
            Sekali saja
          </label>
          <button type="button" className="btn btn-ghost btn-sm" onClick={play}>
            Putar
          </button>
        </>
      ) : null}
    </div>
  );
}
