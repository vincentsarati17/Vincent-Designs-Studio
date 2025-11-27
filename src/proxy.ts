
import { NextRequest, NextResponse } from 'next/server';

async function getSession(cookie: string | undefined) {
  if (!cookie) return null;
  
  // Ensure NEXT_PUBLIC_SITE_URL is set in your environment
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error("NEXT_PUBLIC_SITE_URL is not set. Session verification will fail.");
    return null;
  }

  const response = await fetch(`${siteUrl}/api/auth/session-verify`, {
    headers: {
      Cookie: `__session=${cookie}`,
    },
  });

  if (!response.ok) return null;

  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check for Maintenance Mode via environment variable
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      // Allow essential assets to pass through
      if (pathname.startsWith('/_next/') || pathname.includes('.')) {
          return NextResponse.next();
      }
      // Rewrite other requests to the maintenance page
      return NextResponse.rewrite(new URL('/maintenance', request.url));
  }
  
  // 2. Handle Admin Route Protection
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('__session')?.value;
    const user = await getSession(sessionCookie);
    const isLoginPage = pathname === '/admin/login';
    const isAdminAsset = pathname.startsWith('/image/background-img-admin.jpg');

    // Allow access to the admin background image regardless of session
    if (isAdminAsset) {
      return NextResponse.next();
    }

    if (!user) {
      // If no user and not on the login page, redirect to login
      if (!isLoginPage) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } else {
      // If user is logged in and tries to access login page, redirect to dashboard
      if (isLoginPage) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     * - VINCEDSTUDIO.icon.png (logo)
     */
    '/((?!_next/static|favicon.ico|VINCEDSTUDIO.icon.png).*)',
  ],
};
