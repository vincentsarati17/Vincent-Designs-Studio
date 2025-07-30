
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { headers } from "next/headers";

const firebaseConfig = {
  projectId: "vincent-designs",
  appId: "1:201595097998:web:812ffdc2480d00488a0adf",
  storageBucket: "vincent-designs.appspot.com",
  apiKey: "AIzaSyDsWjvw_MGdM0sk7quTLKUTxRmdjVOXVoE",
  authDomain: "vincent-designs.firebaseapp.com",
  messagingSenderId: "201595097998",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Conditionally initialize auth for server/client
const auth = typeof window !== 'undefined'
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: [browserLocalPersistence, browserSessionPersistence],
    });


export { app, db, auth };
