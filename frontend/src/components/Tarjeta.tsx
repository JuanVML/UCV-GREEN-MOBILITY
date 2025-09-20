import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';


type Props = { title: string; onPress?: () => void };
export default function FunctionCard({ title, onPress }: Props) {
return (
<TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
<View style={{ alignItems: 'center' }}>
{/* Aquí puedes poner un icono si quieres */}
<Text style={styles.title}>{title}</Text>
</View>
</TouchableOpacity>
);
}


const styles = StyleSheet.create({
card: {
width: '48%',
height: 110,
borderRadius: 12,
backgroundColor: '#ffffff',
elevation: 3,
shadowColor: '#000',
shadowOpacity: 0.06,
shadowRadius: 6,
justifyContent: 'center',
marginBottom: 12,
},
title: { fontFamily: 'Outfit-Medium', fontSize: 16 },
});

