import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(150),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').max(72),
  role: z.enum(['superadmin', 'admin_unit']),
  unitIds: z.array(z.number().int().positive()).default([]),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(150),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').max(72).optional().or(z.literal('')),
  role: z.enum(['superadmin', 'admin_unit']),
  unitIds: z.array(z.number().int().positive()).default([]),
});

export const unitSeoSchema = z.object({
  unitId: z.coerce.number().int().positive().optional(),
  seoTitle: z.string().max(160).optional().or(z.literal('')),
  seoDescription: z.string().max(300).optional().or(z.literal('')),
  seoKeywords: z.string().max(250).optional().or(z.literal('')),
});
