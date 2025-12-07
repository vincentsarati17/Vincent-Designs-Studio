
'use server';

import { cookies } from 'next/headers';
import { getAdminAuth } from '@/firebase/admin';

/**
 * Gets the currently authenticated user from the session cookie.
 * To be used in Server Actions and Route Handlers.
 * @returns The user's decoded token, or null if not authenticated.
 */
export async function getCurrentUser() {
  const sessionCookie = cookies().get('__session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
        return null;
    }
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken;
  } catch (error) {
    // Session cookie is invalid or expired.
    return null;
  }
}
