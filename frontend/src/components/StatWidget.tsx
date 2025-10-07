import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';

interface StatWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function StatWidget({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  trend,
  trendValue 
}: StatWidgetProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'remove';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#4CAF50';
      case 'down': return '#F44336';
      default: return '#FFC107';
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
        
        {trend && trendValue && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={getTrendIcon() as any} 
              size={14} 
              color={getTrendColor()} 
            />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {trendValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    height: 140, // altura aumentada un poquito
    justifyContent: 'flex-start',
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
    marginBottom: 6,
  },
  content: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    color: '#666666',
    marginLeft: 6,
    flex: 1,
  },
  value: {
    fontSize: 22,
    fontFamily: 'Outfit-Medium',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Mooli-Regular',
    color: '#888888',
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  trendText: {
    fontSize: 10,
    fontFamily: 'Mooli-Regular',
    marginLeft: 4,
  },
});