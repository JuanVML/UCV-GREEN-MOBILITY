import React, { useEffect, useState } from "react";
import { LogBox } from "react-native";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";

import AppNavigator from "./src/navigation/appNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider as AppThemeProvider } from "./src/context/ThemeContext";

LogBox.ignoreAllLogs(true);

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        "Outfit-Medium": require("./assets/fonts/Outfit-Medium.ttf"),
        "Mooli-Regular": require("./assets/fonts/Mooli-Regular.ttf"),
      });
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <AppThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </AppThemeProvider>
  );
}
