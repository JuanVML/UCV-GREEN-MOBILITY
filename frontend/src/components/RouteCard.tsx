import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';

interface RouteCardProps {
  title: string;
  users: number;
  maxUsers?: number;
  time: string;
  description?: string;
  createdBy?: string;
  onJoin: () => void;
  onDetails: () => void;
  isLoading?: boolean;
  isNew?: boolean;
}

export default function RouteCard({ title, users, maxUsers, time, description, createdBy, onJoin, onDetails, isLoading = false, isNew = false }: RouteCardProps) {
  const availableSpots = maxUsers ? maxUsers - users : null;
  const isFullRoute = availableSpots !== null && availableSpots <= 0;

  const initials = createdBy ? createdBy.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase() : 'UC';

  return (
    <TouchableOpacity
      style={[styles.container, isNew && styles.containerNew]}
      onPress={onDetails}
      activeOpacity={0.85}
    >
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NUEVO</Text>
        </View>
      )}
      <View style={styles.accentBar} />
      <View style={styles.cardBody}>
        <View style={styles.headerRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.routeTitle}>{title}</Text>
            {description ? <Text style={styles.description} numberOfLines={2}>{description}</Text> : null}
          </View>
        </View>

        <View style={styles.detailsContainerRow}>
          <View style={styles.detailRow}>
            <Ionicons name="people" size={14} color="#666666" />
            <Text style={styles.detailText}>{maxUsers ? `${users}/${maxUsers}` : `${users} Usuarios`}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={14} color="#666666" />
            <Text style={styles.detailText}>{time}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[(isLoading || isFullRoute) ? styles.joinButtonDisabled : styles.joinButton]}
          onPress={(e) => { e.stopPropagation(); onJoin(); }}
          activeOpacity={0.8}
          disabled={isLoading || isFullRoute}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.joinButtonText}>{isFullRoute ? 'Completo' : 'Unirme'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
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
    backgroundColor: 'rgba(76, 175, 80, 0.06)',
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
  gradientInner: {
    display: 'none',
  },
  accentBar: {
    width: 8,
    height: '100%',
    backgroundColor: lightTheme.primary,
    borderRadius: 6,
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
    paddingLeft: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F5EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: lightTheme.primary,
    fontWeight: '700',
  },
  description: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  detailsContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  joinButtonDisabled: {
    backgroundColor: '#999',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
    opacity: 0.8,
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