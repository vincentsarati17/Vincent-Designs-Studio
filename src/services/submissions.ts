
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function deleteSubmission(id: string): Promise<void> {
  const firebase = initializeFirebase();
  if (!firebase) throw new Error("Firebase is not initialized. Cannot delete submission.");
  const { db } = firebase;
  const submissionDoc = doc(db, 'submissions', id);
  await deleteDoc(submissionDoc);
}
