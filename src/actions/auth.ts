
'use server';

import { cookies } from 'next/headers';

export async function handleLogout() {
  try {
    cookies().delete('__session');
    return { success: true };
  } catch (error: any) {
    console.error('Logout failed:', error);
    return { success: false, message: 'Logout failed. Please try again.' };
  }
}
