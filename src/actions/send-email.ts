
'use server';

import { z } from 'zod';
import { getAdminDb } from '@/firebase/admin';
import { doc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from '@/services/logs';
import { getCurrentUser } from '@/lib/auth-utils';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  service: z.string().min(1, { message: "Please select a service." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export async function handleFormSubmission(values: FormValues) {
  const parsedData = formSchema.safeParse(values);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map(e => e.message).join(' ');
    return { success: false, message: `Invalid data: ${errorMessages}` };
  }

  try {
    // We fetch our own API route which securely handles the submission
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedData.data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'An API error occurred.');
    }
    
    return { success: true };

  } catch (error: any) {
    console.error('Error handling form submission:', error);
    return { success: false, message: error.message || 'Failed to process your message. Please try again later.' };
  }
}

export async function handleDeleteSubmission(id: string) {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return { success: false, message: 'Authentication required.' };
  }

  try {
    const db = getAdminDb();
    if (!db) {
      throw new Error("Firebase Admin is not configured. Cannot process submission deletion.");
    }
    
    await deleteDoc(doc(db, 'submissions', id));

    await logAdminAction('Submission Deleted', {
      user: user.email,
      deletedSubmissionId: id,
      status: 'Success',
    });
    revalidatePath('/admin/inbox');
    return { success: true, message: 'Message has been removed.' };
  } catch (error: any) {
    await logAdminAction('Delete Submission Failed', {
      user: user.email,
      deletedSubmissionId: id,
      status: 'Failed',
      error: error.message,
    });
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}
