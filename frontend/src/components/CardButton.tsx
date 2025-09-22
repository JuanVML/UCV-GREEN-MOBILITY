import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { fonts } from '../theme/fonts';

export default function CardButton({ title, image, onPress }: { title: string; image: any; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconWrap}>
        <Image source={image} style={styles.icon} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 150,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    marginHorizontal: 14,
    shadowColor: '#010000ff',
    shadowOpacity: 0.04,
    elevation: 3,
  },
  iconWrap: { width: 72, height: 72, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  icon: { width: 56, height: 56, resizeMode: 'contain' },
  title: { fontFamily: fonts.text, fontSize: 14, color: '#2E6D68' },
});
