// User Types
export interface User {
  id: string;
  email: string;
  nama: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  nama: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Siswa Types
export interface Siswa {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  email: string | null;
  telepon: string | null;
  alamat: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSiswaInput {
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  email?: string;
  telepon?: string;
  alamat?: string;
}

export interface UpdateSiswaInput {
  nama?: string;
  nis?: string;
  kelas?: string;
  jurusan?: string;
  email?: string;
  telepon?: string;
  alamat?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  kelas?: string;
  jurusan?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface JWTPayload {
  userId: string;
  email: string;
  nama: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
