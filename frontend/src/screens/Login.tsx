import React, { useState, useContext } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña");
      return;
    }
    const success = await login(email, password);
    if (!success) {
      Alert.alert("Error", "Credenciales incorrectas");
    }
    // No navegues manualmente, la navegación ocurre automáticamente al cambiar el estado de usuario
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado verde */}
   <View style={styles.header}>
  {/* Imagen mancha en la esquina superior izquierda */}
  <Image
    source={require("../../assets/images/mancha.png")}
    style={styles.mancha}
  />

  <Text style={styles.title}>Hola!</Text>
  <Text style={styles.subtitle}>Bienvenido a Movilidad verde!</Text>
  <Image
    source={require("../../assets/images/Planta.png")}
    style={styles.plant}
  />
</View>

      {/* Card de login */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Iniciar sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo institucional"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        {/* Línea y texto */}
        <Text style={styles.footerText}>Una aplicación exclusiva de :</Text>
        <Image
          source={require("../../assets/images/Escudo-ucv.png")}
          style={styles.logo}
        />

        {/* Registro */}
        <Text style={styles.registerText}>
          ¿No tienes una cuenta?{" "}
          <Text style={styles.registerLink}>Regístrate aquí</Text>
        </Text>

        <Image
        source={require("../../assets/images/Riding slider scooter.gif")}

          style={styles.scooter}
        />
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1c6e65",
  },
  header: {
    backgroundColor: "#1c6e65",
    padding: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "flex-start",
    position: "relative",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 45,
    right: 35,
  },
  subtitle: {
    fontSize: 26,
    color: "#fff",
    marginTop: 5,
      right: 35,
  },
  plant: {
    position: "absolute",
    right: -15,
    bottom: -90,
    width: 170,
    height: 350,
    resizeMode: "contain",
    zIndex: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 0,
    marginTop: -30,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    zIndex: 10,
    height: 670
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1c6e65",
    alignSelf: "flex-start"
  },
  input: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#1c6e65",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginVertical: 10,
    resizeMode: "contain",
  },
  registerText: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
  },
  registerLink: {
    color: "#1c6e65",
    fontWeight: "bold",
  },
  scooter: {
    width: 150,
    height: 120,
    marginTop: 15,
    resizeMode: "contain",
  },


  mancha: {
  position: "absolute",
  top: -10,
  left: -10,
  width: 100,   // ajusta el tamaño según necesites
  height: 100,
  resizeMode: "contain",
},

});
