# Tutorial Download Postman Collection

## Langkah-langkah Download Postman Collection

### 1. Buka Halaman API Docs
1. Buka browser dan kunjungi ke: https://api.rizqifauzan.com/api-docs
2. Halaman ini berisi dokumentasi lengkap semua endpoint API

### 2. Download Postman Collection
1. Di halaman API Docs, cari tombol atau link "Download Postman Collection"
2. Klik tombol/link tersebut untuk mendownload file `postman-collection.json`

### 3. Import ke Postman
1. Buka aplikasi Postman (desktop atau web)
2. Klik "Import" dan pilih file `postman-collection.json`
3. Collection akan muncul dengan nama "API Siswa Management"

## Cara Menggunakan Postman Collection

### Setup Collection Variables

Setelah import collection, setup collection variables:

| Variable | Nilai | Deskripsi |
|----------|--------|---------|
| `baseUrl` | `https://api.rizqifauzan.com` | Base URL API |
| `token` | (kosong) | JWT token (akan diisi otomatis setelah login) |
| `userId` | (kosong) | ID siswa (akan diisi saat testing) |

### Jalankan Request Pertama (Login)

Sebelum bisa mengakses endpoint siswa, Anda perlu login terlebih dahulu:

1. Pilih folder "Auth" di collection
2. Pilih request "Login"
3. Klik tab "Body"
4. Isi body dengan:
   ```json
   {
     "email": "test@example.com",
     "password": "Password123"
   }
   ```
5. Klik tombol "Send"

Jika berhasil:
- Token akan disimpan otomatis ke collection variable `token`
- Anda akan mendapatkan response berisi user data

### Jalankan Request Siswa

Setelah login, Anda bisa mengakses endpoint siswa:

#### Get All Siswa
1. Pilih folder "Siswa"
2. Pilih request "Get All Siswa"
3. Klik tombol "Send"
4. Response akan menampilkan daftar siswa dengan pagination

#### Search Siswa
1. Pilih folder "Siswa"
2. Pilih request "Search Siswa"
3. Ubah parameter query `search` dengan kata kunci (contoh: "Fauziah")
4. Klik tombol "Send"

#### Filter Siswa by Kelas
1. Pilih folder "Siswa"
2. Pilih request "Filter Siswa by Kelas"
3. Ubah parameter query `kelas` dengan kelas yang diinginkan (contoh: "X-IPA-2")
4. Klik tombol "Send"

#### Create Siswa
1. Pilih folder "Siswa"
2. Pilih request "Create Siswa"
3. Klik tab "Body"
4. Isi body dengan data siswa baru:
   ```json
   {
     "nis": "12345",
     "nama": "John Doe",
     "kelas": "X-IPA-1",
     "jurusan": "IPA",
     "email": "john@example.com",
     "telepon": "08123456789",
     "alamat": "Jl. Contoh No. 123"
   }
   ```
5. Klik tombol "Send"

**Catatan:**
- Format kelas harus sesuai pattern: `X-IPA-1`, `XI-IPA-2`, dll
- NIS hanya boleh mengandung angka

#### Get Siswa by ID
1. Pilih folder "Siswa"
2. Pilih request "Get Siswa by ID"
3. Ganti variable `userId` dengan ID siswa yang valid (contoh: ganti dengan ID yang didapatkan dari response Get All Siswa)
4. Klik tombol "Send"

#### Update Siswa
1. Pilih folder "Siswa"
2. Pilih request "Update Siswa"
3. Ganti variable `userId` dengan ID siswa yang valid
4. Klik tab "Body"
5. Isi body dengan data yang ingin diupdate (contoh: hanya nama):
   ```json
   {
     "nama": "John Doe Updated"
   }
   ```
6. Klik tombol "Send"

#### Delete Siswa
1. Pilih folder "Siswa"
2. Pilih request "Delete Siswa"
3. Ganti variable `userId` dengan ID siswa yang valid
4. Klik tombol "Send"

## Error Handling Tests

### Test Register with Existing Email
1. Pilih folder "Error Handling Tests"
2. Pilih request "Test: Register with existing email"
3. Klik tombol "Send"
4. Expected: Status 409 Conflict dengan pesan "Email sudah terdaftar"

### Test Login with Wrong Email
1. Pilih folder "Error Handling Tests"
2. Pilih request "Test: Login with wrong email"
3. Isi body:
   ```json
   {
     "email": "wrong@example.com",
     "password": "Password123"
   }
   ```
4. Klik tombol "Send"
5. Expected: Status 401 Unauthorized dengan pesan "Email atau password salah"

### Test Get Current User without Token
1. Pilih folder "Auth"
2. Pilih request "Get Current User"
3. Hapus token dari collection variables (kosongkan nilai `token`)
4. Klik tombol "Send"
5. Expected: Status 401 Unauthorized dengan pesan "Anda tidak memiliki akses. Silakan login kembali."

### Test Get Siswa by Invalid ID
1. Pilih folder "Siswa"
2. Pilih request "Get Siswa by ID"
3. Ganti variable `userId` dengan ID yang tidak valid (contoh: `00000000-0000-0000-000000000000`)
4. Klik tombol "Send"
5. Expected: Status 404 Not Found dengan pesan "Siswa tidak ditemukan"

### Test Create Siswa with Duplicate NIS
1. Pilih folder "Siswa"
2. Pilih request "Create Siswa"
3. Isi body dengan NIS yang sudah ada (contoh: `1030833103219`)
4. Klik tombol "Send"
5. Expected: Status 409 Conflict dengan pesan "NIS sudah terdaftar"

### Test Create Siswa with Invalid Kelas Format
1. Pilih folder "Siswa"
2. Pilih request "Create Siswa"
3. Isi body dengan format kelas tidak valid (contoh: `XIPA1` tanpa tanda hubung)
4. Klik tombol "Send"
5. Expected: Status 400 Bad Request dengan pesan "Format kelas tidak valid (contoh: X-IPA-1)"

## Tips Tambahan

### Gunakan Try It
Postman memiliki fitur "Try It" untuk mencoba request tanpa mengirim ke server. Sangat berguna untuk debugging.

### Simpan Response
Gunakan fitur "Save Response" untuk menyimpan response yang berguna untuk referensi.

### Environment Variables
Gunakan environment untuk memisahkan konfigurasi antara development, staging, dan production.

## Troubleshooting

### Tidak bisa login?
- Pastikan email dan password sudah benar
- Cek apakah password memenuhi syarat (min 6 karakter, 1 huruf kapital, 1 huruf kecil, 1 angka)

### Token tidak valid?
- Token mungkin sudah expired, coba login lagi untuk mendapatkan token baru
- Pastikan token disimpan dengan benar di collection variables

### Endpoint tidak ditemukan?
- Pastikan URL API sudah benar: `https://api.rizqifauzan.com`
- Cek apakah endpoint sudah benar (lihat dokumentasi API)

---

## Support

Jika Anda mengalami masalah atau ada pertanyaan, silakan:
1. Cek dokumentasi API di https://api.rizqifauzan.com/api-docs
2. Hubungi tim development
3. Cek laporan bug di [`reports/bug-report.md`](reports/bug-report.md) dan [`reports/bug-fix-report.md`](reports/bug-fix-report.md)
