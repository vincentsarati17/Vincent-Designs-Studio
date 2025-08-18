
'use server';

// This file is ready for when you want to add portfolio projects.
// The functions to fetch data from Firestore are commented out
// to prevent any errors while the collection doesn't exist.

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit, getDoc, doc } from 'firebase/firestore';
import type { Project } from '@/lib/types';

export async function getProjects(): Promise<Project[]> {
  try {
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
    const projectsQuery = query(collection(db, 'projects'), where('isFeatured', '==', true), limit(2));
    const projectSnapshot = await getDocs(projectsQuery);
    const projectList = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    return projectList;
  } catch (error) {
    console.error("Failed to fetch featured projects:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
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
