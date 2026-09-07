import { AdminField } from './AdminField';

const seoFields = [
  { name: 'title', label: 'Judul SEO', max: 160, hint: 'Kosongkan untuk memakai judul halaman/unit.' },
  { name: 'description', label: 'Deskripsi SEO', max: 300, textarea: true, hint: 'Ringkasan untuk hasil pencarian.' },
  { name: 'keywords', label: 'Kata kunci', max: 250, hint: 'Pisahkan dengan koma.' },
];

/**
 * Field meta title/description/keywords untuk form CMS.
 */
export function SeoFields({ register, errors = {}, names = { title: 'metaTitle', description: 'metaDescription', keywords: 'metaKeywords' } }) {
  return (
    <div className="mt-2 space-y-3">
      <p className="text-sm text-base-content/70">Pengaturan SEO</p>
      {seoFields.map((field) => (
        <AdminField key={field.name} label={field.label} error={errors[names[field.name]]?.message}>
          {field.textarea ? (
            <textarea className="textarea w-full" rows={3} maxLength={field.max} {...register(names[field.name])} />
          ) : (
            <input className="input w-full" maxLength={field.max} {...register(names[field.name])} />
          )}
          <p className="label text-base-content/50">{field.hint}</p>
        </AdminField>
      ))}
    </div>
  );
}
