import { z } from 'zod';

const slug = z.string().min(1, 'Slug wajib diisi').max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug tidak valid');
export const FIELD_TYPES = ['text', 'textarea', 'richtext', 'number', 'boolean', 'date', 'datetime', 'select', 'multiselect', 'media', 'url', 'email'];

export const contentFieldSchema = z.object({
  key: z.string().min(1, 'Kunci wajib diisi').regex(/^[a-z][a-zA-Z0-9_]*$/, 'Gunakan camelCase'),
  label: z.string().min(1, 'Label wajib diisi'),
  type: z.enum(FIELD_TYPES),
  required: z.boolean().default(false),
  public: z.boolean().default(true),
  searchable: z.boolean().default(false),
  filterable: z.boolean().default(false),
  sortable: z.boolean().default(false),
  options: z.array(z.string()).default([]),
});

export const contentTypeFormSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(120),
  key: slug,
  description: z.string().max(500).optional().or(z.literal('')),
  fields: z.array(contentFieldSchema).min(1, 'Tambahkan minimal satu field').superRefine((fields, ctx) => {
    const seen = new Set();
    fields.forEach((field, index) => {
      if (seen.has(field.key)) ctx.addIssue({ code: 'custom', path: [index, 'key'], message: 'Kunci field harus unik' });
      seen.add(field.key);
    });
  }),
});

export function buildEntrySchema(fields = []) {
  const shape = { title: z.string().min(1, 'Judul wajib diisi').max(240), slug, status: z.enum(['draft', 'published']) };
  fields.forEach((field) => {
    let rule;
    if (field.type === 'number') rule = z.coerce.number();
    else if (field.type === 'boolean') rule = z.boolean();
    else if (field.type === 'url') rule = z.string().url('URL tidak valid');
    else rule = z.string();
    if (!field.required) rule = rule.optional().or(z.literal(''));
    else if (field.type !== 'number' && field.type !== 'boolean') rule = rule.min(1, `${field.label} wajib diisi`);
    shape[field.key] = rule;
  });
  return z.object(shape);
}
