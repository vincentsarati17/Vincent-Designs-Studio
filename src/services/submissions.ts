
'use server';

import { getAdminDb } from '@/firebase/admin';
import { doc, deleteDoc } from 'firebase/firestore';

export async function deleteSubmission(id: string): Promise<void> {
  const db = getAdminDb();
  const submissionDoc = doc(db, 'submissions', id);
  await deleteDoc(submissionDoc);
}
