# Tutorial Cara Pakai API
## URL API: https://api.rizqifauzan.com/

---

## Cara Download Postman Collection

### 1. Buka Halaman API Docs
1. Buka browser dan kunjungi ke: https://api.rizqifauzan.com/api-docs
2. Halaman ini berisi dokumentasi lengkap semua endpoint API

### 2. Download Postman Collection
1. Di halaman API Docs, cari tombol atau link "Download Postman Collection"
2. Klik tombol tersebut untuk mendownload file `postman-collection.json`

### 3. Import ke Postman
1. Buka aplikasi Postman (desktop atau web)
2. Klik "Import" dan pilih file `postman-collection.json` yang sudah didownload
3. Collection akan muncul dengan nama "API Siswa Management"

---

## Cara Menggunakan Postman Collection

### 1. Setup Collection Variables

Setelah import collection, pastikan untuk setup collection variables:

| Variable | Nilai | Deskripsi |
|----------|--------|---------|
| baseUrl | `https://api.rizqifauzan.com` | Base URL API (sudah di-set otomatis) |
| token | (kosong) | JWT token (akan diisi otomatis setelah login) |
| userId | (kosong) | ID siswa (perlu diganti dengan ID valid saat testing) |

### 2. Jalankan Request Pertama (Login)

Sebelum bisa mengakses endpoint siswa, Anda perlu login terlebih dahulu:

1. Pilih request **"Login"** di collection
2. Klik tombol **"Send"**
3. Jika berhasil, token akan disimpan otomatis ke collection variable `token`
4. Anda juga akan mendapatkan response berisi user data

### 3. Test Endpoint Siswa

Setelah login, Anda bisa mengakses endpoint siswa:

#### Get All Siswa
1. Pilih request **"Get All Siswa"**
2. Klik tombol **"Send"**
3. Response akan menampilkan daftar siswa dengan pagination

#### Search Siswa
1. Pilih request **"Search Siswa"**
2. Ubah parameter query `search` dengan kata kunci (contoh: "Fauziah")
3. Klik tombol **"Send"**
4. Response akan menampilkan siswa yang sesuai dengan kata kunci

#### Filter Siswa by Kelas
1. Pilih request **"Filter Siswa by Kelas"**
2. Ubah parameter query `kelas` dengan kelas yang diinginkan (contoh: "X-IPA-2")
3. Klik tombol **"Send"**
4. Response akan menampilkan siswa di kelas tersebut

#### Create Siswa
1. Pilih request **"Create Siswa"**
2. Isi body dengan data siswa baru:
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
3. Klik tombol **"Send"**
4. Response akan menampilkan siswa yang baru dibuat

#### Get Siswa by ID
1. Pilih request **"Get Siswa by ID"**
2. Ganti variable `userId` dengan ID siswa yang valid (contoh: ganti dengan ID yang didapatkan dari response Get All Siswa)
3. Klik tombol **"Send"**
4. Response akan menampilkan detail siswa dengan ID tersebut

#### Update Siswa
1. Pilih request **"Update Siswa"**
2. Ganti variable `userId` dengan ID siswa yang valid
3. Isi body dengan data yang ingin diupdate (contoh: hanya nama):
   ```json
   {
     "nama": "John Doe Updated"
   }
   ```
4. Klik tombol **"Send"**
5. Response akan menampilkan siswa yang sudah diupdate

#### Patch Siswa
1. Pilih request **"Patch Siswa"**
2. Ganti variable `userId` dengan ID siswa yang valid
3. Isi body dengan field yang ingin diupdate (hanya field yang dikirim yang akan diupdate):
   ```json
   {
     "nama": "John Doe Patched"
   }
   ```
4. Klik tombol **"Send"**
5. Response akan menampilkan siswa yang sudah diupdate

**Catatan**: Perbedaan antara PUT dan PATCH:
- **PUT**: Mengupdate semua field yang dikirim (field yang tidak dikirim akan di-set ke null)
- **PATCH**: Hanya mengupdate field yang dikirim (field yang tidak dikirim tetap tidak berubah)

#### Delete Siswa
1. Pilih request **"Delete Siswa"**
2. Ganti variable `userId` dengan ID siswa yang valid
3. Klik tombol **"Send"**
4. Response akan menampilkan pesan sukses

---

## Catatan Penting

### Format Kelas
Format kelas harus sesuai pattern: `X-IPA-1`, `XI-IPA-2`, dll.

Contoh yang valid:
- `X-IPA-1`
- `X-IPA-2`
- `XI-IPA-1`
- `XI-IPA-2`

Contoh yang tidak valid:
- `XIPA1` (tidak ada tanda hubung)
- `X IPA 1` (spasi tidak sesuai)

### Validasi Password
Password harus mengandung:
- Minimal 6 karakter
- Maksimal 50 karakter
- Minimal 1 huruf kapital
- Minimal 1 huruf kecil
- Minimal 1 angka

Contoh password valid: `Password123`

### Validasi NIS
NIS hanya boleh mengandung angka.

Contoh NIS valid: `12345`

Contoh NIS tidak valid: `12345A`

### Error Response

Jika Anda mendapatkan error, berikut penjelasan singkatnya:

| Status Code | Deskripsi |
|-------------|----------|
| 400 | Bad Request - Data input tidak valid |
| 401 | Unauthorized - Token tidak valid atau tidak ada |
| 404 | Not Found - Data tidak ditemukan |
| 409 | Conflict - Data sudah ada (email atau NIS) |
| 500 | Internal Server Error - Terjadi kesalahan di server |

---

## Tips Testing

1. **Gunakan Try It**: Postman memiliki fitur "Try It" untuk mencoba request tanpa mengirim ke server
2. **Simpan Response**: Gunakan fitur "Save Response" untuk menyimpan response yang berguna untuk referensi
3. **Environment**: Gunakan environment untuk memisahkan konfigurasi antara development, staging, dan production
4. **Tests**: Gunakan fitur "Tests" untuk membuat automated test suite
5. **Collections**: Gunakan collections untuk mengorganisir request berdasarkan fitur atau project

---

## Troubleshooting

### Tidak bisa login?
1. Pastikan email dan password sudah benar
2. Cek apakah password memenuhi syarat validasi
3. Cek koneksi internet

### Token tidak valid?
1. Token mungkin sudah expired, coba login lagi untuk mendapatkan token baru
2. Pastikan token disimpan dengan benar di collection variables

### Endpoint tidak ditemukan?
1. Pastikan URL API sudah benar: `https://api.rizqifauzan.com`
2. Cek apakah endpoint sudah benar (lihat dokumentasi API)

---

## Support

Jika Anda mengalami masalah atau ada pertanyaan, silakan hubungi tim development atau cek dokumentasi API di https://api.rizqifauzan.com/api-docs
