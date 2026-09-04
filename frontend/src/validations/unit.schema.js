import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const unitFormSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(150),
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .max(80)
    .regex(slugPattern, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  themeColor: z.string().max(30).optional().or(z.literal('')),
  templateKey: z.string().max(50).optional().or(z.literal('')),
  logoMediaId: z.union([z.coerce.number().int().positive(), z.literal(''), z.nan()]).optional(),
  coverMediaId: z.union([z.coerce.number().int().positive(), z.literal(''), z.nan()]).optional(),
  address: z.string().optional().or(z.literal('')),
  phone: z.string().max(50).optional().or(z.literal('')),
  fax: z.string().max(50).optional().or(z.literal('')),
  email: z.union([z.string().email('Email tidak valid'), z.literal('')]).optional(),
  facebookUrl: z.union([z.string().url('URL tidak valid'), z.literal('')]).optional(),
  instagramUrl: z.union([z.string().url('URL tidak valid'), z.literal('')]).optional(),
  twitterUrl: z.union([z.string().url('URL tidak valid'), z.literal('')]).optional(),
  youtubeUrl: z.union([z.string().url('URL tidak valid'), z.literal('')]).optional(),
  tiktokUrl: z.union([z.string().url('URL tidak valid'), z.literal('')]).optional(),
  linkedinUrl: z.union([z.string().url('URL tidak valid'), z.literal('')]).optional(),
  description: z.string().optional().or(z.literal('')),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  seoTitle: z.string().max(160).optional().or(z.literal('')),
  seoDescription: z.string().max(300).optional().or(z.literal('')),
  seoKeywords: z.string().max(250).optional().or(z.literal('')),
});
