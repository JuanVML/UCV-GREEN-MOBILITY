// ✅ Importaciones necesarias
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
import { LinearGradient } from "expo-linear-gradient";
import { fonts } from "../theme/fonts";
import * as FileSystem from "expo-file-system/legacy"; // versión legacy para compatibilidad
import * as ImagePicker from "expo-image-picker";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "../api/firebase";
import { useUser } from "../context/UserContext";

// Props recibidos desde el componente padre
type Props = { visible: boolean; onClose: () => void };

// Tipo del perfil del usuario
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

// 🌿 Componente principal del panel de perfil
export default function ProfilePanel({ visible, onClose }: Props) {
  if (!visible) return null; // Si no está visible, no renderiza nada

  // 🔹 Estados del componente
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  // Animación del toast
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Contexto global (para compartir avatar)
  const { updateAvatar } = useUser();

  // 🔔 Función para mostrar el toast de éxito animado
  const showSuccessToast = (message: string) => {
    setSuccessVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Ocultar el toast luego de 2.5 segundos
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setSuccessVisible(false));
    }, 2500);
  };

  // 🔹 Cargar el perfil del usuario desde Firebase cuando se monta el componente
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfile(null);
        setAvatarUrl(null);
        setLoading(false);
        return;
      }

      try {
        // Consulta en Firestore el perfil del usuario autenticado
        const q = query(collection(db, "Registro"), where("uid", "==", user.uid));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const data = snap.docs[0].data() as ProfileData;
          setProfile(data);

          // Si hay imagen local, verificamos que exista en el dispositivo
          if (data.imagenLocal) {
            const info = await FileSystem.getInfoAsync(data.imagenLocal);
            if (info.exists) {
              setAvatarUrl(data.imagenLocal);
              updateAvatar(data.imagenLocal);
              setLoading(false);
              return;
            }
          }

          // Si no hay imagen local, usar la imagen por defecto
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

  // 📸 Cambiar imagen del perfil (solo localmente y en Firestore)
  const handleChangeImage = async () => {
    try {
      // Pedir permiso de acceso a la galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showSuccessToast("Permiso denegado para acceder a galería.");
        return;
      }

      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;

      const uri = result.assets[0].uri;

      // Guardar imagen localmente
      const profilesDir = FileSystem.documentDirectory + "profiles/";
      await FileSystem.makeDirectoryAsync(profilesDir, { intermediates: true });
      const localPath = profilesDir + `${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: uri, to: localPath });

      // Actualizar referencia en Firestore
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

      // Actualizar estados locales y globales
      setAvatarUrl(localPath);
      setProfile((prev) => (prev ? { ...prev, imagenLocal: localPath } : prev));
      updateAvatar(localPath);

      showSuccessToast("🌿 Imagen actualizada correctamente");
    } catch (err: any) {
      console.error("Error cambiando imagen:", err);
      showSuccessToast("❌ No se pudo cambiar la imagen.");
    }
  };

  // ⏳ Pantalla de carga mientras se obtiene la información
  if (loading) {
    return (
      <View style={styles.overlay}>
        <LinearGradient colors={["#E3F9EE", "#F8FFFB"]} style={styles.card}>
          <ActivityIndicator size="large" color="#167D67" style={{ marginTop: 40 }} />
        </LinearGradient>
      </View>
    );
  }

  // 🌿 UI principal del panel
  return (
    <LinearGradient colors={["#E3F9EE", "#F8FFFB"]} style={styles.overlay}>
      <View style={styles.card}>
        {/* Botón de regreso */}
        <TouchableOpacity style={styles.back} onPress={onClose}>
          <Ionicons name="arrow-back" size={22} color="#167D67" />
        </TouchableOpacity>

        {/* Contenido con scroll */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 0 }}>
          {/* Imagen del perfil con anillo verde */}
          <View style={styles.avatarContainer}>
            <LinearGradient colors={["#19A974", "#6AE58F"]} style={styles.avatarBorder}>
              <Image
                source={{
                  uri:
                    avatarUrl ??
                    "https://firebasestorage.googleapis.com/v0/b/ucv-green-mobility-f98b1.appspot.com/o/default-user.png?alt=media",
                }}
                style={styles.avatar}
              />
            </LinearGradient>

            {/* Botón para cambiar imagen */}
            <TouchableOpacity style={styles.changeButton} onPress={handleChangeImage}>
              <Ionicons name="camera-outline" size={16} color="#fff" />
              <Text style={styles.changeText}>Actualizar foto</Text>
            </TouchableOpacity>
          </View>

          {/* Título */}
          <Text style={styles.title}>Perfil UCV</Text>

          {/* Campos del usuario */}
          <View style={styles.field}>
            <Ionicons name="person-outline" size={16} color="#19A974" />
            <Text style={styles.fieldText}>{profile?.name ?? "Sin nombre"}</Text>
          </View>

          <View style={styles.field}>
            <Ionicons name="mail-outline" size={16} color="#19A974" />
            <Text style={styles.fieldText}>{profile?.email ?? ""}</Text>
          </View>

          <View style={styles.field}>
            <Ionicons name="school-outline" size={16} color="#19A974" />
            <Text style={styles.fieldText}>{profile?.carrera ?? ""}</Text>
          </View>

          <View style={styles.field}>
            <Ionicons name="id-card-outline" size={16} color="#19A974" />
            <Text style={styles.fieldText}>{profile?.dni ?? ""}</Text>
          </View>

          <View style={styles.field}>
            <Ionicons name="bicycle-outline" size={16} color="#19A974" />
            <Text style={styles.fieldText}>{profile?.ciclo ?? ""}</Text>
          </View>

          {/* Campo de contraseña con toggle */}
          <View style={[styles.field, { marginBottom: 0 }]}>
            <Ionicons name="lock-closed-outline" size={16} color="#19A974" />
            <Text style={styles.fieldText}>
              {showPassword ? profile?.password : profile?.password ? "••••••••" : ""}
            </Text>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={18}
                color="#888"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Toast animado */}
        {successVisible && (
          <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
            <Ionicons name="leaf" size={22} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.toastText}>Imagen actualizada correctamente 🌿</Text>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

// 🎨 Estilos visuales
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    right: 10,
    top: 50, // antes 40 → reduce espacio superior
    bottom: 180, // antes 40 → reduce espacio inferior
    width: 300,
    zIndex: 40,
    borderRadius: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    shadowColor: "#19A974",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden",
  },
  back: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 10,
    backgroundColor: "#acf4d5ff",
    padding: 6,
    borderRadius: 20,
  },
  avatarContainer: { alignItems: "center", marginTop: 40, marginBottom: 16 },
  avatarBorder: { padding: 3, borderRadius: 60 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#19A974",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: "#19A974",
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  changeText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: fonts.text,
    marginLeft: 6,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: "#167D67",
    marginBottom: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e4f7f2ff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginBottom: 6, // antes 10 → menos espacio entre campos
    shadowColor: "#19A974",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  fieldText: {
    flex: 1,
    fontFamily: fonts.text,
    color: "#194F42",
    fontSize: 13,
    marginLeft: 8,
  },
  toast: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: "#19A974",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  toastText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: fonts.text,
    fontSize: 14,
  },
});
