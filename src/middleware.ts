
import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/firebase/admin';

async function verifySession(sessionCookie: string | undefined) {
  if (!sessionCookie) return null;
  try {
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      console.error("Firebase Admin Auth is not initialized.");
      return null;
    }
    return await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    console.warn("Could not verify session cookie:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check for Maintenance Mode from environment variables
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const isUnderMaintenancePath = pathname === '/maintenance';

  if (isMaintenanceMode && !pathname.startsWith('/admin') && !pathname.startsWith('/api') && !isUnderMaintenancePath) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }
  
  if (!isMaintenanceMode && isUnderMaintenancePath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Handle Admin Route Protection
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('__session')?.value;
    const decodedToken = await verifySession(sessionCookie);
    const isLoginPage = pathname.startsWith('/admin/login');

    if (!decodedToken) {
      if (!isLoginPage) {
        // If no user and not on the login page, redirect to login
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } else {
      // If user is logged in and tries to access login page, redirect to dashboard
      if (isLoginPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - image/ (public images)
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|image/).*)'],
};
