// src/screens/DashboardScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/appNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

type DashboardNav = StackNavigationProp<RootStackParamList>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardNav>();

  return (
    <View style={styles.container}>
      {/* 🔹 Encabezado */}
      <View style={styles.header}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image source={require("../../assets/images/avatar.png")} style={styles.profile} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Bienvenida */}
      <Text style={styles.greeting}>Hola, yam</Text>
      <Text style={styles.date}>Mon 8 Sept</Text>

      {/* 🔹 Animación */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require("../../assets/lotties/bike.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
      </View>

      {/* 🔹 Funciones */}
      <Text style={styles.sectionTitle}>Funciones</Text>
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card}>
          <Image source={require("../../assets/images/map.png")} style={styles.icon} />
          <Text style={styles.cardText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image source={require("../../assets/images/team.png")} style={styles.icon} />
          <Text style={styles.cardText}>Team</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image source={require("../../assets/images/bike.png")} style={styles.icon} />
          <Text style={styles.cardText}>MoviShare</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image source={require("../../assets/images/chat.png")} style={styles.icon} />
          <Text style={styles.cardText}>Chatbot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E6C65", padding: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { width: 220, height: 200, resizeMode: "center" },
  profile: { width: 40, height: 40, borderRadius: 20 },
  greeting: {
    fontSize: 24,
    color: "#fff",
    marginTop: 1,
    fontFamily: "OutfitMedium",
  },
  date: { color: "#ddd", marginBottom: 16, fontFamily: "MooliRegular" },
  animationContainer: { alignItems: "center", marginVertical: 1 },
  sectionTitle: { fontSize: 20, color: "#fff", marginBottom: 12, fontFamily: "OutfitMedium" },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardText: { color: "#333", fontSize: 16, marginTop: 6 },
  icon: { width: 50, height: 50, resizeMode: "contain" },
});
