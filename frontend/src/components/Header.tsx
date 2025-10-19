// frontend/src/components/Header.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { fonts } from "../theme/fonts";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../api/firebase";

type Props = {
  onAvatarPress?: () => void;
};

export default function Header({ onAvatarPress }: Props) {
  const [displayName, setDisplayName] = useState<string>("Usuario");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        setDisplayName("Usuario");
        setAvatarUrl(null);
        return;
      }

      try {
        const q = query(collection(db, "Registro"), where("uid", "==", user.uid));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const data = snap.docs[0].data() as any;
          setDisplayName(data.name ?? user.displayName ?? "Usuario");
          setAvatarUrl(data.imagen ?? user.photoURL ?? null);
        } else {
          setDisplayName(user.displayName ?? "Usuario");
          setAvatarUrl(user.photoURL ?? null);
        }
      } catch (err) {
        console.warn("Header: error al obtener perfil", err);
        setDisplayName(user.displayName ?? "Usuario");
        setAvatarUrl(user.photoURL ?? null);
      }
    });

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => unsubscribe();
  }, []);

  const formattedDate = new Date().toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        {/* Logo institucional con animación */}
        <Animated.Image
          source={require("../../assets/images/logo.png")}
          style={[
            styles.logo,
            { opacity: fadeAnim, transform: [{ scale: pulseAnim }] },
          ]}
        />

        {/* Botón de avatar (abre menú de perfil, modo oscuro, salir, etc.) */}
        <TouchableOpacity onPress={onAvatarPress} style={styles.avatarWrap}>
          <Image
            source={{
              uri:
                avatarUrl ??
                "https://cdn-icons-png.flaticon.com/512/219/219986.png",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Campus sostenible y conectado 🌱</Text>

      <View style={styles.greetingRow}>
        <Text style={styles.greeting}>Hola, {displayName}</Text>
        <View style={styles.datePill}>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    backgroundColor: "#1B5E20",
    paddingTop: Platform.OS === "ios" ? 50 : 25,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 230,
    height: 120,
    resizeMode: "contain",
    marginLeft: -20,
    marginTop: 12,
  },
  avatarWrap: {
    borderWidth: 2,
    borderColor: "#A5D6A7",
    padding: 3,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 14,
    color: "#E8F5E9",
    marginBottom: 4,
    marginTop: -2,
  },
  greetingRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontFamily: fonts.title,
    fontSize: 18,
    color: "#FFFFFF",
  },
  datePill: {
    backgroundColor: "#388E3C",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  dateText: {
    fontFamily: fonts.text,
    color: "#E8F5E9",
    fontSize: 12,
  },
});
