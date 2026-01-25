# Tutorial Automation Test API dengan Postman

## Persiapan

Sebelum mulai automation test, pastikan:
1. Postman collection sudah diimport ke Postman
2. Collection variables sudah diset dengan benar
3. Environment variables sudah dikonfigurasi

## Membuat Environment di Postman

### 1. Buat Environment Baru
1. Buka Postman
2. Klik ikon "Manage Environments" (pojok kanan atas)
3. Klik tombol "Add"

### 2. Konfigurasi Environment
1. **Environment Name**: `API Siswa Management - Production`
2. **Variable List**:
   - `baseUrl`: `https://api.rizqifauzan.com`
   - `token`: (kosong untuk sekarang, akan diisi otomatis saat automation test)
   - `userId`: (kosong untuk sekarang, akan diisi saat automation test)

### 3. Initial Values (opsional)
Jika ingin men-set nilai awal untuk collection variables, isi di sini:
- `token`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (token yang valid)
- `userId`: `e409291d-580a-4f5f-a68c-134e3ede2fed` (ID user yang valid)

---

## Membuat Collection Variables untuk Automation

Postman memiliki fitur collection variables yang bisa digunakan untuk automation test. Cara membuatnya:

### 1. Buka Collection
1. Buka collection "API Siswa Management"
2. Klik tab "Variables"
3. Klik tombol "Add" untuk membuat variable baru

### 2. Buat Variable untuk Token
1. **Variable Name**: `authToken`
2. **Initial Value**: Kosong
3. **Variable Scope**: Pilih "Current Collection" atau "All Collections"
4. **Type**: Secret (untuk menyembunyikan token)

### 3. Buat Variable untuk User ID
1. **Variable Name**: `currentUserId`
2. **Initial Value**: Kosong
3. **Variable Scope**: Pilih "Current Collection" atau "All Collections"
4. **Type**: Default (bisa diubah saat test)

---

## Membuat Automation Test

### 1. Buka Collection dan Pilih Request
1. Buka collection "API Siswa Management"
2. Pilih folder "Auth" atau "Siswa"
3. Pilih request yang ingin diuji (misalnya "Login")
4. Klik tombol "Send"

### 2. Setup Pre-request Script (Opsional)
Untuk automation test yang lebih kompleks, Anda bisa menggunakan pre-request script:

1. Klik tombol "..." di pojok kanan atas request
2. Pilih "Pre-request Script" tab
3. Isi script berikut untuk menyimpan token otomatis:

```javascript
const response = pm.response.json();

if (response.success && response.data && response.data.token) {
    pm.collectionVariables.set('authToken', response.data.token);
    console.log('Token saved:', response.data.token);
    
    // Simpan user ID jika ada
    if (response.data.user && response.data.user.id) {
        pm.collectionVariables.set('currentUserId', response.data.user.id);
        console.log('User ID saved:', response.data.user.id);
    }
}
```

4. Klik tombol "Save" untuk menyimpan script

### 3. Jalankan Request untuk Login
1. Pilih request "Login"
2. Klik tombol "Send"
3. Postman akan menjalankan script dan menyimpan token otomatis

### 4. Jalankan Request Siswa
Setelah token tersimpan, Anda bisa menjalankan request siswa:

#### Get All Siswa
1. Pilih request "Get All Siswa"
2. Klik tombol "Send"
3. Gunakan collection variable `{{authToken}}` di Authorization header

#### Create Siswa
1. Pilih request "Create Siswa"
2. Klik tab "Body"
3. Isi body JSON dengan data siswa baru
4. Klik tombol "Send"
5. Gunakan collection variable `{{authToken}}` di Authorization header

#### Update Siswa
1. Pilih request "Update Siswa"
2. Ganti variable `currentUserId` dengan ID siswa yang valid
3. Klik tab "Body"
4. Isi body JSON dengan data yang ingin diupdate
5. Klik tombol "Send"
6. Gunakan collection variable `{{authToken}}` di Authorization header

#### Delete Siswa
1. Pilih request "Delete Siswa"
2. Ganti variable `currentUserId` dengan ID siswa yang valid
3. Klik tombol "Send"
4. Gunakan collection variable `{{authToken}}` di Authorization header

---

## Membuat Test Suite

### 1. Buka Collection
1. Buka collection "API Siswa Management"
2. Klik tombol "New Request" atau tiga titik di pojok kanan atas

### 2. Pilih Request Pertama (Login)
1. Pilih request "Login" dari folder "Auth"
2. Klik tombol "Send"
3. Pastikan response berhasil dan token tersimpan

### 3. Buat Test Berikutnya
1. Klik "New Request" lagi
2. Pilih request "Get All Siswa" dari folder "Siswa"
3. Klik tombol "Send"
4. Pastikan Authorization header menggunakan `{{authToken}}`
5. Simpan response untuk referensi

### 4. Ulangi untuk Request Berikutnya
1. Klik tombol "New Request"
2. Pilih request lain yang ingin diuji

---

## Menjalankan Automation Test

### 1. Gunakan Collection Runner
1. Klik tombol "Runner" di pojok kiri atas
2. Pilih collection "API Siswa Management"
3. Klik tab "Iterations"
4. Klik "New Iteration"

### 2. Konfigurasi Iteration
1. **Iteration Count**: Jumlah kali ingin mengulang test (contoh: 3)
2. **Delay**: Delay antar request dalam milidetik (contoh: 1000ms)

### 3. Menjalankan Test
Klik tombol "Run" untuk menjalankan semua request secara berurutan

---

## Assert Response

### 1. Tambahkan Assertion
Untuk memvalidasi response, tambahkan assertion:

1. Di tab "Tests" request
2. Klik tombol "Add assertion"
3. Pilih assertion type:
   - **Status code**: `Status code is 200`
   - **Response time**: `Response time is less than 200ms`
   - **Response body**: `Response body has property`

### 2. Contoh Assertion untuk Get All Siswa
```
Status code: 200
Response time: Response time is less than 200ms
Response body: Response body has property "success" with value "true"
Response body: Response body has property "data"
Response body: Response body has property "pagination"
```

---

## Menyimpan Test Result

### 1. Export Test Result
1. Setelah test selesai, klik tombol "Export" di pojok kanan atas
2. Pilih format export (JSON, CSV, dll)
3. Simpan file untuk dokumentasi

---

## Tips Automation Testing

### 1. Gunakan Environment Variables
Gunakan environment variables untuk memisahkan konfigurasi antara development, staging, dan production:
- `baseUrl`: `https://api.rqifauzan.com` (production)
- `baseUrl`: `https://api-dev.rizqifauzan.com` (development)
- `baseUrl`: `https://api-staging.rizqifauzan.com` (staging)

### 2. Error Handling
Tambahkan test case untuk error handling:
- Login dengan credential salah
- Request tanpa token
- Request dengan data tidak valid
- Request dengan resource tidak ada

### 3. Data Cleanup
Tambahkan test case untuk cleanup:
- Create siswa baru
- Update siswa
- Delete siswa yang baru dibuat

### 4. Report Generation
Gunakan Postman Newman CLI untuk menjalankan test dari command line:
```bash
newman run "API Siswa Management" --environment production
```

Export hasil test dalam format JSON untuk analisis lebih lanjut.

---

## Troubleshooting

### Login Gagal
Jika login gagal, cek:
1. Pastikan email dan password sudah benar
2. Cek apakah API server sedang down
3. Cek environment variables sudah benar

### Token Tidak Valid
Jika token expired atau tidak valid:
1. Jalankan request Login lagi untuk mendapatkan token baru
2. Update collection variable `authToken` dengan token baru

### Request Timeout
Jika request timeout:
1. Cek koneksi internet
2. Tingkatkan timeout di Postman settings
3. Cek apakah API server sedang down

---

## Advanced Automation

### 1. Chaining Requests
Gunakan response dari request sebelumnya untuk request berikutnya:

Contoh: Create siswa, lalu update siswa yang baru dibuat:
1. Jalankan request "Create Siswa"
2. Dari response, ambil ID siswa yang baru dibuat
3. Jalankan request "Update Siswa" dengan ID tersebut
4. Gunakan collection variable `currentUserId` dengan ID tersebut

### 2. Conditional Logic
Gunakan script untuk menambahkan logika kondisional:

```javascript
const response = pm.response.json();

if (response.success && response.data) {
    // Cek jika data siswa yang diharapkan ada
    if (response.data.data && Array.isArray(response.data.data)) {
        const siswa = response.data.data.data;
        if (siswa.length > 0) {
            pm.collectionVariables.set('currentUserId', siswa[0].id);
            console.log('Siswa pertama:', siswa[0].id);
        }
    }
}
```

### 3. Data Validation
Tambahkan script untuk validasi data response:

```javascript
const response = pm.response.json();

if (response.success && response.data) {
    // Validasi schema
    const siswa = response.data.data.data;
    siswa.forEach(siswa => {
        pm.expect(siswa.nis).to.exist();
        pm.expect(siswa.nama).to.be.aString();
        pm.expect(siswa.kelas).to.match(/^[XIV]{1,2}-[A-Z]+-[0-9]+$/);
        pm.expect(siswa.jurusan).to.be.aString();
    });
}
```

---

## Best Practices

### 1. Organisasi Collection
- Gunakan folder untuk mengorganisir request berdasarkan fitur atau resource
- Beri nama request yang deskriptif dan mudah dipahami
- Gunakan deskripsi untuk dokumentasi tujuan setiap request

### 2. Naming Convention
- Gunakan nama request yang konsisten (snake_case, camelCase, dll)
- Contoh: `get_all_siswa`, `create_siswa`, `update_siswa`, `delete_siswa`

### 3. Documentation
- Tambahkan deskripsi untuk setiap request di bagian "Description"
- Dokumentasikan tujuan dan expected response

### 4. Versioning
- Tambahkan version ke nama request jika API mengalami perubahan
- Contoh: `v1_get_siswa`, `v2_get_siswa`

---

## Contoh Full Automation Script

```javascript
// Setup
const baseUrl = pm.collectionVariables.get('baseUrl');
const authToken = pm.collectionVariables.get('authToken');
let currentUserId = '';

// Test 1: Login
pm.sendRequest({
    url: `${baseUrl}/api/auth/login`,
    method: 'POST',
    header: {
        'Content-Type': 'application/json'
    },
    body: {
        email: 'test@example.com',
        password: 'Password123'
    },
    function(err, res) {
        if (err) {
            console.error('Login error:', err);
        throw err;
        }
        
        const jsonData = res.json();
        
        if (jsonData.success && jsonData.data && jsonData.data.token) {
            pm.collectionVariables.set('authToken', jsonData.data.token);
            console.log('Token saved:', jsonData.data.token);
            
            if (jsonData.data.user && jsonData.data.user.id) {
                currentUserId = jsonData.data.user.id;
                console.log('User ID saved:', currentUserId);
            }
        }
    }
});

// Test 2: Get All Siswa
pm.sendRequest({
    url: `${baseUrl}/api/siswa?page=1&limit=10`,
    method: 'GET',
    header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    },
    function(err, res) {
        if (err) {
            console.error('Get siswa error:', err);
            throw err;
        }
        
        const jsonData = res.json();
        
        if (jsonData.success && jsonData.data && jsonData.data.data && jsonData.data.data.length > 0) {
            pm.collectionVariables.set('currentUserId', jsonData.data.data[0].id);
            console.log('Siswa pertama:', jsonData.data.data[0].id);
        }
    }
});

// Test 3: Create Siswa
pm.sendRequest({
    url: `${baseUrl}/api/siswa`,
    method: 'POST',
    header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    },
    body: {
        nis: '99999',
        nama: 'Test Automation',
        kelas: 'X-IPA-1',
        jurusan: 'IPA',
        email: 'automation@example.com',
        telepon: '08123456789',
        alamat: 'Jl. Automation Test'
    },
    function(err, res) {
        if (err) {
            console.error('Create siswa error:', err);
            throw err;
        }
        
        const jsonData = res.json();
        
        if (jsonData.success && jsonData.data && jsonData.data.id) {
            currentUserId = jsonData.data.id;
            console.log('Siswa baru dibuat:', jsonData.data.id);
        }
    }
});

// Test 4: Update Siswa
pm.sendRequest({
    url: `${baseUrl}/api/siswa/${currentUserId}`,
    method: 'PUT',
    header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    },
    body: {
        nama: 'Test Automation Updated'
    },
    function(err, res) {
        if (err) {
            console.error('Update siswa error:', err);
            throw err;
        }
        
        const jsonData = res.json();
        
        if (jsonData.success) {
            console.log('Siswa berhasil diupdate');
        }
    }
});

// Test 5: Delete Siswa
pm.sendRequest({
    url: `${baseUrl}/api/siswa/${currentUserId}`,
    method: 'DELETE',
    header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    },
    function(err, res) {
        if (err) {
            console.error('Delete siswa error:', err);
            throw err;
        }
        
        const jsonData = res.json();
        
        if (jsonData.success) {
            console.log('Siswa berhasil dihapus');
        }
    }
});
```

---

## Menjalankan Automation Test dengan Newman CLI

### Install Newman CLI
```bash
npm install -g newman
```

### Jalankan Test
```bash
# Jalankan test dengan environment production
newman run "API Siswa Management" --environment production

# Jalankan test dengan environment development
newman run "API Sisma Management" --environment development

# Export hasil test
newman run "API Siswa Management" --environment production --reporters html,json,junit
```

---

## Monitoring & Debugging

### 1. Log Response
Tambahkan logging di script untuk memonitor response:
```javascript
console.log('Response Status:', res.statusCode);
console.log('Response Time:', res.responseTime);
console.log('Response Headers:', res.headers);
console.log('Response Body:', res.json());
```

### 2. Assert untuk Debugging
Tambahkan console.log untuk debugging:
```javascript
console.log('Request URL:', req.url);
console.log('Request Method:', req.method);
console.log('Request Headers:', req.headers);
console.log('Request Body:', req.body);
```

### 3. Error Handling
Tambahkan try-catch untuk menangkap error:
```javascript
try {
    // request code
} catch (error) {
    console.error('Error:', error);
    pm.test.fail('Test failed: ' + error.message);
}
```

---

## Integrasi CI/CD

Postman collection bisa diintegrasikan dengan CI/CD tools seperti:
- GitHub Actions
- Jenkins
- GitLab CI
- CircleCI

Contoh GitHub Actions workflow:
```yaml
name: API Automation Test

on: [push]
jobs:
  test-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Newman
        run: npm install -g newman
      
      - name: Run API Tests
        run: newman run "API Siswa Management" --environment production
      
      - name: Upload Test Results
        uses: actions/upload-artifact@v2
        with:
          name: Upload Test Results
        path: test-results/
```

---

## Support

Jika Anda mengalami kesulitan saat membuat automation test:
1. Cek dokumentasi Postman: https://learning.postman.co/docs/
2. Cek dokumentasi Newman CLI: https://learning.postman.co/docs/newman/using-newman-cli/running-collections-on-the-command-line/
3. Hubungi tim development jika ada masalah dengan API

---

## Ringkasan

### File yang Tersedia
1. [`postman-collection.json`](postman-collection.json) - Postman collection untuk import ke Postman
2. [`docs/tutorial-download-postman.md`](docs/tutorial-download-postman.md) - Tutorial cara download Postman collection
3. [`docs/tutorial-automation-test-api.md`](docs/tutorial-automation-test-api.md) - Tutorial automation test API (file baru ini)

### Fitur Automation yang Bisa
- ✅ Collection variables untuk environment management
- ✅ Pre-request scripts untuk menyimpan token dan user ID
- ✅ Assertions untuk validasi response
- ✅ Newman CLI untuk automation testing
- ✅ CI/CD integration
- ✅ Error handling dan logging
- ✅ Data cleanup tests
- ✅ Conditional logic untuk chaining requests

### Langkah Selanjutnya
1. Import Postman collection ke Postman
2. Setup environment variables
3. Jalankan automation test
4. Analisis hasil test
5. Perbaiki bug jika ditemukan

---

## Catatan Penting

### Environment Variables
Pastikan environment variables diset dengan benar untuk masing-masing environment:
- **Development**: `https://api-dev.rizqifauzan.com`
- **Staging**: `https://api-staging.rizqifauzan.com`
- **Production**: `https://api.rizqifauzan.com`

### Token Management
Token akan expired setelah 7 hari. Pastikan automation test memperbarui token secara berkala.

### Rate Limiting
Hati-hati saat menjalankan automation test untuk menghindari rate limiting dari server.

### Data Isolation
Gunakan data dummy untuk testing yang tidak akan mempengaruhi production data.

---

## Tutorial Tambahan

### Video Tutorial
Untuk visual guide, buat screenshot atau video tutorial yang menunjukkan cara:
1. Import Postman collection
2. Setup environment variables
3. Menjalankan automation test
4. Analisis hasil test
5. Export dan share hasil test

---

## Sumber Tambahan

- [Postman Learning Center](https://learning.postman.co/) - Tutorial lengkap Postman
- [Newman Documentation](https://learning.postman.co/docs/newman/using-newman-cli/) - Dokumentasi Newman CLI
- [Postman Community](https://community.postman.com/) - Diskusi dan tips dari komunitas
