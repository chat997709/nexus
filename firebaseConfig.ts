import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const vapidKey = "BJp_IwVgbsKJwxr7j3uTXJYkxPXktJei4FbrVVbgZtbjO277c9pqulD_ENFVkb7702eYm3-KHCJ62L5qanxwBz8";

const firebaseConfig = {
  apiKey: "AIzaSyAtAxTcHVmmXwnJVlq7Di8hUYForsjmWO8",
  authDomain: "nexus-play-b4d89.firebaseapp.com",
  projectId: "nexus-play-b4d89",
  storageBucket: "nexus-play-b4d89.firebasestorage.app",
  messagingSenderId: "588309940832",
  appId: "1:588309940832:web:dfa1e5ef21bee9c2cad105",
  measurementId: "G-54TXMDHCN3"
};

// Проверяем, настроил ли пользователь ключи (AIza...)
const isConfigured = firebaseConfig.apiKey.startsWith("AIza");

let app = null;
let auth = null;
let db = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }
} else {
  console.warn("Nexus Play: Valid Firebase API Key (starting with AIza) not found.");
}

export { auth, db, isConfigured };
