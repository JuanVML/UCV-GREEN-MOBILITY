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
      Alert.alert("Permiso denegado", "Se requiere acceso a tus fotos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  // === Validaciones ===
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (repeatPassword && text !== repeatPassword) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const handleRepeatPasswordChange = (text: string) => {
    setRepeatPassword(text);
    if (password && text !== password) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const validateEmail = (correo: string) => {
    setEmail(correo);
    if (correo.length > 0 && !correo.endsWith("@ucvvirtual.edu.pe")) {
      setEmailError("Solo se permiten correos @ucvvirtual.edu.pe");
    } else {
      setEmailError("");
    }
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
          console.warn("No se pudo guardar la imagen localmente:", err);
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
        imagenLocal: localImagePath, // ruta local guardada
        imagen: foto ?? null,        // ruta temporal
      });

      if (result.success) {
        Alert.alert("✅ Registro exitoso", "Tu cuenta ha sido creada correctamente.");
      } else {
        Alert.alert("Error", result.error || "No se pudo registrar el usuario.");
      }
    } catch (error: any) {
      console.error("Registro error:", error);
      Alert.alert("Error", error.message || "No se pudo registrar");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo moto.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>UCV Green Mobility</Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Regístrate</Text>

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
        {emailError ? (
          <Text style={{ color: "red", marginBottom: 8 }}>{emailError}</Text>
        ) : null}

        {/* Fila carrera + ciclo + foto */}
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
                {ciclo || "Ciclo"}
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

          {/* Imagen */}
          <View style={styles.uploadBox}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.fotoPreview} />
            ) : (
              <>
                <Text style={styles.uploadLabel}>Foto</Text>
                <TouchableOpacity onPress={subirImagen}>
                  <Text style={styles.uploadLink}>Subir Imagen</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Contraseña */}
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
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Repite contraseña */}
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
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {passwordError ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{passwordError}</Text>
        ) : null}

        {/* Botón enviar */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>ENVIAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Registro;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#ecf1f0" },
  header: {
    backgroundColor: "#0d6e6e",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 90,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: { width: 90, height: 90, resizeMode: "contain", marginBottom: 5 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  form: {
    flex: 1,
    backgroundColor: "#ecf1f0",
    marginTop: -70,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0d6e6e",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  colLeft: { flex: 1, marginRight: 10 },
  inputHalfFix: { width: "100%" },
  uploadBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  uploadLabel: { fontSize: 12, color: "#777", marginBottom: 5 },
  uploadLink: { color: "purple", fontSize: 13, fontWeight: "bold" },
  fotoPreview: { width: "100%", height: "100%", borderRadius: 10, resizeMode: "cover" },
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
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  eyeIcon: {
    padding: 10,
    position: "absolute",
    right: 0,
    zIndex: 10,
  },
});
