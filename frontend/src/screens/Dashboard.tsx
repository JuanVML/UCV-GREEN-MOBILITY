import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text } from 'react-native';
import Header from '../components/Header';
import CardButton from '../components/CardButton';
import LottieView from 'lottie-react-native';
import ProfileFloatingMenu from '../components/ProfileFloatingMenu';
import ProfilePanel from '../components/ProfilePanel';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

  return (
    <View style={styles.root}>
      <Header onAvatarPress={() => setMenuVisible(v => !v)} />

      <ProfileFloatingMenu
        visible={menuVisible}
        onViewProfile={() => { setPanelVisible(true); setMenuVisible(false); }}
        onToggleDark={() => { /* utilizar useTheme().toggleTheme si quieres */ }}
        onSignOut={() => { /* logout desde AuthContext */ }}
      />

      <ProfilePanel visible={panelVisible} onClose={() => setPanelVisible(false)} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.lottieCard}>
          <LottieView source={require('../../assets/lotties/bike.json')} autoPlay loop style={{ width: '100%', height: 150,alignSelf: 'stretch' }} />
        </View>

        <Text style={styles.sectionTitle}>Funciones</Text>

        <View style={styles.gridRow}>
          <CardButton title="Map" image={require('../../assets/images/map.png')} onPress={() => navigation.navigate('Mapa')} />
          <CardButton title="Team" image={require('../../assets/images/team.png')} onPress={() => navigation.navigate('Team')} />
        </View>

        <View style={styles.gridRow}>
          <CardButton title="MoviShare" image={require('../../assets/images/bike.png')} onPress={() => navigation.navigate('MoviShare')} />
          <CardButton title="Chatbot" image={require('../../assets/images/chat.png')} onPress={() => navigation.navigate('Chatbot')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B6A75' },
  scroll: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 30 },
  lottieCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
      paddingHorizontal: 0, // 👈 sin espacio a los lados
  paddingVertical: 10,  // mantiene arriba/abajo
    marginTop: 8,
    marginBottom: 36,
  },
  sectionTitle: { fontFamily: 'Outfit-Medium', color: '#E8F3F1', fontSize: 18, marginBottom: 8 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
});
