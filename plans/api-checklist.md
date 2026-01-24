# Checklist Pengecekan API - https://api.rizqifauzan.com/

## Ringkasan Endpoint API

### Auth Endpoints (Public & Protected)
| Method | Endpoint | Auth Required | Deskripsi |
|--------|----------|---------------|-----------|
| POST | `/api/auth/register` | No | Registrasi user baru |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/logout` | No | Logout user |
| GET | `/api/auth/me` | Yes | Get current user data |

### Siswa Endpoints (Protected)
| Method | Endpoint | Auth Required | Deskripsi |
|--------|----------|---------------|-----------|
| GET | `/api/siswa` | Yes | Get all siswa dengan pagination, search, filter, sorting |
| POST | `/api/siswa` | Yes | Create siswa baru |
| GET | `/api/siswa/[id]` | Yes | Get siswa by ID |
| PUT | `/api/siswa/[id]` | Yes | Update siswa |
| DELETE | `/api/siswa/[id]` | Yes | Delete siswa |

---

## Checklist Pengecekan Detail

### 1. Auth Endpoints

#### 1.1 POST /api/auth/register
- [ ] Test registrasi dengan data valid
  - Body: `{ "nama": "string", "email": "string", "password": "string" }`
  - Expected: Status 201, return user data tanpa password
- [ ] Test registrasi dengan email yang sudah ada
  - Expected: Status 409, error message "Email sudah terdaftar"
- [ ] Test registrasi dengan data tidak valid
  - Missing fields
  - Invalid email format
  - Password terlalu pendek
  - Expected: Status 400, validation error

#### 1.2 POST /api/auth/login
- [ ] Test login dengan credential valid
  - Body: `{ "email": "string", "password": "string" }`
  - Expected: Status 200, return user data dan token
- [ ] Test login dengan email salah
  - Expected: Status 401, error message "Email atau password salah"
- [ ] Test login dengan password salah
  - Expected: Status 401, error message "Email atau password salah"
- [ ] Test login dengan data tidak valid
  - Missing fields
  - Invalid email format
  - Expected: Status 400, validation error

#### 1.3 GET /api/auth/me
- [ ] Test get current user dengan token valid
  - Header: `Authorization: Bearer <token>`
  - Expected: Status 200, return user data
- [ ] Test get current user tanpa token
  - Expected: Status 401, error message "Unauthorized"
- [ ] Test get current user dengan token invalid
  - Expected: Status 401, error message "Unauthorized"

#### 1.4 POST /api/auth/logout
- [ ] Test logout
  - Expected: Status 200, success message

---

### 2. Siswa Endpoints

#### 2.1 GET /api/siswa
- [ ] Test get all siswa tanpa parameter
  - Expected: Status 200, return data array dengan pagination info
- [ ] Test pagination dengan parameter page dan limit
  - Query: `?page=1&limit=10`
  - Expected: Status 200, data sesuai limit
- [ ] Test search by nama
  - Query: `?search=nama`
  - Expected: Status 200, data yang mengandung keyword
- [ ] Test search by nis
  - Query: `?search=nis`
  - Expected: Status 200, data dengan NIS yang cocok
- [ ] Test search by email
  - Query: `?search=email`
  - Expected: Status 200, data dengan email yang cocok
- [ ] Test filter by kelas
  - Query: `?kelas=X`
  - Expected: Status 200, data siswa di kelas tersebut
- [ ] Test filter by jurusan
  - Query: `?jurusan=RPL`
  - Expected: Status 200, data siswa di jurusan tersebut
- [ ] Test sorting
  - Query: `?sortBy=nama&sortOrder=asc`
  - Expected: Status 200, data terurut sesuai parameter
- [ ] Test kombinasi search, filter, pagination, dan sorting
  - Query: `?search=test&kelas=X&jurusan=RPL&page=1&limit=5&sortBy=nama&sortOrder=asc`
  - Expected: Status 200, data sesuai semua filter
- [ ] Test tanpa token (unauthorized)
  - Expected: Status 401, error message "Unauthorized"
- [ ] Test dengan token invalid
  - Expected: Status 401, error message "Unauthorized"

#### 2.2 POST /api/siswa
- [ ] Test create siswa dengan data lengkap valid
  - Body: `{ "nis": "string", "nama": "string", "kelas": "string", "jurusan": "string", "email": "string", "telepon": "string", "alamat": "string" }`
  - Header: `Authorization: Bearer <token>`
  - Expected: Status 201, return siswa data
- [ ] Test create siswa dengan data minimal (required fields only)
  - Body: `{ "nis": "string", "nama": "string", "kelas": "string", "jurusan": "string" }`
  - Expected: Status 201, return siswa data
- [ ] Test create siswa dengan NIS yang sudah ada
  - Expected: Status 409, error message "NIS sudah terdaftar"
- [ ] Test create siswa dengan data tidak valid
  - Missing required fields
  - Invalid data types
  - Expected: Status 400, validation error
- [ ] Test create siswa tanpa token
  - Expected: Status 401, error message "Unauthorized"

#### 2.3 GET /api/siswa/[id]
- [ ] Test get siswa by ID yang valid
  - Header: `Authorization: Bearer <token>`
  - Expected: Status 200, return siswa data
- [ ] Test get siswa dengan ID yang tidak ada
  - Expected: Status 404, error message "Siswa tidak ditemukan"
- [ ] Test get siswa tanpa token
  - Expected: Status 401, error message "Unauthorized"

#### 2.4 PUT /api/siswa/[id]
- [ ] Test update siswa dengan data valid
  - Body: `{ "nama": "string", "kelas": "string", "jurusan": "string", ... }`
  - Header: `Authorization: Bearer <token>`
  - Expected: Status 200, return updated siswa data
- [ ] Test update siswa dengan NIS yang sudah dimiliki siswa lain
  - Expected: Status 409, error message "NIS sudah terdaftar"
- [ ] Test update siswa dengan ID yang tidak ada
  - Expected: Status 404, error message "Siswa tidak ditemukan"
- [ ] Test update siswa dengan data tidak valid
  - Invalid data types
  - Expected: Status 400, validation error
- [ ] Test update siswa tanpa token
  - Expected: Status 401, error message "Unauthorized"

#### 2.5 DELETE /api/siswa/[id]
- [ ] Test delete siswa dengan ID yang valid
  - Header: `Authorization: Bearer <token>`
  - Expected: Status 200, success message
- [ ] Test delete siswa dengan ID yang tidak ada
  - Expected: Status 404, error message "Siswa tidak ditemukan"
- [ ] Test delete siswa tanpa token
  - Expected: Status 401, error message "Unauthorized"

---

### 3. General Tests

#### 3.1 Response Format
- [ ] Semua response menggunakan format standar `{ success: boolean, data?: any, error?: string, message?: string }`
- [ ] Status code HTTP sesuai dengan hasil operasi
  - 200: Success
  - 201: Created
  - 400: Bad Request (validation error)
  - 401: Unauthorized
  - 404: Not Found
  - 409: Conflict (duplicate data)
  - 500: Internal Server Error

#### 3.2 CORS
- [ ] Test CORS headers untuk cross-origin requests
  - Expected: Headers CORS tersedia

#### 3.3 Performance
- [ ] Response time reasonable (< 1 detik untuk simple query)
- [ ] Pagination works correctly with large datasets

---

## Format Response API

### Success Response
```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## Catatan
- Semua endpoint kecuali `/api/auth/register`, `/api/auth/login`, dan `/api/auth/logout` memerlukan authentication
- Token harus dikirim via header `Authorization: Bearer <token>`
- Middleware akan memvalidasi token dan menambahkan user info ke headers (`x-user-id`, `x-user-email`)
