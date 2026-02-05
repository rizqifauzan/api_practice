/**
 * Security Utility Functions
 * Fungsi-fungsi helper untuk security dan proteksi
 */

import type { NextRequest } from 'next/server';
import { checkUserAgent } from './user-agent-blocker';
import { checkRateLimit, getIdentifierFromIP, getRateLimitHeaders, isRateLimitingEnabled } from './rate-limiter';
import { addRequestRecord, detectSuspiciousPattern, isPatternDetectionEnabled } from './pattern-detector';

export interface SecurityCheckResult {
  allowed: boolean;
  statusCode?: number;
  headers?: Record<string, string>;
  error?: string;
  reason?: string;
}

/**
 * Ekstrak IP address dari request
 */
export function getClientIP(request: NextRequest): string {
  // Cek berbagai header yang mungkin berisi IP asli
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

  if (forwardedFor) {
    // x-forwarded-for bisa berisi multiple IPs, ambil yang pertama
    return forwardedFor.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback ke IP dari request
  return request.ip || 'unknown';
}

/**
 * Cek apakah request dari localhost (untuk development)
 */
export function isLocalhost(ip: string): boolean {
  const localhostPatterns = [
    '127.0.0.1',
    '::1',
    'localhost',
    '0.0.0.0',
  ];

  return localhostPatterns.includes(ip);
}

/**
 * Jalankan semua security checks
 */
export async function performSecurityChecks(
  request: NextRequest,
  endpoint: string
): Promise<SecurityCheckResult> {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent');
  const method = request.method;

  // Skip security checks untuk localhost di development (bisa di-disable dengan env var)
  const skipLocalhostSecurity = process.env.SKIP_LOCALHOST_SECURITY !== 'false';
  if (skipLocalhostSecurity && isLocalhost(ip) && process.env.NODE_ENV === 'development') {
    return { allowed: true };
  }

  // 1. User-Agent Blocking
  const userAgentCheck = checkUserAgent(userAgent);
  if (userAgentCheck.blocked) {
    return {
      allowed: false,
      statusCode: 403,
      error: 'Forbidden',
      reason: userAgentCheck.reason || 'User-Agent blocked',
    };
  }

  // 2. Rate Limiting
  if (isRateLimitingEnabled()) {
    const identifier = getIdentifierFromIP(ip);
    const rateLimitResult = await checkRateLimit(identifier);

    if (!rateLimitResult.success) {
      return {
        allowed: false,
        statusCode: 429,
        headers: getRateLimitHeaders(rateLimitResult),
        error: 'Too Many Requests',
        reason: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`,
      };
    }
  }

  // 3. Request Pattern Detection
  if (isPatternDetectionEnabled()) {
    // Add record untuk tracking
    addRequestRecord(ip, endpoint, method);

    // Cek pola mencurigakan
    const patternResult = detectSuspiciousPattern(ip);
    if (patternResult.suspicious) {
      return {
        allowed: false,
        statusCode: 403,
        error: 'Forbidden',
        reason: `Suspicious request pattern detected: ${patternResult.reason}`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Generate security headers untuk response
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
}

/**
 * Cek apakah security diaktifkan secara global
 */
export function isSecurityEnabled(): boolean {
  return process.env.SECURITY_ENABLED !== 'false';
}

/**
 * Get IP dari identifier (reverse dari getIdentifierFromIP)
 */
export function getIPFromIdentifier(identifier: string): string {
  return identifier.replace(/_/g, '.');
}

/**
 * Sanitize input untuk mencegah XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate IP address format
 */
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Log security event
 */
export function logSecurityEvent(
  type: 'user-agent-blocked' | 'rate-limit-exceeded' | 'suspicious-pattern' | 'security-check-failed',
  details: {
    ip: string;
    userAgent?: string;
    endpoint?: string;
    method?: string;
    reason?: string;
  }
): void {
  const logData = {
    timestamp: new Date().toISOString(),
    type,
    ...details,
  };

  // Log ke console (di production bisa dikirim ke monitoring service)
  console.warn('[Security Event]', JSON.stringify(logData));
}

/**
 * Get whitelist IP addresses dari environment variable
 */
export function getWhitelistedIPs(): string[] {
  const whitelist = process.env.WHITELISTED_IPS || '';
  return whitelist.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0);
}

/**
 * Cek apakah IP di-whitelist
 */
export function isIPWhitelisted(ip: string): boolean {
  const whitelist = getWhitelistedIPs();
  return whitelist.includes(ip);
}

/**
 * Get blacklist IP addresses dari environment variable
 */
export function getBlacklistedIPs(): string[] {
  const blacklist = process.env.BLACKLISTED_IPS || '';
  return blacklist.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0);
}

/**
 * Cek apakah IP di-blacklist
 */
export function isIPBlacklisted(ip: string): boolean {
  const blacklist = getBlacklistedIPs();
  return blacklist.includes(ip);
}
