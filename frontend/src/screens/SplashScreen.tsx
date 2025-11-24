import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Usar reset para asegurarnos de que la pila de navegación queda en Login
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/logo2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>UCV Green Mobility</Text>
        <Text style={styles.subtitle}>
          Comparte el camino hacia{"\n"}un campus más sostenible
        </Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B6A75",
    justifyContent: "center", // centra vertical
    alignItems: "center", // centra horizontal
    paddingHorizontal: 50,
  },
  content: {
    alignItems: "center", // centra logo y textos
  },
logo: {
  width: 500,
  height: 470,
  marginBottom: -170,
  alignSelf: "flex-start", // lo manda a la izquierda
  marginLeft: 30, 
  marginRight : 150,         // ajusta cuanto se mueve a la izquierda
},

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
  },
});

export default SplashScreen;
