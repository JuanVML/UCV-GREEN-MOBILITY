import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/Dashboard";
import ChatbotScreen from "../screens/Chatbot";
import MoviShareScreen from "../screens/MoviShare";
import MapScreen from "../screens/Map";
import TeamScreen from "../screens/Team";
import { Ionicons } from "@expo/vector-icons";

export type TabParamList = {
  Dashboard: undefined;
  Mapa: undefined;
  MoviShare: undefined;
  Chatbot: undefined;
  Equipo: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Dashboard":
              iconName = "home";
              break;
            case "Mapa":
              iconName = "map";
              break;
            case "MoviShare":
              iconName = "bicycle";
              break;
            case "Chatbot":
              iconName = "chatbubble-ellipses";
              break;
            case "Equipo":
              iconName = "people";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="MoviShare" component={MoviShareScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Equipo" component={TeamScreen} />
    </Tab.Navigator>
  );
}

