'use client';

import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface DocPageProps {
  params: {
    slug: string;
  };
}

const docs: Record<string, { title: string; content: string }> = {
  'tutorial-download-postman': {
    title: 'Tutorial Download dan Import Postman Collection',
    content: `# Tutorial Download dan Import Postman Collection

## Persiapan

Sebelum memulai, pastikan Anda sudah memiliki:
1. Postman Desktop atau Postman Web (https://app.getpostman.com/)
2. File Postman collection JSON
3. Akun Postman (opsional untuk Postman Web)

---

## Langkah 1: Download Postman Collection

### Dari Website
1. Buka https://api.rizqifauzan.com/api-docs
2. Klik tab "Postman"
3. Klik tombol "Download Collection"
4. File akan didownload dengan nama \`api-siswa-management-collection.json\`

### Dari GitHub
Jika collection tersedia di GitHub:
1. Buka repository GitHub
2. Cari file \`postman-collection.json\`
3. Klik tombol "Download" atau "Raw"
4. Simpan file ke komputer Anda

---

## Langkah 2: Import Collection ke Postman

### Postman Desktop
1. Buka Postman Desktop
2. Klik tombol "Import" di pojok kiri atas
3. Pilih tab "File"
4. Klik tombol "Upload Files"
5. Pilih file \`api-siswa-management-collection.json\` yang sudah didownload
6. Klik tombol "Import"
7. Collection akan muncul di sidebar kiri

### Postman Web
1. Buka https://app.getpostman.com/
2. Login jika diperlukan
3. Klik tombol "Import" di pojok kiri atas
4. Pilih tab "File"
5. Klik tombol "Upload Files"
6. Pilih file \`api-siswa-management-collection.json\` yang sudah didownload
7. Klik tombol "Import"
8. Collection akan muncul di sidebar kiri

---

## Langkah 3: Setup Environment Variables

### Buat Environment Baru
1. Klik ikon "Manage Environments" (pojok kanan atas, ikon gear)
2. Klik tombol "Add"
3. Beri nama environment: \`API Siswa Management - Production\`
4. Klik tombol "Add" untuk menambahkan variable

### Tambahkan Variables
Tambahkan variables berikut:

1. **baseUrl**
   - Variable Name: \`baseUrl\`
   - Initial Value: \`https://api.rizqifauzan.com\`
   - Current Value: \`https://api.rizqifauzan.com\`
   - Type: Default

2. **token**
   - Variable Name: \`token\`
   - Initial Value: Kosong
   - Current Value: Kosong
   - Type: Secret (untuk menyembunyikan token)

3. **userId**
   - Variable Name: \`userId\`
   - Initial Value: Kosong
   - Current Value: Kosong
   - Type: Default

5. Klik tombol "Save" untuk menyimpan environment

### Aktifkan Environment
1. Klik dropdown environment di pojok kanan atas
2. Pilih \`API Siswa Management - Production\`
3. Environment sekarang aktif

---

## Langkah 4: Jalankan Request Login

### Buka Request Login
1. Buka collection \`API Siswa Management\`
2. Buka folder \`Auth\`
3. Klik request \`Login\`

### Setup Request
1. Pastikan method adalah \`POST\`
2. URL: \`{{baseUrl}}/api/auth/login\`
3. Klik tab \`Body\`
4. Pilih \`raw\` dan \`JSON\`
5. Masukkan body JSON berikut:
\`\`\`json
{
  "email": "test@example.com",
  "password": "Password123"
}
\`\`\`

### Jalankan Request
1. Klik tombol \`Send\`
2. Response akan muncul di panel bawah
3. Token akan disimpan otomatis ke collection variable \`token\`
4. User ID akan disimpan otomatis ke collection variable \`userId\`

---

## Langkah 5: Coba Endpoint Lainnya

### Get All Siswa
1. Buka folder \`Siswa\`
2. Klik request \`Get All Siswa\`
3. Klik tombol \`Send\`
4. Response akan menampilkan semua data siswa

### Create Siswa
1. Klik request \`Create Siswa\`
2. Klik tab \`Body\`
3. Masukkan body JSON berikut:
\`\`\`json
{
  "nis": "99999",
  "nama": "Test User",
  "kelas": "X-IPA-1",
  "jurusan": "IPA",
  "email": "test@example.com",
  "telepon": "08123456789",
  "alamat": "Jl. Test No. 1"
}
\`\`\`
4. Klik tombol \`Send\`
5. Response akan menampilkan siswa yang baru dibuat

### Update Siswa
1. Klik request \`Update Siswa\`
2. Ganti \`[id]\` dengan ID siswa yang valid
3. Klik tab \`Body\`
4. Masukkan body JSON berikut:
\`\`\`json
{
  "nama": "Test User Updated"
}
\`\`\`
5. Klik tombol \`Send\`
6. Response akan menampilkan siswa yang sudah diupdate

### Delete Siswa
1. Klik request \`Delete Siswa\`
2. Ganti \`[id]\` dengan ID siswa yang valid
3. Klik tombol \`Send\`
4. Response akan menampilkan konfirmasi penghapusan

---

## Tips dan Trik

### Auto-save Token
Collection sudah dikonfigurasi untuk auto-save token setelah login. Token akan disimpan ke collection variable \`token\` dan bisa digunakan untuk semua request yang membutuhkan authentication.

### Collection Variables
Gunakan collection variables untuk menyimpan data yang sering digunakan:
- \`{{baseUrl}}\` - Base URL API
- \`{{token}}\` - JWT token
- \`{{userId}}\` - ID user yang sedang login

### Pre-request Scripts
Collection sudah menyertakan pre-request scripts untuk:
- Menyimpan token setelah login
- Menyimpan user ID setelah login
- Menambahkan Authorization header otomatis

### Tests
Collection sudah menyertakan tests untuk:
- Validasi response status code
- Validasi response body
- Validasi token tersimpan

---

## Troubleshooting

### Login Gagal
Jika login gagal, cek:
1. Email dan password sudah benar
2. API server sedang berjalan
3. Environment variables sudah diset dengan benar
4. URL \`{{baseUrl}}\` sudah benar

### Token Tidak Valid
Jika token expired atau tidak valid:
1. Jalankan request Login lagi
2. Token akan diupdate otomatis
3. Cek collection variable \`token\` untuk memastikan token tersimpan

### Request Timeout
Jika request timeout:
1. Cek koneksi internet
2. Cek apakah API server sedang berjalan
3. Tingkatkan timeout di Postman settings

### 401 Unauthorized
Jika mendapatkan error 401:
1. Cek apakah token tersimpan di collection variable \`token\`
2. Cek apakah Authorization header sudah diset
3. Jalankan request Login lagi untuk mendapatkan token baru

---

## Best Practices

### Environment Management
Gunakan environment terpisah untuk development, staging, dan production:
- \`API Siswa Management - Development\`
- \`API Siswa Management - Staging\`
- \`API Siswa Management - Production\`

### Variable Naming
Gunakan naming convention yang konsisten:
- \`baseUrl\` - Base URL
- \`token\` - JWT token
- \`userId\` - ID user
- \`siswaId\` - ID siswa

### Request Organization
Organisir request dengan folder:
- \`Auth\` - Authentication endpoints
- \`Siswa\` - Siswa management endpoints
- \`Tests\` - Test endpoints

### Documentation
Tambahkan deskripsi untuk setiap request:
- Klik tombol \`...\` di pojok kanan atas request
- Klik \`Edit\`
- Tambahkan deskripsi di bagian \`Description\`

---

## Next Steps

Setelah berhasil import collection, Anda bisa:
1. Menjalankan automation test dengan Postman Runner
2. Membuat test suite untuk validasi API
3. Mengintegrasikan dengan CI/CD tools
4. Sharing collection dengan tim

---

## Support

Jika Anda mengalami kesulitan:
1. Cek dokumentasi Postman: https://learning.postman.co/docs/
2. Cek dokumentasi Newman CLI: https://learning.postman.co/docs/newman/
3. Hubungi tim development jika ada masalah dengan API

---

## Ringkasan

### File yang Tersedia
1. \`postman-collection.json\` - Postman collection untuk import ke Postman

### Langkah-langkah
1. Download Postman collection
2. Import collection ke Postman
3. Setup environment variables
4. Jalankan request login
5. Coba endpoint lainnya

### Fitur Collection
- ✅ Auto-save token setelah login
- ✅ Collection variables untuk environment management
- ✅ Pre-request scripts untuk automation
- ✅ Tests untuk validasi response
- ✅ Documentation untuk setiap endpoint

---

## Catatan Penting

### Token Expiry
Token akan expired setelah 7 hari. Pastikan menjalankan request Login lagi untuk mendapatkan token baru.

### Rate Limiting
Hati-hati saat menjalankan banyak request untuk menghindari rate limiting dari server.

### Data Isolation
Gunakan data dummy untuk testing yang tidak akan mempengaruhi production data.

---

## Sumber Tambahan

- [Postman Learning Center](https://learning.postman.co/) - Tutorial lengkap Postman
- [Postman Community](https://community.postman.com/) - Diskusi dan tips dari komunitas
- [Newman Documentation](https://learning.postman.co/docs/newman/) - Dokumentasi Newman CLI`
  },
  'tutorial-automation-test-api': {
    title: 'Tutorial Automation Test API dengan Postman',
    content: `# Tutorial Automation Test API dengan Postman

## Pendahuluan

Tutorial ini menjelaskan cara membuat automation test untuk API menggunakan Postman. Automation test memungkinkan Anda untuk:
- Menjalankan test secara berulang
- Validasi response API
- Integrasi dengan CI/CD
- Monitoring API health

---

## Persiapan

Sebelum memulai, pastikan:
1. Postman collection sudah diimport ke Postman
2. Environment variables sudah diset dengan benar
3. Request Login sudah berhasil dijalankan

---

## Membuat Test Case

### 1. Buka Request
1. Buka collection \`API Siswa Management\`
2. Pilih request yang ingin ditest (misalnya \`Login\`)
3. Klik tab \`Tests\`

### 2. Tambahkan Test Script
Tambahkan script berikut untuk validasi response:

\`\`\`javascript
// Test status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response time
pm.test("Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});

// Test response structure
pm.test("Response has correct structure", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData).to.have.property('data');
});

// Test success is true
pm.test("Success is true", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});

// Test token exists
pm.test("Token exists", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('token');
});

// Save token to collection variable
pm.test("Save token to collection variable", function () {
    const jsonData = pm.response.json();
    if (jsonData.success && jsonData.data && jsonData.data.token) {
        pm.collectionVariables.set('token', jsonData.data.token);
        console.log('Token saved:', jsonData.data.token);
    }
});
\`\`\`

### 3. Jalankan Test
1. Klik tombol \`Send\`
2. Postman akan menjalankan test
3. Hasil test akan muncul di panel \`Test Results\`

---

## Membuat Test Suite

### 1. Buka Collection Runner
1. Klik tombol \`Runner\` di pojok kiri atas
2. Pilih collection \`API Siswa Management\`
3. Pilih environment \`API Siswa Management - Production\`

### 2. Pilih Request untuk Test
1. Centang request yang ingin ditest
2. Atur urutan request jika diperlukan
3. Klik tombol \`Run API Siswa Management\`

### 3. Hasil Test
1. Postman akan menjalankan semua request yang dipilih
2. Hasil test akan muncul di panel \`Test Results\`
3. Anda bisa melihat test yang passed dan failed

---

## Advanced Testing

### 1. Chaining Requests
Gunakan response dari request sebelumnya untuk request berikutnya:

\`\`\`javascript
// Save user ID from login response
pm.test("Save user ID", function () {
    const jsonData = pm.response.json();
    if (jsonData.success && jsonData.data && jsonData.data.user) {
        pm.collectionVariables.set('userId', jsonData.data.user.id);
        console.log('User ID saved:', jsonData.data.user.id);
    }
});
\`\`\`

### 2. Conditional Logic
Gunakan script untuk menambahkan logika kondisional:

\`\`\`javascript
// Check if user is admin
pm.test("Check if user is admin", function () {
    const jsonData = pm.response.json();
    if (jsonData.success && jsonData.data && jsonData.data.user) {
        const isAdmin = jsonData.data.user.role === 'admin';
        pm.expect(isAdmin).to.be.true;
    }
});
\`\`\`

### 3. Data Validation
Tambahkan script untuk validasi data response:

\`\`\`javascript
// Validate siswa data
pm.test("Validate siswa data", function () {
    const jsonData = pm.response.json();
    if (jsonData.success && jsonData.data && jsonData.data.data) {
        const siswa = jsonData.data.data.data;
        siswa.forEach(s => {
            pm.expect(s).to.have.property('id');
            pm.expect(s).to.have.property('nis');
            pm.expect(s).to.have.property('nama');
            pm.expect(s).to.have.property('kelas');
            pm.expect(s).to.have.property('jurusan');
        });
    }
});
\`\`\`

---

## Pre-request Scripts

### 1. Auto-save Token
Tambahkan pre-request script untuk auto-save token:

\`\`\`javascript
// Auto-save token after login
const response = pm.response.json();

if (response.success && response.data && response.data.token) {
    pm.collectionVariables.set('token', response.data.token);
    console.log('Token saved:', response.data.token);
    
    // Save user ID if available
    if (response.data.user && response.data.user.id) {
        pm.collectionVariables.set('userId', response.data.user.id);
        console.log('User ID saved:', response.data.user.id);
    }
}
\`\`\`

### 2. Add Authorization Header
Tambahkan pre-request script untuk auto-add Authorization header:

\`\`\`javascript
// Add Authorization header
const token = pm.collectionVariables.get('token');

if (token) {
    pm.request.headers.add({
        key: 'Authorization',
        value: 'Bearer ' + token
    });
}
\`\`\`

---

## Newman CLI

### 1. Install Newman CLI
\`\`\`bash
npm install -g newman
\`\`\`

### 2. Jalankan Test dengan Newman
\`\`\`bash
newman run "API Siswa Management" --environment production
\`\`\`

### 3. Export Test Results
\`\`\`bash
newman run "API Siswa Management" --environment production --reporters html,json,junit
\`\`\`

---

## CI/CD Integration

### GitHub Actions
\`\`\`yaml
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
\`\`\`

---

## Best Practices

### 1. Test Organization
- Gunakan folder untuk mengorganisir test
- Beri nama test yang deskriptif
- Tambahkan deskripsi untuk setiap test

### 2. Test Coverage
- Test semua endpoint API
- Test error handling
- Test edge cases
- Test performance

### 3. Test Maintenance
- Update test secara berkala
- Refactor test jika diperlukan
- Hapus test yang tidak relevan

---

## Troubleshooting

### Test Failed
Jika test failed, cek:
1. Response status code
2. Response body structure
3. Collection variables sudah diset
4. Environment sudah aktif

### Token Expired
Jika token expired:
1. Jalankan request Login lagi
2. Token akan diupdate otomatis
3. Jalankan test lagi

### Request Timeout
Jika request timeout:
1. Cek koneksi internet
2. Cek apakah API server sedang berjalan
3. Tingkatkan timeout di Postman settings

---

## Ringkasan

### Fitur Automation Test
- ✅ Test status code
- ✅ Test response time
- ✅ Test response structure
- ✅ Test data validation
- ✅ Chaining requests
- ✅ Conditional logic
- ✅ Newman CLI integration
- ✅ CI/CD integration

### Langkah Selanjutnya
1. Buat test case untuk semua endpoint
2. Jalankan test secara berkala
3. Integrasikan dengan CI/CD
4. Monitor test results

---

## Support

Jika Anda mengalami kesulitan:
1. Cek dokumentasi Postman: https://learning.postman.co/docs/
2. Cek dokumentasi Newman CLI: https://learning.postman.co/docs/newman/
3. Hubungi tim development jika ada masalah dengan API`
  }
};

export default function DocPage({ params }: DocPageProps) {
  const doc = docs[params.slug];

  if (!doc) {
    notFound();
  }

  return (
    <div id="docs-page" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav id="docs-navbar" className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link id="docs-back-link" href="/api-docs" className="flex items-center space-x-2">
              <Button id="docs-back-btn" variant="ghost" className="text-gray-600 dark:text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke API Docs
              </Button>
            </Link>
            <div id="docs-nav-title-wrapper" className="flex items-center space-x-4">
              <div id="docs-nav-title-content" className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span id="docs-nav-title" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {doc.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div id="docs-main" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card id="docs-card" className="max-w-4xl mx-auto">
          <CardContent id="docs-content" className="p-8">
            <div id="docs-prose" className="prose prose-sm dark:prose-invert max-w-none">
              <div id="docs-markdown-content" dangerouslySetInnerHTML={{ __html: formatMarkdown(doc.content) }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatMarkdown(content: string): string {
  // Simple markdown to HTML converter
  let html = content;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>');
  
  // Lists
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');
  
  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr />');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br />');
  
  // Wrap in paragraphs
  html = '<p>' + html + '</p>';
  
  // Clean up
  html = html.replace(/<p><h([1-6])>/g, '<h$1>');
  html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
  html = html.replace(/<p><pre>/g, '<pre>');
  html = html.replace(/<\/pre><\/p>/g, '</pre>');
  html = html.replace(/<p><ul>/g, '<ul>');
  html = html.replace(/<\/ul><\/p>/g, '</ul>');
  html = html.replace(/<p><ol>/g, '<ol>');
  html = html.replace(/<\/ol><\/p>/g, '</ol>');
  html = html.replace(/<p><li>/g, '<li>');
  html = html.replace(/<\/li><\/p>/g, '</li>');
  html = html.replace(/<p><hr \/><\/p>/g, '<hr />');
  
  return html;
}
