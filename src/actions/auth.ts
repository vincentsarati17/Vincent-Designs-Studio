'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function handleLogout() {
  try {
    cookies().delete('__session');
    // Revalidate the path to ensure the middleware re-evaluates the session state
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Logout failed:', error);
    return { success: false, message: 'Logout failed. Please try again.' };
  }
}
