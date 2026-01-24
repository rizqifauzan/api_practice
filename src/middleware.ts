import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// Routes yang tidak memerlukan authentication
const publicRoutes = ['/', '/login', '/register', '/api-docs', '/api/auth/login', '/api/auth/register', '/api/auth/logout'];
const apiRoutes = ['/api/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek jika route adalah public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Cek jika route adalah API route
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route));

  // Jika public route, lanjutkan
  if (isPublicRoute) {
    return NextResponse.next();
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

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
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

  return NextResponse.next();
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
