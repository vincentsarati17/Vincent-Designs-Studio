
'use server';

import { getAdminDb } from '@/firebase/admin';
import { doc, deleteDoc } from 'firebase/firestore';

export async function deleteSubmission(id: string): Promise<void> {
  const db = getAdminDb();
  if (!db) {
    throw new Error("Firebase Admin is not configured. Cannot delete submission.");
  }
  const submissionDoc = doc(db, 'submissions', id);
  await deleteDoc(submissionDoc);
}
