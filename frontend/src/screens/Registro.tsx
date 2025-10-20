import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { registerUser } from "../../../backend/functions/src/auth/authController";

const Registro = () => {
  const [foto, setFoto] = useState<string | null>(null);
  const [ciclo, setCiclo] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [carrera, setCarrera] = useState("");

  // === Función para seleccionar imagen ===
  const subirImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se requiere acceso a tus fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) setFoto(result.assets[0].uri);
  };

  // === Validaciones ===
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (repeatPassword && text !== repeatPassword)
      setPasswordError("Las contraseñas no coinciden");
    else setPasswordError("");
  };

  const handleRepeatPasswordChange = (text: string) => {
    setRepeatPassword(text);
    if (password && text !== password)
      setPasswordError("Las contraseñas no coinciden");
    else setPasswordError("");
  };

  const validateEmail = (correo: string) => {
    setEmail(correo);
    if (correo.length > 0 && !correo.endsWith("@ucvvirtual.edu.pe"))
      setEmailError("Solo se permiten correos @ucvvirtual.edu.pe");
    else setEmailError("");
  };

  // === REGISTRO ===
  const handleRegister = async () => {
    if (password !== repeatPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    try {
      let localImagePath: string | null = null;

      // ✅ Guardar imagen localmente
      if (foto) {
        try {
          const profilesDir = FileSystem.documentDirectory + "profiles/";
          await FileSystem.makeDirectoryAsync(profilesDir, { intermediates: true });
          const filename = `${dni || Date.now()}.jpg`;
          localImagePath = profilesDir + filename;
          await FileSystem.copyAsync({ from: foto, to: localImagePath });
        } catch (err) {
          console.warn("No se pudo guardar la imagen local:", err);
          localImagePath = null;
        }
      }

      // ✅ Enviar datos al backend
      const result = await registerUser({
        name: nombre,
        dni,
        email,
        carrera,
        ciclo,
        password: repeatPassword,
        imagenLocal: localImagePath,
        imagen: foto ?? null,
      });

      if (result.success) {
        Alert.alert(
          "🌿 Bienvenido a Movilidad Verde UCV",
          "Tu cuenta ha sido creada exitosamente. Gracias por unirte a nuestra comunidad sostenible 🚴‍♂️."
        );
      } else {
        Alert.alert("❌ Error", result.error || "No se pudo registrar el usuario.");
      }
    } catch (error: any) {
      console.error("Registro error:", error);
      Alert.alert("⚠️ Error inesperado", error.message || "No se pudo registrar.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo moto.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Movilidad Verde UCV</Text>
        <Text style={styles.subtitle}>
          App para fomentar el uso compartido de bicicletas, scooters y rutas seguras 🚴‍♀️
        </Text>
      </View>

      {/* FORMULARIO */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Crea tu cuenta sostenible</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="DNI"
          keyboardType="numeric"
          value={dni}
          onChangeText={setDni}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo institucional"
          keyboardType="email-address"
          value={email}
          onChangeText={validateEmail}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}

        {/* CARRERA Y CICLO */}
        <View style={styles.row}>
          <View style={styles.colLeft}>
            <TextInput
              style={[styles.input, styles.inputHalfFix]}
              placeholder="Carrera"
              value={carrera}
              onChangeText={setCarrera}
            />

            <TouchableOpacity
              style={[styles.input, styles.inputHalfFix]}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <Text style={{ color: ciclo ? "#000" : "#777" }}>
                {ciclo || "Selecciona tu ciclo"}
              </Text>
            </TouchableOpacity>

            {menuVisible && (
              <View style={styles.dropdown}>
                {[
                  "I Ciclo",
                  "II Ciclo",
                  "III Ciclo",
                  "IV Ciclo",
                  "V Ciclo",
                  "VI Ciclo",
                  "VII Ciclo",
                  "VIII Ciclo",
                  "IX Ciclo",
                  "X Ciclo",
                ].map((opcion) => (
                  <TouchableOpacity
                    key={opcion}
                    onPress={() => {
                      setCiclo(opcion);
                      setMenuVisible(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text>{opcion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* IMAGEN */}
          <View style={styles.uploadBox}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.fotoPreview} />
            ) : (
              <>
                <Ionicons name="image-outline" size={28} color="#0d6e6e" />
                <TouchableOpacity onPress={subirImagen}>
                  <Text style={styles.uploadLink}>Subir Foto</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* CONTRASEÑAS */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#0d6e6e"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Repite Contraseña"
            secureTextEntry={!showRepeatPassword}
            value={repeatPassword}
            onChangeText={handleRepeatPasswordChange}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowRepeatPassword(!showRepeatPassword)}
          >
            <Ionicons
              name={showRepeatPassword ? "eye-off" : "eye"}
              size={22}
              color="#0d6e6e"
            />
          </TouchableOpacity>
        </View>

        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        {/* BOTÓN */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Ionicons name="leaf-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Unirme al movimiento verde</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Registro;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#e8f5f2" },
  header: {
    backgroundColor: "#0d6e6e",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  logo: { width: 100, height: 100, resizeMode: "contain", marginBottom: 5 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#c8f5e4", fontSize: 13, textAlign: "center", marginTop: 5 },
  form: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    elevation: 6,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0d6e6e",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f4f8f7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#d9e6e2",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  colLeft: { flex: 1, marginRight: 10 },
  uploadBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#f4f8f7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#c8ded6",
  },
  uploadLink: { color: "#0d6e6e", fontSize: 13, fontWeight: "bold", marginTop: 5 },
  fotoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    paddingVertical: 5,
    elevation: 3,
  },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  button: {
    backgroundColor: "#0d6e6e",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#f4f8f7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d9e6e2",
  },
  eyeIcon: {
    padding: 10,
    position: "absolute",
    right: 0,
    zIndex: 10,
  },
  errorText: { color: "red", marginBottom: 8 },
});
