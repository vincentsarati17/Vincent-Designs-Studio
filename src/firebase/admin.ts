
import admin from 'firebase-admin';
import { getApps, initializeApp, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;

function initializeAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const serviceAccountString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
      const serviceAccount = JSON.parse(serviceAccountString);
      
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      return adminApp;
    } catch (e: any) {
      console.error('Firebase Admin SDK initialization failed from Base64 env var:', e.message);
      throw new Error('Invalid or missing FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable.');
    }
  }

  try {
    adminApp = initializeApp();
    return adminApp;
  } catch(e: any) {
     console.error('Firebase Admin SDK default initialization failed. For Vercel, ensure FIREBASE_SERVICE_ACCOUNT_BASE64 is set. For local dev, ensure GOOGLE_APPLICATION_CREDENTIALS points to your service account file.');
     throw e;
  }
}

// Lazy initialization of the admin app
function getAdminApp(): App {
    if (adminApp) {
        return adminApp;
    }
    return initializeAdminApp();
}

export function getAdminAuth(): Auth {
    return getAuth(getAdminApp());
}

export function getAdminDb(): Firestore {
    return getFirestore(getAdminApp());
}
