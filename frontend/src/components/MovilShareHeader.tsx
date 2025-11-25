import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface MovilShareHeaderProps {
  title: string;
  onGoBack: () => void;
  onAvatarPress?: () => void;
}

export default function MovilShareHeader({
  title,
  onGoBack,
  onAvatarPress,
}: MovilShareHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          onPress={onGoBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{title}</Text>
        
        <View style={{ width: 40 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: lightTheme.primary,
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  avatarButton: {
    padding: 4,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});