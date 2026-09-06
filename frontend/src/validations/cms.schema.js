import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const optionalUnitId = z.preprocess((val) => {
  if (val === '' || val === undefined || val === null || Number.isNaN(val)) return null;
  return Number(val);
}, z.number().int().positive().nullable());

export const pageFormSchema = z.object({
  unitId: optionalUnitId,
  title: z.string().min(1, 'Judul wajib diisi').max(200),
  slug: z.string().min(1, 'Slug wajib diisi').max(80).regex(slugPattern, 'Slug tidak valid'),
  content: z.string().optional().default(''),
  status: z.enum(['draft', 'published']),
  metaTitle: z.string().max(160).optional().or(z.literal('')),
  metaDescription: z.string().max(300).optional().or(z.literal('')),
  metaKeywords: z.string().max(250).optional().or(z.literal('')),
});

export const postFormSchema = z.object({
  unitId: optionalUnitId,
  categoryId: z.union([z.coerce.number().int().positive(), z.literal(''), z.nan()]).optional(),
  title: z.string().min(1, 'Judul wajib diisi').max(200),
  slug: z.string().min(1, 'Slug wajib diisi').max(80).regex(slugPattern, 'Slug tidak valid'),
  excerpt: z.string().optional().default(''),
  content: z.string().optional().default(''),
  status: z.enum(['draft', 'published']),
  isFeatured: z.boolean(),
  coverMediaId: z.union([z.coerce.number().int().positive(), z.literal(''), z.nan()]).optional(),
  metaTitle: z.string().max(160).optional().or(z.literal('')),
  metaDescription: z.string().max(300).optional().or(z.literal('')),
  metaKeywords: z.string().max(250).optional().or(z.literal('')),
});

export const categoryFormSchema = z.object({
  unitId: optionalUnitId,
  name: z.string().min(1, 'Nama wajib diisi').max(120),
  slug: z.string().min(1, 'Slug wajib diisi').max(80).regex(slugPattern, 'Slug tidak valid'),
});

export const menuFormSchema = z.object({
  unitId: optionalUnitId,
  parentId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
  label: z.string().min(1, 'Label wajib diisi').max(120),
  type: z.enum(['page', 'post_category', 'external_url', 'archive', 'dynamic_content']),
  targetPageId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
  targetCategoryId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
  targetContentTypeId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
  externalUrl: z.string().max(500).optional().or(z.literal('')),
  location: z.enum(['header', 'footer']),
  order: z.coerce.number().int().min(0).optional(),
});

export const organizationFormSchema = z.object({
  unitId: optionalUnitId,
  name: z.string().min(1, 'Nama wajib diisi').max(150),
  title: z.string().min(1, 'Jabatan wajib diisi').max(150),
  photoMediaId: z.union([z.coerce.number().int().positive(), z.literal(''), z.nan()]).optional(),
  parentId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
  order: z.coerce.number().int().min(0).optional(),
});

export const landingFormSchema = z.object({
  unitId: optionalUnitId,
  eyebrow: z.string().max(120).optional().or(z.literal('')),
  heroTitle: z.string().max(200).optional().or(z.literal('')),
  heroSubtitle: z.string().max(500).optional().or(z.literal('')),
  ctaLabel: z.string().max(80).optional().or(z.literal('')),
  ctaUrl: z.string().max(500).optional().or(z.literal('')),
  introTitle: z.string().max(200).optional().or(z.literal('')),
  introBody: z.string().optional().or(z.literal('')),
  newsTitle: z.string().max(200).optional().or(z.literal('')),
  announcementsTitle: z.string().max(200).optional().or(z.literal('')),
  agendaTitle: z.string().max(200).optional().or(z.literal('')),
  servicesTitle: z.string().max(200).optional().or(z.literal('')),
  galleryTitle: z.string().max(200).optional().or(z.literal('')),
  gallerySubtitle: z.string().max(500).optional().or(z.literal('')),
  unitsTitle: z.string().max(200).optional().or(z.literal('')),
  contactTitle: z.string().max(200).optional().or(z.literal('')),
  contactBody: z.string().optional().or(z.literal('')),
  showNews: z.boolean(),
  showAgenda: z.boolean(),
  showServices: z.boolean(),
  showUnits: z.boolean(),
  showGallery: z.boolean(),
});

export const agendaFormSchema = z.object({
  unitId: optionalUnitId,
  title: z.string().min(1, 'Judul wajib diisi').max(200),
  slug: z.string().min(1, 'Slug wajib diisi').max(80).regex(slugPattern, 'Slug tidak valid'),
  startsAt: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endsAt: z.string().optional().or(z.literal('')),
  timeText: z.string().max(80).optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
});
