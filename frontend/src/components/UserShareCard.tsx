import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface UserShareCardProps {
  id: string;
  name: string;
  location: string;
  time: string;
  avatar: ImageSourcePropType;
  onPress: (userId: string) => void;
}

export default function UserShareCard({
  id,
  name,
  location,
  time,
  avatar,
  onPress,
}: UserShareCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
    >
      <View style={styles.userInfo}>
        <Image source={avatar} style={styles.avatar} />
        
        <View style={styles.userDetails}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{name}</Text>
            <Ionicons name="bicycle" size={20} color={lightTheme.primary} />
          </View>
          
          <View style={styles.locationRow}>
            <Text style={styles.userLocation}>{location}</Text>
            <Text style={styles.userTime}>- {time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: lightTheme.primary,
    fontWeight: '600',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLocation: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#666',
  },
  userTime: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#666',
    marginLeft: 4,
  },
});