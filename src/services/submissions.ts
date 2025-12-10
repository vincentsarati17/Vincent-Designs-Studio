'use server';

import { doc, deleteDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export async function deleteSubmission(id: string): Promise<void> {
  const { db } = initializeFirebase();
  if (!db) {
    throw new Error("Firebase client is not configured. Cannot delete submission.");
  }
  const submissionDoc = doc(db, 'submissions', id);
  await deleteDoc(submissionDoc);
}
