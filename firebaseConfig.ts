
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtAxTcHVmmXwnJVlq7Di8hUYForsjmWO8",
  authDomain: "nexus-play-b4d89.firebaseapp.com",
  projectId: "nexus-play-b4d89",
  storageBucket: "nexus-play-b4d89.firebasestorage.app",
  messagingSenderId: "588309940832",
  appId: "1:588309940832:web:dfa1e5ef21bee9c2cad105",
  measurementId: "G-54TXMDHCN3"
};

// Проверяем, настроил ли пользователь ключи
const isConfigured = firebaseConfig.apiKey.startsWith("AIza");

let app = null;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }
} else {
  console.warn("Nexus Play: Valid Firebase API Key not found.");
}

export { auth, db, googleProvider, isConfigured };
