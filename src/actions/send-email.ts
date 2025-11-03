
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Resend } from 'resend';

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

  // Check for Resend API key before proceeding
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.');
    return { success: false, message: 'Server configuration error. Could not send email.' };
  }
  
  try {
    // 1. Save submission to Firestore
    const submission = {
      ...parsedData.data,
      isRead: false,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'submissions'), submission);

    // 2. Send email notification
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // IMPORTANT: The 'from' address MUST be from a domain you have verified in your Resend account.
    // The 'to' address is where you will receive the notifications.
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Replace with your verified domain, e.g., 'noreply@vincentdesigns.studio'
      to: 'vincentdesigns137@gmail.com', // This should be your personal email to receive notifications
      subject: `New Message from ${parsedData.data.name} via your website`,
      reply_to: parsedData.data.email, // So you can reply directly to the user
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
    // Determine if the error is from Resend or Firestore and customize the message if needed
    return { success: false, message: 'Failed to process your message. Please try again later.' };
  }
}
