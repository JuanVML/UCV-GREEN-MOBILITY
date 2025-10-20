import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../theme/fonts";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "../api/firebase";
import { useUser } from "../context/UserContext";

type Props = { visible: boolean; onClose: () => void };

type ProfileData = {
  name?: string;
  email?: string;
  carrera?: string;
  dni?: string;
  ciclo?: string;
  password?: string;
  imagenLocal?: string;
  uid?: string;
};

export default function ProfilePanel({ visible, onClose }: Props) {
  if (!visible) return null;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { updateAvatar } = useUser();

  // 🔹 Mostrar notificación animada
  const showSuccessToast = (message: string) => {
    setSuccessVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setSuccessVisible(false));
    }, 2500);
  };

  // 🔹 Cargar perfil
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfile(null);
        setAvatarUrl(null);
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "Registro"), where("uid", "==", user.uid));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const data = snap.docs[0].data() as ProfileData;
          setProfile(data);

          if (data.imagenLocal) {
            const info = await FileSystem.getInfoAsync(data.imagenLocal);
            if (info.exists) {
              setAvatarUrl(data.imagenLocal);
              updateAvatar(data.imagenLocal);
              setLoading(false);
              return;
            }
          }

          setAvatarUrl(
            data.imagenLocal ??
              "https://firebasestorage.googleapis.com/v0/b/ucv-green-mobility-f98b1.appspot.com/o/default-user.png?alt=media"
          );
          updateAvatar(data.imagenLocal ?? "");
        }
      } catch (err) {
        console.warn("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [visible]);

  // 📸 Cambiar imagen (local + contexto)
  const handleChangeImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showSuccessToast("Permiso denegado para acceder a galería.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;

      const uri = result.assets[0].uri;
      const profilesDir = FileSystem.documentDirectory + "profiles/";
      await FileSystem.makeDirectoryAsync(profilesDir, { intermediates: true });

      const localPath = profilesDir + `${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: uri, to: localPath });

      const user = auth.currentUser;
      if (!user) {
        showSuccessToast("Error: usuario no autenticado.");
        return;
      }

      const q = query(collection(db, "Registro"), where("uid", "==", user.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docRef = snap.docs[0].ref;
        await updateDoc(docRef, { imagenLocal: localPath });
      }

      setAvatarUrl(localPath);
      setProfile((prev) => (prev ? { ...prev, imagenLocal: localPath } : prev));
      updateAvatar(localPath);

      showSuccessToast("🌿 Imagen actualizada correctamente");
    } catch (err: any) {
      console.error("Error cambiando imagen:", err);
      showSuccessToast("❌ No se pudo cambiar la imagen.");
    }
  };

  if (loading) {
    return (
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#2F6B66" style={{ marginTop: 40 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.back} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color="#2F6B66" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ padding: 18 }}>
          <View style={{ alignItems: "center", marginBottom: 8 }}>
            <Image
              source={{
                uri:
                  avatarUrl ??
                  "https://firebasestorage.googleapis.com/v0/b/ucv-green-mobility-f98b1.appspot.com/o/default-user.png?alt=media",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity onPress={handleChangeImage}>
              <Text style={styles.change}>Cambiar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nombre</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{profile?.name ?? ""}</Text>
          </View>

          <Text style={styles.label}>Correo Institucional</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{profile?.email ?? ""}</Text>
          </View>

          <Text style={styles.label}>Carrera</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{profile?.carrera ?? ""}</Text>
          </View>

          <Text style={styles.label}>DNI</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{profile?.dni ?? ""}</Text>
          </View>

          <Text style={styles.label}>Ciclo</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{profile?.ciclo ?? ""}</Text>
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputText}>
              {showPassword ? profile?.password : profile?.password ? "••••••••" : ""}
            </Text>
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={{ paddingLeft: 8 }}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={18} color="#9FBAB7" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ✅ Toast de éxito personalizado */}
        {successVisible && (
          <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
            <Ionicons name="leaf" size={22} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.toastText}>Imagen actualizada correctamente 🌿</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    right: 18,
    top: 40,
    bottom: 40,
    width: 280,
    zIndex: 40,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    elevation: 8,
  },
  back: { position: "absolute", left: 12, top: 12, zIndex: 10 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginTop: 18,
    borderWidth: 2,
    borderColor: "#0d6e6e",
  },
  change: {
    fontFamily: fonts.text,
    color: "#0d6e6e",
    marginTop: 6,
    fontWeight: "bold",
  },
  label: {
    fontFamily: fonts.title,
    color: "#0d6e6e",
    marginTop: 12,
    marginBottom: 6,
    fontSize: 13,
  },
  input: { backgroundColor: "#ECF6F5", padding: 10, borderRadius: 12 },
  inputRow: {
    backgroundColor: "#ECF6F5",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: { fontFamily: fonts.text, color: "#2E6D68" },
  toast: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#1B7F6C",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  toastText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: fonts.text,
  },
});
