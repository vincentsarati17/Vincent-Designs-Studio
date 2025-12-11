'use server';

import { z } from 'zod';
import { addAdmin as addAdminToDb, deleteAdmin as deleteAdminFromDb } from '@/services/admins';
import { logAdminAction } from '@/services/logs';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth-utils';

const addAdminSchema = z.object({
  email: z.string().email(),
  role: z.enum(['Super Admin', 'Admin', 'Support', 'Content']),
});

// MOCK USER FOR DEVELOPMENT
const getDevUser = () => ({
    email: 'developer@example.com',
});

export async function handleAddAdmin(values: { email: string, role: 'Super Admin' | 'Admin' | 'Support' | 'Content' }) {
  const user = process.env.NODE_ENV === 'development' ? getDevUser() : await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  const parsed = addAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: 'Invalid email or role.' };
  }

  try {
    const result = await addAdminToDb(parsed.data.email, parsed.data.role);
    if (!result.success) {
        return result; // Forward the message from the service layer
    }
    await logAdminAction('Admin Added', {
      user: user.email,
      targetUser: parsed.data.email,
      role: parsed.data.role,
      status: 'Success',
    });
    revalidatePath('/admin/settings');
    return { success: true, message: 'Admin user has been added.' };
  } catch (error: any) {
    await logAdminAction('Add Admin Failed', {
      user: user.email,
      targetUser: parsed.data.email,
      status: 'Failed',
      error: error.message,
    });
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

export async function handleDeleteAdmin(id: string) {
  const user = process.env.NODE_ENV === 'development' ? getDevUser() : await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  try {
    // In a real app, you might want to get the user's email before deleting for logging.
    await deleteAdminFromDb(id);
    await logAdminAction('Admin Deleted', {
      user: user.email,
      deletedAdminId: id,
      status: 'Success',
    });
    revalidatePath('/admin/settings');
    return { success: true, message: 'Admin user has been removed.' };
  } catch (error: any) {
    await logAdminAction('Delete Admin Failed', {
      user: user.email,
      deletedAdminId: id,
      status: 'Failed',
      error: error.message,
    });
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}
