import { useState } from 'react';
import { FALLBACK_UNIT_LOGO, unitLogoUrl } from '../../helpers/cmsDisplay';

/**
 * Lambang unit, fallback ke PNG UNAND.
 */
export function SiteLogo({ unit, className = 'h-11 w-11 object-contain md:h-12 md:w-12' }) {
  const preferred = unitLogoUrl(unit);
  const [tracked, setTracked] = useState(preferred);
  const [stage, setStage] = useState(0);

  if (tracked !== preferred) {
    setTracked(preferred);
    setStage(0);
  }

  if (stage >= 2 || (stage >= 1 && preferred === FALLBACK_UNIT_LOGO)) {
    return (
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-xs text-white md:h-12 md:w-12">
        UN
      </span>
    );
  }

  return (
    <img
      src={stage === 0 ? preferred : FALLBACK_UNIT_LOGO}
      alt={unit?.name || 'Universitas Andalas'}
      className={className}
      onError={() => setStage((current) => current + 1)}
    />
  );
}
