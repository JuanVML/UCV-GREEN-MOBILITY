import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../hooks/useNavigation';

export default function MoviShareScreen() {
  const navigation = useNavigation();

  // Función para navegar hacia atrás
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/fondo3.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      {/* Configuración de la barra de estado */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Flecha de regreso en la parte superior */}
      <View style={styles.header}>
        <TouchableOpacity 
           
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.text}>Te encuentras en la pantalla MovilShare</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: StatusBar.currentHeight || 44,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  text: { 
    fontSize: 20, 
    fontFamily: 'Mooli-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});