import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';

interface RouteCardProps {
  title: string;
  users: number;
  maxUsers?: number;
  time: string;
  onJoin: () => void;
  onDetails: () => void;
  isLoading?: boolean;
  isNew?: boolean;
}

export default function RouteCard({ title, users, maxUsers, time, onJoin, onDetails, isLoading = false, isNew = false }: RouteCardProps) {
  const availableSpots = maxUsers ? maxUsers - users : null;
  const isFullRoute = availableSpots !== null && availableSpots <= 0;

  return (
    <TouchableOpacity 
      style={[styles.container, isNew && styles.containerNew]}
      onPress={onDetails}
      activeOpacity={0.7}
    >
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NUEVO</Text>
        </View>
      )}
      <View style={styles.routeInfo}>
        <View style={styles.titleContainer}>
          <Ionicons name="location" size={16} color={lightTheme.primary} />
          <Text style={styles.routeTitle}>{title}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Ionicons name="people" size={14} color="#666666" />
            <Text style={styles.detailText}>
              {maxUsers ? `${users}/${maxUsers}` : `${users} Usuarios`}
            </Text>
          </View>
          <View style={styles.detail}>
            <Ionicons name="time" size={14} color="#666666" />
            <Text style={styles.detailText}>{time}</Text>
          </View>
        </View>
        {availableSpots !== null && (
          <View style={styles.availabilityContainer}>
            <Ionicons 
              name={isFullRoute ? "close-circle" : "checkmark-circle"} 
              size={12} 
              color={isFullRoute ? "#F44336" : "#4CAF50"} 
            />
            <Text style={[
              styles.availabilityText, 
              isFullRoute ? styles.availabilityTextFull : styles.availabilityTextAvailable
            ]}>
              {isFullRoute ? 'Completo' : `${availableSpots} cupos`}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.joinButton, 
          (isLoading || isFullRoute) && styles.joinButtonDisabled
        ]}
        onPress={(e) => {
          e.stopPropagation();
          onJoin();
        }}
        activeOpacity={0.8}
        disabled={isLoading || isFullRoute}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.joinButtonText}>
            {isFullRoute ? 'Completo' : 'Unirme'}
          </Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  containerNew: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  newBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Outfit-Medium',
  },
  routeInfo: {
    flex: 1,
    marginRight: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#333333',
    marginLeft: 8,
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Mooli-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  availabilityText: {
    fontSize: 11,
    fontFamily: 'Mooli-Regular',
    marginLeft: 4,
  },
  availabilityTextAvailable: {
    color: '#4CAF50',
  },
  availabilityTextFull: {
    color: '#F44336',
  },
});