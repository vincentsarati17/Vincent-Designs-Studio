'use server';

import { doc, deleteDoc } from 'firebase/firestore';
import { getAdminDb } from '@/firebase/admin';

export async function deleteSubmission(id: string): Promise<void> {
  const db = getAdminDb();
  if (!db) {
    throw new Error("Firebase Admin is not configured. Cannot delete submission.");
  }
  const submissionDoc = doc(db, 'submissions', id);
  await deleteDoc(submissionDoc);
}
