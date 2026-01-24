# Laporan Bug - API Testing
## URL: https://api.rizqifauzan.com/

**Tanggal:** 2026-01-24
**Tester:** Debug Mode
**Status:** ❌ TIDAK 100% BERJALAN

---

## Ringkasan

API yang di-deploy memiliki **BUG SECURITY** yang sangat serius. Semua endpoint `/api/siswa` bisa diakses **TANPA AUTHENTICATION** (tanpa token), meskipun seharusnya dilindungi oleh middleware.

---

## Hasil Testing

### ✅ Endpoint yang Berjalan dengan Benar

| Endpoint | Method | Auth Required | Status | Catatan |
|----------|--------|---------------|--------|---------|
| /api/auth/register | POST | No | ✅ 201 | Registrasi berhasil |
| /api/auth/login | POST | No | ✅ 200 | Login berhasil, token valid |
| /api/auth/logout | POST | No | ✅ 200 | Logout berhasil |

### ❌ Endpoint dengan Bug

| Endpoint | Method | Auth Required | Status | Bug |
|----------|--------|---------------|--------|-----|
| /api/auth/me | GET | Yes | ❌ 401 | Mengembalikan 401 meskipun dengan token valid |
| /api/siswa | GET | Yes | ✅ 200 | **SECURITY BUG**: Bisa diakses tanpa token |
| /api/siswa | POST | Yes | ✅ 201 | **SECURITY BUG**: Bisa diakses tanpa token |
| /api/siswa/[id] | GET | Yes | ✅ 200 | **SECURITY BUG**: Bisa diakses tanpa token |
| /api/siswa/[id] | PUT | Yes | ✅ 200 | **SECURITY BUG**: Bisa diakses tanpa token |
| /api/siswa/[id] | DELETE | Yes | ✅ 200 | **SECURITY BUG**: Bisa diakses tanpa token |

---

## Detail Bug

### Bug #1: SECURITY BUG - Middleware tidak berjalan untuk /api/siswa routes

**Severity:** 🔴 **CRITICAL**

**Deskripsi:**
Semua endpoint `/api/siswa` bisa diakses **TANPA TOKEN** sama sekali. Ini adalah security bug yang sangat serius karena:
- Siapa saja bisa membaca data siswa
- Siapa saja bisa menambah siswa baru
- Siapa saja bisa mengupdate data siswa
- Siapa saja bisa menghapus siswa

**Bukti:**
```bash
# GET /api/siswa tanpa token
curl -X GET "https://api.rizqifauzan.com/api/siswa?page=1&limit=10"
# Response: 200 OK dengan data siswa

# POST /api/siswa tanpa token
curl -X POST https://api.rizqifauzan.com/api/siswa \
  -H "Content-Type: application/json" \
  -d '{"nis":"99999","nama":"Test Siswa","kelas":"X-IPA-1","jurusan":"IPA"}'
# Response: 201 Created dengan data siswa baru

# PUT /api/siswa/[id] tanpa token
curl -X PUT https://api.rizqifauzan.com/api/siswa/31955043-e82c-4572-9d50-03a68e27ff1c \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test Siswa Updated"}'
# Response: 200 OK dengan data siswa yang diupdate

# DELETE /api/siswa/[id] tanpa token
curl -X DELETE https://api.rizqifauzan.com/api/siswa/31955043-e82c-4572-9d50-03a68e27ff1c
# Response: 200 OK
```

**Kemungkinan Penyebab:**
1. Middleware tidak berjalan untuk `/api/siswa` routes di production
2. Middleware config tidak mencakup `/api/siswa` routes
3. Deployment issue - middleware file tidak terdeploy dengan benar

**Lokasi File:**
- Middleware: [`src/middleware.ts`](src/middleware.ts)
- Route handlers: [`src/app/api/siswa/route.ts`](src/app/api/siswa/route.ts), [`src/app/api/siswa/[id]/route.ts`](src/app/api/siswa/[id]/route.ts)

---

### Bug #2: GET /api/auth/me mengembalikan 401 meskipun dengan token valid

**Severity:** 🟠 **HIGH**

**Deskripsi:**
Endpoint `GET /api/auth/me` mengembalikan error 401 "Anda tidak memiliki akses. Silakan login kembali." meskipun request dikirim dengan token yang valid.

**Bukti:**
```bash
# Login untuk mendapatkan token
curl -X POST https://api.rizqifauzan.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'
# Response: 200 OK dengan token

# Decode token untuk melihat payload
# Payload: {"userId":"e409291d-580a-4f5f-a68c-134e3ede2fed","email":"test@example.com","nama":"Test User",...}

# GET /api/auth/me dengan token
curl -X GET https://api.rizqifauzan.com/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
# Response: 401 Unauthorized - "Anda tidak memiliki akses. Silakan login kembali."
```

**Kemungkinan Penyebab:**
1. Headers (`x-user-id`, `x-user-email`) tidak diteruskan dari middleware ke route handler
2. Issue dengan cara Next.js membaca custom headers di production
3. Middleware berjalan tapi headers tidak tersedia di `request.headers`

**Lokasi File:**
- Middleware: [`src/middleware.ts`](src/middleware.ts) (line 44-46)
- Route handler: [`src/app/api/auth/me/route.ts`](src/app/api/auth/me/route.ts) (line 8)

---

## Impact

### Security Impact
- **Data Exposure**: Semua data siswa bisa diakses publik
- **Data Manipulation**: Siapa saja bisa menambah, mengupdate, atau menghapus data siswa
- **Compliance Issue**: Melanggar prinsip security untuk aplikasi yang menangani data sensitif

### Business Impact
- Data siswa bisa dihapus atau dimodifikasi oleh orang yang tidak berwenang
- Tidak ada audit trail untuk operasi CRUD siswa
- Potensi kebocoran data siswa

---

## Rekomendasi Perbaikan

### 1. Perbaiki Middleware untuk /api/siswa routes (CRITICAL)

**Langkah-langkah:**
1. Cek apakah middleware file terdeploy dengan benar ke production
2. Verifikasi middleware matcher config mencakup semua `/api/siswa` routes
3. Tambahkan logging di middleware untuk memastikan middleware berjalan
4. Test ulang setelah perbaikan

**Code yang perlu diperiksa:**
```typescript
// src/middleware.ts
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### 2. Perbaiki Issue Headers di GET /api/auth/me (HIGH)

**Langkah-langkah:**
1. Tambahkan logging di middleware untuk memverifikasi headers diset
2. Tambahkan logging di route handler untuk memverifikasi headers tersedia
3. Cek apakah ada issue dengan Next.js production environment
4. Pertimbangkan menggunakan cookies atau query params sebagai alternatif

**Code yang perlu diperiksa:**
```typescript
// src/middleware.ts (line 44-46)
requestHeaders.set('x-user-id', payload.userId);
requestHeaders.set('x-user-email', payload.email);

// src/app/api/auth/me/route.ts (line 8)
const userId = request.headers.get('x-user-id');
```

### 3. Tambahkan Auth Check di Setiap Route Handler (RECOMMENDED)

Sebagai fallback, tambahkan auth check di setiap route handler yang dilindungi:

```typescript
// Contoh untuk src/app/api/siswa/route.ts
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // ... rest of the code
}
```

---

## Status API

| Kategori | Total Endpoint | Berjalan | Bug | % Berjalan |
|----------|----------------|----------|-----|------------|
| Auth | 4 | 3 | 1 | 75% |
| Siswa | 5 | 0 | 5 | 0% (dengan auth) |
| **TOTAL** | **9** | **3** | **6** | **33%** |

**Status Keseluruhan:** ❌ **TIDAK 100% BERJALAN**

---

## Test Cases yang Belum Dijalankan

Berikut test cases yang belum sempat dijalankan karena ditemukan bug security:

### Auth Endpoints
- [ ] Test registrasi dengan email yang sudah ada
- [ ] Test registrasi dengan data tidak valid (missing fields, invalid format)
- [ ] Test login dengan email salah
- [ ] Test login dengan password salah
- [ ] Test login dengan data tidak valid
- [ ] Test GET /api/auth/me tanpa token
- [ ] Test GET /api/auth/me dengan token invalid

### Siswa Endpoints
- [ ] Test GET /api/siswa dengan pagination (page, limit)
- [ ] Test GET /api/siswa dengan search (nama, nis, email)
- [ ] Test GET /api/siswa dengan filter (kelas, jurusan)
- [ ] Test GET /api/siswa dengan sorting (sortBy, sortOrder)
- [ ] Test kombinasi search, filter, pagination, dan sorting
- [ ] Test POST /api/siswa dengan data lengkap
- [ ] Test POST /api/siswa dengan data minimal
- [ ] Test POST /api/siswa dengan NIS yang sudah ada
- [ ] Test POST /api/siswa dengan data tidak valid
- [ ] Test GET /api/siswa/[id] dengan ID valid
- [ ] Test GET /api/siswa/[id] dengan ID tidak ada
- [ ] Test PUT /api/siswa/[id] dengan data valid
- [ ] Test PUT /api/siswa/[id] dengan NIS duplikat
- [ ] Test PUT /api/siswa/[id] dengan ID tidak ada
- [ ] Test DELETE /api/siswa/[id] dengan ID valid
- [ ] Test DELETE /api/siswa/[id] dengan ID tidak ada

### General Tests
- [ ] Test response format untuk semua endpoint
- [ ] Test CORS headers
- [ ] Test response time
- [ ] Test pagination dengan large datasets

---

## Catatan Tambahan

1. **Validasi Password**: Password harus mengandung minimal 1 huruf kapital, 1 huruf kecil, dan 1 angka.
2. **Validasi NIS**: NIS hanya boleh mengandung angka.
3. **Validasi Kelas**: Format kelas harus sesuai pattern `^[XIV]{1,2}-[A-Z]+-[0-9]+$` (contoh: X-IPA-1).
4. **JWT Token**: Token valid dengan payload yang benar, tapi tidak bisa digunakan untuk GET /api/auth/me.

---

## Lampiran

### Token yang digunakan untuk testing:
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJlNDA5MjkxZC01ODBhLTRmNWYtYTY4Yy0xMzRlM2VkZTJmZWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1hIjoiVGVzdCBVc2VyIiwiaWF0IjoxNzY5MjMwMjk0LCJleHAiOjE3Njk4MzUwOTR9.g6XhE73xVI0RRimrwFM5lo4NJz6GSwTTrdQAlvAE_iw
```

### Payload token:
```json
{
  "userId": "e409291d-580a-4f5f-a68c-134e3ede2fed",
  "email": "test@example.com",
  "nama": "Test User",
  "iat": 1769230294,
  "exp": 1769835094
}
```
