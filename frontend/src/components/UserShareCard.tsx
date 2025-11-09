import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { MovilShareUser, VehicleType } from '../types/movilshare';

interface UserShareCardProps {
  loan: MovilShareUser;
  onPress: (loanId: string) => void;
  isActiveLoan?: boolean;
}

export default function UserShareCard({ loan, onPress, isActiveLoan = false }: UserShareCardProps) {
  const getVehicleIcon = (type: VehicleType) => {
    return type === 'bicycle' ? 'bicycle' : 'flash';
  };

  const getVehicleLabel = (type: VehicleType) => {
    return type === 'bicycle' ? 'Bicicleta' : 'Scooter';
  };

  const isAvailable = loan.status === 'available';

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        !isAvailable && styles.cardUnavailable,
        isActiveLoan && styles.cardActiveLoan
      ]}
      onPress={() => onPress(loan.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Left side - Avatar and Name */}
        <View style={styles.leftSection}>
          <Image source={loan.avatar} style={styles.avatar} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{loan.ownerName}</Text>
          </View>
        </View>

        {/* Right side - Details */}
        <View style={styles.rightSection}>
          {/* Vehicle Type */}
          <View style={styles.infoRow}>
            <Ionicons
              name={getVehicleIcon(loan.vehicleType)}
              size={18}
              color={lightTheme.primary}
            />
            <Text style={styles.infoText}>{getVehicleLabel(loan.vehicleType)}</Text>
          </View>

          {/* Location */}
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color={lightTheme.primary} />
            <Text style={styles.infoText}>{loan.campusGate}</Text>
          </View>

          {/* Time */}
          <View style={styles.infoRow}>
            <Ionicons name="time" size={18} color={lightTheme.primary} />
            <Text style={styles.infoText}>
              Devolver: {loan.returnTime}
            </Text>
          </View>

          {/* Status Badge */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                isActiveLoan ? styles.statusActiveLoan : (isAvailable ? styles.statusAvailable : styles.statusUnavailable),
              ]}
            >
              <Text style={styles.statusText}>
                {isActiveLoan ? 'En uso por ti' : (isAvailable ? 'Disponible' : 'No disponible')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* New indicator */}
      {loan.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NUEVO</Text>
        </View>
      )}
      
      {/* Active loan ribbon */}
      {isActiveLoan && (
        <View style={styles.activeLoanRibbon}>
          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
          <Text style={styles.activeLoanRibbonText}>PRÉSTAMO ACTIVO</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardUnavailable: {
    opacity: 0.6,
  },
  cardActiveLoan: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: '#666',
    marginLeft: 4,
  },
  rightSection: {
    flex: 1,
    paddingLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  statusContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: '#4CAF50',
  },
  statusUnavailable: {
    backgroundColor: '#F44336',
  },
  statusActiveLoan: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 11,
    fontFamily: fonts.title,
    color: '#FFFFFF',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontFamily: fonts.title,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activeLoanRibbon: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeLoanRibbonText: {
    fontSize: 10,
    fontFamily: fonts.title,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});