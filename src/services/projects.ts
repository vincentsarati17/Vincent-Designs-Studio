
'use server';

import { getAdminDb } from '@/firebase/admin';
import { collection, getDocs, query, where, limit, getDoc, doc, addDoc, serverTimestamp, updateDoc, deleteDoc as deleteDocFromDb } from 'firebase/firestore';
import type { Project } from '@/lib/types';

export async function getProjects(): Promise<Project[]> {
  try {
    const db = getAdminDb();
    if (!db) {
        console.warn("Firebase Admin is not available. Returning empty array for projects.");
        return [];
    }
    const projectsCol = collection(db, 'projects');
    const projectSnapshot = await getDocs(projectsCol);
    const projectList = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    return projectList;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
    try {
        const db = getAdminDb();
        if (!db) {
            console.warn("Firebase Admin is not available. Returning empty array for featured projects.");
            return [];
        }
        const projectsQuery = query(collection(db, 'projects'), where('isFeatured', '==', true), limit(2));
        const projectSnapshot = await getDocs(projectsQuery);
        const projectList = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        return projectList;
    } catch (error) {
        console.error("Failed to fetch featured projects:", error);
        return [];
    }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const db = getAdminDb();
    if (!db) {
        console.warn(`Firebase Admin is not available. Cannot fetch project by id ${id}.`);
        return null;
    }
    const projectDocRef = doc(db, 'projects', id);
    const projectDoc = await getDoc(projectDocRef);

    if (!projectDoc.exists()) {
        return null;
    }

    const data = projectDoc.data();
    return { 
        id: projectDoc.id,
        ...data,
        deadline: data.deadline?.toDate(), // Convert timestamp to Date
     } as Project;
  } catch (error)
  {
    console.error(`Failed to fetch project by id ${id}:`, error);
    return null;
  }
}


export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const db = getAdminDb();
    if (!db) {
        console.warn(`Firebase Admin is not available. Cannot fetch project by slug ${slug}.`);
        return null;
    }
    const projectsQuery = query(collection(db, 'projects'), where('slug', '==', slug), limit(1));
    const projectSnapshot = await getDocs(projectsQuery);

    if (projectSnapshot.empty) {
        return null;
    }

    const projectDoc = projectSnapshot.docs[0];
    return { id: projectDoc.id, ...projectDoc.data() } as Project;
  } catch (error)
  {
    console.error(`Failed to fetch project by slug ${slug}:`, error);
    return null;
  }
}

// ---- Write Operations ----

export async function addProject(projectData: any): Promise<any> {
    const db = getAdminDb();
    if (!db) {
      throw new Error("Firebase Admin is not configured. Cannot process submission.");
    }
    
    // Special mode to only check for slug existence
    if (projectData.checkSlugOnly) {
        const slugQuery = query(collection(db, 'projects'), where('slug', '==', projectData.slug));
        const slugSnapshot = await getDocs(slugQuery);
        return { slugExists: !slugSnapshot.empty };
    }

    const finalProjectData = {
      ...projectData,
      createdAt: serverTimestamp(),
    };
    return await addDoc(collection(db, 'projects'), finalProjectData);
}

export async function updateProject(projectId: string, projectData: any): Promise<any> {
    const db = getAdminDb();
    if (!db) {
      throw new Error("Firebase Admin is not configured. Cannot process update.");
    }
    
    // Special mode to only check for slug existence
    if (projectData.checkSlugOnly) {
        const slugQuery = query(collection(db, 'projects'), where('slug', '==', projectData.slug));
        const slugSnapshot = await getDocs(slugQuery);
        // Ensure the found slug doesn't belong to the current project
        const slugExists = !slugSnapshot.empty && slugSnapshot.docs[0].id !== projectId;
        return { slugExists };
    }

    const finalProjectData = {
      ...projectData,
      updatedAt: serverTimestamp(),
    };

    const projectDocRef = doc(db, 'projects', projectId);
    await updateDoc(projectDocRef, finalProjectData);
}

export async function deleteProject(id: string): Promise<void> {
  const db = getAdminDb();
  if (!db) {
    throw new Error("Firebase Admin is not configured. Cannot delete project.");
  }
  await deleteDocFromDb(doc(db, 'projects', id));
}
