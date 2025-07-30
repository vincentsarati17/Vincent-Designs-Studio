
import type { User as FirebaseUser } from "firebase/auth";

export interface Testimonial {
  name: string;
  company: string;
  quote: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
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
}

export interface User extends FirebaseUser {}
