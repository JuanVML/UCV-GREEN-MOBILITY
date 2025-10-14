import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '../hooks/useNavigation';
import { useMovilShare } from '../hooks/useMovilShare';
import { lightTheme } from '../theme/colors';
import { fonts } from '../theme/fonts';
import MovilShareHeader from '../components/MovilShareHeader';
import UserShareCard from '../components/UserShareCard';

export default function MoviShareScreen() {
  const navigation = useNavigation();
  const { users, isLoading, error, joinUser, createMeetingPoint } = useMovilShare();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleUserPress = async (userId: string) => {
    // TODO: Implementar navegación al perfil del usuario o mostrar opciones
    Alert.alert(
      'Unirse al viaje',
      '¿Quieres unirte a este usuario para compartir el viaje?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Unirse', 
          onPress: () => joinUser(userId)
        }
      ]
    );
  };

  const handleCreatePoint = () => {
    // TODO: Implementar modal o navegación para crear punto de encuentro
    Alert.alert(
      'Crear punto',
      'Esta funcionalidad se implementará cuando esté listo el backend',
      [{ text: 'OK' }]
    );
  };

  const handleAvatarPress = () => {
    // TODO: Implementar navegación al perfil del usuario
    console.log('Avatar presionado');
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={lightTheme.primary} />
        <MovilShareHeader 
          title="MovilShare"
          onGoBack={handleGoBack}
          onAvatarPress={handleAvatarPress}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      </View>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={lightTheme.primary} />
        <MovilShareHeader 
          title="MovilShare"
          onGoBack={handleGoBack}
          onAvatarPress={handleAvatarPress}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={lightTheme.primary} />
      
      {/* Header */}
      <MovilShareHeader 
        title="MovilShare"
        onGoBack={handleGoBack}
        onAvatarPress={handleAvatarPress}
      />

      {/* Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {users.length > 0 ? (
            users.map((user) => (
              <UserShareCard
                key={user.id}
                id={user.id}
                name={user.name}
                location={user.location}
                time={user.time}
                avatar={user.avatar}
                onPress={handleUserPress}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No hay usuarios disponibles para compartir viaje en este momento
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create Point Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePoint}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>Crear punto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100, // Espacio para el botón flotante
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: '#FFFFFF',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: lightTheme.primary,
    padding: 16,
    paddingBottom: 32,
  },
  createButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});