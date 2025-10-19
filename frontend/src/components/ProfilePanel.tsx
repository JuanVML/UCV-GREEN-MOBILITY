import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../theme/fonts";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage"; // 👈 necesario
import { auth, db } from "../api/firebase";
import { getStorage } from "firebase/storage";

type Props = { visible: boolean; onClose: () => void };

type ProfileData = {
  name?: string;
  email?: string;
  carrera?: string;
  dni?: string;
  ciclo?: string;
  password?: string;
  imagen?: string; // puede ser URL o nombre de archivo
  uid?: string;
};

export default function ProfilePanel({ visible, onClose }: Props) {
  if (!visible) return null;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

          // 📸 Intenta traer la imagen real desde Firebase Storage
          if (data.imagen) {
            const storage = getStorage();
            let imageUrl: string;

            if (data.imagen.startsWith("http")) {
              // ya es una URL completa
              imageUrl = data.imagen;
            } else {
              // es solo un nombre de archivo, obtenemos la URL pública
              const imageRef = ref(storage, `perfiles/${data.imagen}`);
              imageUrl = await getDownloadURL(imageRef);
            }

            setAvatarUrl(imageUrl);
          } else {
            setAvatarUrl(null);
          }
        } else {
          setProfile(null);
          setAvatarUrl(null);
        }
      } catch (err) {
        console.warn("ProfilePanel: error fetching profile", err);
        setProfile(null);
        setAvatarUrl(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [visible]);

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
              source={
                avatarUrl
                  ? { uri: avatarUrl }
                  : { uri: "https://firebasestorage.googleapis.com/v0/b/ucv-green-mobility-f98b1.appspot.com/o/default-user.png?alt=media" }
              }
              style={styles.avatar}
            />
            <Text style={styles.change}>Cambiar</Text>
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
            <Text style={styles.inputText}>{profile?.password ? "••••••••" : ""}</Text>
            <Ionicons name="eye-off" size={18} color="#9FBAB7" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: "absolute", right: 18, top: 40, bottom: 40, width: 280, zIndex: 40 },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 8,
  },
  back: { position: "absolute", left: 12, top: 12, zIndex: 10 },
  avatar: { width: 76, height: 76, borderRadius: 38, marginTop: 16 },
  change: { fontFamily: fonts.text, color: "#7DAAA6", marginTop: 6 },
  label: { fontFamily: fonts.title, color: "#2F6B66", marginTop: 12, marginBottom: 6 },
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
});
