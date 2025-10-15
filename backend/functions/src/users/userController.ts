import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Buscar usuario por correo
export async function getUserByEmail(email: string) {
  const q = query(collection(db, "Usuarios"), where("Correo Institucional", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

/**
 * Convierte un archivo a base64.
 * @param file Archivo de imagen (File o Blob)
 * @returns Promise<string> base64 string
 */
function convertToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Registra un usuario en Firebase Auth y Firestore, incluyendo imagen en base64.
 * @param data Datos del usuario (email, password, name, carrera, dni, ciclo)
 * @param imageFile Archivo de imagen seleccionado por el usuario (File o Blob)
 */
export async function registerUser(
  data: {
    email: string;
    password: string;
    name: string;
    carrera: string;
    dni: string;
    ciclo: string;
  },
  imageFile?: File | Blob // Puede ser undefined si no se selecciona imagen
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // 1. Validar imagen (si existe)
    let imagen: string;
    if (imageFile) {
      // Validar tamaño máximo 1MB
      const maxSize = 1024 * 1024; // 1MB en bytes
      if ("size" in imageFile && imageFile.size > maxSize) {
        return { success: false, error: "Solo se admiten fotos de hasta 1MB de peso." };
      }
      // Convertir a base64
      imagen = await convertToBase64(imageFile);
    } else {
      // Imagen por defecto si no se selecciona ninguna
      imagen = "https://via.placeholder.com/300x300.png?text=UCV+User";
    }

    // 2. Registrar usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

    // 3. Guardar datos en Firestore (colección "Registro")
    await addDoc(collection(db, "Registro"), {
      uid: userCredential.user.uid,
      ...data,
      imagen, // Guardar imagen en base64 o URL por defecto
    });

    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al registrar usuario." };
  }
}