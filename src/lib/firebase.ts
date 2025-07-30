
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, browserLocalPersistence, browserSessionPersistence, Auth } from "firebase/auth";

const firebaseConfig = {
  projectId: "vincent-designs",
  appId: "1:201595097998:web:812ffdc2480d00488a0adf",
  storageBucket: "vincent-designs.appspot.com",
  apiKey: "AIzaSyDsWjvw_MGdM0sk7quTLKUTxRmdjVOXVoE",
  authDomain: "vincent-designs.firebaseapp.com",
  messagingSenderId: "201595097998",
};

let app: FirebaseApp;
let auth: Auth;

if (typeof window === 'undefined') {
  // Server-side initialization
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  // Client-side initialization
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  // This ensures persistence is only set on the client
  auth = initializeAuth(app, {
    persistence: [browserLocalPersistence, browserSessionPersistence]
  });
}

const db = getFirestore(app);

export { app, db, auth };
