import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ImageBackground, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import LottieView from 'lottie-react-native';
import ProfileFloatingMenu from '../components/ProfileFloatingMenu';
import ProfilePanel from '../components/ProfilePanel';
import StatWidget from '../components/StatWidget';
import RecommendedRoutes from '../components/RecommendedRoutes';
import { useDashboardStats, useRecommendedRoutes } from '../hooks/useDashboardStats';
import { useNavigation } from '@react-navigation/native';
import { lightTheme } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const { stats, isLoading, refreshStats } = useDashboardStats();
  const recommendedRoutes = useRecommendedRoutes();

  return (
    <View style={styles.root}>
      {/* Fondo de color sólido (ACTIVO) */}
      <View style={styles.colorBackground}>
        <Header onAvatarPress={() => setMenuVisible(v => !v)} />

        <ProfileFloatingMenu
          visible={menuVisible}
          onViewProfile={() => { setPanelVisible(true); setMenuVisible(false); }}
          onToggleDark={() => { /* utilizar useTheme().toggleTheme si quieres */ }}
          onSignOut={() => { /* logout desde AuthContext */ }}
        />

        <ProfilePanel visible={panelVisible} onClose={() => setPanelVisible(false)} />

        <View style={styles.content}>
          <View style={styles.lottieCard}>
            <LottieView 
              source={require('../../assets/lotties/bike.json')} 
              autoPlay 
              loop 
              style={{ width: '100%', height: 150, alignSelf: 'stretch' }} 
            />
          </View>

          <Text style={styles.sectionTitle}>Tu Impacto Verde</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={lightTheme.primary} />
              <Text style={styles.loadingText}>Cargando estadísticas...</Text>
            </View>
          ) : stats ? (
            <>
              {/* Fila 1: Viajes Realizados y CO₂ Ahorrado */}
              <View style={styles.statsRow}>
                <View style={styles.statHalf}>
                  <StatWidget
                    title="Viajes Realizados"
                    value={stats.totalTrips}
                    subtitle="Total histórico"
                    icon="bicycle"
                    color={lightTheme.primary}
                    trend="up"
                    trendValue={`+${stats.weeklyTrips} esta semana`}
                  />
                </View>
                <View style={styles.statHalf}>
                  <StatWidget
                    title="CO₂ Ahorrado"
                    value={`${stats.carbonSaved}kg`}
                    subtitle="Equivale a plantar 2 árboles"
                    icon="leaf"
                    color="#4CAF50"
                  />
                </View>
              </View>

              {/* Fila 2: Dinero Ahorrado y Distancia Recorrida */}
              <View style={styles.statsRow}>
                <View style={styles.statHalf}>
                  <StatWidget
                    title="Dinero Ahorrado"
                    value={`S/ ${stats.moneySaved}`}
                    subtitle="vs. transporte público"
                    icon="wallet"
                    color="#FF9800"
                    trend="up"
                    trendValue="+S/ 45 este mes"
                  />
                </View>
                <View style={styles.statHalf}>
                  <StatWidget
                    title="Distancia Recorrida"
                    value={`${stats.monthlyDistance}km`}
                    subtitle="Total acumulado"
                    icon="speedometer"
                    color="#2196F3"
                  />
                </View>
              </View>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error al cargar estadísticas</Text>
            </View>
          )}
        </View>
      </View>
      {/* Opción con imagen de fondo - Descomenta las líneas de abajo y comenta la View para usar imagen */}
      {/* 
      <ImageBackground 
        source={require('../../assets/images/fondo3.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Header onAvatarPress={() => setMenuVisible(v => !v)} />
        // ... resto del contenido (copia todo lo que está dentro de la View)
      </ImageBackground> 
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  // Estilo para color de fondo (ACTIVO)
  colorBackground: { flex: 1, backgroundColor: '#0B6A75' },
  // Estilo para imagen de fondo (COMENTADO - descomenta para usar imagen)
  // backgroundImage: { 
  //   flex: 1,
  //   width: '100%',
  //   height: '100%'
  // },
  content: { paddingHorizontal: 20, paddingTop: 0, paddingBottom: 25, flex: 1 },
  lottieCard: {
    backgroundColor: '#ffffff3e',
    borderRadius: 12,
    paddingHorizontal: 0, // 👈 sin espacio a los lados
    paddingVertical: 4,
    marginTop: 20,         // bajar la tarjeta del header
    marginBottom: 8,
  },
  sectionTitle: { 
    fontFamily: 'Outfit-Medium', 
    color: '#E8F3F1', 
    fontSize: 18, 
    marginBottom: 6 
  },
  // Estados de carga y error
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontFamily: 'Mooli-Regular',
    color: '#E8F3F1',
    fontSize: 14,
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: 'Mooli-Regular',
    color: '#F44336',
    fontSize: 14,
  },
  // Layout para estadísticas
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statHalf: {
    flex: 1,
    marginHorizontal: 6,
  },
});
