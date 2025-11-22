
import { FirebaseOptions } from "firebase/app";
import { firebaseConfig } from "./client-config";

// This function now builds the config from environment variables
export function getFirebaseConfig(): FirebaseOptions {

  // Basic validation
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Firebase configuration is missing or incomplete. Please check your .env.local file or environment variables.');
  }

  return firebaseConfig;
};

