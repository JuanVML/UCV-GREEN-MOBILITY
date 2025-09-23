import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TeamScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Estás en la pantalla Team</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontFamily: 'Mooli-Regular' },
});
