
import { getApps, initializeApp, App, cert, AppOptions } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

function initializeAdminApp(): void {
    // Only run initialization in a server environment
    if (typeof window !== 'undefined') {
        return;
    }

    if (getApps().length === 0) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (projectId && clientEmail && privateKey) {
            try {
                adminApp = initializeApp({
                    credential: cert({
                        projectId,
                        clientEmail,
                        privateKey: privateKey.replace(/\\n/g, '\n'),
                    }),
                    databaseURL: `https://${projectId}.firebaseio.com`,
                });
            } catch (e: any) {
                console.error('Firebase Admin SDK initialization failed:', e.message);
            }
        } else {
            console.warn('Firebase Admin SDK environment variables not fully set. Admin features may be limited.');
        }
    } else {
        adminApp = getApps()[0];
    }
}

// Initialize on first import in a server environment
initializeAdminApp();

// Use dynamic imports within the getter functions to ensure
// they are only imported when called on the server.
export function getAdminApp(): App | null {
    return adminApp;
}

export function getAdminAuth(): Auth | null {
    if (!adminAuth && adminApp) {
        adminAuth = require('firebase-admin/auth').getAuth(adminApp);
    }
    return adminAuth;
}

export function getAdminDb(): Firestore | null {
    if (!adminDb && adminApp) {
        adminDb = require('firebase-admin/firestore').getFirestore(adminApp);
    }
    return adminDb;
}
