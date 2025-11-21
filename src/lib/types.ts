
import type { User as FirebaseUser } from "firebase/auth";

export interface Testimonial {
  name: string;
  company: string;
  quote: string;
}

export interface ContactSubmission {
  id: string;
  name:string;
  email: string;
  service: string;
  message: string;
  createdAt: any; // Firestore Timestamp
  isRead: boolean;
}

// The Project type is ready for when you want to add portfolio projects.
export interface Project {
  id:string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  isFeatured: boolean;
  slug: string;
  details: string[];
  createdAt?: any; // Firestore Timestamp
  deadline?: any; // Firestore Timestamp
}

export interface AdminLog {
  id: string;
  action: string;
  user: string;
  status: 'Success' | 'Failed';
  details?: Record<string, any>;
  createdAt: any;
}

export interface AdminUser {
  id:string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Support' | 'Content';
}


export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  createdAt: any;
}

export interface ClientNote {
  id: string;
  content: string;
  author: string;
  createdAt: any; // Firestore Timestamp
}

export interface ClientRequest {
  id: string;
  title: string;
  status: 'New' | 'In Progress' | 'Completed';
  createdAt: any; // Firestore Timestamp
}


export interface User extends FirebaseUser {}
