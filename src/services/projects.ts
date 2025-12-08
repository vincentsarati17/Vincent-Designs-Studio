'use server';

import { getAdminDb } from '@/firebase/admin';
import { collection, getDocs, query, where, limit, getDoc, doc } from 'firebase/firestore';
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

    return { id: projectDoc.id, ...projectDoc.data() } as Project;
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
