
'use server';

import { collection, getDocs, setDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { adminAuth, adminDb } from '@/firebase/admin';
import type { AdminUser } from '@/lib/types';


export async function getAdmins(): Promise<AdminUser[]> {
  const adminsCol = collection(adminDb, 'admins');
  const adminSnapshot = await getDocs(adminsCol);
  const adminList = adminSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
  return adminList;
}

export async function addAdmin(email: string, role: AdminUser['role']): Promise<{success: boolean, message: string}> {
  try {
    // Check if user already exists in Firestore 'admins' collection by email
    const q = query(collection(adminDb, 'admins'), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { success: false, message: 'An admin with this email already exists.' };
    }

    let userRecord;
    try {
        // Check if user exists in Firebase Auth
        userRecord = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // If user does not exist, create them
            userRecord = await adminAuth.createUser({
                email: email,
                emailVerified: true, // Or false, depending on your flow
                // A temporary strong random password. User should reset this.
                password: `temp-password-${Math.random().toString(36).slice(-8)}`,
            });
        } else {
            // For other auth errors (e.g., malformed email), re-throw
            throw error;
        }
    }

    // Now we have a userRecord (either existing or newly created), use its UID as doc ID
    const adminDocRef = doc(adminDb, 'admins', userRecord.uid);
    await setDoc(adminDocRef, { email, role });
    
    return { success: true, message: 'Admin user has been added.' };

  } catch (error: any) {
    console.error("Error adding admin:", error);
    return { success: false, message: error.message || 'Could not add admin user.' };
  }
}

export async function deleteAdmin(id: string): Promise<void> {
  // `id` is the UID of the admin
  const adminDoc = doc(adminDb, 'admins', id);
  await deleteDoc(adminDoc);
  
  // Optional: Disable or delete the user from Firebase Authentication as well
  // Be careful with this, as it's a destructive action.
  // await adminAuth.deleteUser(id);
}
