// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA866ntQjm_mCSIV6tOY49sC87VCos3Zjo",
  authDomain: "mens-health-app-b7749.firebaseapp.com",
  projectId: "mens-health-app-b7749",
  storageBucket: "mens-health-app-b7749.firebasestorage.app",
  messagingSenderId: "153718063629",
  appId: "1:153718063629:web:988c1a11b7ba0150888b44",
  measurementId: "G-1JQMFN2VF2",
  // Web SDK configuration for Google OAuth
  clientId: "153718063629-6r7pffek2pt83fmlqb5uu49n2inb87br.apps.googleusercontent.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Debug: Log Firestore configuration
console.log('Firestore initialized with project:', firebaseConfig.projectId);

// Initialize Analytics (only in production)
export const analytics = typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? getAnalytics(app) : null;

export default app;
