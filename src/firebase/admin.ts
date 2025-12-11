
import { getApps, initializeApp, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

function initializeAdminApp(): void {
  // This function should only run in a server environment.
  if (typeof window !== 'undefined') {
    return;
  }

  // Ensure initialization happens only once.
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Check if all required environment variables are present.
    if (projectId && clientEmail && privateKey) {
      try {
        adminApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            // Replace escaped newlines from environment variables.
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        });
        adminAuth = getAuth(adminApp);
        adminDb = getFirestore(adminApp);
      } catch (e: any) {
        console.error('Firebase Admin SDK initialization failed:', e.message);
        // Reset to null if initialization fails
        adminApp = null;
        adminAuth = null;
        adminDb = null;
      }
    } else {
      console.warn('Firebase Admin SDK environment variables not fully set. Admin features will be disabled.');
    }
  } else {
    // If already initialized, get the existing app and services.
    if (!adminApp) {
        adminApp = getApps()[0];
        if (adminApp) {
            adminAuth = getAuth(adminApp);
            adminDb = getFirestore(adminApp);
        }
    }
  }
}

// Initialize on module load.
initializeAdminApp();

export function getAdminApp(): App | null {
  if (!adminApp) initializeAdminApp();
  return adminApp;
}

export function getAdminAuth(): Auth | null {
  if (!adminAuth) initializeAdminApp();
  return adminAuth;
}

export function getAdminDb(): Firestore | null {
  if (!adminDb) initializeAdminApp();
  return adminDb;
}
