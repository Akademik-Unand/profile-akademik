import { defaultLandingStats } from '../../helpers/landingBlocks';

/**
 * Pita angka ringkas di bawah hero (pola kampus kelas dunia).
 */
export function StatsStrip({ items, title = 'Menuju layanan akademik unggul' }) {
  const rows = (items?.length ? items : defaultLandingStats()).filter((item) => item.value);
  if (!rows.length) return null;

  return (
    <section className="bg-hero text-white" data-landing-stats>
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        {title ? (
          <p className="mb-8 max-w-xl text-sm text-white/70 md:text-base" data-aos="fade-up">
            {title}
          </p>
        ) : null}
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((item, index) => (
            <li key={`${item.value}-${item.label}`} data-aos="fade-up" data-aos-delay={Math.min(index * 80, 240)}>
              <p className="font-headline text-4xl tracking-tight md:text-5xl">{item.value}</p>
              <p className="mt-2 text-sm text-white/75">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
