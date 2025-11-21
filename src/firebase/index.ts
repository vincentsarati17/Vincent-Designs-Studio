
import { getFirebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  // This function is now primarily for server-side initialization.
  // Client-side initialization is handled in FirebaseClientProvider.
  if (typeof window !== 'undefined') {
    // On the client, initialization is handled by the provider.
    // If an app already exists, return its SDKs. Otherwise, something is wrong.
    if (getApps().length > 0) {
      return getSdks(getApps()[0]);
    }
    // This should ideally not be reached on the client.
    console.error("Client-side Firebase initialization should be handled by FirebaseClientProvider.");
    // Fallback to old method just in case, but it's not the intended path.
    const firebaseConfig = getFirebaseConfig();
    const app = initializeApp(firebaseConfig);
    return getSdks(app);
  }

  // Server-side logic
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    if (process.env.NODE_ENV === 'production') {
      // In production builds (like Vercel), if server credentials are not set,
      // we return null to prevent build-time functions from crashing.
      console.warn("FIREBASE_SERVICE_ACCOUNT_BASE64 not found. Firebase Admin features will be unavailable during build.");
      return null;
    }
    // In local dev, we also return null if no server creds are found.
    return null;
  }
  
  if (!getApps().length) {
    let firebaseApp;
    try {
      // This path is for environments with Application Default Credentials
      firebaseApp = initializeApp();
    } catch (e) {
      // Fallback for other server environments
      const firebaseConfig = getFirebaseConfig();
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    app: firebaseApp,
    auth: getAuth(firebaseApp),
    db: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
