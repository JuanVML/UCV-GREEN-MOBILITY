import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoanDetails, VehicleType } from '../types/movilshare';
import { lightTheme } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface LoanDetailsModalProps {
  visible: boolean;
  loan: LoanDetails | null;
  onClose: () => void;
  onRequest: () => void;
  isRequesting?: boolean;
  isActiveLoan?: boolean;
}

const LoanDetailsModal: React.FC<LoanDetailsModalProps> = ({
  visible,
  loan,
  onClose,
  onRequest,
  isRequesting = false,
  isActiveLoan = false,
}) => {
  if (!loan) return null;

  const getVehicleIcon = (type: VehicleType) => {
    return type === 'bicycle' ? 'bicycle' : 'flash';
  };

  const getVehicleLabel = (type: VehicleType) => {
    return type === 'bicycle' ? 'Bicicleta' : 'Scooter Eléctrico';
  };

  const isAvailable = loan.status === 'available';

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Detalles del Préstamo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Owner Info */}
            <View style={styles.ownerSection}>
              <Image source={loan.avatar} style={styles.avatar} />
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>{loan.ownerName}</Text>
              </View>
            </View>

            {/* Vehicle Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name={getVehicleIcon(loan.vehicleType)}
                  size={24}
                  color={lightTheme.primary}
                />
                <Text style={styles.sectionTitle}>Movilidad</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.vehicleType}>{getVehicleLabel(loan.vehicleType)}</Text>
                {loan.vehicleDescription && (
                  <Text style={styles.vehicleDescription}>{loan.vehicleDescription}</Text>
                )}
              </View>
            </View>

            {/* Location Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location" size={24} color={lightTheme.primary} />
                <Text style={styles.sectionTitle}>Ubicación</Text>
              </View>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Punto de encuentro:</Text>
                  <Text style={styles.infoValue}>{loan.campusGate}</Text>
                </View>
              </View>
            </View>

            {/* Time Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time" size={24} color={lightTheme.primary} />
                <Text style={styles.sectionTitle}>Horario</Text>
              </View>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Disponible desde:</Text>
                  <Text style={styles.infoValue}>Ahora</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Devolver antes de:</Text>
                  <Text style={styles.infoValue}>{loan.returnTime}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Tiempo de espera:</Text>
                  <Text style={styles.infoValue}>{loan.waitingTime} minutos</Text>
                </View>
              </View>
            </View>

            {/* Arrival Instructions */}
            {loan.arrivalInstructions && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="information-circle" size={24} color="#2196F3" />
                  <Text style={styles.sectionTitle}>Instrucciones de Llegada</Text>
                </View>
                <View style={[styles.infoCard, styles.instructionsCard]}>
                  <Text style={styles.instructionsText}>{loan.arrivalInstructions}</Text>
                </View>
              </View>
            )}

            {/* Requirements */}
            {loan.requirements && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="alert-circle" size={24} color="#FF9800" />
                  <Text style={styles.sectionTitle}>Nota del dueño</Text>
                </View>
                <View style={[styles.infoCard, styles.requirementsCard]}>
                  <Text style={styles.requirementsText}>{loan.requirements}</Text>
                </View>
              </View>
            )}

            {/* General Conditions - ALWAYS SHOWN */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark" size={24} color="#2196F3" />
                <Text style={styles.sectionTitle}>Condiciones de Uso</Text>
              </View>
              <View style={[styles.infoCard, styles.conditionsCard]}>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionBullet}>•</Text>
                  <Text style={styles.conditionText}>Usar únicamente en ciclovías autorizadas</Text>
                </View>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionBullet}>•</Text>
                  <Text style={styles.conditionText}>No prestar a terceros - Uso personal exclusivo</Text>
                </View>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionBullet}>•</Text>
                  <Text style={styles.conditionText}>Respetar todas las señales de tránsito</Text>
                </View>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionBullet}>•</Text>
                  <Text style={styles.conditionText}>Devolver en el mismo estado recibido</Text>
                </View>
              </View>
            </View>

            {/* ID Card Requirement - ALWAYS SHOWN */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="card" size={24} color="#F44336" />
                <Text style={styles.sectionTitle}>Requisito Obligatorio</Text>
              </View>
              <View style={[styles.infoCard, styles.idCardCard]}>
                <Text style={styles.idCardText}>
                  📱 Debes presentar tu carnet estudiantil UCV para verificación al momento del encuentro.
                </Text>
              </View>
            </View>

            {/* Status */}
            <View style={styles.section}>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    isAvailable ? styles.statusAvailable : styles.statusUnavailable,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {isAvailable ? '✓ Disponible' : '✗ No disponible'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.requestButton,
                isActiveLoan && styles.returnButton,
                (!isAvailable || isRequesting) && !isActiveLoan && styles.requestButtonDisabled,
              ]}
              onPress={onRequest}
              disabled={(!isAvailable || isRequesting) && !isActiveLoan}
              activeOpacity={0.8}
            >
              {isRequesting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons 
                    name={isActiveLoan ? "return-down-back" : "checkmark-circle"} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.requestButtonText}>
                    {isActiveLoan 
                      ? `Devolver ${getVehicleLabel(loan.vehicleType)}` 
                      : (isAvailable ? 'Solicitar Préstamo' : 'No Disponible')
                    }
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    maxHeight: '100%',
    padding: 20,
  },
  ownerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontFamily: fonts.title,
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#333',
    marginLeft: 4,
  },
  loansText: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: '#333',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
  },
  vehicleType: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: lightTheme.primary,
    marginBottom: 4,
  },
  vehicleDescription: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fonts.title,
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  requirementsCard: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  requirementsText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#666',
  },
  conditionsCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  conditionBullet: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: '#2196F3',
    marginRight: 8,
    marginTop: 2,
  },
  conditionText: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: '#666',
    lineHeight: 20,
  },
  instructionsCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#666',
    lineHeight: 20,
  },
  idCardCard: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  idCardText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#666',
    lineHeight: 20,
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusAvailable: {
    backgroundColor: '#4CAF50',
  },
  statusUnavailable: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: 14,
    fontFamily: fonts.title,
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  requestButton: {
    backgroundColor: lightTheme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  returnButton: {
    backgroundColor: '#FF9800',
  },
  requestButtonText: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default LoanDetailsModal;
