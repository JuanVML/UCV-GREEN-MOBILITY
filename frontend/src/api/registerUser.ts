/**
 * Función para registrar usuarios en Firebase Auth y guardar su información en Firestore.
 * Permite seleccionar imagen de galería y subirla a Firebase Storage.
 */

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import * as ImagePicker from "expo-image-picker";

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  carrera: string;
  dni: string;
  ciclo: string;
}) {
  try {
    const { email, password, name, carrera, dni, ciclo } = data;

    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Permitir seleccionar imagen de galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    let photoURL = null;

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const response = await fetch(imageUri);
      const blob = await response.blob();
      // Validar tamaño máximo de 1MB
      if (blob.size > 1024 * 1024) {
        throw new Error("Solo se admiten fotos de hasta 1MB de peso.");
      }
      // Guardar la imagen como base64 en Firestore
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      photoURL = await base64Promise;
    } else {
      // Imagen por defecto si no se selecciona ninguna
      photoURL = "https://via.placeholder.com/300x300.png?text=UCV+User";
    }

    // Guardar datos en Firestore
    await addDoc(collection(db, "usuarios"), {
      uid: user.uid,
      email,
      name,
      carrera,
      dni,
      ciclo,
      photoURL,
      createdAt: new Date().toISOString(),
    });

    return { success: true, user };
  } catch (error: any) {
    console.error("Error al registrar usuario:", error);
    return { success: false, error: error.message || "Error al registrar usuario." };
  }
}