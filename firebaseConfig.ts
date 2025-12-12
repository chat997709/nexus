
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Helper to safely get env vars without crashing if import.meta.env is undefined
// We use direct access pattern inside a function to handle both Vite replacement and runtime fallbacks
const getEnv = (key: string, fallback: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || fallback;
    }
  } catch (e) {
    console.warn("Error accessing environment variable:", key);
  }
  return fallback;
};

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY", "AIzaSyAtAxTcHVmmXwnJVlq7Di8hUYForsjmWO8"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", "nexus-play-b4d89.firebaseapp.com"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", "nexus-play-b4d89"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", "nexus-play-b4d89.firebasestorage.app"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "588309940832"),
  appId: getEnv("VITE_FIREBASE_APP_ID", "1:588309940832:web:dfa1e5ef21bee9c2cad105"),
  measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID", "G-54TXMDHCN3")
};

// Проверяем, настроил ли пользователь ключи
const isConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey.startsWith("AIza");

let app: firebase.app.App | null = null;
let auth: firebase.auth.Auth | null = null;
let db: firebase.firestore.Firestore | null = null;
let googleProvider: firebase.auth.GoogleAuthProvider | null = null;

if (isConfigured) {
  try {
    // Check if apps already initialized to prevent duplicates in HMR
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
    
    auth = firebase.auth();
    db = firebase.firestore();
    googleProvider = new firebase.auth.GoogleAuthProvider();
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }
} else {
  console.warn("Nexus Play: Valid Firebase API Key not found.");
}

export { auth, db, googleProvider, isConfigured };
