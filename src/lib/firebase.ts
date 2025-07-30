
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "vincent-designs",
  appId: "1:201595097998:web:812ffdc2480d00488a0adf",
  storageBucket: "vincent-designs.appspot.com",
  apiKey: "AIzaSyDsWjvw_MGdM0sk7quTLKUTxRmdjVOXVoE",
  authDomain: "vincent-designs.firebaseapp.com",
  messagingSenderId: "201595097998",
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
