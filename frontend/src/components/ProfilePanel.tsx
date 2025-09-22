import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../theme/fonts';

type Props = { visible: boolean; onClose: () => void };

export default function ProfilePanel({ visible, onClose }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.back} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color="#2F6B66" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ padding: 18 }}>
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
            <Text style={styles.change}>cambiar</Text>
          </View>

          <Text style={styles.label}>Name</Text>
          <View style={styles.input}><Text style={styles.inputText}>Bryan Tolentino</Text></View>

          <Text style={styles.label}>Correo Institucional</Text>
          <View style={styles.input}><Text style={styles.inputText}>yamil@dev.edu.pe</Text></View>

          <Text style={styles.label}>Carrera</Text>
          <View style={styles.input}><Text style={styles.inputText}>Ingenieria Sistemas</Text></View>

          <Text style={styles.label}>Dni</Text>
          <View style={styles.input}><Text style={styles.inputText}>76754576</Text></View>

          <Text style={styles.label}>Ciclo</Text>
          <View style={styles.input}><Text style={styles.inputText}>VIII</Text></View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputText}>••••••••</Text>
            <Ionicons name="eye-off" size={18} color="#9FBAB7" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', right: 18, top: 40, bottom: 40, width: 280, zIndex: 40 },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 8,
  },
  back: { position: 'absolute', left: 12, top: 12, zIndex: 10 },
  avatar: { width: 76, height: 76, borderRadius: 38, marginTop: 16 },
  change: { fontFamily: fonts.text, color: '#7DAAA6', marginTop: 6 },
  label: { fontFamily: fonts.title, color: '#2F6B66', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#ECF6F5', padding: 10, borderRadius: 12 },
  inputRow: { backgroundColor: '#ECF6F5', padding: 10, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputText: { fontFamily: fonts.text, color: '#2E6D68' },
});
