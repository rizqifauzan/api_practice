# API Practice - Siswa Management

Aplikasi web untuk latihan API testing dengan fokus pada domain **Siswa**. Aplikasi ini memungkinkan pengguna melakukan operasi CRUD (Create, Read, Update, Delete) pada data siswa.

## Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **UI Template**: Shadcn/UI
- **Validation**: Zod
- **Authentication**: JWT + bcrypt

## Features

- **Authentication**: Register, Login, Logout dengan JWT token
- **CRUD Operations**: Create, Read, Update, Delete data siswa
- **Pagination**: Menangani data yang banyak dengan pagination
- **Search**: Cari berdasarkan nama, NIS, atau email
- **Filter**: Filter berdasarkan kelas dan jurusan
- **Sorting**: Sort berdasarkan kolom (nama, kelas, jurusan, created_at)
- **Input Validation**: Validasi input dengan Zod
- **API Documentation**: Dokumentasi API yang lengkap dan interaktif

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- Akun Supabase

### Installation

1. Clone repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` dan isi dengan:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```

5. Setup database di Supabase:
   - Buat project baru di Supabase
   - Jalankan SQL berikut di SQL Editor Supabase:

   ```sql
   -- Enable UUID extension
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

   -- Create index untuk pencarian dan filter
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_siswa_nama ON siswa(nama);
   CREATE INDEX idx_siswa_nis ON siswa(nis);
   CREATE INDEX idx_siswa_kelas ON siswa(kelas);
   CREATE INDEX idx_siswa_jurusan ON siswa(jurusan);
   CREATE INDEX idx_siswa_email ON siswa(email);

   -- Trigger untuk update updated_at
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
       NEW.updated_at = NOW();
       RETURN NEW;
   END;
   $$ language 'plpgsql';

   CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

   CREATE TRIGGER update_siswa_updated_at BEFORE UPDATE ON siswa
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
   ```

6. Jalankan development server:
   ```bash
   npm run dev
   ```

7. Buka browser dan akses `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|---------|-----------|-------------|---------------|
| POST | `/api/auth/register` | Register user baru | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Siswa Management

| Method | Endpoint | Description | Auth Required |
|---------|-----------|-------------|---------------|
| GET | `/api/siswa` | Get all students | Yes |
| GET | `/api/siswa/[id]` | Get student by ID | Yes |
| POST | `/api/siswa` | Create new student | Yes |
| PUT | `/api/siswa/[id]` | Update student | Yes |
| DELETE | `/api/siswa/[id]` | Delete student | Yes |

Untuk dokumentasi lengkap, buka halaman `/api-docs` setelah menjalankan aplikasi.

## Validation Rules

### User Registration

- **nama**: 3-100 karakter, hanya huruf dan spasi
- **email**: Email yang valid, maksimal 100 karakter
- **password**: 6-50 karakter, minimal 1 huruf kapital, 1 huruf kecil, 1 angka

### Siswa Data

- **nama**: 3-100 karakter, hanya huruf dan spasi
- **nis**: 5-20 karakter, hanya angka
- **kelas**: 2-10 karakter, format `X-IPA-1`
- **jurusan**: 2-50 karakter
- **email**: Email yang valid (opsional)
- **telepon**: Format `+62...`, `62...`, atau `0...` (opsional)
- **alamat**: Maksimal 500 karakter (opsional)

## Project Structure

```
api_practice/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── me/route.ts
│   │   │   └── siswa/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── page.tsx
│   │   ├── api-docs/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── table.tsx
│   │       ├── badge.tsx
│   │       ├── select.tsx
│   │       ├── toast.tsx
│   │       ├── use-toast.ts
│   │       ├── toaster.tsx
│   │       ├── tabs.tsx
│   │       └── accordion.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   ├── types.ts
│   │   ├── validation.ts
│   │   ├── api-docs-data.ts
│   │   └── utils.ts
│   └── middleware.ts
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── README.md
```

## Deployment

### Vercel

1. Push code ke GitHub
2. Connect repository ke Vercel
3. Configure environment variables di Vercel
4. Deploy

## License

MIT
