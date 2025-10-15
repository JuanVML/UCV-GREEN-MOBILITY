/**
 * Configuración de Firebase para Expo React Native (Android)
 * - Inicializa Firebase con los datos reales de google-services.json
 * - Exporta app, auth y db para uso en toda la app
 */

import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuración real de tu proyecto Firebase (Android)
const firebaseConfig = {
  apiKey: "AIzaSyBcC34e6rPmgusO6s7BOQIz9xv_NE1Wnak",
  authDomain: "ucv-green-mobility-f98b1.firebaseapp.com",
  projectId: "ucv-green-mobility-f98b1",
  storageBucket: "ucv-green-mobility-f98b1.firebasestorage.app",
  messagingSenderId: "978357271003",
  appId: "1:978357271003:android:5b55b550f0e4c85fcc4ffe"
};

// Solo inicializa si no existe una app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializa autenticación, Firestore y Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("✅ Firebase inicializado correctamente en Android");

export default app;
