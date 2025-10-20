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
      } catch (err) {
        console.warn("Header: error al obtener perfil", err);
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

  const avatarUrl =
    user?.avatar ?? "https://cdn-icons-png.flaticon.com/512/219/219986.png";

  return (
    <View style={styles.headerContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    backgroundColor: "#118245ff",
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
