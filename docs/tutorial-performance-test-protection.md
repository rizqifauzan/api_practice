# Tutorial: Rate Limiting untuk Mencegah Performance Test

## Ringkasan

Tutorial ini menjelaskan cara mengimplementasikan rate limiting untuk mencegah user melakukan performance test pada aplikasi web yang di-deploy di Vercel. Rate limiting membatasi jumlah request per IP dalam periode waktu tertentu.

## Struktur File

```
src/
├── lib/
│   └── rate-limiter.ts          # Rate limiting logic
├── middleware.ts               # Middleware dengan rate limiting
└── app/
    └── api/
        └── security/
            └── status/         # Endpoint untuk cek status rate limiting
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
# Rate Limiting Configuration
RATE_LIMIT_ENABLED=true

# Upstash Redis (opsional untuk development, wajib untuk production)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

Untuk Vercel, tambahkan environment variables di dashboard Vercel:

1. Buka project di Vercel
2. Settings → Environment Variables
3. Tambahkan semua variables di atas

## Fitur

### Rate Limiting

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
X-RateLimit-Reset: 2026-02-18T03:30:00.000Z
Retry-After: 30
```

**Response saat limit tercapai (HTTP 429):**
```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 30 seconds."
}
```

## Penggunaan

### Cek Status Rate Limiting

```bash
curl http://localhost:3000/api/security/status
```

Response:
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-02-18T03:30:00.000Z",
    "ip": "::1",
    "features": {
      "rateLimiting": true
    },
    "rateLimitConfig": {
      "minute": { "window": 60, "limit": 100 },
      "fiveMinutes": { "window": 300, "limit": 500 },
      "hour": { "window": 3600, "limit": 1000 }
    },
    "yourRateLimitStatus": {
      "success": true,
      "limit": 100,
      "remaining": 95,
      "reset": "2026-02-18T03:31:00.000Z",
      "retryAfter": null
    },
    "environment": {
      "nodeEnv": "development",
      "hasUpstashRedis": false
    }
  }
}
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

### Menambah Custom Rate Limit Window

Edit file `src/lib/rate-limiter.ts`:

```typescript
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // ... existing configs
  day: { window: 86400, limit: 10000 },  // Tambah limit per hari
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
RATE_LIMIT_ENABLED=true
```

### 3. Deploy

```bash
git add .
git commit -m "Add rate limiting protection"
git push
```

Vercel akan otomatis deploy.

## Monitoring

### Endpoint Monitoring

Gunakan endpoint `/api/security/status` untuk monitoring:

```bash
# Check status dari monitoring service
curl https://your-app.vercel.app/api/security/status
```

### Log Rate Limit Events

Semua rate limit events di-log ke console. Untuk production, Anda bisa:

1. Integrasikan dengan Vercel Analytics
2. Kirim ke monitoring service (Sentry, Datadog, dll)
3. Simpan ke database untuk analisis

## Troubleshooting

### Masalah: Rate limiting tidak berfungsi di production

**Solusi:** Pastikan Upstash Redis dikonfigurasi dengan benar:

```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Masalah: Rate limit terlalu ketat untuk user normal

**Solusi:** Sesuaikan limit di `src/lib/rate-limiter.ts`:

```typescript
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  minute: { window: 60, limit: 200 },      // Naikkan limit
  fiveMinutes: { window: 300, limit: 1000 }, // Naikkan limit
  hour: { window: 3600, limit: 2000 },     // Naikkan limit
};
```

### Masalah: Rate limit tidak berfungsi di development

**Solusi:** Pastikan `RATE_LIMIT_ENABLED=true` di `.env.local`:

```env
RATE_LIMIT_ENABLED=true
```

## Best Practices

1. **Gunakan Upstash Redis untuk production** - In-memory storage tidak cocok untuk production
2. **Monitor rate limit hits** - Sesuaikan limit berdasarkan traffic normal
3. **Log rate limit events** - Untuk analisis dan debugging
4. **Test secara berkala** - Pastikan rate limiting tidak memblokir user valid
5. **Set appropriate limits** - Sesuaikan dengan kebutuhan aplikasi

## Security Headers

Middleware juga menambahkan security headers ke semua response:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

## Referensi

- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Vercel Edge Runtime](https://vercel.com/docs/concepts/functions/edge-functions)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HTTP Rate Limiting Best Practices](https://tools.ietf.org/html/rfc6585)
