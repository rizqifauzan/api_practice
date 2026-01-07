import { z } from 'zod';

// Validation Rules untuk Users

export const registerSchema = z.object({
  nama: z.string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  email: z.string()
    .email('Email tidak valid')
    .max(100, 'Email maksimal 100 karakter'),
  password: z.string()
    .min(6, 'Password minimal 6 karakter')
    .max(50, 'Password maksimal 50 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf kapital')
    .regex(/[a-z]/, 'Password harus mengandung minimal 1 huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string()
    .email('Email tidak valid'),
  password: z.string()
    .min(1, 'Password tidak boleh kosong'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Validation Rules untuk Siswa

export const createSiswaSchema = z.object({
  nama: z.string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  nis: z.string()
    .min(5, 'NIS minimal 5 karakter')
    .max(20, 'NIS maksimal 20 karakter')
    .regex(/^[0-9]+$/, 'NIS hanya boleh mengandung angka'),
  kelas: z.string()
    .min(2, 'Kelas minimal 2 karakter')
    .max(10, 'Kelas maksimal 10 karakter')
    .regex(/^[XIV]{1,2}-[A-Z]+-[0-9]+$/, 'Format kelas tidak valid (contoh: X-IPA-1)'),
  jurusan: z.string()
    .min(2, 'Jurusan minimal 2 karakter')
    .max(50, 'Jurusan maksimal 50 karakter'),
  email: z.string()
    .email('Email tidak valid')
    .max(100, 'Email maksimal 100 karakter')
    .optional()
    .or(z.literal('')),
  telepon: z.string()
    .regex(/^(\+62|62|0)[0-9]{9,13}$/, 'Format nomor telepon tidak valid')
    .optional()
    .or(z.literal('')),
  alamat: z.string()
    .max(500, 'Alamat maksimal 500 karakter')
    .optional()
    .or(z.literal('')),
});

export type CreateSiswaInput = z.infer<typeof createSiswaSchema>;

export const updateSiswaSchema = createSiswaSchema.partial();

export type UpdateSiswaInput = z.infer<typeof updateSiswaSchema>;

// Validation Helper Functions

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      if (err.path.length > 0) {
        errors[err.path.join('.')] = err.message;
      } else {
        errors['general'] = err.message;
      }
    });
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}

export function getValidationErrors(error: unknown): Record<string, string> {
  if (error instanceof z.ZodError) {
    const errors: Record<string, string> = {};
    error.errors.forEach((err) => {
      if (err.path.length > 0) {
        errors[err.path.join('.')] = err.message;
      } else {
        errors['general'] = err.message;
      }
    });
    return errors;
  }
  
  return { general: 'Terjadi kesalahan validasi' };
}
