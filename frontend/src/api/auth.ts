import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export async function loginWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export default { loginWithEmail };
