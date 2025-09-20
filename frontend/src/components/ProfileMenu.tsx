import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';


type Props = { onClose: () => void };
export default function ProfileMenu({ onClose }: Props) {
return (
<View style={styles.wrapper}>
<TouchableOpacity style={styles.backdrop} onPress={onClose} />
<View style={styles.card}>
<Text style={styles.title}>Perfil</Text>
<TouchableOpacity style={styles.item} onPress={() => { /* abrir modal perfil */ onClose(); }}>
<Text>Ver perfil</Text>
</TouchableOpacity>


<TouchableOpacity style={styles.item} onPress={() => { /* toggle theme */ onClose(); }}>
<Text>Modo oscuro</Text>
</TouchableOpacity>


<TouchableOpacity style={styles.item} onPress={() => { /* logout */ onClose(); }}>
<Text>Cerrar sesión</Text>
</TouchableOpacity>


</View>
</View>
);
}


const styles = StyleSheet.create({
wrapper: { flex: 1, justifyContent: 'flex-start' },
backdrop: { position: 'absolute', inset: 0, backgroundColor: 'transparent' },
card: { position: 'absolute', right: 16, top: 70, width: 200, backgroundColor: '#fff', borderRadius: 12, padding: 12, elevation: 6 },
title: { fontFamily: 'Outfit-Medium', marginBottom: 8 },
item: { paddingVertical: 8 },
});