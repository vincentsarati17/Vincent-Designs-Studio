'use server';

import { collection, getDocs, setDoc, deleteDoc, doc, query, where, getCountFromServer, getDoc } from 'firebase/firestore';
import { getAdminAuth, getAdminDb } from '@/firebase/admin';
import type { AdminUser } from '@/lib/types';


export async function getAdmins(): Promise<AdminUser[]> {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return [];
    const adminsCol = collection(adminDb, 'admins');
    const adminSnapshot = await getDocs(adminsCol);
    const adminList = adminSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
    return adminList;
  } catch (error) {
    console.warn("Could not fetch admins, likely due to missing admin credentials.", error);
    return [];
  }
}

async function seedInitialAdmin() {
  try {
    const adminDb = getAdminDb();
    const adminAuth = getAdminAuth();
    
    if (!adminDb || !adminAuth) {
        console.log("Admin seeding skipped: Firebase Admin not configured.");
        return;
    }

    const adminsCol = collection(adminDb, 'admins');
    const snapshot = await getCountFromServer(adminsCol);

    if (snapshot.data().count === 0) {
      console.log("No admins found. Seeding initial Super Admin...");
      const initialAdminEmail = "admin@vincentdesignsstudio.org";
      const initialAdminPassword = "VINCENT12032002";
      
      let userRecord;
      try {
        userRecord = await adminAuth.getUserByEmail(initialAdminEmail);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          userRecord = await adminAuth.createUser({
            email: initialAdminEmail,
            password: initialAdminPassword,
            emailVerified: true,
          });
           console.log(`Successfully created initial Super Admin auth user: ${initialAdminEmail}`);
        } else {
          throw error;
        }
      }
      
      const adminDocRef = doc(adminDb, 'admins', userRecord.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (!adminDoc.exists()) {
        await setDoc(adminDocRef, { email: initialAdminEmail, role: 'Super Admin' });
        console.log(`Successfully seeded Firestore with Super Admin role for ${initialAdminEmail}`);
      } else {
        console.log(`Admin document already exists in Firestore for ${initialAdminEmail}.`);
      }

    }
  } catch (error: any) {
      console.error("Failed to seed initial admin. This is expected if admin credentials are not set.", error.message);
  }
}

if (process.env.IS_SEEDING_ENABLED === 'true') {
    seedInitialAdmin();
}


export async function addAdmin(email: string, role: AdminUser['role']): Promise<{success: boolean, message: string}> {
  try {
    const adminDb = getAdminDb();
    const adminAuth = getAdminAuth();
    if (!adminDb || !adminAuth) {
        return { success: false, message: 'Firebase Admin is not configured. Cannot add admin.' };
    }

    const q = query(collection(adminDb, 'admins'), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { success: false, message: 'An admin with this email already exists.' };
    }

    let userRecord;
    try {
        userRecord = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            userRecord = await adminAuth.createUser({
                email: email,
                emailVerified: true,
                password: `temp-password-${Math.random().toString(36).slice(-8)}`,
            });
        } else {
            throw error;
        }
    }

    const adminDocRef = doc(adminDb, 'admins', userRecord.uid);
    await setDoc(adminDocRef, { email, role });
    
    return { success: true, message: 'Admin user has been added.' };

  } catch (error: any) {
    console.error("Error adding admin:", error);
    return { success: false, message: error.message || 'Could not add admin user.' };
  }
}

export async function deleteAdmin(id: string): Promise<void> {
  const adminDb = getAdminDb();
  if (!adminDb) {
      throw new Error('Firebase Admin is not configured. Cannot delete admin.');
  }
  const adminDoc = doc(adminDb, 'admins', id);
  await deleteDoc(adminDoc);
}
