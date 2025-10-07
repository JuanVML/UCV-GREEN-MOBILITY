import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';

interface RouteDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onJoin: () => void;
  route: RouteDetails | null;
  isJoining?: boolean;
}

export interface RouteDetails {
  id: string;
  title: string;
  description?: string;
  users: number;
  maxUsers: number;
  time: string;
  meetingPoint?: string;
  createdBy?: string;
  isActive?: boolean;
}

export default function RouteDetailsModal({ 
  visible, 
  onClose, 
  onJoin,
  route,
  isJoining = false 
}: RouteDetailsModalProps) {
  if (!route) return null;

  const availableSpots = route.maxUsers - route.users;
  const isFullRoute = availableSpots <= 0;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Detalles de la Ruta</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Título de la ruta */}
            <View style={styles.detailSection}>
              <View style={styles.detailHeader}>
                <Ionicons name="location" size={20} color={lightTheme.primary} />
                <Text style={styles.sectionTitle}>Ruta</Text>
              </View>
              <Text style={styles.routeTitle}>{route.title}</Text>
            </View>

            {/* Descripción */}
            {route.description && (
              <View style={styles.detailSection}>
                <View style={styles.detailHeader}>
                  <Ionicons name="document-text" size={20} color={lightTheme.primary} />
                  <Text style={styles.sectionTitle}>Descripción</Text>
                </View>
                <Text style={styles.description}>{route.description}</Text>
              </View>
            )}

            {/* Punto de encuentro */}
            {route.meetingPoint && (
              <View style={styles.detailSection}>
                <View style={styles.detailHeader}>
                  <Ionicons name="flag" size={20} color={lightTheme.primary} />
                  <Text style={styles.sectionTitle}>Punto de Encuentro</Text>
                </View>
                <Text style={styles.meetingPoint}>{route.meetingPoint}</Text>
              </View>
            )}

            {/* Creador de la ruta */}
            {route.createdBy && (
              <View style={styles.detailSection}>
                <View style={styles.detailHeader}>
                  <Ionicons name="person" size={20} color={lightTheme.primary} />
                  <Text style={styles.sectionTitle}>Creado por</Text>
                </View>
                <Text style={styles.createdBy}>{route.createdBy}</Text>
              </View>
            )}

            {/* Información de horario y usuarios */}
            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Ionicons name="time" size={18} color="#4CAF50" />
                  <Text style={styles.infoLabel}>Hora de Salida</Text>
                </View>
                <Text style={styles.infoValue}>{route.time}</Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Ionicons name="people" size={18} color="#2196F3" />
                  <Text style={styles.infoLabel}>Participantes</Text>
                </View>
                <Text style={styles.infoValue}>
                  {route.users} / {route.maxUsers}
                </Text>
              </View>
            </View>

            {/* Estado de disponibilidad */}
            <View style={[
              styles.statusCard, 
              isFullRoute ? styles.statusCardFull : styles.statusCardAvailable
            ]}>
              <Ionicons 
                name={isFullRoute ? "close-circle" : "checkmark-circle"} 
                size={20} 
                color={isFullRoute ? "#F44336" : "#4CAF50"} 
              />
              <Text style={[
                styles.statusText, 
                isFullRoute ? styles.statusTextFull : styles.statusTextAvailable
              ]}>
                {isFullRoute 
                  ? "Ruta completa - No hay cupos disponibles"
                  : `${availableSpots} cupo${availableSpots !== 1 ? 's' : ''} disponible${availableSpots !== 1 ? 's' : ''}`
                }
              </Text>
            </View>

            {/* Información adicional */}
            <View style={styles.additionalInfo}>
              {route.createdBy === 'Tú' || route.createdBy === 'Usuario Actual' ? (
                <>
                  <View style={styles.infoRow}>
                    <Ionicons name="person-circle" size={16} color={lightTheme.primary} />
                    <Text style={[styles.additionalText, { color: lightTheme.primary, fontFamily: 'Outfit-Medium' }]}>
                      Eres el creador de esta ruta
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="settings" size={16} color="#666" />
                    <Text style={styles.additionalText}>Puedes modificar los detalles</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.infoRow}>
                    <Ionicons name="shield-checkmark" size={16} color="#666" />
                    <Text style={styles.additionalText}>Ruta verificada y segura</Text>
                  </View>
                </>
              )}
              <View style={styles.infoRow}>
                <Ionicons name="chatbubbles" size={16} color="#666" />
                <Text style={styles.additionalText}>Chat grupal incluido</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="notifications" size={16} color="#666" />
                <Text style={styles.additionalText}>Notificaciones de cambios</Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cerrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.joinButton, 
                (isFullRoute || isJoining) && styles.joinButtonDisabled
              ]}
              onPress={onJoin}
              activeOpacity={0.8}
              disabled={isFullRoute || isJoining}
            >
              {isJoining ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={[styles.joinButtonText, { marginLeft: 8 }]}>
                    Uniéndose...
                  </Text>
                </View>
              ) : (
                <Text style={styles.joinButtonText}>
                  {isFullRoute ? 'Ruta Completa' : 'Unirse a la Ruta'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flex: 1,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: lightTheme.primary,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#333333',
    lineHeight: 24,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Mooli-Regular',
    color: '#666666',
    lineHeight: 22,
  },
  meetingPoint: {
    fontSize: 15,
    fontFamily: 'Mooli-Regular',
    color: '#333333',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: lightTheme.primary,
  },
  createdBy: {
    fontSize: 15,
    fontFamily: 'Outfit-Medium',
    color: '#333333',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Mooli-Regular',
    color: '#666666',
    marginLeft: 6,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#333333',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  statusCardAvailable: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  statusCardFull: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Mooli-Regular',
    marginLeft: 10,
    flex: 1,
  },
  statusTextAvailable: {
    color: '#2E7D32',
  },
  statusTextFull: {
    color: '#C62828',
  },
  additionalInfo: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  additionalText: {
    fontSize: 13,
    fontFamily: 'Mooli-Regular',
    color: '#666666',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: lightTheme.primary,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: lightTheme.primary,
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
  },
  joinButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: lightTheme.primary,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.6,
    backgroundColor: '#CCCCCC',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});