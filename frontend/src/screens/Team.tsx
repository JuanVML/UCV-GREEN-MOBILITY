import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../hooks/useNavigation';
import { useTeam, Route } from '../hooks/useTeam';
import { lightTheme } from '../theme/colors';
import RouteCard from '../components/RouteCard';
import CreateGroupModal, { CreateGroupData } from '../components/CreateGroupModal';
import RouteDetailsModal, { RouteDetails } from '../components/RouteDetailsModal';

export default function TeamScreen() {
  const navigation = useNavigation();
  const { routes, isLoading, isJoining, isCreating, joinRoute, createGroup, getRouteDetails } = useTeam();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState<RouteDetails | null>(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleJoinRoute = async (routeTitle: string, routeId: string) => {
    const success = await joinRoute(routeId);
    if (success) {
      setSelectedRoute(routeTitle);
      setModalVisible(true);
    }
  };

  const handleCreateGroup = () => {
    setCreateModalVisible(true);
  };

  const handleShowRouteDetails = async (routeId: string) => {
    const details = await getRouteDetails(routeId);
    if (details) {
      setSelectedRouteDetails(details);
      setDetailsModalVisible(true);
    }
  };

  const handleJoinFromDetails = async () => {
    if (selectedRouteDetails) {
      const success = await joinRoute(selectedRouteDetails.id);
      if (success) {
        setSelectedRoute(selectedRouteDetails.title);
        setDetailsModalVisible(false);
        setModalVisible(true);
      }
    }
  };

  const handleCreateGroupSubmit = async (groupData: CreateGroupData): Promise<boolean> => {
    const success = await createGroup({
      title: groupData.title,
      description: groupData.description,
      maxUsers: groupData.maxUsers,
      departureTime: groupData.departureTime,
      meetingPoint: groupData.meetingPoint,
    });
    
    if (success) {
      console.log(`Grupo "${groupData.title}" creado exitosamente!`);
    }
    
    return success;
  };

  const renderRouteItem = ({ item }: { item: Route }) => (
    <RouteCard
      title={item.title}
      users={item.users}
      maxUsers={item.maxUsers}
      time={item.time}
      onJoin={() => handleJoinRoute(item.title, item.id)}
      onDetails={() => handleShowRouteDetails(item.id)}
      isLoading={isJoining}
      isNew={item.isNew}
    />
  );

  return (
    <ImageBackground 
      source={require('../../assets/images/fondo3.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Team</Text>
        </View>

        {/* Routes List */}
        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={lightTheme.primary} />
              <Text style={styles.loadingText}>Cargando rutas...</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={routes}
                renderItem={renderRouteItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.routesList}
                showsVerticalScrollIndicator={false}
              />

              {/* Create Group Button */}
              <TouchableOpacity
                style={styles.createGroupButton}
                onPress={handleCreateGroup}
                activeOpacity={0.8}
              >
                <Text style={styles.createGroupButtonText}>Crear un grupo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Create Group Modal */}
        <CreateGroupModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onCreateGroup={handleCreateGroupSubmit}
          isLoading={isCreating}
        />

        {/* Route Details Modal */}
        <RouteDetailsModal
          visible={detailsModalVisible}
          onClose={() => setDetailsModalVisible(false)}
          onJoin={handleJoinFromDetails}
          route={selectedRouteDetails}
          isJoining={isJoining}
        />

        {/* Join Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalIcon}>
                <Ionicons name="checkmark-circle" size={50} color={lightTheme.primary} />
              </View>
              <Text style={styles.modalTitle}>Te has unido al grupo</Text>
              <Text style={styles.modalSubtitle}>{selectedRoute}</Text>
              <Text style={styles.modalTime}>(6:00 AM)</Text>
              
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    marginRight: 40, // Compensar el botón de atrás
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Mooli-Regular',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  routesList: {
    paddingBottom: 20,
  },
  createGroupButton: {
    backgroundColor: 'rgba(114, 166, 151, 0.8)',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  createGroupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Mooli-Regular',
    color: lightTheme.primary,
    textAlign: 'center',
    marginBottom: 5,
  },
  modalTime: {
    fontSize: 14,
    fontFamily: 'Mooli-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
  },
});
