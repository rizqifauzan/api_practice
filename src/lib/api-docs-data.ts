export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  requiresAuth: boolean;
  request?: {
    headers?: Record<string, { type: string; description: string; required: boolean }>;
    params?: Record<string, { type: string; description: string; required: boolean }>;
    body?: Record<string, { type: string; description: string; required: boolean }>;
    query?: Record<string, { type: string; description: string; required: boolean }>;
  };
  response: {
    success: Record<string, { type: string; description: string }>;
    error?: Record<string, { type: string; description: string }>;
  };
  examples: {
    request: {
      curl?: string;
      javascript?: string;
      java?: string;
    };
    response: {
      success: string;
      error: string;
    };
  };
}

export const apiEndpoints: ApiEndpoint[] = [
  // Authentication Endpoints
  {
    id: 'auth-register',
    method: 'POST',
    path: '/api/auth/register',
    title: 'Register User',
    description: 'Membuat akun pengguna baru dengan validasi email dan password.',
    requiresAuth: false,
    request: {
      body: {
        nama: { type: 'string', description: 'Nama lengkap pengguna (3-100 karakter)', required: true },
        email: { type: 'string', description: 'Email pengguna (harus valid)', required: true },
        password: { type: 'string', description: 'Password (min 6 karakter, 1 huruf kapital, 1 huruf kecil, 1 angka)', required: true },
      },
    },
    response: {
      success: {
        success: { type: 'boolean', description: 'Status keberhasilan request' },
        message: { type: 'string', description: 'Pesan sukses' },
        data: { type: 'object', description: 'Data user yang dibuat' },
      },
    },
    examples: {
      request: {
        curl: `curl -X POST https://your-domain.com/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "nama": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'`,
        javascript: `fetch('https://your-domain.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nama: 'John Doe',
    email: 'john@example.com',
    password: 'Password123'
  })
}).then(res => res.json()).then(data => console.log(data));`,
        java: `import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.json.JSONObject;

public class ApiClient {
    public static void main(String[] args) {
        String baseUrl = "https://your-domain.com";
        
        JSONObject requestBody = new JSONObject();
        requestBody.put("nama", "John Doe");
        requestBody.put("email", "john@example.com");
        requestBody.put("password", "Password123");
        
        Response response = RestAssured.given()
            .baseUri(baseUrl)
            .header("Content-Type", "application/json")
            .body(requestBody.toString())
            .post("/api/auth/register");
        
        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Response: " + response.asString());
    }
}`,
      },
      response: {
        success: `{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": "uuid-here",
    "nama": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}`,
        error: `{
  "success": false,
  "error": "Email sudah terdaftar"
}`,
      },
    },
  },
  {
    id: 'auth-login',
    method: 'POST',
    path: '/api/auth/login',
    title: 'Login User',
    description: 'Masuk ke aplikasi dengan email dan password. Mengembalikan JWT token.',
    requiresAuth: false,
    request: {
      body: {
        email: { type: 'string', description: 'Email pengguna', required: true },
        password: { type: 'string', description: 'Password pengguna', required: true },
      },
    },
    response: {
      success: {
        success: { type: 'boolean', description: 'Status keberhasilan request' },
        message: { type: 'string', description: 'Pesan sukses' },
        data: { type: 'object', description: 'Data user dan token' },
      },
    },
    examples: {
      request: {
        curl: `curl -X POST https://your-domain.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'`,
        javascript: `fetch('https://your-domain.com/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'Password123'
  })
}).then(res => res.json()).then(data => console.log(data));`,
        java: `import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.json.JSONObject;

public class ApiClient {
    public static void main(String[] args) {
        String baseUrl = "https://your-domain.com";
        
        JSONObject requestBody = new JSONObject();
        requestBody.put("email", "john@example.com");
        requestBody.put("password", "Password123");
        
        Response response = RestAssured.given()
            .baseUri(baseUrl)
            .header("Content-Type", "application/json")
            .body(requestBody.toString())
            .post("/api/auth/login");
        
        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Response: " + response.asString());
        
        // Extract token from response
        String token = response.jsonPath().getString("data.token");
        System.out.println("Token: " + token);
    }
}`,
      },
      response: {
        success: `{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "uuid-here",
      "nama": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`,
        error: `{
  "success": false,
  "error": "Email atau password salah"
}`,
      },
    },
  },
  {
    id: 'auth-logout',
    method: 'POST',
    path: '/api/auth/logout',
    title: 'Logout User',
    description: 'Keluar dari aplikasi (hapus token dari client).',
    requiresAuth: true,
    request: {
      headers: {
        Authorization: { type: 'string', description: 'Bearer token', required: true },
      },
    },
    response: {
      success: {
        success: { type: 'boolean', description: 'Status keberhasilan request' },
        message: { type: 'string', description: 'Pesan sukses' },
      },
    },
    examples: {
      request: {
        curl: `curl -X POST https://your-domain.com/api/auth/logout \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`,
        javascript: `fetch('https://your-domain.com/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
}).then(res => res.json()).then(data => console.log(data));`,
        java: `import io.restassured.RestAssured;
import io.restassured.response.Response;

public class ApiClient {
    public static void main(String[] args) {
        String baseUrl = "https://your-domain.com";
        String token = "YOUR_TOKEN_HERE";
        
        Response response = RestAssured.given()
            .baseUri(baseUrl)
            .header("Authorization", "Bearer " + token)
            .post("/api/auth/logout");
        
        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Response: " + response.asString());
    }
}`,
      },
      response: {
        success: `{
  "success": true,
  "message": "Logout berhasil"
}`,
        error: `{
  "success": false,
  "error": "Unauthorized"
}`,
      },
    },
  },
  {
    id: 'auth-me',
    method: 'GET',
    path: '/api/auth/me',
    title: 'Get Current User',
    description: 'Mendapatkan informasi user yang sedang login.',
    requiresAuth: true,
    request: {
      headers: {
        Authorization: { type: 'string', description: 'Bearer token', required: true },
      },
    },
    response: {
      success: {
        success: { type: 'boolean', description: 'Status keberhasilan request' },
        data: { type: 'object', description: 'Data user' },
      },
    },
    examples: {
      request: {
        curl: `curl -X GET https://your-domain.com/api/auth/me \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`,
        javascript: `fetch('https://your-domain.com/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
}).then(res => res.json()).then(data => console.log(data));`,
        java: `import io.restassured.RestAssured;
import io.restassured.response.Response;

public class ApiClient {
    public static void main(String[] args) {
        String baseUrl = "https://your-domain.com";
        String token = "YOUR_TOKEN_HERE";
        
        Response response = RestAssured.given()
            .baseUri(baseUrl)
            .header("Authorization", "Bearer " + token)
            .get("/api/auth/me");
        
        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Response: " + response.asString());
    }
}`,
      },
      response: {
        success: `{
  "success": true,
  "data": {
    "id": "uuid-here",
    "nama": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}`,
        error: `{
  "success": false,
  "error": "Unauthorized"
}`,
      },
    },
  },
  // Siswa Endpoints
  {
    id: 'siswa-list',
    method: 'GET',
    path: '/api/siswa',
    title: 'Get All Students',
    description: 'Mendapatkan daftar semua siswa dengan pagination, search, filter, dan sorting.',
    requiresAuth: true,
    request: {
      headers: {
        Authorization: { type: 'string', description: 'Bearer token', required: true },
      },
      query: {
        page: { type: 'number', description: 'Nomor halaman (default: 1)', required: false },
        limit: { type: 'number', description: 'Jumlah data per halaman (default: 10)', required: false },
        search: { type: 'string', description: 'Cari berdasarkan nama, NIS, atau email', required: false },
        kelas: { type: 'string', description: 'Filter berdasarkan kelas', required: false },
        jurusan: { type: 'string', description: 'Filter berdasarkan jurusan', required: false },
        sortBy: { type: 'string', description: 'Kolom untuk sorting (nama, kelas, jurusan, created_at)', required: false },
        sortOrder: { type: 'string', description: 'Urutan sorting (asc, desc)', required: false },
      },
    },
    response: {
      success: {
        success: { type: 'boolean', description: 'Status keberhasilan request' },
        data: { type: 'array', description: 'Array data siswa' },
        pagination: { type: 'object', description: 'Informasi pagination' },
      },
    },
    examples: {
      request: {
        curl: `curl -X GET "https://your-domain.com/api/siswa?page=1&limit=10&search=John&kelas=X-IPA-1&sortBy=nama&sortOrder=asc" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`,
        javascript: `fetch('https://your-domain.com/api/siswa?page=1&limit=10&search=John&kelas=X-IPA-1&sortBy=nama&sortOrder=asc', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
}).then(res => res.json()).then(data => console.log(data));`,
      },
      response: {
        success: `{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "nama": "John Doe",
      "nis": "12345",
      "kelas": "X-IPA-1",
      "jurusan": "IPA",
      "email": "john@example.com",
      "telepon": "+628123456789",
      "alamat": "Jl. Contoh No. 1",
      "created_by": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}`,
        error: `{
  "success": false,
  "error": "Unauthorized"
}`,
      },
    },
  },
  {
    id: 'siswa-detail',
    method: 'GET',
    path: '/api/siswa/[id]',
    title: 'Get Student by ID',
    description: 'Mendapatkan detail siswa berdasarkan ID.',
    requiresAuth: true,
    request: {
      headers: {
        Authorization: { type: 'string', description: 'Bearer token', required: true },
      },
      params: {
        id: { type: 'string', description: 'ID siswa (UUID)', required: true },
      },
    },
    response: {
      success: {
        success: { type: 'boolean', description: 'Status keberhasilan request' },
        data: { type: 'object', description: 'Data siswa' },
      },
    },
    examples: {
      request: {
        curl: `curl -X GET https://your-domain.com/api/siswa/uuid-here \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`,
        javascript: `fetch('https://your-domain.com/api/siswa/uuid-here', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
}).then(res => res.json()).then(data => console.log(data));`,
      },
      response: {
        success: `{
  "success": true,
  "data": {
    "id": "uuid-here",
    "nama": "John Doe",
    "nis": "12345",
    "kelas": "X-IPA-1",
    "jurusan": "IPA",
    "email": "john@example.com",
    "telepon": "+628123456789",
    "alamat": "Jl. Contoh No. 1",
    "created_by": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}`,
        error: `{
  "success": false,
  "error": "Siswa tidak ditemukan"
}`,
      },
    },
  },
  {
    id: 'siswa-create',
    method: 'POST',
    path: '/api/siswa',
    title: 'Create Student',
    description: 'Menambahkan data siswa baru dengan validasi.',
    requiresAuth: true,
    request: {
      headers: {
        Authorization: { type: 'string', description: 'Bearer token', required: true },
      },
      body: {
        nama: { type: 'string', description: 'Nama lengkap siswa (3-100 karakter)', required: true },
        nis: { type: 'string', description: 'Nomor Induk Siswa (5-20 angka)', required: true },
        kelas: { type: 'string', description: 'Kelas siswa (format: X-IPA-1)', required: true },
        jurusan: { type: 'string', description: 'Jurusan siswa', required: true },
        email: { type: 'string', description: 'Email siswa (opsional)', required: false },
        telepon: { type: 'string', description: 'Nomor telepon (opsional)', required: false },
        alamat: { type: 'string', description: 'Alamat lengkap (opsional)', required: false },
      },
    },
    response: {
      success: {
        success: { type: 'boolean', description: 'Status keberhasilan request' },
        message: { type: 'string', description: 'Pesan sukses' },
        data: { type: 'object', description: 'Data siswa yang dibuat' },
      },
    },
    examples: {
      request: {
        curl: `curl -X POST https://your-domain.com/api/siswa \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nama": "Jane Doe",
    "nis": "12346",
    "kelas": "X-IPA-1",
    "jurusan": "IPA",
    "email": "jane@example.com",
    "telepon": "+628123456789",
    "alamat": "Jl. Contoh No. 2"
  }'`,
        javascript: `fetch('https://your-domain.com/api/siswa', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nama: 'Jane Doe',
    nis: '12346',
    kelas: 'X-IPA-1',
    jurusan: 'IPA',
    email: 'jane@example.com',
    telepon: '+628123456789',
    alamat: 'Jl. Contoh No. 2'
  })
}).then(res => res.json()).then(data => console.log(data));`,
      },
      response: {
        success: `{
  "success": true,
  "message": "Siswa berhasil ditambahkan",
  "data": {
    "id": "uuid-here",
    "nama": "Jane Doe",
    "nis": "12346",
    "kelas": "X-IPA-1",
    "jurusan": "IPA",
    "email": "jane@example.com",
    "telepon": "+628123456789",
    "alamat": "Jl. Contoh No. 2",
    "created_by": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}`,
        error: `{
  "success": false,
  "error": "NIS sudah terdaftar"
}`,
      },
    },
  },
  {
    id: 'siswa-update',
    method: 'PUT',
    path: '/api/siswa/[id]',
    title: 'Update Student',
    description: 'Mengubah data siswa yang sudah ada dengan validasi.',
    requiresAuth: true,
    request: {
      headers: {
        Authorization: { type: 'string', description: 'Bearer token', required: true },
      },
      params: {
        id: { type: 'string', description: 'ID siswa (UUID)', required: true },
      },
      body: {
        nama: { type: 'string', description: 'Nama lengkap siswa (opsional)', required: false },
        nis: { type: 'string', description: 'Nomor Induk Siswa (opsional)', required: false },
        kelas: { type: 'string', description: 'Kelas siswa (opsional)', required: false },
        jurusan: { type: 'string', description: 'Jurusan siswa (opsional)', required: false },
        email: { type: 'string', description: 'Email siswa (opsional)', required: false },
        telepon: { type: 'string', description: 'Nomor telepon (opsional)', required: false },
        alamat: { type: 'string', description: 'Alamat lengkap (opsional)', required: false },
      },
    },
    response: {
      success: {
        success: { type: 'boolean', description: 'Status keberhasilan request' },
        message: { type: 'string', description: 'Pesan sukses' },
        data: { type: 'object', description: 'Data siswa yang diupdate' },
      },
    },
    examples: {
      request: {
        curl: `curl -X PUT https://your-domain.com/api/siswa/uuid-here \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nama": "Jane Smith",
    "email": "jane.smith@example.com"
  }'`,
        javascript: `fetch('https://your-domain.com/api/siswa/uuid-here', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nama: 'Jane Smith',
    email: 'jane.smith@example.com'
  })
}).then(res => res.json()).then(data => console.log(data));`,
        java: `import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.json.JSONObject;

public class ApiClient {
    public static void main(String[] args) {
        String baseUrl = "https://your-domain.com";
        String token = "YOUR_TOKEN_HERE";
        String siswaId = "uuid-here";
        
        JSONObject requestBody = new JSONObject();
        requestBody.put("nama", "Jane Smith");
        requestBody.put("email", "jane.smith@example.com");
        
        Response response = RestAssured.given()
            .baseUri(baseUrl)
            .header("Authorization", "Bearer " + token)
            .header("Content-Type", "application/json")
            .pathParam("id", siswaId)
            .body(requestBody.toString())
            .put("/api/siswa/{id}");
        
        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Response: " + response.asString());
    }
}`,
      },
      response: {
        success: `{
  "success": true,
  "message": "Siswa berhasil diupdate",
  "data": {
    "id": "uuid-here",
    "nama": "Jane Smith",
    "nis": "12346",
    "kelas": "X-IPA-1",
    "jurusan": "IPA",
    "email": "jane.smith@example.com",
    "telepon": "+628123456789",
    "alamat": "Jl. Contoh No. 2",
    "created_by": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T01:00:00Z"
  }
}`,
        error: `{
  "success": false,
  "error": "Siswa tidak ditemukan"
}`,
      },
    },
  },
  {
    id: 'siswa-delete',
    method: 'DELETE',
    path: '/api/siswa/[id]',
    title: 'Delete Student',
    description: 'Menghapus data siswa berdasarkan ID.',
    requiresAuth: true,
    request: {
      headers: {
        Authorization: { type: 'string', description: 'Bearer token', required: true },
      },
      params: {
        id: { type: 'string', description: 'ID siswa (UUID)', required: true },
      },
    },
    response: {
      success: {
        success: { type: 'boolean', description: 'Status keberhasilan request' },
        message: { type: 'string', description: 'Pesan sukses' },
      },
    },
    examples: {
      request: {
        curl: `curl -X DELETE https://your-domain.com/api/siswa/uuid-here \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`,
        javascript: `fetch('https://your-domain.com/api/siswa/uuid-here', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
}).then(res => res.json()).then(data => console.log(data));`,
        java: `import io.restassured.RestAssured;
import io.restassured.response.Response;

public class ApiClient {
    public static void main(String[] args) {
        String baseUrl = "https://your-domain.com";
        String token = "YOUR_TOKEN_HERE";
        String siswaId = "uuid-here";
        
        Response response = RestAssured.given()
            .baseUri(baseUrl)
            .header("Authorization", "Bearer " + token)
            .pathParam("id", siswaId)
            .delete("/api/siswa/{id}");
        
        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Response: " + response.asString());
    }
}`,
      },
      response: {
        success: `{
  "success": true,
  "message": "Siswa berhasil dihapus"
}`,
        error: `{
  "success": false,
  "error": "Siswa tidak ditemukan"
}`,
      },
    },
  },
];

export const apiCategories = [
  { id: 'auth', name: 'Authentication', endpoints: ['auth-register', 'auth-login', 'auth-logout', 'auth-me'] },
  { id: 'siswa', name: 'Siswa Management', endpoints: ['siswa-list', 'siswa-detail', 'siswa-create', 'siswa-update', 'siswa-delete'] },
];
