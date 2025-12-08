'use server';

import { getAdminDb } from '@/firebase/admin';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Logs an administrative action to the 'admin_logs' collection in Firestore.
 * @param action - A string describing the action, e.g., 'Admin Login', 'Create Project'.
 * @param details - An object containing relevant details about the action.
 */
export async function logAdminAction(action: string, details: Record<string, any>) {
  try {
    const db = getAdminDb();
    if (!db) {
        // Silently fail if admin is not configured.
        return;
    }
    await addDoc(collection(db, 'admin_logs'), {
      action,
      ...details,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
    // Depending on the importance, you might want to handle this error more robustly
  }
}
