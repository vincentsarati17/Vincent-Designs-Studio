
'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from '@/services/logs';
import { getCurrentUser } from '@/lib/auth-utils';
import { getAdminDb } from '@/firebase/admin';

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
    return { success: false, message: 'Invalid data.' };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable is not configured.');
    return { success: false, message: 'Server configuration error: The RESEND_API_KEY is missing. Could not send email.' };
  }
  
  try {
    const db = getAdminDb();
    if (!db) {
        // This is a server configuration issue, so we return a generic server error.
        console.error("Firebase Admin is not configured. Cannot save submission to database.");
        return { success: false, message: 'A server error occurred. Please try again later.' };
    }

    const submission = {
      ...parsedData.data,
      isRead: false,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'submissions'), submission);

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: 'vincentdesigns137@gmail.com', 
      subject: `New Message from ${parsedData.data.name} via your website`,
      reply_to: parsedData.data.email, 
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${parsedData.data.name}</p>
        <p><strong>Email:</strong> ${parsedData.data.email}</p>
        <p><strong>Service:</strong> ${parsedData.data.service}</p>
        <p><strong>Message:</strong></p>
        <p>${parsedData.data.message}</p>
      `,
    });

    return { success: true };

  } catch (error) {
    console.error('Error handling form submission:', error);
    return { success: false, message: 'Failed to process your message. Please try again later.' };
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
    
    await db.collection('submissions').doc(id).delete();

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
