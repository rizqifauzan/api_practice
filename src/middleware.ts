import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { 
  checkRateLimit, 
  getIdentifierFromIP, 
  getRateLimitHeaders, 
  isRateLimitingEnabled 
} from '@/lib/rate-limiter';

// Routes yang tidak memerlukan authentication
const publicRoutes = ['/', '/login', '/register', '/api-docs', '/api/auth/login', '/api/auth/register', '/api/auth/logout'];
const apiRoutes = ['/api/'];

// Routes yang akan melewati rate limiting (opsional, untuk testing)
const bypassRateLimitRoutes = ['/api/security/status'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // Cek jika route harus melewati rate limiting
  const shouldBypassRateLimit = bypassRateLimitRoutes.some(route => pathname.startsWith(route));

  // Jalankan rate limiting (kecuali untuk bypass routes)
  if (!shouldBypassRateLimit && isRateLimitingEnabled()) {
    const identifier = getIdentifierFromIP(ip);
    const rateLimitResult = await checkRateLimit(identifier);

    if (!rateLimitResult.success) {
      console.warn('[Rate Limit Exceeded]', {
        ip,
        endpoint: pathname,
        method: request.method,
        limit: rateLimitResult.limit,
        retryAfter: rateLimitResult.retryAfter,
      });

      return NextResponse.json(
        { 
          success: false, 
          error: 'Too Many Requests', 
          message: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.` 
        },
        { 
          status: 429,
          headers: {
            ...getRateLimitHeaders(rateLimitResult),
            'Content-Type': 'application/json',
          }
        }
      );
    }
  }

  // Cek jika route adalah public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Cek jika route adalah API route
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route));

  // Jika public route, lanjutkan dengan rate limit headers
  if (isPublicRoute) {
    const response = NextResponse.next();
    
    // Tambahkan rate limit headers jika rate limiting diaktifkan
    if (isRateLimitingEnabled() && !shouldBypassRateLimit) {
      const identifier = getIdentifierFromIP(ip);
      const rateLimitResult = await checkRateLimit(identifier);
      Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }

    // Tambahkan security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    return response;
  }

  // Untuk API routes yang dilindungi
  if (isApiRoute) {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Token tidak ditemukan' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Token tidak valid' },
        { status: 401 }
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

    // Tambahkan rate limit headers jika rate limiting diaktifkan
    if (isRateLimitingEnabled() && !shouldBypassRateLimit) {
      const identifier = getIdentifierFromIP(ip);
      const rateLimitResult = await checkRateLimit(identifier);
      Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }

    // Tambahkan security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    return response;
  }

  // Untuk protected page routes
  const token = request.cookies.get('token')?.value;
  if (!token) {
    // Redirect ke login jika tidak ada token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    // Redirect ke login jika token tidak valid
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const response = NextResponse.next();

  // Tambahkan rate limit headers jika rate limiting diaktifkan
  if (isRateLimitingEnabled() && !shouldBypassRateLimit) {
    const identifier = getIdentifierFromIP(ip);
    const rateLimitResult = await checkRateLimit(identifier);
    Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  // Tambahkan security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

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
