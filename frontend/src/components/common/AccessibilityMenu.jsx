import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui/Icon';
import { FONT_SCALES, getFontScale, isDarkAdminTheme } from '../../constants/theme';
import { fontScaleIndex } from '../../helpers/accessibility';
import { useUiStore } from '../../store/ui.store';

export function AccessibilityMenu({ variant = 'admin' }) {
  const { theme, toggleTheme, fontScale, setFontScale, stepFontScale } = useUiStore();
  const dark = isDarkAdminTheme(theme);
  const current = getFontScale(fontScale);
  const index = fontScaleIndex(fontScale);
  const atMin = index <= 0;
  const atMax = index >= FONT_SCALES.length - 1;
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const publicVariant = variant === 'public';

  useEffect(() => {
    function onPointer(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const triggerClass = publicVariant
    ? 'inline-flex size-10 items-center justify-center text-white hover:text-white/80'
    : 'btn btn-ghost btn-sm gap-1.5 px-2.5';
  const panelClass = publicVariant
    ? 'absolute right-0 z-50 mt-1 w-72 rounded-md border border-neutral-200 bg-surface p-3 text-neutral-900 shadow-md'
    : 'absolute right-0 z-50 mt-2 w-72 rounded-box border border-base-300 bg-base-100 p-3 text-base-content shadow-xl';
  const mutedClass = publicVariant ? 'text-neutral-500' : 'text-base-content/60';
  const modeBtn = (active) =>
    publicVariant
      ? `inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm ${active ? 'bg-primary text-white' : 'border border-neutral-200 bg-surface'}`
      : `btn btn-sm gap-1.5 ${active ? 'btn-primary' : 'btn-ghost'}`;
  const iconBtn = publicVariant
    ? 'inline-flex size-8 items-center justify-center border border-neutral-200 disabled:opacity-40'
    : 'btn btn-ghost btn-square btn-sm';
  const scaleBtn = (active) =>
    publicVariant
      ? `px-2 py-1 text-xs ${active ? 'bg-primary text-white' : 'border border-neutral-200'}`
      : `btn btn-xs ${active ? 'btn-primary' : 'btn-ghost'}`;

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={triggerClass}
        title="Kemudahan tampilan"
        aria-label="Kemudahan tampilan"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon icon="mdi:human" className={publicVariant ? 'size-5' : 'size-4 text-primary'} />
      </button>
      {open ? (
        <div className={panelClass}>
          <p className={`mb-3 text-xs uppercase tracking-wide ${mutedClass}`}>Kemudahan tampilan</p>
          <p className="mb-1.5 text-sm">Mode tampilan</p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button type="button" className={modeBtn(!dark)} onClick={() => dark && toggleTheme()}>
              <Icon icon="mdi:white-balance-sunny" className="size-3.5" />
              Terang
            </button>
            <button type="button" className={modeBtn(dark)} onClick={() => !dark && toggleTheme()}>
              <Icon icon="mdi:weather-night" className="size-3.5" />
              Gelap
            </button>
          </div>
          <p className="mb-1.5 text-sm">Ukuran huruf</p>
          <p className={`mb-2 text-xs ${mutedClass}`}>Perbesar teks jika tulisan terasa kecil.</p>
          <div className="mb-2 flex items-center gap-2">
            <button type="button" className={iconBtn} onClick={() => stepFontScale(-1)} disabled={atMin} aria-label="Kecilkan huruf">
              <Icon icon="mdi:minus" className="size-3.5" />
            </button>
            <span className="flex-1 text-center text-sm">{current.label}</span>
            <button type="button" className={iconBtn} onClick={() => stepFontScale(1)} disabled={atMax} aria-label="Perbesar huruf">
              <Icon icon="mdi:plus" className="size-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {FONT_SCALES.map((item) => (
              <button key={item.id} type="button" className={scaleBtn(item.id === current.id)} onClick={() => setFontScale(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
