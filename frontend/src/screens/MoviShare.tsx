import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../hooks/useNavigation';
import { useMovilShare } from '../hooks/useMovilShare';
import { lightTheme } from '../theme/colors';
import { fonts } from '../theme/fonts';
import MovilShareHeader from '../components/MovilShareHeader';
import UserShareCard from '../components/UserShareCard';
import LoanDetailsModal from '../components/LoanDetailsModal';
import CreateLoanModal from '../components/CreateLoanModal';
import { LoanDetails, CreateLoanRequest } from '../types/movilshare';

export default function MoviShareScreen() {
  const navigation = useNavigation();
  const { 
    loans, 
    isLoading, 
    isCreating,
    isRequesting,
    error, 
    createLoan, 
    getLoanDetails,
    requestLoan 
  } = useMovilShare();

  // Modal states
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanDetails | null>(null);
  const [sendingModalVisible, setSendingModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [requestedLoanInfo, setRequestedLoanInfo] = useState<{
    title: string;
    gate: string;
    waitingTime: number;
    instructions?: string;
  } | null>(null);
  
  // Control de préstamo activo
  const [hasActiveLoan, setHasActiveLoan] = useState(false);
  const [activeLoanInfo, setActiveLoanInfo] = useState<string>('');
  const [activeLoanModalVisible, setActiveLoanModalVisible] = useState(false);
  const [activeLoanId, setActiveLoanId] = useState<string>('');
  
  // Modales de devolución
  const [returningModalVisible, setReturningModalVisible] = useState(false);
  const [returnConfirmedModalVisible, setReturnConfirmedModalVisible] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLoanPress = async (loanId: string) => {
    const details = await getLoanDetails(loanId);
    if (details) {
      setSelectedLoan(details);
      setDetailsModalVisible(true);
    }
  };

  const handleRequestLoan = async () => {
    if (!selectedLoan) return;

    // Verificar si ya tiene un préstamo activo
    if (hasActiveLoan) {
      setDetailsModalVisible(false);
      setActiveLoanModalVisible(true);
      return;
    }

    // Guardar información del préstamo
    const vehicleType = selectedLoan.vehicleType === 'bicycle' ? 'Bicicleta' : 'Scooter';
    const loanTitle = `${vehicleType} de ${selectedLoan.ownerName}`;
    
    setRequestedLoanInfo({
      title: loanTitle,
      gate: selectedLoan.campusGate,
      waitingTime: selectedLoan.waitingTime,
      instructions: selectedLoan.arrivalInstructions,
    });

    const success = await requestLoan(selectedLoan.id);
    
    if (success) {
      // Marcar como préstamo activo
      setHasActiveLoan(true);
      setActiveLoanInfo(loanTitle);
      setActiveLoanId(selectedLoan.id);
      
      setDetailsModalVisible(false);
      
      // Modal 1: Solicitud enviada
      setSendingModalVisible(true);
      
      // Después de 3 segundos, cerrar Modal 1 y abrir Modal 2
      setTimeout(() => {
        setSendingModalVisible(false);
        setSuccessModalVisible(true);
      }, 3000);
    } else {
      Alert.alert(
        'Error',
        'No se pudo solicitar el préstamo. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleReturnLoan = () => {
    setDetailsModalVisible(false);
    
    // Modal 1: Devolución por confirmar
    setReturningModalVisible(true);
    
    // Después de 3 segundos, cerrar Modal 1 y abrir Modal 2
    setTimeout(() => {
      setReturningModalVisible(false);
      setReturnConfirmedModalVisible(true);
    }, 3000);
  };

  const handleReturnConfirmed = () => {
    setHasActiveLoan(false);
    setActiveLoanInfo('');
    setActiveLoanId('');
    setReturnConfirmedModalVisible(false);
  };

  const handleCreatePoint = () => {
    setCreateModalVisible(true);
  };

  const handleCreateLoanSubmit = async (loanData: CreateLoanRequest): Promise<boolean> => {
    const success = await createLoan(loanData);
    if (success) {
      setCreateModalVisible(false);
    }
    return success;
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
          <Text style={styles.loadingText}>Cargando préstamos...</Text>
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
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Préstamo de Movilidad</Text>
            <Text style={styles.infoText}>
              Comparte tu bicicleta o scooter con la comunidad UCV o solicita uno prestado para moverte por el campus.
            </Text>
          </View>

          {/* Loans List */}
          {loans.length > 0 ? (
            loans
              .filter(loan => loan.status === 'available' || (hasActiveLoan && loan.id === activeLoanId))
              .map((loan) => (
                <UserShareCard
                  key={loan.id}
                  loan={loan}
                  onPress={handleLoanPress}
                  isActiveLoan={hasActiveLoan && loan.id === activeLoanId}
                />
              ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No hay movilidad disponible para préstamo en este momento.
                ¡Sé el primero en compartir!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create Loan Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePoint}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>Prestar mi Movilidad</Text>
        </TouchableOpacity>
      </View>

      {/* Loan Details Modal */}
      <LoanDetailsModal
        visible={detailsModalVisible}
        loan={selectedLoan}
        onClose={() => setDetailsModalVisible(false)}
        onRequest={hasActiveLoan && selectedLoan?.id === activeLoanId ? handleReturnLoan : handleRequestLoan}
        isRequesting={isRequesting}
        isActiveLoan={hasActiveLoan && selectedLoan?.id === activeLoanId}
      />

      {/* Create Loan Modal */}
      <CreateLoanModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreateLoan={handleCreateLoanSubmit}
        isLoading={isCreating}
      />

      {/* Modal 1: Solicitud Enviada */}
      {sendingModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.confirmIcon}>
              <Text style={styles.confirmIconText}>✓</Text>
            </View>
            <Text style={styles.confirmTitle}>¡Solicitud Enviada!</Text>
            <Text style={styles.confirmMessage}>
              Tu solicitud para {requestedLoanInfo?.title} ha sido enviada exitosamente.
            </Text>
            <Text style={styles.confirmSubMessage}>
              El dueño recibirá una notificación y te confirmará pronto.
            </Text>
          </View>
        </View>
      )}

      {/* Modal 2: Solicitud Aceptada - Con Instrucciones */}
      {successModalVisible && requestedLoanInfo && (
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>🎉</Text>
            </View>
            <Text style={styles.successTitle}>¡Solicitud Aceptada!</Text>
            
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionItem}>
                <Ionicons name="location" size={24} color={lightTheme.primary} />
                <View style={styles.instructionContent}>
                  <Text style={styles.instructionLabel}>Dirígete a:</Text>
                  <Text style={styles.instructionValue}>{requestedLoanInfo.gate}</Text>
                </View>
              </View>

              <View style={styles.instructionItem}>
                <Ionicons name="time" size={24} color={lightTheme.primary} />
                <View style={styles.instructionContent}>
                  <Text style={styles.instructionLabel}>Tiempo de espera:</Text>
                  <Text style={styles.instructionValue}>
                    {requestedLoanInfo.waitingTime} minutos
                  </Text>
                  <Text style={styles.instructionNote}>
                    El dueño está bajando de clases
                  </Text>
                </View>
              </View>

              {requestedLoanInfo.instructions && (
                <View style={styles.instructionItem}>
                  <Ionicons name="information-circle" size={24} color="#2196F3" />
                  <View style={styles.instructionContent}>
                    <Text style={styles.instructionLabel}>Instrucciones:</Text>
                    <Text style={styles.instructionNote}>
                      {requestedLoanInfo.instructions}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.instructionItem}>
                <Ionicons name="card" size={24} color="#F44336" />
                <View style={styles.instructionContent}>
                  <Text style={styles.instructionLabel}>Importante:</Text>
                  <Text style={styles.instructionHighlight}>
                    📱 Lleva tu carnet estudiantil UCV para verificación
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setSuccessModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal: Préstamo Activo - Advertencia */}
      {activeLoanModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.warningModal}>
            <View style={styles.warningIcon}>
              <Ionicons name="alert-circle" size={60} color="#FF9800" />
            </View>
            <Text style={styles.warningTitle}>⚠️ Préstamo Activo</Text>
            <Text style={styles.warningMessage}>
              Ya tienes un préstamo activo:
            </Text>
            <Text style={styles.activeLoanTitle}>{activeLoanInfo}</Text>
            <Text style={styles.warningSubMessage}>
              No puedes solicitar otro préstamo hasta que devuelvas el actual.
            </Text>
            <TouchableOpacity
              style={styles.warningButton}
              onPress={() => setActiveLoanModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.warningButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal 1: Devolución por confirmar */}
      {returningModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.confirmIcon}>
              <Text style={styles.confirmIconText}>⏳</Text>
            </View>
            <Text style={styles.confirmTitle}>Devolución Por Confirmar</Text>
            <Text style={styles.confirmMessage}>
              Estamos verificando la devolución del vehículo...
            </Text>
            <Text style={styles.confirmSubMessage}>
              Por favor espera en el punto de encuentro.
            </Text>
          </View>
        </View>
      )}

      {/* Modal 2: Devolución Confirmada */}
      {returnConfirmedModalVisible && requestedLoanInfo && (
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✅</Text>
            </View>
            <Text style={styles.successTitle}>¡Devolución Confirmada!</Text>
            
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <View style={styles.instructionContent}>
                  <Text style={styles.instructionNote}>
                    El dueño está llegando al punto de encuentro.
                  </Text>
                </View>
              </View>

              <View style={styles.instructionItem}>
                <Ionicons name="time" size={24} color={lightTheme.primary} />
                <View style={styles.instructionContent}>
                  <Text style={styles.instructionLabel}>Tiempo de espera estimado:</Text>
                  <Text style={styles.instructionValue}>
                    {requestedLoanInfo.waitingTime} minutos
                  </Text>
                  <Text style={styles.instructionNote}>
                    Por favor espera mientras el dueño baja
                  </Text>
                </View>
              </View>

              <View style={styles.instructionItem}>
                <Ionicons name="information-circle" size={24} color="#2196F3" />
                <View style={styles.instructionContent}>
                  <Text style={styles.instructionLabel}>Importante:</Text>
                  <Text style={styles.instructionNote}>
                    Asegúrate de devolver el vehículo en el mismo estado en que lo recibiste.
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.successButton}
              onPress={handleReturnConfirmed}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: fonts.title,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: lightTheme.primary,
    fontWeight: '600',
  },
  // Confirmation Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  confirmIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmIconText: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmTitle: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  confirmSubMessage: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: lightTheme.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: '#FFFFFF',
  },
  // Success Modal Styles (Modal 2)
  successModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '95%',
    maxWidth: 450,
    maxHeight: '80%',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  successIconText: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  instructionContent: {
    flex: 1,
    marginLeft: 12,
  },
  instructionLabel: {
    fontSize: 14,
    fontFamily: fonts.title,
    color: '#333',
    marginBottom: 4,
  },
  instructionValue: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: lightTheme.primary,
    marginBottom: 2,
  },
  instructionNote: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: '#666',
    lineHeight: 18,
  },
  instructionHighlight: {
    fontSize: 13,
    fontFamily: fonts.title,
    color: '#F44336',
    lineHeight: 18,
  },
  successButton: {
    backgroundColor: lightTheme.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: '#FFFFFF',
  },
  returnButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: lightTheme.primary,
  },
  returnButtonText: {
    fontSize: 14,
    fontFamily: fonts.title,
    color: lightTheme.primary,
  },
  // Warning Modal Styles
  warningModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  warningIcon: {
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 22,
    fontFamily: fonts.title,
    color: '#FF9800',
    marginBottom: 12,
    textAlign: 'center',
  },
  warningMessage: {
    fontSize: 15,
    fontFamily: fonts.text,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  activeLoanTitle: {
    fontSize: 17,
    fontFamily: fonts.title,
    color: lightTheme.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  warningSubMessage: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  warningButton: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  warningButtonText: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: '#FFFFFF',
  },
});