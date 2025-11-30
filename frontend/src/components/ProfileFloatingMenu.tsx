import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';

type Props = {
  visible: boolean;
  onViewProfile: () => void;
  onToggleDark: () => void;
  onSignOut: () => void;
};

export default function ProfileFloatingMenu({ visible, onViewProfile, onToggleDark, onSignOut }: Props) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { theme } = useThemeContext();

  if (!visible) return null;

  const handleToggleDark = () => {
    setIsDarkMode(!isDarkMode);
    onToggleDark();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.menu, { backgroundColor: theme.card, borderColor: theme.softCard, borderWidth: 1 }]}>
        <TouchableOpacity style={styles.item} onPress={onViewProfile}>
          <Ionicons name="person-circle-outline" size={16} color={theme.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.text, { color: theme.primary }]}>ver perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={handleToggleDark}>
          <Ionicons 
            name={isDarkMode ? 'sunny-outline' : 'moon-outline'} 
            size={16} 
            color={theme.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.text, { color: theme.primary }]}>
            {isDarkMode ? 'modo claro' : 'modo oscuro'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={onSignOut}>
          <Ionicons name="log-out-outline" size={16} color="#C84B4B" style={{ marginRight: 8 }} />
          <Text style={[styles.text, { color: '#C84B4B' }]}>salir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 70, right: 18, zIndex: 50 },
  menu: {
    width: 160,
    backgroundColor: '#EAF3F2',
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 6,
  },
  item: { paddingVertical: 8, width: '100%', alignItems: 'center' },
  text: { fontFamily: 'Mooli-Regular', fontSize: 13, color: '#204F4A' },
});
