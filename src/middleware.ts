import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_HINT_COOKIE } from '@/lib/auth/constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/account') || pathname.startsWith('/admin')) {
    const hint = request.cookies.get(AUTH_HINT_COOKIE);
    if (!hint?.value) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
