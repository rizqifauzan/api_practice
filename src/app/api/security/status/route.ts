/**
 * Security Status Endpoint
 * Endpoint untuk cek status security dan konfigurasi
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClientIP } from '@/lib/security';
import { isRateLimitingEnabled, RATE_LIMIT_CONFIGS } from '@/lib/rate-limiter';
import { isPatternDetectionEnabled, getRequestStats } from '@/lib/pattern-detector';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const requestStats = getRequestStats(ip);

    const status = {
      timestamp: new Date().toISOString(),
      ip,
      features: {
        rateLimiting: isRateLimitingEnabled(),
        userAgentBlocking: process.env.USER_AGENT_BLOCK_ENABLED !== 'false',
        patternDetection: isPatternDetectionEnabled(),
      },
      rateLimitConfig: RATE_LIMIT_CONFIGS,
      yourRequestStats: {
        totalRequests: requestStats.totalRequests,
        uniqueEndpoints: requestStats.uniqueEndpoints,
        oldestRequest: requestStats.oldestRequest ? new Date(requestStats.oldestRequest).toISOString() : null,
        newestRequest: requestStats.newestRequest ? new Date(requestStats.newestRequest).toISOString() : null,
      },
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
