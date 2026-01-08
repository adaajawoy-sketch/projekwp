import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Cek apakah user mau masuk ke halaman admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // 2. Cek apakah user punya "Tiket" (Cookie admin_session)
    const isAdmin = request.cookies.get('admin_session');

    // 3. Kalau tidak punya tiket, tendang ke halaman login
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Konfigurasi: Middleware ini hanya aktif di folder /admin
export const config = {
  matcher: '/admin/:path*',
};