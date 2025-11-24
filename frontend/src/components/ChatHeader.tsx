import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

interface ChatHeaderProps {
  onBackPress: () => void;
  onClearChat?: () => void;
  showClearButton?: boolean;
}

export default function ChatHeader({ onBackPress, onClearChat, showClearButton = false }: ChatHeaderProps) {
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

      {showClearButton && (
        <TouchableOpacity 
          onPress={onClearChat}
          activeOpacity={0.7}
          style={styles.clearButton}
        >
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
    marginLeft: 25,
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
    marginRight: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  clearButton: {
    padding: 8,
    marginLeft: 10,
  },
});