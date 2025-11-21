
'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { getSdks } from '@/firebase';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
} | null;

// This configuration is now hardcoded to ensure it's available on the client.
// This is safe because these are client-side keys.
const firebaseConfig: FirebaseOptions = {
  "projectId": "vincent-designs",
  "appId": "1:201595097998:web:812ffdc2480d00488a0adf",
  "apiKey": "AIzaSyDsWjvw_MGdM0sk7quTLKUTxRmdjVOXVoE",
  "authDomain": "vincent-designs.firebaseapp.com",
  "measurementId": "G-84PDSFHYSK",
  "messagingSenderId": "201595097998"
};


export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices>(null);

  useEffect(() => {
    // Initialize Firebase on the client side, once per component mount.
    if (!getApps().length) {
      if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY" || !firebaseConfig.projectId) {
          console.error("Firebase configuration is missing or incomplete. Please check and update the values in src/firebase/client-provider.tsx");
          return;
      }
      initializeApp(firebaseConfig);
    }
    const services = getSdks(getApps()[0]);
    setFirebaseServices(services);
  }, []); // Empty dependency array ensures this runs only once on mount

  if (!firebaseServices) {
    // You can render a loading state here if needed
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.app}
      auth={firebaseServices.auth}
      firestore={firebaseServices.db}
    >
      {children}
    </FirebaseProvider>
  );
}
