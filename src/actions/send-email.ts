
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  
  try {
    // 1. Save submission to Firestore
    const submission = {
      ...parsedData.data,
      isRead: false,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'submissions'), submission);

    // 2. Send email notification
    await resend.emails.send({
      from: 'onboarding@resend.dev', // This must be a domain you have verified with Resend
      to: 'vincentdesigns137@gmail.com',
      subject: `New Message from ${parsedData.data.name} via your website`,
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
