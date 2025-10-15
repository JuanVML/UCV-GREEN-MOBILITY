import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

// Login con correo y contraseña
export async function loginWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Registro de usuario (guarda en Auth y Firestore)
export async function registerUser(data: {
  email: string;
  password: string; // Este será el valor de verificarContraseña
  name: string;
  carrera: string;
  dni: string;
  ciclo: string;
}) {
  try {
    // Registro en Auth
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    // Guarda datos extra en Firestore
    await addDoc(collection(db, "Registro"), {
      uid: userCredential.user.uid,
      ...data,
      password: data.password, // Guarda solo la verificada
    });
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}