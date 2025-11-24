// src/components/Header.tsx
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
import { useUser } from "../context/UserContext";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../api/firebase";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  onAvatarPress?: () => void;
};

export default function Header({ onAvatarPress }: Props) {
  const { user, setUser } = useUser();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      try {
        const q = query(collection(db, "Registro"), where("uid", "==", firebaseUser.uid));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const data = snap.docs[0].data() as any;
          setUser({
            name: data.name ?? firebaseUser.displayName ?? "Usuario",
            email: data.email ?? firebaseUser.email ?? "",
            avatar: data.imagen ?? firebaseUser.photoURL ?? null,
          });
        } else {
          setUser({
            name: firebaseUser.displayName ?? "Usuario",
            email: firebaseUser.email ?? "",
            avatar: firebaseUser.photoURL ?? null,
          });
        }
      } catch {
        setUser({
          name: firebaseUser.displayName ?? "Usuario",
          email: firebaseUser.email ?? "",
          avatar: firebaseUser.photoURL ?? null,
        });
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
          toValue: 1.05,
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

  const avatarUrl =
    user?.avatar ?? "https://cdn-icons-png.flaticon.com/512/219/219986.png";

  return (
    <LinearGradient
      colors={["#0E8A52", "#0C6C44", "#07492E"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerContainer}
    >
      <View style={styles.topRow}>
        <Animated.Image
          source={require("../../assets/images/logo.png")}
          style={[
            styles.logo,
            { opacity: fadeAnim, transform: [{ scale: pulseAnim }] },
          ]}
        />

        <TouchableOpacity onPress={onAvatarPress} style={styles.avatarWrap}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Campus sostenible y conectado 🌱</Text>

      <View style={styles.greetingRow}>
        <Text style={styles.greeting}>Hola, {user?.name ?? "Usuario"}</Text>
        <View style={styles.datePill}>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 52 : 32,
    paddingBottom: 26,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 110,
    resizeMode: "contain",
  },
  avatarWrap: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.45)",
    padding: 4,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(14px)", // efecto cristal
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 15,
    color: "#DFFFEA",
    marginTop: 2,
    marginBottom: 6,
    opacity: 0.95,
  },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontFamily: fonts.title,
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  datePill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  dateText: {
    fontFamily: fonts.text,
    color: "#F1FFF5",
    fontSize: 13,
  },
});
