// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native"; // Contenedor principal de navegación
import AppNavigator from "./src/navigation/appNavigator"; // Navegador principal
import { useFonts } from "expo-font"; // Hook para cargar fuentes
import { ActivityIndicator, View } from "react-native"; // Loader de carga

export default function App() {
  // 🔹 Cargamos las tipografías personalizadas desde assets/fonts
  const [fontsLoaded] = useFonts({
    Mooli: require("./assets/fonts/Mooli-Regular.ttf"),
    Outfit: require("./assets/fonts/Outfit-Medium.ttf"),
  });

 
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 🔹 Cuando las fuentes ya están listas, mostramos la navegación de la app
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
