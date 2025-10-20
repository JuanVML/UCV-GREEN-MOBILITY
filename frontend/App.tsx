// App.tsx
import React, { useEffect, useState } from "react";
import { LogBox, View } from "react-native";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/appNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider as AppThemeProvider } from "./src/context/ThemeContext";
import { ChatProvider } from "./src/context/ChatContext";
import { UserProvider } from "./src/context/UserContext"; // ✅ nuevo

import { auth } from "./src/api/firebase";

LogBox.ignoreAllLogs(true);

export default function App() {
  const [ready, setReady] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        "Outfit-Medium": require("./assets/fonts/Outfit-Medium.ttf"),
        "Mooli-Regular": require("./assets/fonts/Mooli-Regular.ttf"),
      });
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    try {
      if (auth) setFirebaseReady(true);
    } catch {
      setFirebaseReady(false);
    }
  }, []);

  if (!ready) return null;

  return (
    <AppThemeProvider>
      <AuthProvider>
        <UserProvider>
          <ChatProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ChatProvider>
        </UserProvider>
      </AuthProvider>
      <View></View>
    </AppThemeProvider>
  );
}
