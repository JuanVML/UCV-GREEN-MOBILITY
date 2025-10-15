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
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // Asegúrate de tener @expo/vector-icons instalado
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

  // Función para abrir la galería
  const subirImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se requiere acceso a tus fotos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Usa MediaTypeOptions para Expo
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

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

  const handleRegister = async () => {
    if (password !== repeatPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    const result = await registerUser({
      name: nombre,
      dni,
      email,
      carrera,
      ciclo,
      password: repeatPassword, // Solo este valor se guarda en Firestore
    });
    if (result.success) {
      Alert.alert("Registro exitoso");
      // Navega a login o dashboard
    } else {
      Alert.alert("Error", result.error || "No se pudo registrar");
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
          placeholder="nombre completo"
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

        {/* Fila con carrera + ciclo y foto */}
        <View style={styles.row}>
          {/* Columna izquierda */}
          <View style={styles.colLeft}>
            <TextInput
              style={[styles.input, styles.inputHalfFix]}
              placeholder="carrera"
              value={carrera}
              onChangeText={setCarrera}
            />

            {/* Botón Ciclo */}
            <TouchableOpacity
              style={[styles.input, styles.inputHalfFix]}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <Text style={{ color: ciclo ? "#000" : "#777" }}>
                {ciclo || "ciclo"}
              </Text>
            </TouchableOpacity>

            {/* Menú desplegable */}
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

          {/* Columna derecha: subir imagen */}
          <View style={styles.uploadBox}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.fotoPreview} />
            ) : (
              <>
                <Text style={styles.uploadLabel}>foto</Text>
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
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Repite Contraseña */}
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
            onPress={() => setShowRepeatPassword((prev) => !prev)}
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
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>ENVIAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Registro;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ecf1f0",
  },
  header: {
  backgroundColor: "#0d6e6e",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 90, // antes 30
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
},

  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginBottom: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
form: {
  flex: 1,
  backgroundColor: "#ecf1f0",
  marginHorizontal: 0,
  marginTop: -70,
  borderTopLeftRadius: 40,   // borde arriba izquierda
  borderTopRightRadius: 40,  // borde arriba derecha
  borderBottomLeftRadius: 0, // recto abajo izquierda
  borderBottomRightRadius: 0, // recto abajo derecha
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
  colLeft: {
    flex: 1,
    marginRight: 10,
  },
  inputHalfFix: {
    width: "100%",
  },
  uploadBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  uploadLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
  },
  uploadLink: {
    color: "purple",
    fontSize: 13,
    fontWeight: "bold",
  },
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
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  button: {
    backgroundColor: "#0d6e6e",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
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
