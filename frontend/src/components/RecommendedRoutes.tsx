import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';

interface RecommendedRoute {
  id: string;
  name: string;
  time: string;
  spots: number;
}

interface RecommendedRoutesProps {
  routes: RecommendedRoute[];
  onRoutePress?: (routeId: string) => void;
}

export default function RecommendedRoutes({ routes, onRoutePress }: RecommendedRoutesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="star" size={20} color="#FFC107" />
        <Text style={styles.title}>Rutas Recomendadas</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.routesContainer}
      >
        {routes.map((route) => (
          <TouchableOpacity 
            key={route.id}
            style={styles.routeCard}
            onPress={() => onRoutePress?.(route.id)}
            activeOpacity={0.8}
          >
            <View style={styles.routeHeader}>
              <Ionicons name="location" size={16} color={lightTheme.primary} />
              <Text style={styles.routeName} numberOfLines={2}>
                {route.name}
              </Text>
            </View>
            
            <View style={styles.routeInfo}>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={14} color="#666" />
                <Text style={styles.infoText}>{route.time}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="people" size={14} color="#666" />
                <Text style={styles.infoText}>{route.spots} cupos</Text>
              </View>
            </View>
            
            <View style={styles.joinBadge}>
              <Text style={styles.joinText}>¡Únete!</Text>
            </View>
          </TouchableOpacity>
        ))}
        
        {routes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="map" size={32} color="#ccc" />
            <Text style={styles.emptyText}>No hay rutas disponibles</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#333333',
    marginLeft: 8,
  },
  routesContainer: {
    paddingRight: 16,
  },
  routeCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 160,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  routeName: {
    fontSize: 13,
    fontFamily: 'Outfit-Medium',
    color: '#333333',
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  routeInfo: {
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 11,
    fontFamily: 'Mooli-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  joinBadge: {
    backgroundColor: lightTheme.primary,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  joinText: {
    fontSize: 10,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: 'Mooli-Regular',
    color: '#999999',
    marginTop: 8,
  },
});