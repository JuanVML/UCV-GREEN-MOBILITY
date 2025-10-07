import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateGroup: (groupData: CreateGroupData) => Promise<boolean>;
  isLoading?: boolean;
}

export interface CreateGroupData {
  title: string;
  description: string;
  maxUsers: number;
  departureTime: string;
  meetingPoint: string;
}

export default function CreateGroupModal({ 
  visible, 
  onClose, 
  onCreateGroup, 
  isLoading = false 
}: CreateGroupModalProps) {
  const [formData, setFormData] = useState<CreateGroupData>({
    title: '',
    description: '',
    maxUsers: 8,
    departureTime: '',
    meetingPoint: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.departureTime.trim()) {
      newErrors.departureTime = 'La hora de salida es requerida';
    } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)?$/i.test(formData.departureTime)) {
      newErrors.departureTime = 'Formato inválido (ej: 6:30 AM)';
    }

    if (!formData.meetingPoint.trim()) {
      newErrors.meetingPoint = 'El punto de encuentro es requerido';
    }

    if (formData.maxUsers < 2 || formData.maxUsers > 20) {
      newErrors.maxUsers = 'Debe ser entre 2 y 20 usuarios';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      console.log('Modal: Iniciando creación de grupo:', formData);
      const success = await onCreateGroup(formData);
      console.log('Modal: Resultado de creación:', success);
      
      if (success) {
        console.log('Modal: Grupo creado exitosamente, limpiando formulario');
        // Limpiar formulario
        setFormData({
          title: '',
          description: '',
          maxUsers: 8,
          departureTime: '',
          meetingPoint: '',
        });
        setErrors({});
        onClose();
      } else {
        console.log('Modal: Error al crear grupo');
        Alert.alert('Error', 'No se pudo crear el grupo. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Modal: Error en handleCreate:', error);
      Alert.alert('Error', 'No se pudo crear el grupo. Intenta nuevamente.');
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          style={styles.modalContent}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Crear Nuevo Grupo</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.form} 
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Título de la ruta */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título de la Ruta *</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="Ej: Ruta Callao - UCV"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                maxLength={60}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            {/* Descripción */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción (Opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe los detalles de la ruta..."
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
                maxLength={200}
                textAlignVertical="top"
              />
            </View>

            {/* Punto de encuentro */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Punto de Encuentro *</Text>
              <TextInput
                style={[styles.input, errors.meetingPoint && styles.inputError]}
                placeholder="Ej: Estación Naranjal"
                value={formData.meetingPoint}
                onChangeText={(text) => setFormData({ ...formData, meetingPoint: text })}
                maxLength={80}
              />
              {errors.meetingPoint && <Text style={styles.errorText}>{errors.meetingPoint}</Text>}
            </View>

            {/* Hora de salida */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hora de Salida *</Text>
              <TextInput
                style={[styles.input, errors.departureTime && styles.inputError]}
                placeholder="Ej: 6:30 AM"
                value={formData.departureTime}
                onChangeText={(text) => setFormData({ ...formData, departureTime: text })}
                maxLength={10}
              />
              {errors.departureTime && <Text style={styles.errorText}>{errors.departureTime}</Text>}
            </View>

            {/* Número máximo de usuarios */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Máximo de Usuarios</Text>
              <View style={styles.numberInputContainer}>
                <TouchableOpacity
                  style={styles.numberButton}
                  onPress={() => setFormData({ 
                    ...formData, 
                    maxUsers: Math.max(2, formData.maxUsers - 1) 
                  })}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={20} color={lightTheme.primary} />
                </TouchableOpacity>
                
                <Text style={styles.numberValue}>{formData.maxUsers}</Text>
                
                <TouchableOpacity
                  style={styles.numberButton}
                  onPress={() => setFormData({ 
                    ...formData, 
                    maxUsers: Math.min(20, formData.maxUsers + 1) 
                  })}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color={lightTheme.primary} />
                </TouchableOpacity>
              </View>
              {errors.maxUsers && <Text style={styles.errorText}>{errors.maxUsers}</Text>}
            </View>
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.createButton, isLoading && styles.createButtonDisabled]}
              onPress={handleCreate}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={[styles.createButtonText, { marginLeft: 8 }]}>
                    Creando...
                  </Text>
                </View>
              ) : (
                <Text style={styles.createButtonText}>Crear Grupo</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    maxHeight: '95%',
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
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContent: {
    paddingTop: 15,
    paddingBottom: 5,
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: 'Mooli-Regular',
    color: '#333333',
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  textArea: {
    minHeight: 70,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    fontFamily: 'Mooli-Regular',
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 8,
  },
  numberButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8F7',
    borderRadius: 20,
  },
  numberValue: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#333333',
    marginHorizontal: 30,
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
  createButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: lightTheme.primary,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
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