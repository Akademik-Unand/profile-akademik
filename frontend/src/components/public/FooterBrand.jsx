import { FALLBACK_UNIT_LOGO } from '../../helpers/cmsDisplay';

export function FooterBrand({ unit }) {
  return (
    <div className="lg:col-span-4">
      <div className="flex items-center gap-4">
        <img src={FALLBACK_UNIT_LOGO} alt="Universitas Andalas" className="h-16 w-16 object-contain md:h-20 md:w-20" />
        <div>
          <p className="font-headline text-base leading-tight">Universitas Andalas</p>
          <p className="mt-1 text-sm text-white/80">{unit?.name || 'Bidang Akademik'}</p>
        </div>
      </div>
      {unit?.description ? <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75">{unit.description}</p> : null}
    </div>
  );
}
