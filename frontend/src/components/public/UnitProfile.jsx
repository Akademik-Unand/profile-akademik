import { Badge } from '../ui/Badge';

export function UnitProfile({ unit }) {
  if (!unit) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm text-neutral-600">{unit.slug}</p>
      <h1 className="mt-1 text-3xl text-neutral-900">{unit.name}</h1>
      <div className="mt-4 flex items-center gap-2">
        <Badge tone={unit.isActive ? 'success' : 'neutral'}>
          {unit.isActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
        {unit.isDefault ? <Badge>Unit utama</Badge> : null}
      </div>
      <p className="mt-8 max-w-2xl text-neutral-700">
        Halaman profil unit ini masih dalam tahap skeleton. Konten halaman, pengumuman, dan menu
        navigasi akan ditambahkan pada tahap berikutnya.
      </p>
    </section>
  );
}
