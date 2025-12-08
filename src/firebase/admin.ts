
import { getApps, initializeApp, App, cert, AppOptions } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

function initializeAdminApp(): void {
    // Only run initialization in a server environment
    if (typeof window !== 'undefined') {
        return;
    }

    if (getApps().some(app => app.name === '[DEFAULT]')) {
        adminApp = getApps().find(app => app.name === '[DEFAULT]') || null;
    } else {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (projectId && clientEmail && privateKey) {
            const appOptions: AppOptions = {
                credential: cert({
                    projectId: projectId,
                    clientEmail: clientEmail,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
                databaseURL: `https://${projectId}.firebaseio.com`,
            };
            try {
                adminApp = initializeApp(appOptions);
            } catch (e: any) {
                console.error('Firebase Admin SDK initialization failed:', e.message);
                adminApp = null;
            }
        } else {
            console.warn('Firebase Admin SDK environment variables not fully set. Admin features may be limited.');
            adminApp = null;
        }
    }
    
    if (adminApp) {
        adminAuth = getAuth(adminApp);
        adminDb = getFirestore(adminApp);
    }
}

// Initialize on first import
initializeAdminApp();

export function getAdminApp(): App | null {
    return adminApp;
}

export function getAdminAuth(): Auth | null {
    return adminAuth;
}

export function getAdminDb(): Firestore | null {
    return adminDb;
}
