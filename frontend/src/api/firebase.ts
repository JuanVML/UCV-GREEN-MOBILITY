/**
 * Configuración de Firebase para Expo React Native (Android)
 * Compatible con Firestore, Auth y Storage
 */

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, initializeAuth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBcC34e6rPmgusO6s7BOQIz9xv_NE1Wnak",
  authDomain: "ucv-green-mobility-f98b1.firebaseapp.com",
  projectId: "ucv-green-mobility-f98b1",
  storageBucket: "ucv-green-mobility-f98b1.appspot.com",
  messagingSenderId: "978357271003",
  appId: "1:978357271003:android:5b55b550f0e4c85fcc4ffe",
};

// 🔧 Inicializa la app solo una vez
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 🔐 Inicializa Auth
let auth: Auth;
try {
  if (Platform.OS !== "web" && typeof initializeAuth === "function") {
    auth = initializeAuth(app, { persistence: undefined });
  } else {
    auth = getAuth(app);
  }
} catch (error) {
  console.warn("⚠️ Error inicializando Auth, usando fallback getAuth:", error);
  auth = getAuth(app);
}

// 🧭 Firestore y Storage
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };

console.log("✅ Firebase inicializado correctamente con Auth, Firestore y Storage");
