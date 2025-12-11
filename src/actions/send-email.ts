'use server';

import { z } from 'zod';
import { getAdminDb } from '@/firebase/admin';
import { doc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from '@/services/logs';
import { getCurrentUser } from '@/lib/auth-utils';
import { Resend } from 'resend';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  service: z.string().min(1, { message: "Please select a service." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const replySchema = z.object({
  to: z.string().email(),
  from: z.string().min(1, 'From address is required.'),
  subject: z.string().min(1, 'Subject is required.'),
  html: z.string().min(1, 'Email body is required.'),
});

type ReplyValues = z.infer<typeof replySchema>;

export async function handleFormSubmission(values: FormValues) {
  const parsedData = formSchema.safeParse(values);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map(e => e.message).join(' ');
    return { success: false, message: `Invalid data: ${errorMessages}` };
  }

  try {
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('Server is not configured with a base URL. Cannot process submission.');
    }
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

export async function handleSendReply(values: ReplyValues) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: 'Authentication required.' };
    }
    
    if (!process.env.RESEND_API_KEY) {
        console.error('Resend API key is not configured.');
        return { success: false, message: 'The email service is not configured on the server.' };
    }

    const parsed = replySchema.safeParse(values);
    if (!parsed.success) {
        return { success: false, message: 'Invalid reply data.' };
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send(parsed.data);

        await logAdminAction('Email Reply Sent', {
            user: user.email,
            recipient: parsed.data.to,
            status: 'Success',
        });
        
        return { success: true, message: 'Your reply has been sent.' };
    } catch (error: any) {
        console.error('Resend error:', error);
        await logAdminAction('Email Reply Failed', {
            user: user.email,
            recipient: parsed.data.to,
            status: 'Failed',
            error: error.message,
        });
        return { success: false, message: 'Failed to send email. Please check server logs.' };
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
