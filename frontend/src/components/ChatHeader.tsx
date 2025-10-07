import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

interface ChatHeaderProps {
  onBackPress: () => void;
}

export default function ChatHeader({ onBackPress }: ChatHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
     
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>AsistenteMobil</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 20, // Más arriba: de 35 a 20
    left: 0,
    right: 0,
    height: 80, // Altura fija para centrar mejor
    zIndex: 1000,
    paddingHorizontal: 20,
    paddingTop: 0, // Sin padding top para centrado perfecto
    paddingBottom: 0, // Sin padding bottom para centrado perfecto
    flexDirection: 'row',
    alignItems: 'center', // Esto centra verticalmente todos los elementos
    justifyContent: 'flex-start', // Alineación al inicio
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25, // Más a la derecha: de 15 a 25
    flex: 1,
    justifyContent: 'flex-start', // Cambiado: alineación al inicio (izquierda)
  },
  titleText: {
    fontSize: 20, // Texto más grande
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
    marginRight: 15, // Más espacio entre texto y animación
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

});