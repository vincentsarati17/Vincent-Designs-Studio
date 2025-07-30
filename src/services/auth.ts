
'use server';

import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, User } from 'firebase/auth';

export async function signInWithEmail(email: string, password: string):Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
