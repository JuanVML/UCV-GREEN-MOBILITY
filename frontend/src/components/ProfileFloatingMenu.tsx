import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  onViewProfile: () => void;
  onToggleDark: () => void;
  onSignOut: () => void;
};

export default function ProfileFloatingMenu({ visible, onViewProfile, onToggleDark, onSignOut }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.item} onPress={onViewProfile}>
          <Text style={styles.text}>ver perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={onToggleDark}>
          <Text style={styles.text}>modo oscuro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={onSignOut}>
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
