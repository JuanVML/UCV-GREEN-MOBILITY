import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../screens/Dashboard";
import Map from "../screens/Map";
import Team from "../screens/Team";
import MoviShare from "../screens/MoviShare";
import Chatbot from "../screens/Chatbot";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "home";

          if (route.name === "Inicio") iconName = "home";
          else if (route.name === "Mapa") iconName = "map";
          else if (route.name === "Equipo") iconName = "people";
          else if (route.name === "MoviShare") iconName = "bicycle";
          else if (route.name === "Chatbot") iconName = "chatbubble-ellipses";

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Inicio" component={Dashboard} />
      <Tab.Screen name="Mapa" component={Map} />
      <Tab.Screen name="Equipo" component={Team} />
      <Tab.Screen name="MoviShare" component={MoviShare} />
      <Tab.Screen name="Chatbot" component={Chatbot} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

