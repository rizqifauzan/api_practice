/**
 * Rate Limiting
 * Membatasi jumlah request per IP dalam periode waktu tertentu
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limit configuration
interface RateLimitConfig {
  window: number;  // dalam detik
  limit: number;  // jumlah request maksimum
}

// Default rate limit configurations
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  minute: { window: 60, limit: 100 },      // 100 request/menit
  fiveMinutes: { window: 300, limit: 500 }, // 500 request/5 menit
  hour: { window: 3600, limit: 1000 },     // 1000 request/jam
};

// In-memory storage untuk development/fallback
interface InMemoryStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

class InMemoryRateLimiter {
  private store: InMemoryStore = {};

  async limit(identifier: string, config: RateLimitConfig): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const resetAt = now + config.window * 1000;
    const key = `${identifier}:${config.window}`;

    // Clean up expired entries
    if (this.store[key] && this.store[key].resetAt < now) {
      delete this.store[key];
    }

    // Get or create entry
    if (!this.store[key]) {
      this.store[key] = { count: 0, resetAt };
    }

    const entry = this.store[key];
    const remaining = Math.max(0, config.limit - entry.count - 1);

    if (entry.count >= config.limit) {
      return {
        success: false,
        limit: config.limit,
        remaining: 0,
        reset: entry.resetAt,
      };
    }

    entry.count++;

    return {
      success: true,
      limit: config.limit,
      remaining,
      reset: entry.resetAt,
    };
  }

  reset(identifier: string): void {
    // Reset all entries for this identifier
    Object.keys(this.store).forEach(key => {
      if (key.startsWith(identifier)) {
        delete this.store[key];
      }
    });
  }
}

// Rate limiter instance
let rateLimiter: Ratelimit | InMemoryRateLimiter | null = null;
let useInMemory = false;

/**
 * Inisialisasi rate limiter
 */
export function initRateLimiter() {
  // Cek environment variables untuk Upstash Redis
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken && !useInMemory) {
    // Gunakan Upstash Redis untuk production
    try {
      const redis = new Redis({
        url: redisUrl,
        token: redisToken,
      });

      // Gunakan sliding window algorithm untuk lebih akurat
      rateLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(RATE_LIMIT_CONFIGS.minute.limit, `${RATE_LIMIT_CONFIGS.minute.window} s`),
        analytics: true,
      });

      console.log('Rate limiter initialized with Upstash Redis');
    } catch (error) {
      console.error('Failed to initialize Upstash Redis, falling back to in-memory:', error);
      useInMemory = true;
      rateLimiter = new InMemoryRateLimiter();
      console.log('Rate limiter initialized with in-memory storage');
    }
  } else {
    // Gunakan in-memory untuk development
    useInMemory = true;
    rateLimiter = new InMemoryRateLimiter();
    console.log('Rate limiter initialized with in-memory storage');
  }
}

/**
 * Cek rate limit untuk identifier tertentu
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.minute
): Promise<RateLimitResult> {
  // Inisialisasi jika belum
  if (!rateLimiter) {
    initRateLimiter();
  }

  try {
    if (useInMemory && rateLimiter instanceof InMemoryRateLimiter) {
      const result = await rateLimiter.limit(identifier, config);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
      };
    } else if (rateLimiter instanceof Ratelimit) {
      // Gunakan Upstash Redis
      const result = await rateLimiter.limit(identifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
      };
    }

    // Fallback jika rateLimiter tidak terinisialisasi
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: Date.now() + config.window * 1000,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Pada error, izinkan request (fail-open)
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: Date.now() + config.window * 1000,
    };
  }
}

/**
 * Reset rate limit untuk identifier tertentu (untuk testing/admin)
 */
export function resetRateLimit(identifier: string): void {
  if (useInMemory && rateLimiter instanceof InMemoryRateLimiter) {
    rateLimiter.reset(identifier);
  }
  // Untuk Upstash Redis, tidak perlu reset karena akan expire otomatis
}

/**
 * Generate identifier dari request
 */
export function getIdentifierFromIP(ip: string): string {
  // Sanitize IP untuk digunakan sebagai key
  return ip.replace(/[:.]/g, '_');
}

/**
 * Generate identifier dari request dengan prefix
 */
export function getIdentifier(prefix: string, ip: string): string {
  return `${prefix}:${getIdentifierFromIP(ip)}`;
}

/**
 * Cek apakah rate limiting diaktifkan
 */
export function isRateLimitingEnabled(): boolean {
  return process.env.RATE_LIMIT_ENABLED !== 'false';
}

/**
 * Get rate limit headers untuk response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
    ...(result.retryAfter && { 'Retry-After': result.retryAfter.toString() }),
  };
}
