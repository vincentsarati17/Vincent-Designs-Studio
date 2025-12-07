
import { getApps, initializeApp, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let appInitialized = false;

function initializeAdminApp(): App | null {
  if (appInitialized) {
    return adminApp;
  }
  appInitialized = true; // Attempt initialization only once

  if (getApps().length > 0) {
    const defaultApp = getApps().find(app => app.name === '[DEFAULT]');
    if (defaultApp) {
        adminApp = defaultApp;
        return adminApp;
    }
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
      adminApp = null;
      return null;
    }
  }
  
  console.warn('Firebase Admin SDK environment variables not set. Admin features will be unavailable.');
  adminApp = null;
  return null;
}

export function getAdminApp(): App | null {
    return initializeAdminApp();
}

export function getAdminAuth(): Auth | null {
    const app = initializeAdminApp();
    return app ? getAuth(app) : null;
}

export function getAdminDb(): Firestore | null {
    const app = initializeAdminApp();
    return app ? getFirestore(app) : null;
}
