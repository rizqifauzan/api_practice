# Tutorial: Proteksi Performance Test

## Ringkasan

Tutorial ini menjelaskan cara mengimplementasikan proteksi untuk mencegah user melakukan performance test pada aplikasi web yang di-deploy di Vercel. Proteksi ini menggunakan tiga lapisan:

1. **User-Agent Blocking** - Memblokir tools performance testing yang dikenali
2. **Rate Limiting** - Membatasi jumlah request per IP dalam periode waktu tertentu
3. **Request Pattern Detection** - Mendeteksi pola request yang mencurigakan

## Struktur File

```
src/
├── lib/
│   ├── user-agent-blocker.ts    # User-Agent blocking logic
│   ├── rate-limiter.ts          # Rate limiting logic
│   ├── pattern-detector.ts       # Request pattern detection
│   └── security.ts             # Security utility functions
├── middleware.ts               # Middleware dengan proteksi security
└── app/
    └── api/
        └── security/
            └── status/         # Endpoint untuk cek status security
                └── route.ts
```

## Instalasi

### 1. Install Dependencies

```bash
npm install @upstash/ratelimit @upstash/redis
```

### 2. Setup Upstash Redis (Untuk Production)

1. Buat akun di [Upstash](https://upstash.com/)
2. Buat database Redis baru
3. Copy REST URL dan REST Token
4. Tambahkan ke environment variables

### 3. Konfigurasi Environment Variables

Tambahkan ke `.env.local` untuk development:

```env
# Security Configuration
SKIP_LOCALHOST_SECURITY=false  # Set false untuk testing proteksi di localhost
SECURITY_ENABLED=true
RATE_LIMIT_ENABLED=true
USER_AGENT_BLOCK_ENABLED=true
PATTERN_DETECTION_ENABLED=true

# Upstash Redis (untuk production)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# IP Whitelist/Blacklist (opsional)
# WHITELISTED_IPS=1.2.3.4,5.6.7.8
# BLACKLISTED_IPS=9.10.11.12,13.14.15.16
```

Untuk Vercel, tambahkan environment variables di dashboard Vercel:

1. Buka project di Vercel
2. Settings → Environment Variables
3. Tambahkan semua variables di atas

## Fitur

### 1. User-Agent Blocking

Memblokir request dari tools performance testing yang dikenali:

**Tools yang diblokir:**
- Apache Bench (`ab/`)
- JMeter (`Apache-JMeter`)
- k6 (`k6/`)
- Locust (`locust/`)
- Gatling (`Gatling`)
- wrk (`wrk/`)
- hey (`hey/`)
- curl (`curl/`)
- wget (`wget/`)
- Postman (`PostmanRuntime`)
- Headless browsers (Puppeteer, Playwright, dll)

**Browser yang diizinkan:**
- Chrome
- Firefox
- Safari
- Edge
- Search engine bots (Googlebot, Bingbot, dll)

### 2. Rate Limiting

Membatasi jumlah request per IP:

| Window | Limit | Deskripsi |
|--------|-------|-----------|
| 1 menit | 100 request | Untuk burst protection |
| 5 menit | 500 request | Untuk sustained load |
| 1 jam | 1000 request | Untuk long-term protection |

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2026-02-05T02:30:00.000Z
Retry-After: 30
```

### 3. Request Pattern Detection

Mendeteksi pola request yang mencurigakan:

- **Burst Requests**: >10 request dalam 1 detik
- **Exact Interval**: Request dengan interval yang sama persis
- **Same Endpoint**: >20 request ke endpoint yang sama dalam 5 detik

## Penggunaan

### Cek Status Security

```bash
curl http://localhost:3000/api/security/status
```

Response:
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-02-05T02:30:00.000Z",
    "ip": "::1",
    "features": {
      "rateLimiting": true,
      "userAgentBlocking": true,
      "patternDetection": true
    },
    "rateLimitConfig": {
      "minute": { "window": 60, "limit": 100 },
      "fiveMinutes": { "window": 300, "limit": 500 },
      "hour": { "window": 3600, "limit": 1000 }
    },
    "yourRequestStats": {
      "totalRequests": 0,
      "uniqueEndpoints": 0,
      "oldestRequest": null,
      "newestRequest": null
    },
    "environment": {
      "nodeEnv": "development",
      "hasUpstashRedis": false
    }
  }
}
```

### Testing User-Agent Blocking

```bash
# Request dengan Apache Bench User-Agent (akan diblokir)
curl -H "User-Agent: ab/2.3" http://localhost:3000/api/siswa

# Response:
# {
#   "success": false,
#   "error": "Forbidden",
#   "message": "Blocked User-Agent pattern: ab/"
# }
```

### Testing Rate Limiting

```bash
# Lakukan banyak request dengan cepat
for i in {1..150}; do
  curl -s http://localhost:3000/api/siswa &
done
wait

# Response setelah limit tercapai:
# {
#   "success": false,
#   "error": "Too Many Requests",
#   "message": "Rate limit exceeded. Try again in 30 seconds."
# }
```

## Konfigurasi Lanjutan

### Mengubah Rate Limit

Edit file `src/lib/rate-limiter.ts`:

```typescript
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  minute: { window: 60, limit: 200 },      // Ubah dari 100 ke 200
  fiveMinutes: { window: 300, limit: 1000 }, // Ubah dari 500 ke 1000
  hour: { window: 3600, limit: 2000 },     // Ubah dari 1000 ke 2000
};
```

### Menambah User-Agent ke Blocklist

Edit file `src/lib/user-agent-blocker.ts`:

```typescript
const BLOCKLISTED_PATTERNS = [
  // ... patterns yang sudah ada
  /custom-tool\//i,  // Tambah custom tool
];
```

### Menambah User-Agent ke Whitelist

Edit file `src/lib/user-agent-blocker.ts`:

```typescript
const WHITELISTED_PATTERNS = [
  // ... patterns yang sudah ada
  /MyCustomBot/i,  // Tambah custom bot
];
```

### Mengubah Pattern Detection Threshold

Edit file `src/lib/pattern-detector.ts`:

```typescript
const PATTERN_CONFIG = {
  burstThreshold: 20,      // Ubah dari 10 ke 20
  burstWindow: 2000,      // Ubah dari 1000 ke 2000ms
  exactIntervalThreshold: 10,  // Ubah dari 5 ke 10
  sameEndpointThreshold: 50,    // Ubah dari 20 ke 50
  // ...
};
```

## Deployment ke Vercel

### 1. Setup Upstash Redis

1. Login ke [Upstash Console](https://console.upstash.com/)
2. Create Database → pilih region terdekat dengan Vercel
3. Copy REST URL dan REST Token
4. Add ke Vercel Environment Variables

### 2. Add Environment Variables di Vercel

Di Vercel Dashboard → Settings → Environment Variables:

```
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
SECURITY_ENABLED=true
RATE_LIMIT_ENABLED=true
USER_AGENT_BLOCK_ENABLED=true
PATTERN_DETECTION_ENABLED=true
```

### 3. Deploy

```bash
git add .
git commit -m "Add performance test protection"
git push
```

Vercel akan otomatis deploy.

## Monitoring

### Log Security Events

Semua security event di-log ke console. Untuk production, Anda bisa:

1. Integrasikan dengan Vercel Analytics
2. Kirim ke monitoring service (Sentry, Datadog, dll)
3. Simpan ke database untuk analisis

### Endpoint Monitoring

Gunakan endpoint `/api/security/status` untuk monitoring:

```bash
# Check status dari monitoring service
curl https://your-app.vercel.app/api/security/status
```

## Troubleshooting

### Masalah: Rate limiting tidak berfungsi di production

**Solusi:** Pastikan Upstash Redis dikonfigurasi dengan benar:

```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Masalah: User-Agent blocking memblokir user yang valid

**Solusi:** Tambah user-agent ke whitelist di `src/lib/user-agent-blocker.ts`:

```typescript
const WHITELISTED_PATTERNS = [
  // ... existing patterns
  /YourValidBrowser/i,
];
```

### Masalah: Pattern detection false positive

**Solusi:** Tingkatkan threshold di `src/lib/pattern-detector.ts`:

```typescript
const PATTERN_CONFIG = {
  burstThreshold: 20,      // Naikkan dari 10
  sameEndpointThreshold: 50,  // Naikkan dari 20
  // ...
};
```

### Masalah: Development mode selalu melewati security checks

**Solusi:** Set environment variable:

```env
SKIP_LOCALHOST_SECURITY=false
```

## Best Practices

1. **Gunakan Upstash Redis untuk production** - In-memory storage tidak cocok untuk production
2. **Monitor rate limit hits** - Sesuaikan limit berdasarkan traffic normal
3. **Log security events** - Untuk analisis dan debugging
4. **Test secara berkala** - Pastikan proteksi tidak memblokir user valid
5. **Update blocklist secara berkala** - Tools baru mungkin muncul

## Referensi

- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Vercel Edge Runtime](https://vercel.com/docs/concepts/functions/edge-functions)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
