
'use server';

import { z } from 'zod';
import { addProject, updateProject, deleteProject as deleteProjectFromDb, getProjects as getProjectsFromDb, getFeaturedProjects as getFeaturedProjectsFromDb, getProjectById as getProjectByIdFromDb, getProjectBySlug as getProjectBySlugFromDb } from '@/services/projects';
import { logAdminAction } from '@/services/logs';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth-utils';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { initializeFirebase } from '@/firebase';
import type { Project } from '@/lib/types';

// Helper to get client-side storage instance
function getClientStorage() {
    const { storage } = initializeFirebase();
    return storage;
}

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  slug: z.string().min(3, 'Slug must be at least 3 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  category: z.string().min(2, 'Category is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  details: z.string().min(20, 'Project details must be at least 20 characters.'),
  isFeatured: z.preprocess((val) => val === 'on' || val === true, z.boolean().default(false)),
  deadline: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),
});

const addProjectSchema = projectSchema.extend({
  image: z.any().refine((file) => file?.size > 0, 'Project image is required.'),
});

const updateProjectSchema = projectSchema.extend({
  image: z.any().optional(),
  currentImageUrl: z.string().optional(),
  currentSlug: z.string().optional(),
});

// --- SERVER-SIDE GETTERS ---
export async function getProjects(): Promise<Project[]> {
    return getProjectsFromDb();
}

export async function getFeaturedProjects(): Promise<Project[]> {
    return getFeaturedProjectsFromDb();
}

export async function getProjectById(id: string): Promise<Project | null> {
    return getProjectByIdFromDb(id);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    return getProjectBySlugFromDb(slug);
}
// --- END SERVER-SIDE GETTERS ---

export async function handleAddProject(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return { success: false, message: 'Authentication required.' };
  }

  const values = Object.fromEntries(formData.entries());
  const parsed = addProjectSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessages = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, message: `Invalid project data: ${errorMessages}` };
  }

  const { image, ...projectData } = parsed.data;

  try {
    const storage = getClientStorage();
    
    const isSlugTaken = await addProject({ ...projectData, checkSlugOnly: true });
    if (isSlugTaken.slugExists) {
        return { success: false, message: 'This slug is already in use. Please choose a unique one.' };
    }

    const storageRef = ref(storage, `projects/${Date.now()}-${image.name}`);
    const snapshot = await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(snapshot.ref);

    const finalProjectData = {
      ...projectData,
      imageUrl,
      details: projectData.details.split('\n').filter(p => p.trim() !== ''),
    };

    const docRef = await addProject(finalProjectData);
    
    await logAdminAction('Project Created', { 
        projectId: docRef.id, 
        projectTitle: projectData.title,
        user: user.email,
        status: 'Success'
    });

    revalidatePath('/portfolio');
    revalidatePath('/admin/projects');
    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true, message: 'Project added successfully!' };
  } catch (error: any) {
    console.error('Error adding project:', error);
    await logAdminAction('Project Creation Failed', { 
        projectTitle: projectData.title,
        user: user.email,
        status: 'Failed',
        error: error.message
    });
    return { success: false, message: error.message || 'An unexpected error occurred while saving the project.' };
  }
}

export async function handleUpdateProject(projectId: string, prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return { success: false, message: 'Authentication required.' };
  }

  const values = Object.fromEntries(formData.entries());
  const parsed = updateProjectSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessages = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, message: `Invalid project data: ${errorMessages}` };
  }

  const { image, currentImageUrl, currentSlug, ...projectData } = parsed.data;

  try {
    const storage = getClientStorage();

    if (projectData.slug !== currentSlug) {
        const isSlugTaken = await updateProject(projectId, { ...projectData, checkSlugOnly: true });
        if (isSlugTaken.slugExists) {
            return { success: false, message: 'This slug is already in use. Please choose a unique one.' };
        }
    }

    let imageUrl = currentImageUrl;
    if (image && image.size > 0) {
      const newImageRef = ref(storage, `projects/${Date.now()}-${image.name}`);
      await uploadBytes(newImageRef, image);
      imageUrl = await getDownloadURL(newImageRef);

      if (currentImageUrl) {
        try {
          const oldImageRef = ref(storage, currentImageUrl);
          await deleteObject(oldImageRef);
        } catch (storageError: any) {
          console.warn("Could not delete old project image:", storageError);
        }
      }
    }

    const finalProjectData = {
      ...projectData,
      imageUrl,
      details: projectData.details.split('\n').filter(p => p.trim() !== ''),
    };

    await updateProject(projectId, finalProjectData);
    
    await logAdminAction('Project Updated', { 
        projectId, 
        projectTitle: projectData.title,
        user: user.email,
        status: 'Success'
    });

    revalidatePath(`/portfolio/${projectData.slug}`);
    revalidatePath('/admin/projects');
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/portfolio');

    return { success: true, message: 'Project updated successfully!', slug: projectData.slug };
  } catch (error: any) {
    console.error('Error updating project:', error);
    await logAdminAction('Project Update Failed', { 
        projectId,
        projectTitle: projectData.title,
        user: user.email,
        status: 'Failed',
        error: error.message
    });
    return { success: false, message: error.message || 'An unexpected error occurred while saving the project.' };
  }
}

export async function handleDeleteProject(id: string) {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return { success: false, message: 'Authentication required.' };
  }

  try {
    await deleteProjectFromDb(id);
    await logAdminAction('Project Deleted', {
      user: user.email,
      deletedProjectId: id,
      status: 'Success',
    });
    revalidatePath('/admin/projects');
    revalidatePath('/portfolio');
    revalidatePath('/');

    return { success: true, message: 'Project has been removed.' };
  } catch (error: any) {
    await logAdminAction('Delete Project Failed', {
      user: user.email,
      deletedProjectId: id,
      status: 'Failed',
      error: error.message,
    });
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}
