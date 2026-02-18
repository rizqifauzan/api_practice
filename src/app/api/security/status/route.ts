/**
 * Security Status Endpoint
 * Endpoint untuk cek status rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { isRateLimitingEnabled, RATE_LIMIT_CONFIGS, checkRateLimit, getIdentifierFromIP } from '@/lib/rate-limiter';

export async function GET(request: NextRequest) {
  try {
    // Ekstrak IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

    let ip = 'unknown';
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    } else if (realIP) {
      ip = realIP;
    } else if (cfConnectingIP) {
      ip = cfConnectingIP;
    } else {
      ip = request.ip || 'unknown';
    }

    // Cek rate limit status untuk IP ini
    let rateLimitStatus = null;
    if (isRateLimitingEnabled()) {
      const identifier = getIdentifierFromIP(ip);
      rateLimitStatus = await checkRateLimit(identifier);
    }

    const status = {
      timestamp: new Date().toISOString(),
      ip,
      features: {
        rateLimiting: isRateLimitingEnabled(),
      },
      rateLimitConfig: RATE_LIMIT_CONFIGS,
      yourRateLimitStatus: rateLimitStatus ? {
        success: rateLimitStatus.success,
        limit: rateLimitStatus.limit,
        remaining: rateLimitStatus.remaining,
        reset: new Date(rateLimitStatus.reset).toISOString(),
        retryAfter: rateLimitStatus.retryAfter,
      } : null,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasUpstashRedis: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
      },
    };

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Security status check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get security status',
      },
      { status: 500 }
    );
  }
}
