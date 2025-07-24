import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  projectId: "vincent-designs",
  appId: "1:201595097998:web:812ffdc2480d00488a0adf",
  storageBucket: "vincent-designs.firebasestorage.app",
  apiKey: "AIzaSyDsWjvw_MGdM0sk7quTLKUTxRmdjVOXVoE",
  authDomain: "vincent-designs.firebaseapp.com",
  messagingSenderId: "201595097998",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// The database is not used for now, so we can comment it out.
// import { getFirestore } from "firebase/firestore";
// const db = getFirestore(app);

export { app };
