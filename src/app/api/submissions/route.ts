
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/firebase/admin';
import { collection, addDoc, serverTimestamp } from 'firebase-admin/firestore';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  service: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = formSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, message: 'Invalid data provided.' }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db) {
      console.error("Firebase Admin is not configured on the server. Cannot save submission.");
      return NextResponse.json({ success: false, message: 'Server is not configured to handle submissions.' }, { status: 500 });
    }

    const submission = {
      ...parsedData.data,
      isRead: false,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'submissions'), submission);

    return NextResponse.json({ success: true, message: 'Submission saved.' });

  } catch (error: any) {
    console.error('API Error: Failed to save submission:', error);
    return NextResponse.json({ success: false, message: 'Failed to save submission due to a server error.' }, { status: 500 });
  }
}
