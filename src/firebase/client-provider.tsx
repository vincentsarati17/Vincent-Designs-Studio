
'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { getSdks } from '@/firebase';
import { getFirebaseConfig } from '@/firebase/config';
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

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices>(null);

  useEffect(() => {
    // Initialize Firebase on the client side, once per component mount.
    if (!getApps().length) {
      try {
        const firebaseConfig = getFirebaseConfig();
        initializeApp(firebaseConfig);
      } catch (error) {
        console.error("Firebase initialization failed:", error);
        // If config is missing, we can't proceed.
        // The app will not have Firebase services.
        return;
      }
    }
    const services = getSdks(getApps()[0]);
    setFirebaseServices(services);
  }, []); // Empty dependency array ensures this runs only once on mount

  if (!firebaseServices) {
    // You can render a loading state here if needed
    // For now, we return null to prevent rendering children that depend on Firebase
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
