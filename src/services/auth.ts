
'use server';

import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';

export async function signInWithEmail(email: string, password: string):Promise<boolean> {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return !!userCredential.user;
  } catch (error: any) {
    // In a real app, you might want to log the specific error code.
    // For now, we'll throw a generic message for security.
    console.error("Authentication Error:", error.code);
    throw new Error("Invalid credentials. Please check your email and password.");
  }
}
