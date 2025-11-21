
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const { db } = initializeFirebase();

export async function deleteSubmission(id: string): Promise<void> {
  const submissionDoc = doc(db, 'submissions', id);
  await deleteDoc(submissionDoc);
}
