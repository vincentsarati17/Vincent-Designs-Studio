
import { getApps, initializeApp, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;

function initializeAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      adminApp = initializeApp({
        credential: cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });
      return adminApp;
    } catch (e: any) {
      console.error('Firebase Admin SDK initialization failed from environment variables:', e.message);
      throw new Error('Firebase Admin SDK initialization failed.');
    }
  }
  
  console.warn('Firebase Admin SDK environment variables not set. Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY. Admin features will be unavailable.');
  throw new Error('Firebase Admin SDK is not configured. Please set the required environment variables in your Vercel project settings.');
}

export function getAdminAuth(): Auth {
    return getAuth(initializeAdminApp());
}

export function getAdminDb(): Firestore {
    return getFirestore(initializeAdminApp());
}
