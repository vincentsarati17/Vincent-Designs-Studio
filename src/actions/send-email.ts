
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
    const submission = {
      ...parsedData.data,
      isRead: false,
      createdAt: serverTimestamp(),
    };
    
    await addDoc(collection(db, 'submissions'), submission);

    return { success: true };

  } catch (error) {
    console.error('Error saving submission to Firestore:', error);
    return { success: false, message: 'Failed to save your message. Please try again later.' };
  }
}

