import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseConfig } from '@/firebase/config';

// Initialize firebase config to check for maintenance mode from environment variables
// This is a simplified check. In a real app, you might use a more robust config source.
try {
  getFirebaseConfig();
} catch (e) {
  // Silently fail if config is not present
}


async function getSession(cookie: string | undefined) {
  if (!cookie) return null;
  
  // The site URL is required to make an absolute URL fetch to the internal API route
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error("NEXT_PUBLIC_SITE_URL is not set. Session verification will fail.");
    return null;
  }

  try {
    const response = await fetch(`${siteUrl}/api/auth/session-verify`, {
      headers: {
        Cookie: `__session=${cookie}`,
      },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Session verification fetch failed:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check for Maintenance Mode
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode && !pathname.startsWith('/admin') && !pathname.startsWith('/api/auth')) {
      return NextResponse.rewrite(new URL('/maintenance', request.url));
  }
  
  // 2. Handle Admin Route Protection
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('__session')?.value;
    const session = await getSession(sessionCookie);
    const isLoginPage = pathname.startsWith('/admin/login');

    if (!session && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (session && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/ (API routes, but we exclude auth routes for maintenance mode check)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image/ (public images)
     */
    '/((?!api/auth/|_next/static|_next/image|favicon.ico|image/).*)',
    // We explicitly include /admin/login to ensure it's processed by middleware
    '/admin/login' 
  ],
};
