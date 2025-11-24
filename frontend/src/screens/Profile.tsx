import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* 🔹 Botón atrás */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#0E6C65" />
      </TouchableOpacity>

      {/* 🔹 Avatar */}
      <Image
        source={{ uri: "https://avatars.dicebear.com/api/identicon/ucv-user.png" }}
        style={styles.avatar}
      />
      <TouchableOpacity>
        <Text style={styles.changeText}>cambiar</Text>
      </TouchableOpacity>

      {/* 🔹 Datos del usuario */}
      <View style={styles.infoContainer}>
        {/* ⚠️ Estos datos vendrán del backend, por ahora están quemados */}
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} editable={false} value="Bryan Tolentino" />

        <Text style={styles.label}>Correo Institucional</Text>
        <TextInput style={styles.input} editable={false} value="yam1l@dev.edu.pe" />

        <Text style={styles.label}>Carrera</Text>
        <TextInput style={styles.input} editable={false} value="Ingeniería Sistemas" />

        <Text style={styles.label}>DNI</Text>
        <TextInput style={styles.input} editable={false} value="76754576" />

        <Text style={styles.label}>Ciclo</Text>
        <TextInput style={styles.input} editable={false} value="VIII" />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput style={styles.input} editable={false} value="********" secureTextEntry />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  backButton: { marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: "center" },
  changeText: { textAlign: "center", color: "#0E6C65", marginVertical: 6 },
  infoContainer: { marginTop: 10 },
  label: { color: "#0E6C65", marginTop: 12, fontWeight: "bold" },
  input: {
    backgroundColor: "#E8F0F2",
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
});
