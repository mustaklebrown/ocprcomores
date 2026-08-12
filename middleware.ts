import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ocpr_comores_super_secure_jwt_secret_2026_key_change_in_prod'
);

const COOKIE_NAME = 'ocpr_admin_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes & login route
  if (
    pathname === '/admin/login' ||
    pathname === '/api/admin/login' ||
    !pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')
  ) {
    return NextResponse.next();
  }

  // 2. Extract token from HttpOnly cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Accès non autorisé. Identifiant ou jeton manquant.' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Verify JWT validity
  try {
    const verified = await jwtVerify(token, JWT_SECRET);

    // Add security headers to response
    const response = NextResponse.next();
    response.headers.set('X-Admin-User', String(verified.payload.email || ''));
    return response;
  } catch (err) {
    // Invalid or expired token
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Session expirée ou jeton invalide. Veuillez vous reconnecter.' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('error', 'session_expired');
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
