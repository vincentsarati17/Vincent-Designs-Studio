
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Tracks a page view by logging it to Firestore.
 * This is a server action that can be called from client components.
 * @param path - The path of the page that was viewed.
 */
export async function trackPageView(path: string) {
  if (!path) return;

  try {
    const firebase = initializeFirebase();
    if (!firebase) {
      console.warn("Firebase not initialized. Page view tracking is disabled.");
      return;
    }
    const { db } = firebase;
    await addDoc(collection(db, 'page_views'), {
      path,
      timestamp: serverTimestamp(),
      // In a real app, you could add more details like user agent, location (if GDPR compliant), etc.
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
    // This action fails silently on the client to not impact user experience.
  }
}
