# Development Plan: Web Latihan API Test - Domain Siswa

## 📋 Overview

Membuat aplikasi web untuk latihan API testing dengan fokus pada domain **Siswa**. Aplikasi ini akan memungkinkan pengguna melakukan operasi CRUD (Create, Read, Update, Delete) pada data siswa.

### Tech Stack
- **Frontend**: Next.js (React)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **UI Template**: Shadcn/UI (komponen React yang mudah dipahami dan dikustomisasi)
- **Validation**: Zod (TypeScript-first schema validation)

---

## 🎯 Project Requirements

### Functional Requirements
1. **Authentication**:
   - Register: Membuat akun pengguna baru dengan validasi
   - Login: Masuk ke aplikasi dengan email dan password
   - Logout: Keluar dari aplikasi
2. **Create**: Menambahkan data siswa baru dengan validasi
3. **Read**: Menampilkan daftar semua siswa dan detail siswa tertentu dengan:
   - Pagination untuk menangani data yang banyak
   - Search berdasarkan nama, NIS, atau email
   - Filter berdasarkan kelas dan jurusan
   - Sorting berdasarkan kolom (nama, kelas, jurusan, created_at)
4. **Update**: Mengubah data siswa yang sudah ada dengan validasi
5. **Delete**: Menghapus data siswa dengan konfirmasi
6. **API Documentation**: Dokumentasi API yang lengkap dan interaktif

### Data Siswa
- `id`: Unique identifier (auto-generated)
- `nama`: Nama lengkap siswa
- `nis`: Nomor Induk Siswa (unique)
- `kelas`: Kelas siswa
- `jurusan`: Jurusan siswa
- `email`: Email siswa (optional)
- `telepon`: Nomor telepon (optional)
- `alamat`: Alamat siswa (optional)
- `created_by`: User yang membuat data siswa
- `created_at`: Timestamp pembuatan
- `updated_at`: Timestamp update terakhir

### Data Users
- `id`: Unique identifier (auto-generated)
- `email`: Email pengguna (unique)
- `password`: Password yang di-hash (bcrypt)
- `nama`: Nama lengkap pengguna
- `created_at`: Timestamp pembuatan
- `updated_at`: Timestamp update terakhir

---

## 📅 Development Phases

### Phase 1: Setup & Configuration
- [ ] Inisialisasi project Next.js
- [ ] Setup Shadcn/UI
- [ ] Setup Supabase account dan project
- [ ] Konfigurasi environment variables
- [ ] Setup Tailwind CSS
- [ ] Setup struktur folder project
- [ ] Install dependencies: bcryptjs, jsonwebtoken, jose, zod

### Phase 2: Database Setup
- [ ] Buat table `users` di Supabase
- [ ] Buat table `siswa` di Supabase
- [ ] Definisikan kolom dan tipe data
- [ ] Setup Row Level Security (RLS) policies
- [ ] Buat API key dan connection strings
- [ ] Test koneksi database
- [ ] Buat index untuk kolom: nama, nis, email, kelas, jurusan

### Phase 3: Backend API Development
- [ ] Setup Supabase client
- [ ] Buat helper untuk password hashing (bcrypt)
- [ ] Buat helper untuk JWT token generation & verification
- [ ] Install dan setup Zod untuk validation
- [ ] Buat validation schemas untuk auth (register, login)
- [ ] Buat validation schemas untuk siswa (create, update)
- [ ] Create API endpoint: `POST /api/auth/register` - Register user dengan validation
- [ ] Create API endpoint: `POST /api/auth/login` - Login user dengan validation
- [ ] Create API endpoint: `POST /api/auth/logout` - Logout user
- [ ] Create API endpoint: `GET /api/auth/me` - Get current user
- [ ] Create API endpoint: `GET /api/siswa` - Get all students dengan pagination, search, filter, dan sorting
- [ ] Create API endpoint: `GET /api/siswa/[id]` - Get student by ID
- [ ] Create API endpoint: `POST /api/siswa` - Create new student dengan validation
- [ ] Create API endpoint: `PUT /api/siswa/[id]` - Update student dengan validation
- [ ] Create API endpoint: `DELETE /api/siswa/[id]` - Delete student
- [ ] Add error handling untuk semua endpoints
- [ ] Buat middleware untuk proteksi route

### Phase 4: Frontend Development
- [ ] Install Shadcn/UI components yang diperlukan (Button, Input, Table, Dialog, Card, Toast, Label, Select, Pagination, Badge)
- [ ] Buat layout utama aplikasi
- [ ] Buat Landing page (halaman depan)
- [ ] Buat API Documentation page (halaman dokumentasi API) dengan format lengkap
- [ ] Buat halaman login dengan form dan validation
- [ ] Buat halaman register dengan form dan validation
- [ ] Buat halaman dashboard (List View siswa) dengan Table component
- [ ] Buat Pagination component dengan ellipsis support
- [ ] Buat SearchFilter component dengan debounce dan active filters display
- [ ] Implementasi sorting pada table headers
- [ ] Buat form tambah siswa (Create) dengan Input components dan validation
- [ ] Buat form edit siswa (Update) dengan Input components dan validation
- [ ] Buat modal konfirmasi delete dengan Dialog component
- [ ] Implementasi auth context untuk state management
- [ ] Implementasi loading states dan skeleton loading
- [ ] Implementasi error messages
- [ ] Implementasi success notifications dengan Toast component
- [ ] Implementasi empty state untuk data kosong

### Phase 5: Testing
- [ ] Test Landing page
- [ ] Test API Documentation page (semua sections)
- [ ] Test register dan login flow dengan validasi
- [ ] Test auth middleware
- [ ] Test semua API endpoints dengan berbagai scenarios
- [ ] Test pagination (first, last, next, prev, page numbers)
- [ ] Test search functionality (nama, nis, email)
- [ ] Test filter functionality (kelas, jurusan)
- [ ] Test sorting functionality
- [ ] Test CRUD operations secara manual via GUI
- [ ] Test responsive design
- [ ] Test error scenarios dan validation messages
- [ ] Test debounce pada search input
- [ ] Bug fixing

### Phase 6: Deployment
- [ ] Setup Vercel account
- [ ] Connect repository ke Vercel
- [ ] Configure environment variables di Vercel
- [ ] Deploy ke Vercel
- [ ] Test production deployment
- [ ] Test pagination, search, dan filter di production
- [ ] Setup custom domain (optional)

---

## 🗂️ Project Structure

```
api_practice/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts      # POST - Register user
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts      # POST - Login user
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts      # POST - Logout user
│   │   │   │   └── me/
│   │   │   │       └── route.ts      # GET - Get current user
│   │   │   └── siswa/
│   │   │       ├── route.ts          # GET (all), POST
│   │   │       └── [id]/
│   │   │           └── route.ts      # GET (by id), PUT, DELETE
│   │   ├── page.tsx                  # Landing page (halaman depan)
│   │   ├── api-docs/
│   │   │   └── page.tsx              # API Documentation page
│   │   ├── login/
│   │   │   └── page.tsx              # Halaman login
│   │   ├── register/
│   │   │   └── page.tsx              # Halaman register
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Halaman utama (list siswa) - Protected
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── card.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── accordion.tsx
│   │   │   └── ...
│   │   ├── SiswaForm.tsx             # Form create/update
│   │   ├── SiswaList.tsx             # List siswa dengan table
│   │   ├── SiswaCard.tsx             # Card siswa individual
│   │   ├── DeleteModal.tsx           # Modal konfirmasi delete
│   │   ├── Notification.tsx          # Toast notification
│   │   ├── Pagination.tsx            # Pagination component dengan ellipsis
│   │   ├── SearchFilter.tsx          # Search & Filter component dengan debounce
│   │   ├── ApiDoc/                   # API Documentation components
│   │   │   ├── ApiDocSidebar.tsx     # Navigation sidebar
│   │   │   ├── ApiDocCard.tsx        # Card untuk setiap endpoint
│   │   │   ├── ApiDocTryIt.tsx       # Modal untuk try it
│   │   │   ├── ApiDocCodeBlock.tsx   # Code block dengan copy button
│   │   │   └── ApiDocResponse.tsx    # Response display
│   │   └── Loading/                  # Loading components
│   │       ├── TableSkeleton.tsx      # Skeleton loading untuk table
│   │       └── CardSkeleton.tsx       # Skeleton loading untuk card
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client config
│   │   ├── auth.ts                   # Auth helpers (JWT, password)
│   │   ├── types.ts                  # TypeScript types
│   │   ├── validation.ts             # Zod validation schemas
│   │   └── api-docs-data.ts         # Data untuk API documentation
│   ├── middleware.ts                 # Middleware untuk proteksi route
│   └── utils/
│       └── validation.ts             # Input validation helpers (deprecated, gunakan lib/validation.ts)
├── .env.local                        # Environment variables (local)
├── .env.example                     # Template environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📦 Dependencies

### Production Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/auth-helpers-nextjs": "^0.x",
    "zod": "^3.x",
    "bcryptjs": "^2.x",
    "jose": "^5.x",
    "lucide-react": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  }
}
```

### Development Dependencies

```json
{
  "devDependencies": {
    "@types/node": "^20.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "@types/bcryptjs": "^2.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "eslint": "^8.x",
    "eslint-config-next": "^14.x"
  }
}
```

### Dependencies Explanation

| Package | Purpose | Version |
|---------|----------|----------|
| `next` | React framework untuk frontend dan backend | ^14.x |
| `react` / `react-dom` | React library | ^18.x |
| `@supabase/supabase-js` | Supabase client untuk database | ^2.x |
| `@supabase/auth-helpers-nextjs` | Auth helpers untuk Next.js | ^0.x |
| `zod` | Schema validation library | ^3.x |
| `bcryptjs` | Password hashing | ^2.x |
| `jose` | JWT token generation dan verification | ^5.x |
| `lucide-react` | Icon library untuk UI | ^0.x |
| `clsx` / `tailwind-merge` | Utility untuk Tailwind CSS | ^2.x |

---

## 🔧 Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

---

## 📊 Database Schema

### Table: `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Email pengguna |
| password | VARCHAR(255) | NOT NULL | Password (hashed dengan bcrypt) |
| nama | VARCHAR(100) | NOT NULL | Nama lengkap pengguna |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Timestamp pembuatan |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Timestamp update |

### Table: `siswa`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| nama | VARCHAR(100) | NOT NULL | Nama lengkap siswa |
| nis | VARCHAR(20) | NOT NULL, UNIQUE | Nomor Induk Siswa |
| kelas | VARCHAR(10) | NOT NULL | Kelas siswa (mis: X-IPA-1) |
| jurusan | VARCHAR(50) | NOT NULL | Jurusan siswa |
| email | VARCHAR(100) | NULL | Email siswa |
| telepon | VARCHAR(20) | NULL | Nomor telepon |
| alamat | TEXT | NULL | Alamat lengkap |
| created_by | VARCHAR(100) | NOT NULL | User yang membuat data siswa |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Timestamp pembuatan |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Timestamp update |

### SQL Script untuk Membuat Table

```sql
-- Table users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table siswa
CREATE TABLE siswa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(100) NOT NULL,
    nis VARCHAR(20) NOT NULL UNIQUE,
    kelas VARCHAR(10) NOT NULL,
    jurusan VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    telepon VARCHAR(20),
    alamat TEXT,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable UUID extension jika belum ada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create index untuk pencarian dan filter
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_siswa_nama ON siswa(nama);
CREATE INDEX idx_siswa_nis ON siswa(nis);
CREATE INDEX idx_siswa_kelas ON siswa(kelas);
CREATE INDEX idx_siswa_jurusan ON siswa(jurusan);
CREATE INDEX idx_siswa_email ON siswa(email);

-- Trigger untuk update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_siswa_updated_at BEFORE UPDATE ON siswa
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## ✅ Input Validation Library & Rules

### Validation Library
Aplikasi menggunakan **Zod** sebagai library untuk input validation. Zod dipilih karena:
- Type-safe validation (berintegrasi dengan TypeScript)
- Schema definition yang mudah dibaca
- Error messages yang customizable
- Support untuk complex validations

### Validation Rules untuk Users

#### Register Validation
```typescript
import { z } from 'zod';

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
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
});

export type RegisterInput = z.infer<typeof registerSchema>;
```

#### Login Validation
```typescript
export const loginSchema = z.object({
  email: z.string()
    .email('Email tidak valid'),
  password: z.string()
    .min(1, 'Password tidak boleh kosong')
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### Validation Rules untuk Siswa

#### Create Siswa Validation
```typescript
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
    .or(z.literal(''))
});

export type CreateSiswaInput = z.infer<typeof createSiswaSchema>;
```

#### Update Siswa Validation
```typescript
export const updateSiswaSchema = createSiswaSchema.partial();

export type UpdateSiswaInput = z.infer<typeof updateSiswaSchema>;
```

### Validation Helper Functions

```typescript
// lib/utils/validation.ts
import { z } from 'zod';

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

export function formatZodError(error: z.ZodError): Record<string, string> {
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
```

### Error Response Format untuk Validasi

Semua error validasi akan mengembalikan response dengan format:

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "nama": "Nama minimal 3 karakter",
    "email": "Email tidak valid",
    "password": "Password harus mengandung minimal 1 huruf kapital"
  }
}
```

---

## 📖 API Documentation Format

### Overview
API documentation akan disajikan dalam format yang **lengkap, mudah dimengerti, dan interaktif** menggunakan custom UI dengan Shadcn/UI components. Documentation akan menampilkan semua informasi yang dibutuhkan developer untuk menggunakan API.

### Documentation Structure

#### 1. Halaman API Documentation (`/api-docs`)

Halaman ini dibagi menjadi beberapa bagian:

**Header Section:**
- Judul: "API Documentation"
- Deskripsi singkat tentang API
- Badge status: "Production Ready" / "Development"

**Navigation Sidebar:**
- Quick links ke setiap endpoint
- Grouped by category:
  - 🔐 Authentication
  - 📚 Siswa Management
- Search bar untuk mencari endpoint
- Active state untuk endpoint yang sedang dilihat

**Main Content Area:**
Setiap endpoint ditampilkan dalam card dengan format:

```
┌─────────────────────────────────────────────────────────────┐
│  POST /api/auth/register                                    │
│  [Register User]                                            │
├─────────────────────────────────────────────────────────────┤
│  Description: Membuat akun pengguna baru                    │
│                                                             │
│  🔑 Authentication: None                                   │
│  📦 Content-Type: application/json                         │
├─────────────────────────────────────────────────────────────┤
│  Request Body:                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ {                                                   │   │
│  │   "email": "user@example.com",                      │   │
│  │   "password": "password123",                        │   │
│  │   "nama": "User Name"                               │   │
│  │ }                                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  [📋 Copy] [🧪 Try It]                                      │
├─────────────────────────────────────────────────────────────┤
│  Response: 201 Created                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ {                                                   │   │
│  │   "success": true,                                 │   │
│  │   "message": "Registrasi berhasil",                │   │
│  │   "data": {                                        │   │
│  │     "id": "uuid",                                  │   │
│  │     "email": "user@example.com",                   │   │
│  │     "nama": "User Name",                           │   │
│  │     "created_at": "2024-01-01T00:00:00Z"           │   │
│  │   }                                                 │   │
│  │ }                                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  [📋 Copy]                                                  │
├─────────────────────────────────────────────────────────────┤
│  Error Responses:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 409 Conflict - Email sudah terdaftar                │   │
│  │ 422 Unprocessable Entity - Validasi gagal            │   │
│  └─────────────────────────────────────────────────────┘   │
│  [▼ Show Details]                                           │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Interactive Features

**"Try It" Button:**
- Membuka modal untuk menguji endpoint langsung dari browser
- User dapat mengisi request body
- Menampilkan response secara real-time
- Menampilkan HTTP status code
- Menampilkan response time

**Copy Button:**
- Copy request/response example ke clipboard
- Toast notification: "Copied to clipboard!"

**Expand/Collapse Details:**
- Error responses dapat di-expand untuk melihat detail
- Response schema dapat di-expand untuk melihat field descriptions

#### 3. Code Examples

Setiap endpoint menampilkan code examples dalam multiple formats:

**cURL:**
```bash
curl -X POST https://api.example.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "nama": "User Name"
  }'
```

**JavaScript (Fetch):**
```javascript
const response = await fetch('https://api.example.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    nama: 'User Name'
  })
});

const data = await response.json();
console.log(data);
```

**JavaScript (Axios):**
```javascript
import axios from 'axios';

const response = await axios.post('https://api.example.com/api/auth/register', {
  email: 'user@example.com',
  password: 'password123',
  nama: 'User Name'
});

console.log(response.data);
```

**Python (Requests):**
```python
import requests

response = requests.post('https://api.example.com/api/auth/register', json={
    'email': 'user@example.com',
    'password': 'password123',
    'nama': 'User Name'
})

print(response.json())
```

#### 4. Status Codes Reference

Section khusus yang menjelaskan semua HTTP status codes yang digunakan:

| Code | Status | Description | When to Use |
|------|--------|-------------|-------------|
| 200 | OK | Request berhasil | GET, PUT, DELETE yang berhasil |
| 201 | Created | Resource berhasil dibuat | POST yang berhasil membuat resource baru |
| 204 | No Content | Request berhasil tanpa content | DELETE yang berhasil (opsional) |
| 400 | Bad Request | Request tidak valid | Input yang salah atau tidak lengkap |
| 401 | Unauthorized | User tidak terautentikasi | Token tidak valid atau tidak ada |
| 403 | Forbidden | User tidak memiliki akses | User tidak memiliki permission |
| 404 | Not Found | Resource tidak ditemukan | ID tidak ada di database |
| 409 | Conflict | Conflict dengan resource yang sudah ada | Email/NIS sudah terdaftar |
| 422 | Unprocessable Entity | Validasi gagal | Input tidak memenuhi kriteria |
| 500 | Internal Server Error | Error di server | Error tak terduga di server |

#### 5. Authentication Guide

Section khusus yang menjelaskan cara authentication:

**How to Get Token:**
1. Register user via `POST /api/auth/register`
2. Login via `POST /api/auth/login`
3. Copy `token` dari response

**How to Use Token:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Example:**
```bash
curl -X GET https://api.example.com/api/siswa \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### 6. Data Models

Section yang menjelaskan struktur data:

**User Model:**
```typescript
interface User {
  id: string;           // UUID
  email: string;        // Email pengguna
  nama: string;         // Nama lengkap
  created_at: string;   // ISO 8601 timestamp
  updated_at: string;   // ISO 8601 timestamp
}
```

**Siswa Model:**
```typescript
interface Siswa {
  id: string;           // UUID
  nama: string;         // Nama lengkap
  nis: string;          // Nomor Induk Siswa
  kelas: string;        // Kelas (X-IPA-1)
  jurusan: string;      // Jurusan
  email?: string;       // Email (optional)
  telepon?: string;     // Nomor telepon (optional)
  alamat?: string;      // Alamat (optional)
  created_by: string;    // User yang membuat
  created_at: string;   // ISO 8601 timestamp
  updated_at: string;   // ISO 8601 timestamp
}
```

#### 7. Search & Filter Guide

Section yang menjelaskan cara menggunakan search dan filter:

**Search Parameter:**
```
GET /api/siswa?search=john
```

**Filter Parameters:**
```
GET /api/siswa?kelas=X-IPA-1&jurusan=IPA
```

**Combined Search & Filter:**
```
GET /api/siswa?search=john&kelas=X-IPA-1&jurusan=IPA
```

#### 8. Pagination Guide

Section yang menjelaskan cara menggunakan pagination:

**Basic Pagination:**
```
GET /api/siswa?page=1&limit=10
```

**Response with Pagination:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### 9. Error Handling Guide

Section yang menjelaskan cara menangani error:

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "Error message for field"
  }
}
```

**Common Errors:**
- 401: Token expired → Refresh token or re-login
- 422: Validation error → Check error messages and fix input
- 404: Not found → Check if resource ID is correct
- 500: Server error → Contact support

#### 10. Quick Reference

Section dengan cheat sheet untuk quick reference:

```
🔐 Authentication
POST   /api/auth/register  - Register user
POST   /api/auth/login     - Login user
POST   /api/auth/logout    - Logout user
GET    /api/auth/me        - Get current user

📚 Siswa Management
GET    /api/siswa          - Get all students (with pagination & search)
GET    /api/siswa/:id      - Get student by ID
POST   /api/siswa          - Create new student
PUT    /api/siswa/:id      - Update student
DELETE /api/siswa/:id      - Delete student
```

### Documentation Implementation

**File Structure:**
```
src/
├── app/
│   └── api-docs/
│       └── page.tsx              # API Documentation page
├── components/
│   ├── ApiDoc/
│   │   ├── ApiDocSidebar.tsx    # Navigation sidebar
│   │   ├── ApiDocCard.tsx       # Card untuk setiap endpoint
│   │   ├── ApiDocTryIt.tsx      # Modal untuk try it
│   │   ├── ApiDocCodeBlock.tsx  # Code block with copy button
│   │   └── ApiDocResponse.tsx   # Response display
│   └── ui/
│       ├── tabs.tsx              # Tabs untuk code examples
│       ├── badge.tsx             # Badge untuk status codes
│       └── accordion.tsx         # Accordion untuk expand/collapse
└── lib/
    └── api-docs-data.ts         # Data untuk API documentation
```

**API Documentation Data Structure:**
```typescript
// lib/api-docs-data.ts
export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  category: 'auth' | 'siswa';
  authentication: boolean;
  contentType?: string;
  requestBody?: {
    type: 'object' | 'array';
    properties: Record<string, {
      type: string;
      required: boolean;
      description: string;
      example?: any;
    }>;
    example?: any;
  };
  response: {
    statusCode: number;
    statusText: string;
    example: any;
  };
  errorResponses: Array<{
    statusCode: number;
    statusText: string;
    description: string;
    example?: any;
  }>;
}

export const apiEndpoints: ApiEndpoint[] = [
  // ... endpoint definitions
];
```

---

## 🌐 API Endpoints

### HTTP Status Codes

Aplikasi menggunakan HTTP status codes sesuai standar internasional (RFC 7231) untuk memberikan respon yang konsisten:

| Status Code | Keterangan | Penggunaan |
|-------------|------------|------------|
| 200 OK | Request berhasil | GET, PUT, DELETE yang berhasil |
| 201 Created | Resource berhasil dibuat | POST yang berhasil membuat resource baru |
| 204 No Content | Request berhasil tanpa content | DELETE yang berhasil (opsional) |
| 400 Bad Request | Request tidak valid | Input yang salah atau tidak lengkap |
| 401 Unauthorized | User tidak terautentikasi | Token tidak valid atau tidak ada |
| 403 Forbidden | User tidak memiliki akses | User tidak memiliki permission |
| 404 Not Found | Resource tidak ditemukan | ID tidak ada di database |
| 409 Conflict | Conflict dengan resource yang sudah ada | Email/NIS sudah terdaftar |
| 422 Unprocessable Entity | Validasi gagal | Input tidak memenuhi kriteria |
| 500 Internal Server Error | Error di server | Error tak terduga di server |

### Authentication Endpoints

#### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "nama": "User Name"
}
```
**Response: 201 Created**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "nama": "User Name",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error Response: 409 Conflict**
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

**Error Response: 422 Unprocessable Entity**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": "Email tidak valid",
    "password": "Password minimal 6 karakter"
  }
}
```

#### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response: 200 OK**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "nama": "User Name"
    }
  }
}
```

**Error Response: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

**Error Response: 422 Unprocessable Entity**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": "Email tidak valid",
    "password": "Password tidak boleh kosong"
  }
}
```

#### 3. Logout User
```
POST /api/auth/logout
```
**Headers:**
```
Authorization: Bearer jwt_token_here
```
**Response: 200 OK**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

**Error Response: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Token tidak valid atau expired"
}
```

#### 4. Get Current User
```
GET /api/auth/me
```
**Headers:**
```
Authorization: Bearer jwt_token_here
```
**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "nama": "User Name",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error Response: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Token tidak valid atau expired"
}
```

### Siswa Endpoints

#### 5. Get All Students
```
GET /api/siswa?page=1&limit=10&search=john&kelas=X-IPA-1&jurusan=IPA&sortBy=nama&sortOrder=asc
```
**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Halaman yang ingin diambil |
| `limit` | integer | No | 10 | Jumlah data per halaman (max: 100) |
| `search` | string | No | - | Kata kunci pencarian (mencari di nama, nis, email) |
| `kelas` | string | No | - | Filter berdasarkan kelas (contoh: X-IPA-1) |
| `jurusan` | string | No | - | Filter berdasarkan jurusan (contoh: IPA) |
| `sortBy` | string | No | created_at | Kolom untuk sorting (nama, nis, kelas, jurusan, created_at) |
| `sortOrder` | string | No | desc | Urutan sorting (asc, desc) |

**Examples:**

Get first page with default limit:
```
GET /api/siswa
```

Get page 2 with 20 items per page:
```
GET /api/siswa?page=2&limit=20
```

Search students by name:
```
GET /api/siswa?search=john
```

Filter by class and major:
```
GET /api/siswa?kelas=X-IPA-1&jurusan=IPA
```

Combined search and filter:
```
GET /api/siswa?search=john&kelas=X-IPA-1&jurusan=IPA&page=1&limit=10
```

Sort by name ascending:
```
GET /api/siswa?sortBy=nama&sortOrder=asc
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nama": "John Doe",
      "nis": "12345",
      "kelas": "X-IPA-1",
      "jurusan": "IPA",
      "email": "john@example.com",
      "telepon": "08123456789",
      "alamat": "Jl. Contoh No. 1",
      "created_by": "admin",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Pagination Object:**
| Field | Type | Description |
|-------|------|-------------|
| `page` | integer | Halaman saat ini |
| `limit` | integer | Jumlah data per halaman |
| `total` | integer | Total semua data |
| `totalPages` | integer | Total halaman |
| `hasNext` | boolean | Apakah ada halaman selanjutnya |
| `hasPrev` | boolean | Apakah ada halaman sebelumnya |

**Error Response: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Token tidak valid atau expired"
}
```

#### 6. Get Student by ID
```
GET /api/siswa/[id]
```
**Headers:**
```
Authorization: Bearer jwt_token_here
```
**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nama": "John Doe",
    "nis": "12345",
    "kelas": "X-IPA-1",
    "jurusan": "IPA",
    "email": "john@example.com",
    "telepon": "08123456789",
    "alamat": "Jl. Contoh No. 1",
    "created_by": "admin",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error Response: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Token tidak valid atau expired"
}
```

**Error Response: 404 Not Found**
```json
{
  "success": false,
  "message": "Siswa tidak ditemukan"
}
```

#### 7. Create Student
```
POST /api/siswa
```
**Headers:**
```
Authorization: Bearer jwt_token_here
```
**Content-Type: application/json

{
  "nama": "John Doe",
  "nis": "12345",
  "kelas": "X-IPA-1",
  "jurusan": "IPA",
  "email": "john@example.com",
  "telepon": "08123456789",
  "alamat": "Jl. Contoh No. 1"
}
```
**Response: 201 Created**
```json
{
  "success": true,
  "message": "Siswa berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "nama": "John Doe",
    "nis": "12345",
    "kelas": "X-IPA-1",
    "jurusan": "IPA",
    "email": "john@example.com",
    "telepon": "08123456789",
    "alamat": "Jl. Contoh No. 1",
    "created_by": "admin",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error Response: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Token tidak valid atau expired"
}
```

**Error Response: 409 Conflict**
```json
{
  "success": false,
  "message": "NIS sudah terdaftar"
}
```

**Error Response: 422 Unprocessable Entity**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "nama": "Nama tidak boleh kosong",
    "nis": "NIS tidak valid",
    "kelas": "Kelas tidak boleh kosong"
  }
}
```

#### 8. Update Student
```
PUT /api/siswa/[id]
```
**Headers:**
```
Authorization: Bearer jwt_token_here
```
**Content-Type: application/json

{
  "nama": "John Updated",
  "kelas": "XI-IPA-1"
}
```
**Response: 200 OK**
```json
{
  "success": true,
  "message": "Siswa berhasil diupdate",
  "data": {
    "id": "uuid",
    "nama": "John Updated",
    "nis": "12345",
    "kelas": "XI-IPA-1",
    "jurusan": "IPA",
    "email": "john@example.com",
    "telepon": "08123456789",
    "alamat": "Jl. Contoh No. 1",
    "created_by": "admin",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

**Error Response: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Token tidak valid atau expired"
}
```

**Error Response: 404 Not Found**
```json
{
  "success": false,
  "message": "Siswa tidak ditemukan"
}
```

**Error Response: 409 Conflict**
```json
{
  "success": false,
  "message": "NIS sudah terdaftar"
}
```

**Error Response: 422 Unprocessable Entity**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "nama": "Nama tidak boleh kosong"
  }
}
```

#### 9. Delete Student
```
DELETE /api/siswa/[id]
```
**Headers:**
```
Authorization: Bearer jwt_token_here
```
**Response: 200 OK**
```json
{
  "success": true,
  "message": "Siswa berhasil dihapus"
}
```

**Error Response: 401 Unauthorized**
```json
{
  "success": false,
  "message": "Token tidak valid atau expired"
}
```

**Error Response: 404 Not Found**
```json
{
  "success": false,
  "message": "Siswa tidak ditemukan"
}
```

---

## 🎨 UI/UX Requirements

### Overview
Aplikasi ini menyediakan GUI (Graphical User Interface) yang lengkap untuk melakukan operasi CRUD pada data siswa. User dapat melakukan semua operasi melalui web interface tanpa perlu menggunakan API secara langsung.

### Halaman Publik (Tanpa Login)

#### Landing Page (Halaman Depan)
- Hero section dengan judul aplikasi dan deskripsi singkat
- Fitur-fitur utama aplikasi (CRUD siswa, Authentication, dll)
- Call-to-action (CTA) buttons:
  - "Mulai Sekarang" - Mengarah ke halaman login/register
  - "Lihat Dokumentasi API" - Mengarah ke halaman API Documentation
- Footer dengan informasi aplikasi

#### API Documentation Page
- Header dengan judul "API Documentation"
- Navigasi untuk berpindah antar endpoint:
  - Authentication Endpoints (Register, Login, Logout, Get Current User)
  - Siswa Endpoints (Get All, Get by ID, Create, Update, Delete)
- Dokumentasi lengkap untuk setiap endpoint:
  - HTTP Method (GET, POST, PUT, DELETE)
  - URL endpoint
  - Request Headers (Authorization, Content-Type)
  - Request Body (untuk POST dan PUT)
  - Response Body (success dan error)
  - HTTP Status Codes
- Code examples dalam format JSON
- Copy-to-clipboard button untuk code examples
- Search bar untuk mencari endpoint
- Responsive design untuk mobile dan desktop

### Halaman Autentikasi

#### Login Page
- Header dengan judul aplikasi
- Form login dengan field: Email, Password
- Tombol "Login" (menggunakan Button component dari Shadcn/UI)
- Link ke halaman register
- Error message jika login gagal
- Loading state saat proses login

### Register Page
- Header dengan judul aplikasi
- Form register dengan field: Nama, Email, Password, Konfirmasi Password
- Tombol "Register" (menggunakan Button component dari Shadcn/UI)
- Link ke halaman login
- Error message jika registrasi gagal
- Validasi password dan konfirmasi password
- Loading state saat proses registrasi

### Halaman Dashboard (Protected - Memerlukan Login)

#### Main Page (List View) - READ Operation
- Header dengan judul aplikasi dan nama user yang login
- Tombol "Logout" di header
- Tombol "Tambah Siswa" (menggunakan Button component dari Shadcn/UI)
- Table (menggunakan Table component dari Shadcn/UI) untuk menampilkan siswa
- Kolom: Nama, NIS, Kelas, Jurusan, Email, Telepon, Created By, Actions
- **Search & Filter Section**:
  - Search bar untuk mencari siswa (menggunakan Input component dari Shadcn/UI)
    - Mencari berdasarkan: nama, nis, email
    - Debounce 500ms untuk mengurangi API calls
    - Placeholder: "Cari berdasarkan nama, NIS, atau email..."
    - Clear button untuk reset search
  - Filter dropdown untuk kelas (menggunakan Select component)
    - Opsi: Semua, X-IPA-1, X-IPA-2, X-IPS-1, dll
  - Filter dropdown untuk jurusan (menggunakan Select component)
    - Opsi: Semua, IPA, IPS, Bahasa, dll
  - Tombol "Reset Filter" untuk menghapus semua filter
- **Pagination Section**:
  - Dropdown untuk memilih items per page (5, 10, 20, 50, 100)
  - Tombol navigasi: First, Previous, Next, Last
  - Info halaman: "Menampilkan 1-10 dari 100 data"
  - Page numbers dengan ellipsis untuk banyak halaman
    - Contoh: « 1 2 3 ... 10 »
- **Sorting**:
  - Klik header kolom untuk sort ascending/descending
  - Icon indikator sorting (↑/↓) pada kolom yang disortir
  - Default sort: created_at descending
- Action buttons: Edit, Delete untuk setiap siswa (menggunakan Button component)
- User dapat melihat semua data siswa dalam bentuk tabel yang rapi
- Data diambil secara otomatis dari database saat halaman dimuat
- Loading skeleton saat data sedang dimuat
- Empty state jika tidak ada data yang ditemukan
  - Icon dan pesan: "Tidak ada data siswa yang ditemukan"
  - Tombol "Tambah Siswa" jika ingin menambah data baru

### Form Page (Create/Update) - CREATE & UPDATE Operations
- Form dengan field yang sesuai (menggunakan Input component dari Shadcn/UI)
- Field: Nama, NIS, Kelas, Jurusan, Email, Telepon, Alamat
- Note: Created By akan otomatis diisi dengan user yang sedang login
- Validasi input untuk memastikan data yang diinput valid
- Tombol "Simpan" dan "Batal" (menggunakan Button component)
- Error message jika validasi gagal
- Success notification setelah data berhasil disimpan
- Form akan otomatis redirect ke halaman list setelah berhasil menyimpan

### Delete Confirmation - DELETE Operation
- Modal popup untuk konfirmasi (menggunakan Dialog component dari Shadcn/UI)
- Menampilkan nama siswa yang akan dihapus
- Tombol "Ya, Hapus" dan "Batal" (menggunakan Button component)
- Success notification setelah data berhasil dihapus
- Table akan otomatis refresh setelah data dihapus

### Notifications
- Toast notification untuk success/error (menggunakan Toast component dari Shadcn/UI)
- Auto-dismiss setelah beberapa detik

### Shadcn/UI Components yang digunakan:
- `Button` - Tombol untuk aksi
- `Input` - Input field untuk form
- `Table` - Tabel untuk menampilkan data
- `Dialog` - Modal untuk konfirmasi delete
- `Card` - Card untuk menampilkan informasi
- `Toast` - Notifikasi
- `Label` - Label untuk input fields
- `Select` - Dropdown untuk pilihan (kelas, jurusan)
- `Pagination` - Komponen pagination
- `Badge` - Badge untuk status dan info

---

## 🔍 Pagination & Search Implementation

### Overview
Fitur pagination dan search diimplementasikan untuk meningkatkan performa dan user experience saat menangani data siswa yang banyak.

### Pagination Implementation

#### Backend Implementation

**API Route: `GET /api/siswa`**

```typescript
// app/api/siswa/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const kelas = searchParams.get('kelas') || '';
  const jurusan = searchParams.get('jurusan') || '';
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  // Validate limit
  const validLimit = Math.min(Math.max(limit, 1), 100);
  
  // Calculate offset
  const offset = (page - 1) * validLimit;

  // Build query
  let query = supabase
    .from('siswa')
    .select('*', { count: 'exact' });

  // Apply search filter
  if (search) {
    query = query.or(`nama.ilike.%${search}%,nis.ilike.%${search}%,email.ilike.%${search}%`);
  }

  // Apply class filter
  if (kelas) {
    query = query.eq('kelas', kelas);
  }

  // Apply major filter
  if (jurusan) {
    query = query.eq('jurusan', jurusan);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + validLimit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data siswa' },
      { status: 500 }
    );
  }

  // Calculate pagination info
  const totalPages = Math.ceil((count || 0) / validLimit);

  return NextResponse.json({
    success: true,
    data: data || [],
    pagination: {
      page,
      limit: validLimit,
      total: count || 0,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
}
```

#### Frontend Implementation

**Pagination Component:**

```typescript
// components/Pagination.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange
}: PaginationProps) {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Tampilkan:</span>
        <Select
          value={limit.toString()}
          onValueChange={(value) => onLimitChange(parseInt(value))}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Page info */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {startItem}-{endItem} dari {total} data
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </Button>

        {getPageNumbers().map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className="w-9"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </Button>
      </div>
    </div>
  );
}
```

### Search Implementation

#### Backend Implementation

Search sudah diimplementasikan dalam API route di atas menggunakan operator `ilike` untuk case-insensitive search.

#### Frontend Implementation

**Search Component with Debounce:**

```typescript
// components/SearchFilter.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Search } from 'lucide-react';

interface SearchFilterProps {
  search: string;
  kelas: string;
  jurusan: string;
  onSearchChange: (search: string) => void;
  onKelasChange: (kelas: string) => void;
  onJurusanChange: (jurusan: string) => void;
  onReset: () => void;
  kelasOptions: string[];
  jurusanOptions: string[];
}

export function SearchFilter({
  search,
  kelas,
  jurusan,
  onSearchChange,
  onKelasChange,
  onJurusanChange,
  onReset,
  kelasOptions,
  jurusanOptions
}: SearchFilterProps) {
  const [searchInput, setSearchInput] = useState(search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  // Update input when search prop changes (e.g., from reset)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const hasActiveFilters = search || kelas || jurusan;

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama, NIS, atau email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Class Filter */}
        <Select value={kelas} onValueChange={onKelasChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Kelas</SelectItem>
            {kelasOptions.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Major Filter */}
        <Select value={jurusan} onValueChange={onJurusanChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter Jurusan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Jurusan</SelectItem>
            {jurusanOptions.map((j) => (
              <SelectItem key={j} value={j}>
                {j}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={onReset}>
            <X className="mr-2 h-4 w-4" />
            Reset Filter
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>Search: "{search}"</span>
              <button
                onClick={() => setSearchInput('')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {kelas && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>Kelas: {kelas}</span>
              <button
                onClick={() => onKelasChange('')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {jurusan && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>Jurusan: {jurusan}</span>
              <button
                onClick={() => onJurusanChange('')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Dashboard Page Integration

**Dashboard Page Component:**

```typescript
// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { SiswaList } from '@/components/SiswaList';
import { Pagination } from '@/components/Pagination';
import { SearchFilter } from '@/components/SearchFilter';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Siswa {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  email?: string;
  telepon?: string;
  alamat?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function DashboardPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Filter states
  const [search, setSearch] = useState('');
  const [kelas, setKelas] = useState('');
  const [jurusan, setJurusan] = useState('');

  // Fetch siswa data
  const fetchSiswa = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(kelas && { kelas }),
        ...(jurusan && { jurusan })
      });

      const response = await fetch(`/api/siswa?${params}`);
      const data = await response.json();

      if (data.success) {
        setSiswa(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching siswa:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiswa();
  }, [pagination.page, pagination.limit, search, kelas, jurusan]);

  const handleResetFilters = () => {
    setSearch('');
    setKelas('');
    setJurusan('');
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Siswa</h1>
          <p className="text-muted-foreground">Kelola data siswa</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Siswa
        </Button>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        search={search}
        kelas={kelas}
        jurusan={jurusan}
        onSearchChange={setSearch}
        onKelasChange={setKelas}
        onJurusanChange={setJurusan}
        onReset={handleResetFilters}
        kelasOptions={['X-IPA-1', 'X-IPA-2', 'X-IPS-1', 'X-IPS-2', 'XI-IPA-1', 'XI-IPA-2', 'XI-IPS-1', 'XI-IPS-2']}
        jurusanOptions={['IPA', 'IPS', 'Bahasa']}
      />

      {/* Table */}
      <SiswaList siswa={siswa} loading={loading} onRefresh={fetchSiswa} />

      {/* Pagination */}
      {!loading && siswa.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
        />
      )}
    </div>
  );
}
```

### Performance Considerations

1. **Debounce Search**: 500ms delay untuk mengurangi API calls
2. **Database Indexing**: Index pada kolom `nama`, `nis`, `email`, `kelas`, `jurusan`
3. **Limit Max Records**: Maximum 100 records per page
4. **Optimized Query**: Single query dengan count untuk pagination
5. **Caching**: Consider menggunakan React Query atau SWR untuk caching data

### UX Best Practices

1. **Loading States**: Skeleton loading saat data dimuat
2. **Empty States**: Pesan yang jelas saat tidak ada data
3. **Error Handling**: Toast notification untuk error
4. **Responsive Design**: Mobile-friendly untuk search dan pagination
5. **Keyboard Navigation**: Support keyboard untuk pagination controls

---

## 🧭 Routing & Navigation

### Public Routes (Tanpa Login)
| Route | Page | Deskripsi |
|-------|-------|-----------|
| `/` | Landing Page | Halaman depan dengan informasi aplikasi |
| `/api-docs` | API Documentation | Dokumentasi lengkap API endpoints |
| `/login` | Login Page | Form login untuk masuk ke aplikasi |
| `/register` | Register Page | Form registrasi untuk membuat akun baru |

### Protected Routes (Memerlukan Login)
| Route | Page | Deskripsi |
|-------|-------|-----------|
| `/dashboard` | Dashboard | Halaman utama dengan list siswa (CRUD operations) |

### Navigation Flow
1. **User Belum Login**:
   - Dapat mengakses: `/`, `/api-docs`, `/login`, `/register`
   - Jika mencoba mengakses `/dashboard`, akan diarahkan ke `/login`

2. **User Sudah Login**:
   - Dapat mengakses: `/`, `/api-docs`, `/dashboard`
   - Jika mengakses `/login` atau `/register`, akan diarahkan ke `/dashboard`
   - Logout akan menghapus token dan mengarahkan ke `/login`

3. **Navigation Components**:
   - Navbar (Header) dengan:
     - Logo/nama aplikasi
     - Menu: Home, API Docs
     - Tombol Login (jika belum login)
     - Tombol Logout (jika sudah login)
     - Nama user (jika sudah login)

## 🔐 Authentication Flow

1. **Register Flow**:
   - User mengisi form register (nama, email, password)
   - Password di-hash menggunakan bcrypt
   - Data user disimpan ke database
   - User diarahkan ke halaman login

2. **Login Flow**:
   - User mengisi form login (email, password)
   - Password di-verifikasi dengan hash di database
   - Jika valid, JWT token dibuat
   - Token disimpan di localStorage/cookie
   - User diarahkan ke halaman dashboard

3. **Protected Route**:
   - Setiap request ke API siswa harus menyertakan JWT token
   - Middleware memverifikasi token
   - Jika token valid, request dilanjutkan
   - Jika token invalid/expired, user diarahkan ke login

4. **Logout Flow**:
   - Token dihapus dari localStorage/cookie
   - User diarahkan ke halaman login

## 🚀 Deployment Steps

### 1. Vercel Setup
1. Login ke [Vercel](https://vercel.com)
2. Connect GitHub repository
3. Import project

### 2. Environment Variables di Vercel
1. Masuk ke project settings
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`

### 3. Deploy
1. Trigger deployment
2. Tunggu proses build selesai
3. Test production URL

---

## 📝 Notes

### Best Practices
- Gunakan TypeScript untuk type safety
- Implement error handling yang baik
- Validasi input di client dan server menggunakan Zod
- Gunakan environment variables untuk sensitive data
- Follow Next.js best practices
- Responsive design untuk mobile dan desktop
- **Validation Best Practices**:
  - Gunakan Zod schema untuk type-safe validation
  - Validasi input di kedua sisi (client dan server)
  - Tampilkan error messages yang jelas dan spesifik
  - Gunakan regex patterns untuk format yang spesifik (email, telepon, dll)
  - Implementasi password complexity requirements
- **Pagination Best Practices**:
  - Gunakan limit maksimal untuk mencegah overload server (max: 100)
  - Implementasi database index untuk kolom yang sering dicari
  - Gunakan debounce untuk search input (500ms)
  - Tampilkan info pagination yang jelas (page, total, items per page)
  - Implementasi ellipsis untuk banyak halaman
- **Search & Filter Best Practices**:
  - Gunakan case-insensitive search (ilike)
  - Implementasi active filter badges untuk UX yang baik
  - Berikan opsi reset filter
  - Filter berdasarkan kolom yang relevan saja
  - Implementasi sorting dengan indikator visual

### Future Enhancements
- [ ] Export data ke Excel/CSV
- [ ] Bulk delete
- [ ] Activity log
- [ ] Data visualization/statistik
- [ ] Role-based access control (admin/user)
- [ ] Email verification (opsional)
- [ ] Forgot password functionality
- [ ] Advanced search dengan multiple criteria
- [ ] Data import dari Excel/CSV
- [ ] Photo upload untuk siswa
- [ ] Dark mode support
- [ ] Mobile app / PWA

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com)
