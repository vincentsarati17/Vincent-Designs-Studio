
import { getApps, initializeApp, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let appInitialized = false;

function initializeAdminApp(): void {
  if (appInitialized) return;
  appInitialized = true; // Attempt initialization only once

  if (getApps().some(app => app.name === '[DEFAULT]')) {
    adminApp = getApps().find(app => app.name === '[DEFAULT]') || null;
    return;
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
    } catch (e: any) {
      console.error('Firebase Admin SDK initialization failed from environment variables:', e.message);
      adminApp = null;
    }
  } else {
    console.warn('Firebase Admin SDK environment variables not set. Admin features will be unavailable.');
    adminApp = null;
  }
}

// Call initialization logic right away
initializeAdminApp();

export function getAdminApp(): App | null {
    return adminApp;
}

export function getAdminAuth(): Auth | null {
    return adminApp ? getAuth(adminApp) : null;
}

export function getAdminDb(): Firestore | null {
    return adminApp ? getFirestore(adminApp) : null;
}
