/**
 * Configuración de Firebase para Expo React Native (Android)
 * Compatible con Firestore, Auth y Storage
 */

import { initializeApp, getApps, getApp } from "firebase/app";
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

// 🔧 Inicializa la app solo una vez y evita re-inicializaciones con config distinta
let app;
const existingApps = getApps();
if (existingApps.length) {
  // usar la app existente
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const existingApp = getApp();
  // comparar opciones básicas para detectar diferencias de configuración
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const existingOptions = (existingApp.options || {}) as any;
    const newOptions = firebaseConfig as any;
    const same = Object.keys(newOptions).every((k: string) => existingOptions[k] === newOptions[k]);
    if (!same) {
      console.warn('⚠️ Firebase: ya existe una app inicializada con opciones diferentes. Usando la instancia existente.');
    }
  } catch (e) {
    // ignore
  }
  app = existingApp;
} else {
  app = initializeApp(firebaseConfig);
}

// 🔐 Inicializa Auth
let auth: Auth;
try {
  // Carga dinámica para evitar errores si el paquete RN no está disponible en entornos web
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
  const rnAuth = require('firebase/auth/react-native');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const reactNativePersistence = rnAuth.getReactNativePersistence(AsyncStorage);
  auth = initializeAuth(app, { persistence: reactNativePersistence });
} catch (e) {
  // Fallback: si initializeAuth no está disponible o falla, usar getAuth
  // (por ejemplo en entornos web o si ya fue inicializado)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  auth = getAuth(app);
}

// 🧭 Firestore y Storage
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };

console.log("✅ Firebase inicializado correctamente con Auth, Firestore y Storage");
