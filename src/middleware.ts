
import { NextRequest, NextResponse } from 'next/server';
import { getMaintenanceModeSettings } from '@/services/settings';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check for Maintenance Mode from Firestore
  try {
    const maintenanceSettings = await getMaintenanceModeSettings();
    const isMaintenanceMode = maintenanceSettings.isEnabled;
    const isUnderMaintenancePath = pathname === '/maintenance';

    // Allow access to admin, API, and the maintenance page itself
    const isAllowedPath = pathname.startsWith('/admin') || pathname.startsWith('/api') || isUnderMaintenancePath;

    if (isMaintenanceMode && !isAllowedPath) {
      return NextResponse.rewrite(new URL('/maintenance', request.url));
    }
    
    if (!isMaintenanceMode && isUnderMaintenancePath) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    console.error("Middleware error checking maintenance mode:", error);
    // If we can't check the setting, proceed as if it's disabled.
  }


  // 2. Handle Admin Route Protection
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('__session')?.value;
    const isLoginPage = pathname.startsWith('/admin/login');

    if (!sessionCookie) {
      if (!isLoginPage) {
        // If no user and not on the login page, redirect to login
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } else {
      // If user is logged in and tries to access login page, redirect to dashboard
      // Note: We are not verifying the cookie here, just checking for its presence.
      // Verification happens in Server Components/Actions via getCurrentUser.
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
