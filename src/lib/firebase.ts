
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, browserLocalPersistence, browserSessionPersistence, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  projectId: "vincent-designs",
  appId: "1:201595097998:web:812ffdc2480d00488a0adf",
  storageBucket: "vincent-designs.appspot.com",
  apiKey: "AIzaSyDsWjvw_MGdM0sk7quTLKUTxRmdjVOXVoE",
  authDomain: "vincent-designs.firebaseapp.com",
  messagingSenderId: "201595097998",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// It's safe to call initializeAuth on the client, and it has no effect on the server.
// This is a reliable way to set persistence.
if (typeof window !== 'undefined') {
  initializeAuth(app, {
    persistence: [browserLocalPersistence, browserSessionPersistence]
  });
}


export { app, db, auth };
