import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CreateLoanRequest, CampusGate, VehicleType } from '../types/movilshare';
import { lightTheme } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface CreateLoanModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateLoan: (loanData: CreateLoanRequest) => Promise<boolean>;
  isLoading?: boolean;
}

const CreateLoanModal: React.FC<CreateLoanModalProps> = ({
  visible,
  onClose,
  onCreateLoan,
  isLoading = false,
}) => {
  const [vehicleType, setVehicleType] = useState<VehicleType>('bicycle');
  const [vehicleDescription, setVehicleDescription] = useState('');
  const [campusGate, setCampusGate] = useState<CampusGate>('Puerta Principal');
  const [returnTime, setReturnTime] = useState('');
  const [waitingTime, setWaitingTime] = useState<number>(5);
  const [arrivalInstructions, setArrivalInstructions] = useState('');
  const [requirements, setRequirements] = useState('');

  const campusGates: CampusGate[] = ['Puerta Principal', 'Puerta 2', 'Puerta 3'];
  const waitingTimeOptions = [5, 10, 15];

  const resetForm = () => {
    setVehicleType('bicycle');
    setVehicleDescription('');
    setCampusGate('Puerta Principal');
    setReturnTime('');
    setWaitingTime(5);
    setArrivalInstructions('');
    setRequirements('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    if (!returnTime.trim()) {
      Alert.alert('Error', 'Por favor ingresa la hora de devolución');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const loanData: CreateLoanRequest = {
      vehicleType,
      vehicleDescription: vehicleDescription.trim() || undefined,
      campusGate,
      returnTime: returnTime.trim(),
      waitingTime,
      arrivalInstructions: arrivalInstructions.trim() || undefined,
      requirements: requirements.trim() || undefined,
    };

    const success = await onCreateLoan(loanData);

    if (success) {
      Alert.alert(
        '¡Éxito!',
        'Tu punto de préstamo ha sido creado correctamente',
        [{ text: 'OK', onPress: handleClose }]
      );
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Crear Punto de Préstamo</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Vehicle Type */}
            <View style={styles.section}>
              <Text style={styles.label}>Tipo de Movilidad *</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    vehicleType === 'bicycle' && styles.optionButtonActive,
                  ]}
                  onPress={() => setVehicleType('bicycle')}
                >
                  <Ionicons
                    name="bicycle"
                    size={24}
                    color={vehicleType === 'bicycle' ? '#FFFFFF' : lightTheme.primary}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      vehicleType === 'bicycle' && styles.optionTextActive,
                    ]}
                  >
                    Bicicleta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    vehicleType === 'scooter' && styles.optionButtonActive,
                  ]}
                  onPress={() => setVehicleType('scooter')}
                >
                  <Ionicons
                    name="flash"
                    size={24}
                    color={vehicleType === 'scooter' ? '#FFFFFF' : lightTheme.primary}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      vehicleType === 'scooter' && styles.optionTextActive,
                    ]}
                  >
                    Scooter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Vehicle Description */}
            <View style={styles.section}>
              <Text style={styles.label}>Descripción (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Bicicleta MTB roja, Scooter eléctrico negro"
                placeholderTextColor="#999"
                value={vehicleDescription}
                onChangeText={setVehicleDescription}
                maxLength={100}
              />
            </View>

            {/* Campus Gate */}
            <View style={styles.section}>
              <Text style={styles.label}>Puerta de Encuentro *</Text>
              <View style={styles.buttonGroup}>
                {campusGates.map((gate) => (
                  <TouchableOpacity
                    key={gate}
                    style={[
                      styles.gateButton,
                      campusGate === gate && styles.gateButtonActive,
                    ]}
                    onPress={() => setCampusGate(gate)}
                  >
                    <Text
                      style={[
                        styles.gateText,
                        campusGate === gate && styles.gateTextActive,
                      ]}
                    >
                      {gate}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Return Time */}
            <View style={styles.section}>
              <Text style={styles.label}>Hora de Devolución *</Text>
              <Text style={styles.helper}>
                💡 Ingresa 30 min antes de que terminen tus clases
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 11:30 AM"
                placeholderTextColor="#999"
                value={returnTime}
                onChangeText={setReturnTime}
              />
            </View>

            {/* Waiting Time */}
            <View style={styles.section}>
              <Text style={styles.label}>Tiempo de Espera *</Text>
              <Text style={styles.helper}>
                ¿Cuánto tiempo puede esperar el solicitante?
              </Text>
              <View style={styles.buttonGroup}>
                {waitingTimeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeButton,
                      waitingTime === time && styles.timeButtonActive,
                    ]}
                    onPress={() => setWaitingTime(time)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        waitingTime === time && styles.timeTextActive,
                      ]}
                    >
                      {time} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Arrival Instructions */}
            <View style={styles.section}>
              <Text style={styles.label}>Instrucciones de Llegada (Opcional)</Text>
              <Text style={styles.helper}>
                Ej: "Bajo del 3er piso", "Esperarme en la puerta"
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ej: Salgo de clases, esperarme 5 minutos..."
                placeholderTextColor="#999"
                value={arrivalInstructions}
                onChangeText={setArrivalInstructions}
                multiline
                numberOfLines={2}
                maxLength={150}
              />
            </View>

            {/* Requirements */}
            <View style={styles.section}>
              <Text style={styles.label}>Condiciones o Requisitos (Opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ej: Traer candado propio"
                placeholderTextColor="#999"
                value={requirements}
                onChangeText={setRequirements}
                multiline
                numberOfLines={2}
                maxLength={150}
              />
            </View>

            {/* ID Card Notice */}
            <View style={styles.noticeCard}>
              <Ionicons name="card" size={24} color="#F44336" />
              <Text style={styles.noticeText}>
                El solicitante deberá presentar su carnet estudiantil UCV
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.createButton, isLoading && styles.createButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.createButtonText}>Crear</Text>
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
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.title,
    color: '#333',
    marginBottom: 8,
  },
  helper: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: '#999',
    marginBottom: 8,
    lineHeight: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minWidth: 120,
  },
  optionButtonActive: {
    backgroundColor: lightTheme.primary,
    borderColor: lightTheme.primary,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fonts.title,
    color: lightTheme.primary,
    marginLeft: 8,
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  gateButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minWidth: 100,
  },
  gateButtonActive: {
    backgroundColor: lightTheme.primary,
    borderColor: lightTheme.primary,
  },
  gateText: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: '#333',
    textAlign: 'center',
  },
  gateTextActive: {
    color: '#FFFFFF',
    fontFamily: fonts.title,
  },
  timeButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minWidth: 80,
  },
  timeButtonActive: {
    backgroundColor: lightTheme.primary,
    borderColor: lightTheme.primary,
  },
  timeText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#333',
    textAlign: 'center',
  },
  timeTextActive: {
    color: '#FFFFFF',
    fontFamily: fonts.title,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    gap: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.text,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: '#666',
  },
  createButton: {
    flex: 1,
    backgroundColor: lightTheme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: '#FFFFFF',
  },
});

export default CreateLoanModal;
