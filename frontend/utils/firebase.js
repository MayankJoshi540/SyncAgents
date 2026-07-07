// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "syncagents-c92ab.firebaseapp.com",
  projectId: "syncagents-c92ab",
  storageBucket: "syncagents-c92ab.firebasestorage.app",
  messagingSenderId: "551759670036",
  appId: "1:551759670036:web:1bf8ef1b625bf70a88b001",
  measurementId: "G-W8C6VKMZP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Analytics initialization failed:", e);
}
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider()

export { app, auth, googleProvider };