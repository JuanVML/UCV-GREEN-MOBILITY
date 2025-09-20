import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import ProfileScreen from "../screens/Profile";

export type RootStackParamList = {
  Main: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();




export default function AppNavigator() {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}  // 👈 Aquí está bien escrito
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
