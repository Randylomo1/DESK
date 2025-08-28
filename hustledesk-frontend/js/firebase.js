// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz8thvKw5Mk8il7-aFjdenEpi6eOIVKEQ",
  authDomain: "desk-4b71a.firebaseapp.com",
  projectId: "desk-4b71a",
  storageBucket: "desk-4b71a.firebasestorage.app",
  messagingSenderId: "472077705244",
  appId: "1:472077705244:web:4e00c9413b5747df4affd9",
  measurementId: "G-3GG32091VQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

// Export Firebase services
export { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  googleProvider,
  signInWithPopup,
  onAuthStateChanged,
  doc, 
  setDoc, 
  getDoc 
};
