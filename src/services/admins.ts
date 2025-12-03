
'use server';

import { collection, getDocs, setDoc, deleteDoc, doc, query, where, getCountFromServer } from 'firebase/firestore';
import { getAdminAuth, getAdminDb } from '@/firebase/admin';
import type { AdminUser } from '@/lib/types';


export async function getAdmins(): Promise<AdminUser[]> {
  const adminDb = getAdminDb();
  const adminsCol = collection(adminDb, 'admins');
  const adminSnapshot = await getDocs(adminsCol);
  const adminList = adminSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
  return adminList;
}

// Seed the first super admin if no admins exist
async function seedInitialAdmin() {
  const adminDb = getAdminDb();
  const adminAuth = getAdminAuth();
  const adminsCol = collection(adminDb, 'admins');
  const snapshot = await getCountFromServer(adminsCol);

  if (snapshot.data().count === 0) {
    console.log("No admins found. Seeding initial Super Admin...");
    const initialAdminEmail = "admin@vincentdesignsstudio.org";
    const initialAdminPassword = "VINCENT12032002";
    
    try {
      let userRecord = await adminAuth.createUser({
        email: initialAdminEmail,
        password: initialAdminPassword,
        emailVerified: true,
      });

      const adminDocRef = doc(adminDb, 'admins', userRecord.uid);
      await setDoc(adminDocRef, { email: initialAdminEmail, role: 'Super Admin' });
      console.log(`Successfully created initial Super Admin: ${initialAdminEmail}`);

    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log("Initial admin email already exists in Auth. Ensuring it's in Firestore.");
        const userRecord = await adminAuth.getUserByEmail(initialAdminEmail);
        const adminDocRef = doc(adminDb, 'admins', userRecord.uid);
        const adminDoc = await getDoc(adminDocRef);
        if (!adminDoc.exists()) {
             await setDoc(adminDocRef, { email: initialAdminEmail, role: 'Super Admin' });
             console.log(`Added existing auth user to Firestore as Super Admin: ${initialAdminEmail}`);
        }
      } else {
        console.error("Failed to seed initial admin:", error);
      }
    }
  }
}

// Call the seeding function when this module is loaded on the server.
seedInitialAdmin().catch(console.error);

export async function addAdmin(email: string, role: AdminUser['role']): Promise<{success: boolean, message: string}> {
  try {
    const adminDb = getAdminDb();
    const adminAuth = getAdminAuth();
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
  const adminDb = getAdminDb();
  // `id` is the UID of the admin
  const adminDoc = doc(adminDb, 'admins', id);
  await deleteDoc(adminDoc);
  
  // Optional: Disable or delete the user from Firebase Authentication as well
  // Be careful with this, as it's a destructive action.
  // const adminAuth = getAdminAuth();
  // await adminAuth.deleteUser(id);
}
