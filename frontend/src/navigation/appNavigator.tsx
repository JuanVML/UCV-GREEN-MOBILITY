import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/Dashboard';
import MapScreen from '../screens/Map';
import MoviShareScreen from '../screens/MoviShare';
import ChatbotScreen from '../screens/Chatbot';
import TeamScreen from '../screens/Team';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { height: 65, paddingBottom: 8, paddingTop: 8 },
        tabBarIcon: ({ focused, color, size }) => {
          let name: any = 'home';
          if (route.name === 'Mapa') name = 'map';
          if (route.name === 'MoviShare') name = 'bicycle';
          if (route.name === 'Chatbot') name = 'chatbubble';
          if (route.name === 'Team') name = 'people';
          return <Ionicons name={name} size={24} color={focused ? '#0F6E66' : '#9AAEB0'} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="MoviShare" component={MoviShareScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      {/* Screens accesibles desde botones del dashboard */}
    </Stack.Navigator>
  );
}
