import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAlZMOgyE9vAaoVhuKo71HdaTSjrXjQYMk",
  authDomain: "ucv-green-mobility-f98b1.firebaseapp.com",
  projectId: "ucv-green-mobility-f98b1",
  storageBucket: "ucv-green-mobility-f98b1.appspot.com",
  messagingSenderId: "978357271003",
  appId: "1:978357271003:web:a46d5c32f62a3b01cc4ffe"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la autenticación y base de datos
export const auth = getAuth(app);
export const db = getFirestore(app);
