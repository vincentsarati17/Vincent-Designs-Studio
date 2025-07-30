
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { ContactSubmission } from '@/lib/types';

export async function getSubmissions(): Promise<ContactSubmission[]> {
  // In a real app, you'd want to protect this endpoint
  // to ensure only authenticated admins can access it.
  try {
    const submissionsCol = collection(db, 'submissions');
    const q = query(submissionsCol, orderBy('createdAt', 'desc'));
    const submissionSnapshot = await getDocs(q);
    const submissionList = submissionSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ContactSubmission));
    return submissionList;
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return [];
  }
}
