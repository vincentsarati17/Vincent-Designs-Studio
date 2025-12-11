'use server';

import { z } from 'zod';
import { addClient, deleteClient, updateClient, addNoteForClient, addRequestForClient } from '@/services/clients';
import { logAdminAction } from '@/services/logs';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth-utils';

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().min(2, "Company name is required."),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const noteSchema = z.object({
  content: z.string().min(5, "Note must be at least 5 characters."),
  clientId: z.string(),
});

const requestSchema = z.object({
    title: z.string().min(5, "Request title must be at least 5 characters."),
    status: z.enum(['New', 'In Progress', 'Completed']),
    clientId: z.string(),
});

export async function handleAddClient(values: ClientFormValues) {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return { success: false, message: 'Authentication required.' };
  }
  
  const parsed = clientSchema.safeParse(values);
  if (!parsed.success) {
    const errorMessages = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, message: `Invalid data: ${errorMessages}` };
  }

  try {
    const newClient = await addClient(parsed.data);
    await logAdminAction('Client Added', {
      user: user.email,
      clientId: newClient.id,
      clientName: newClient.name,
      status: 'Success',
    });
    revalidatePath('/admin/clients');
    return { success: true, message: 'New client has been added.' };
  } catch (error: any) {
    await logAdminAction('Add Client Failed', {
      user: user.email,
      clientName: parsed.data.name,
      status: 'Failed',
      error: error.message,
    });
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

export async function handleUpdateClient(id: string, values: ClientFormValues) {
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return { success: false, message: 'Authentication required.' };
    }

    const parsed = clientSchema.safeParse(values);
    if (!parsed.success) {
        const errorMessages = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return { success: false, message: `Invalid data: ${errorMessages}` };
    }

    try {
        await updateClient(id, parsed.data);
        await logAdminAction('Client Updated', {
            user: user.email,
            clientId: id,
            status: 'Success',
        });
        revalidatePath('/admin/clients');
        return { success: true, message: 'Client details have been updated.' };
    } catch (error: any) {
        await logAdminAction('Update Client Failed', {
            user: user.email,
            clientId: id,
            status: 'Failed',
            error: error.message,
        });
        return { success: false, message: error.message || 'An unexpected error occurred.' };
    }
}


export async function handleDeleteClient(id: string) {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return { success: false, message: 'Authentication required.' };
  }

  try {
    await deleteClient(id);
    await logAdminAction('Client Deleted', {
      user: user.email,
      deletedClientId: id,
      status: 'Success',
    });
    revalidatePath('/admin/clients');
    return { success: true, message: 'Client has been removed.' };
  } catch (error: any) {
    await logAdminAction('Delete Client Failed', {
      user: user.email,
      deletedClientId: id,
      status: 'Failed',
      error: error.message,
    });
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

export async function handleAddNote(values: { content: string, clientId: string }) {
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return { success: false, message: 'Authentication required.' };
    }

    const parsed = noteSchema.safeParse(values);
    if (!parsed.success) {
        return { success: false, message: 'Invalid note content.' };
    }
    try {
        await addNoteForClient(parsed.data.clientId, { content: parsed.data.content, author: user.email });
        revalidatePath('/admin/clients');
        return { success: true, message: 'Note added successfully.' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Could not add note.' };
    }
}

export async function handleAddRequest(values: { title: string, status: 'New' | 'In Progress' | 'Completed', clientId: string }) {
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return { success: false, message: 'Authentication required.' };
    }

    const parsed = requestSchema.safeParse(values);
    if (!parsed.success) {
        return { success: false, message: 'Invalid request data.' };
    }
    try {
        await addRequestForClient(parsed.data.clientId, { title: parsed.data.title, status: parsed.data.status });
        revalidatePath('/admin/clients');
        return { success: true, message: 'Request added successfully.' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Could not add request.' };
    }
}
