import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import {
  performSecurityChecks,
  getSecurityHeaders,
  getClientIP,
  isIPWhitelisted,
  isIPBlacklisted,
  logSecurityEvent
} from '@/lib/security';

// Routes yang tidak memerlukan authentication
const publicRoutes = ['/', '/login', '/register', '/api-docs', '/api/auth/login', '/api/auth/register', '/api/auth/logout'];
const apiRoutes = ['/api/'];

// Routes yang akan melewati security checks (opsional, untuk testing)
const bypassSecurityRoutes = ['/api/health', '/api/security/status'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);

  // Cek IP blacklist/whitelist
  if (isIPBlacklisted(ip)) {
    logSecurityEvent('security-check-failed', {
      ip,
      userAgent: request.headers.get('user-agent') || undefined,
      endpoint: pathname,
      method: request.method,
      reason: 'IP is blacklisted',
    });
    return NextResponse.json(
      { success: false, error: 'Forbidden', message: 'Your IP has been blocked' },
      { status: 403, headers: getSecurityHeaders() }
    );
  }

  // Cek jika route harus melewati security checks
  const shouldBypassSecurity = bypassSecurityRoutes.some(route => pathname.startsWith(route));

  // Jalankan security checks (kecuali untuk bypass routes)
  if (!shouldBypassSecurity) {
    const securityResult = await performSecurityChecks(request, pathname);

    if (!securityResult.allowed) {
      // Log security event
      logSecurityEvent(
        securityResult.statusCode === 403 ? 'user-agent-blocked' : 'rate-limit-exceeded',
        {
          ip,
          userAgent: request.headers.get('user-agent') || undefined,
          endpoint: pathname,
          method: request.method,
          reason: securityResult.reason,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error: securityResult.error,
          message: securityResult.reason
        },
        {
          status: securityResult.statusCode,
          headers: {
            ...getSecurityHeaders(),
            ...(securityResult.headers || {}),
          }
        }
      );
    }
  }

  // Cek jika route adalah public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Cek jika route adalah API route
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route));

  // Jika public route, lanjutkan dengan security headers
  if (isPublicRoute) {
    const response = NextResponse.next();
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Untuk API routes yang dilindungi
  if (isApiRoute) {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Token tidak ditemukan' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Token tidak valid' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Tambahkan user info ke headers untuk digunakan di route handler
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-email', payload.email);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Tambahkan security headers
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // Untuk protected page routes
  const token = request.cookies.get('token')?.value;
  if (!token) {
    // Redirect ke login jika tidak ada token
    const response = NextResponse.redirect(new URL('/login', request.url));
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  const payload = await verifyToken(token);
  if (!payload) {
    // Redirect ke login jika token tidak valid
    const response = NextResponse.redirect(new URL('/login', request.url));
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  const response = NextResponse.next();
  Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
