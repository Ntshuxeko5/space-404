import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Exclude login page from protection
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // In a real app, you'd check cookies. 
    // Since we use localStorage for the token, client-side redirection is usually handled in the components.
    // However, for API routes under /api/admin (if any) or shared logic, we can check headers.
    
    // For now, most admin protection is handled via:
    // 1. Client-side checks in admin components (redirect to /admin/login if no token)
    // 2. Server-side token verification in API routes (returning 401 if unauthorized)
    
    // We can add a simple cookie check here if we transition to cookies later.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (handled by API routes internal logic)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
