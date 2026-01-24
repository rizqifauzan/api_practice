# Checklist Pengecekan API - https://api.rizqifauzan.com/

## Petunjuk Penggunaan
- [x] = Sudah diuji dan berhasil
- [ ] = Belum diuji
- [-] = Sedang diuji
- [!] = Gagal/Error

---

## 1. AUTH ENDPOINTS

### 1.1 POST /api/auth/register - Registrasi User Baru

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | Registrasi dengan data valid | [ ] | Body: `{ "nama": "Test User", "email": "test@example.com", "password": "password123" }` |
| 2 | Registrasi dengan email yang sudah ada | [ ] | Expected: 409 Conflict |
| 3 | Registrasi tanpa field nama | [ ] | Expected: 400 Bad Request |
| 4 | Registrasi tanpa field email | [ ] | Expected: 400 Bad Request |
| 5 | Registrasi tanpa field password | [ ] | Expected: 400 Bad Request |
| 6 | Registrasi dengan email format invalid | [ ] | Expected: 400 Bad Request |
| 7 | Registrasi dengan password terlalu pendek | [ ] | Expected: 400 Bad Request |

### 1.2 POST /api/auth/login - Login User

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | Login dengan credential valid | [ ] | Expected: 200 OK dengan token |
| 2 | Login dengan email salah | [ ] | Expected: 401 Unauthorized |
| 3 | Login dengan password salah | [ ] | Expected: 401 Unauthorized |
| 4 | Login tanpa field email | [ ] | Expected: 400 Bad Request |
| 5 | Login tanpa field password | [ ] | Expected: 400 Bad Request |
| 6 | Login dengan email format invalid | [ ] | Expected: 400 Bad Request |

### 1.3 GET /api/auth/me - Get Current User

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | Get current user dengan token valid | [ ] | Header: `Authorization: Bearer <token>` |
| 2 | Get current user tanpa token | [ ] | Expected: 401 Unauthorized |
| 3 | Get current user dengan token invalid | [ ] | Expected: 401 Unauthorized |

### 1.4 POST /api/auth/logout - Logout

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | Logout berhasil | [ ] | Expected: 200 OK |

---

## 2. SISWA ENDPOINTS

### 2.1 GET /api/siswa - Get All Siswa

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | Get all siswa tanpa parameter | [ ] | Expected: 200 OK dengan pagination |
| 2 | Pagination page=1, limit=10 | [ ] | Expected: data sesuai limit |
| 3 | Pagination page=2, limit=5 | [ ] | Expected: data sesuai limit |
| 4 | Search by nama | [ ] | Query: `?search=nama` |
| 5 | Search by nis | [ ] | Query: `?search=nis` |
| 6 | Search by email | [ ] | Query: `?search=email` |
| 7 | Filter by kelas | [ ] | Query: `?kelas=X` |
| 8 | Filter by jurusan | [ ] | Query: `?jurusan=RPL` |
| 9 | Sort by nama asc | [ ] | Query: `?sortBy=nama&sortOrder=asc` |
| 10 | Sort by nama desc | [ ] | Query: `?sortBy=nama&sortOrder=desc` |
| 11 | Kombinasi search + filter + pagination + sort | [ ] | Query lengkap |
| 12 | Get siswa tanpa token | [ ] | Expected: 401 Unauthorized |
| 13 | Get siswa dengan token invalid | [ ] | Expected: 401 Unauthorized |

### 2.2 POST /api/siswa - Create Siswa Baru

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | Create siswa dengan data lengkap valid | [ ] | Expected: 201 Created |
| 2 | Create siswa dengan data minimal (required only) | [ ] | Expected: 201 Created |
| 3 | Create siswa dengan NIS yang sudah ada | [ ] | Expected: 409 Conflict |
| 4 | Create siswa tanpa field nis | [ ] | Expected: 400 Bad Request |
| 5 | Create siswa tanpa field nama | [ ] | Expected: 400 Bad Request |
| 6 | Create siswa tanpa field kelas | [ ] | Expected: 400 Bad Request |
| 7 | Create siswa tanpa field jurusan | [ ] | Expected: 400 Bad Request |
| 8 | Create siswa tanpa token | [ ] | Expected: 401 Unauthorized |

### 2.3 GET /api/siswa/[id] - Get Siswa by ID

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | Get siswa dengan ID valid | [ ] | Expected: 200 OK |
| 2 | Get siswa dengan ID tidak ada | [ ] | Expected: 404 Not Found |
| 3 | Get siswa tanpa token | [ ] | Expected: 401 Unauthorized |
| 4 | Get siswa dengan token invalid | [ ] | Expected: 401 Unauthorized |

### 2.4 PUT /api/siswa/[id] - Update Siswa

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | Update siswa dengan data valid | [ ] | Expected: 200 OK |
| 2 | Update nama siswa | [ ] | Expected: 200 OK |
| 3 | Update kelas siswa | [ ] | Expected: 200 OK |
| 4 | Update jurusan siswa | [ ] | Expected: 200 OK |
| 5 | Update dengan NIS yang sudah dimiliki siswa lain | [ ] | Expected: 409 Conflict |
| 6 | Update siswa dengan ID tidak ada | [ ] | Expected: 404 Not Found |
| 7 | Update siswa tanpa token | [ ] | Expected: 401 Unauthorized |
| 8 | Update siswa dengan token invalid | [ ] | Expected: 401 Unauthorized |

### 2.5 DELETE /api/siswa/[id] - Delete Siswa

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | Delete siswa dengan ID valid | [ ] | Expected: 200 OK |
| 2 | Delete siswa dengan ID tidak ada | [ ] | Expected: 404 Not Found |
| 3 | Delete siswa tanpa token | [ ] | Expected: 401 Unauthorized |
| 4 | Delete siswa dengan token invalid | [ ] | Expected: 401 Unauthorized |

---

## 3. GENERAL TESTS

### 3.1 Response Format

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | Semua response menggunakan format standar | [ ] | `{ success, data?, error?, message? }` |
| 2 | Status code 200 untuk success | [ ] | |
| 3 | Status code 201 untuk created | [ ] | |
| 4 | Status code 400 untuk bad request | [ ] | |
| 5 | Status code 401 untuk unauthorized | [ ] | |
| 6 | Status code 404 untuk not found | [ ] | |
| 7 | Status code 409 untuk conflict | [ ] | |
| 8 | Status code 500 untuk server error | [ ] | |

### 3.2 CORS & Performance

| No | Test Case | Status | Catatan |
|----|-----------|--------|---------|
| 1 | CORS headers tersedia | [ ] | |
| 2 | Response time reasonable (< 1 detik) | [ ] | |
| 3 | Pagination works correctly | [ ] | |

---

## 4. SUMMARY

| Kategori | Total Test | Passed | Failed | Pending |
|----------|------------|--------|--------|---------|
| Auth Endpoints | 16 | 0 | 0 | 16 |
| Siswa Endpoints | 28 | 0 | 0 | 28 |
| General Tests | 11 | 0 | 0 | 11 |
| **TOTAL** | **55** | **0** | **0** | **55** |

---

## 5. NOTES / ISSUES

| Timestamp | Issue | Severity | Status |
|-----------|-------|----------|--------|
| - | - | - | - |

---

## 6. COMMAND EXAMPLES

### Register
```bash
curl -X POST https://api.rizqifauzan.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST https://api.rizqifauzan.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get All Siswa (with token)
```bash
curl -X GET "https://api.rizqifauzan.com/api/siswa?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Siswa (with token)
```bash
curl -X POST https://api.rizqifauzan.com/api/siswa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"nis":"12345","nama":"John Doe","kelas":"X","jurusan":"RPL"}'
```
