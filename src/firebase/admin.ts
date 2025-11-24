import admin from 'firebase-admin';
import { getApps, initializeApp, App, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Initializes the Firebase Admin SDK.
 * 
 * This function handles initialization for different environments:
 * - Vercel/Production: Reads a Base64-encoded service account key from environment variables.
 * - Development: Falls back to default application credentials if the env var is not set.
 */
function initializeAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  // Vercel deployment: Use the Base64-encoded service account from environment variables.
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const serviceAccountString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
      const serviceAccount = JSON.parse(serviceAccountString);
      
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    } catch (e: any) {
      console.error('Firebase Admin SDK initialization failed from Base64 env var:', e.message);
      throw new Error('Invalid or missing FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable.');
    }
  }

  // Local development or environments with Application Default Credentials
  // This will try to use credentials found in the environment, but might fail outside a GCP context.
  try {
    // This will only succeed if you have GOOGLE_APPLICATION_CREDENTIALS set locally
    return initializeApp();
  } catch(e: any) {
     console.error('Firebase Admin SDK default initialization failed. For Vercel, ensure FIREBASE_SERVICE_ACCOUNT_BASE64 is set. For local dev, ensure GOOGLE_APPLICATION_CREDENTIALS points to your service account file.');
     throw e;
  }
}

const adminApp = initializeAdminApp();
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
