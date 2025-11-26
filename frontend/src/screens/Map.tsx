// src/screens/Map.tsx
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Image,
  SafeAreaView,
  Alert,
  Animated,
  Platform,
} from "react-native";
import MapView, { Marker, Polyline, MapPressEvent } from "react-native-maps";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useMap, RouteInfo, Coordinates } from "../hooks/useMap";
import { GOOGLE_MAPS_API_KEY } from "../api/config";
import { lightTheme } from "../theme/colors";
import MapViewDirections from "react-native-maps-directions";

type Step = {
  html_instructions?: string;
  end_location?: { lat: number; lng: number };
  polyline?: { points?: string };
};

// MODAL PERSONALIZADO PARA ALERTAS
type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    style?: "default" | "cancel" | "destructive";
    onPress: () => void;
  }>;
};

const CustomAlertModal: React.FC<CustomModalProps> = ({ visible, onClose, title, message, buttons }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          
          <View style={styles.modalButtonsContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  button.onPress();
                  onClose();
                }}
                style={[
                  styles.modalButton,
                  button.style === "destructive" && styles.modalButtonDestructive,
                  button.style === "cancel" && styles.modalButtonCancel,
                ]}
              >
                <Text style={[
                  styles.modalButtonText,
                  button.style === "destructive" && styles.modalButtonTextDestructive,
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Map() {
  const mapRef = useRef<MapView | null>(null);
  const navigationIntervalRef = useRef<number | null>(null);

  const {
    userLocation,
    UCV_COORDS,
    lastRoute,
    savedRoutes,
    calculateRoute,
    saveRoute,
    deleteRoute,
    loadSavedRouteOnMap,
    mapType,
    setMapType,
  } = useMap();

  const [mode, setMode] = useState<"ida" | "retorno">("ida");
  const [searchModal, setSearchModal] = useState(false);
  const [routesModal, setRoutesModal] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<any>>([]);
  const [selectedPlace, setSelectedPlace] = useState<Coordinates | null>(null);
  const [showCiclovias, setShowCiclovias] = useState(false);

  // Animación del botón
  const [buttonBottom] = useState(new Animated.Value(140));

  // Navegación automática
  const [navegando, setNavegando] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [followUser, setFollowUser] = useState(true);
  const [modoPrimerPlano, setModoPrimerPlano] = useState(false);

  // Datos en tiempo real
  const [mostrarDatos, setMostrarDatos] = useState(true);
  const [speedKmh, setSpeedKmh] = useState<number | null>(null);
  const [distanceRemainingMeters, setDistanceRemainingMeters] = useState<number | null>(null);
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);

  // Para cálculo de velocidad
  const prevLocRef = useRef<Coordinates | null>(null);
  const prevTsRef = useRef<number | null>(null);

  // Para evitar anuncios repetidos
  const announcedRef = useRef<Record<number, Set<number>>>({});

  // ESTADOS PARA MODALES PERSONALIZADOS
  const [deleteMarkerModal, setDeleteMarkerModal] = useState(false);
  const [saveRouteModal, setSaveRouteModal] = useState(false);
  const [stopNavigationModal, setStopNavigationModal] = useState(false);
  const [deleteRouteModal, setDeleteRouteModal] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<{id: string, name: string} | null>(null);

  // -----------------------------
  // Utils
  // -----------------------------
  const deg2rad = useCallback((deg: number) => deg * (Math.PI / 180), []);

  const distanceMeters = useCallback(
    (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
      const R = 6371000;
      const dLat = deg2rad(b.latitude - a.latitude);
      const dLon = deg2rad(b.longitude - a.longitude);
      const lat1 = deg2rad(a.latitude);
      const lat2 = deg2rad(b.latitude);

      const aa = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
      return R * c;
    },
    [deg2rad]
  );

  const stripHtml = useCallback((html?: string) => (html ? html.replace(/<[^>]+>/g, "") : ""), []);

  const speak = useCallback((text: string) => {
    if (!text) return;
    const t = stripHtml(text);
    if (!t) return;
    Speech.stop();
    Speech.speak(t, { rate: 0.9, language: "es-ES" });
  }, [stripHtml]);

  const formatDistance = useCallback((meters: number | null) => {
    if (meters === null) return "--";
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  }, []);

  const formatMinutes = useCallback((mins: number | null) => (mins === null ? "--" : `${mins} min`), []);
  const formatSpeed = useCallback((s: number | null) => (s === null ? "--" : `${s.toFixed(1)} km/h`), []);

// Ciclovías
const ciclovias = useMemo(
  () => [
    {
      id: "c1",
      nombre: "Ciclovía Av. Universitaria",
      coordinates: [
        { latitude: -11.964007, longitude: -77.071952 },
        { latitude: -11.965644, longitude: -77.073748 },
        { latitude: -11.967823, longitude: -77.074849 },
        { latitude: -11.971881, longitude: -77.075831 },
        { latitude: -11.983128, longitude: -77.078542 },
        { latitude: -11.996115, longitude: -77.084597 },
        { latitude: -12.006644, longitude: -77.082470 },
      
        { latitude: -12.019219, longitude: -77.076368 }, 
      ],
      color: "#00C853", 
    },
    {
      id: "c2",
      nombre: "Ciclovía Av. Próceres",
      coordinates: [
        { latitude: -11.969945, longitude: -77.080214 },
        { latitude: -11.963803, longitude: -77.077432 },
        { latitude: -11.959290, longitude: -77.075909 },
        { latitude: -11.956302, longitude: -77.075682 },
        { latitude: -11.954378, longitude: -77.075995 },
        { latitude: -11.947730, longitude: -77.077019 },
      ],
      color: "#00C853",
    },
    {
      id: "c3",
      nombre: "Ciclovía Av. 2 de Octubre",
      coordinates: [
        { latitude: -11.949971, longitude: -77.084348 }, 
        { latitude: -11.947576, longitude: -77.077046 },
        { latitude: -11.945963, longitude: -77.072088 },
      ],
      color: "#00C853", 
    },
    {
      id: "c4",
      nombre: "Ciclovía Av. Izaguirre",
      coordinates: [
        { latitude: -11.991446, longitude: -77.080028 },
        { latitude: -11.991693, longitude: -77.075173 },
        { latitude: -11.991186, longitude: -77.071719 },
        { latitude: -11.990187, longitude: -77.065008 },
      ],
      color: "#00C853", 
    },
  ],
  []
);

  // Eliminar punto con modal personalizado
  const handleLongPressMarker = useCallback(() => {
    if (selectedPlace) {
      setDeleteMarkerModal(true);
    }
  }, [selectedPlace]);

  // FUNCIÓN PARA ELIMINAR RUTA GUARDADA
  const handleDeleteSavedRoute = useCallback((id: string, routeName: string) => {
    setRouteToDelete({ id, name: routeName });
    setDeleteRouteModal(true);
  }, []);

  // CONFIRMAR ELIMINACIÓN DE RUTA
  const confirmDeleteRoute = useCallback(() => {
    if (routeToDelete) {
      deleteRoute(routeToDelete.id);
      setRouteToDelete(null);
      setDeleteRouteModal(false);
    }
  }, [routeToDelete, deleteRoute]);

  // --------------------------------
  // Efectos
  // --------------------------------
  useEffect(() => {
    Animated.timing(buttonBottom, {
      toValue: lastRoute ? 250 : 160,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [lastRoute, buttonBottom]);

  // Centrar mapa en usuario
  useEffect(() => {
    if (mapRef.current && userLocation && !navegando) {
      try {
        mapRef.current.animateCamera({ center: userLocation, zoom: 15 } as any);
      } catch (e) {}
    }
  }, [userLocation, navegando]);

  // Ajustar vista a ruta
  useEffect(() => {
    if (lastRoute?.coordinates && mapRef.current && !navegando) {
      try {
        mapRef.current.fitToCoordinates(lastRoute.coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      } catch (e) {}
    }
  }, [lastRoute, navegando]);

  // Cargar pasos al cambiar ruta
  useEffect(() => {
    setSteps(lastRoute?.steps ?? []);
    setCurrentStep(0);
    announcedRef.current = {};
  }, [lastRoute]);

  // --------------------------------
  // Búsqueda Places
  // --------------------------------
  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.length < 3 || !userLocation) return setResults([]);

    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        text
      )}&location=${userLocation.latitude},${userLocation.longitude}&radius=5000&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      setResults(data.predictions ?? []);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setResults([]);
    }
  }, [userLocation]);

  const selectPlace = useCallback(async (placeId: string, description: string) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const loc = data?.result?.geometry?.location;
      if (!loc) return;
      const coords: Coordinates = { latitude: loc.lat, longitude: loc.lng, name: description };
      setSelectedPlace(coords);

      mapRef.current?.animateToRegion(
        { latitude: loc.lat, longitude: loc.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 } as any,
        1000
      );

      setSearchModal(false);
      setQuery("");
      setResults([]);
    } catch (error) {
      console.error("Error seleccionando lugar:", error);
    }
  }, []);

  const handleMapPress = useCallback((e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedPlace({ latitude, longitude, name: "Ubicación seleccionada" });
  }, []);

  const cycleMapType = useCallback(() => {
    const types: ("standard" | "satellite" | "terrain" | "hybrid")[] = ["standard", "satellite", "terrain", "hybrid"];
    const current = types.indexOf(mapType);
    const next = types[(current + 1) % types.length];
    setMapType(next);
  }, [mapType, setMapType]);

  // CALCULAR RUTA CON MANEJO DE ERRORES
  const handleCalculateRoute = useCallback(async (routeMode: "ida" | "retorno") => {
    try {
      const route = await calculateRoute(routeMode, selectedPlace);
      
      if (route && route.id.includes('simulated')) {
        // Aquí podrías agregar un modal personalizado si lo deseas
        Alert.alert(
          "ℹ Ruta Estimada",
          "Se está utilizando una ruta estimada. Las rutas detalladas no están disponibles en tu ubicación.",
          [{ text: "Entendido", style: "default" }]
        );
      }
    } catch (error) {
      console.error("Error calculando ruta:", error);
      Alert.alert(
        "Error",
        "No se pudo calcular la ruta. Verifica tu conexión e intenta nuevamente.",
        [{ text: "Aceptar", style: "default" }]
      );
    }
  }, [calculateRoute, selectedPlace]);

  //  GUARDAR RUTA CON MODAL PERSONALIZADO
  const handleSaveRoute = useCallback(() => {
    if (!lastRoute) {
      setSaveRouteModal(true);
      return;
    }
    
    // Mostrar modal de confirmación para guardar
    setSaveRouteModal(true);
  }, [lastRoute]);

  //  CONFIRMAR GUARDAR RUTA
  const confirmSaveRoute = useCallback(() => {
    saveRoute(selectedPlace, mode);
    setSaveRouteModal(false);
  }, [saveRoute, selectedPlace, mode]);

  const handleOpenSavedRoute = useCallback((route: RouteInfo) => {
    loadSavedRouteOnMap(route.id);
    setRoutesModal(false);
  }, [loadSavedRouteOnMap]);

  // -----------------------------
  // NAVEGACIÓN AUTOMÁTICA MEJORADA
  // -----------------------------
  const startNavigation = useCallback(() => {
    if (!lastRoute) {
      Alert.alert(
        "Iniciar Navegación",
        "Primero calcula una ruta antes de iniciar la navegación",
        [{ text: "Entendido", style: "default" }]
      );
      return;
    }
    
    if (!lastRoute.steps || lastRoute.steps.length === 0) {
      Alert.alert(
        "Sin Instrucciones Detalladas",
        "La ruta no contiene instrucciones paso a paso. Se utilizará navegación básica.",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Continuar",
            style: "default",
            onPress: () => {
              // Iniciar navegación básica
              setNavegando(true);
              setFollowUser(true);
              setModoPrimerPlano(false);
              speak("Iniciando navegación básica. Sigue la ruta marcada en el mapa.");
            }
          }
        ]
      );
      return;
    }

    setSteps(lastRoute.steps);
    setCurrentStep(0);
    setNavegando(true);
    setFollowUser(true);
    setModoPrimerPlano(false);

    setDistanceRemainingMeters(null);
    setMinutesRemaining(null);
    setSpeedKmh(null);

    prevLocRef.current = userLocation ?? null;
    prevTsRef.current = Date.now();
    announcedRef.current = {};

    if (mapRef.current) {
      try {
        mapRef.current.animateCamera({ 
          center: userLocation ?? lastRoute.coordinates[0], 
          pitch: 0, 
          heading: 0, 
          altitude: 1000, 
          zoom: 16 
        } as any, { duration: 600 });
      } catch (e) {}
    }

    // Anunciar inicio de navegación
    speak("Iniciando navegación. Sigue las instrucciones de voz.");
  }, [lastRoute, userLocation, speak]);

  // DETENER NAVEGACIÓN CON MODAL PERSONALIZADO
  const stopNavigation = useCallback(() => {
    setStopNavigationModal(true);
  }, []);

  // CONFIRMAR DETENER NAVEGACIÓN
  const confirmStopNavigation = useCallback(() => {
    setNavegando(false);
    setCurrentStep(0);
    setSteps([]);
    setFollowUser(false);
    setModoPrimerPlano(false);
    Speech.stop();

    setDistanceRemainingMeters(null);
    setMinutesRemaining(null);
    setSpeedKmh(null);
    prevLocRef.current = null;
    prevTsRef.current = null;
    announcedRef.current = {};

    if (navigationIntervalRef.current) {
      clearInterval(navigationIntervalRef.current as unknown as number);
      navigationIntervalRef.current = null;
    }

    speak("Navegación finalizada.");
    setStopNavigationModal(false);
  }, []);

  // NAVEGACIÓN AUTOMÁTICA MEJORADA
  useEffect(() => {
    if (!navegando) return;

    // Limpiar intervalo anterior
    if (navigationIntervalRef.current) {
      clearInterval(navigationIntervalRef.current as unknown as number);
      navigationIntervalRef.current = null;
    }

    navigationIntervalRef.current = setInterval(() => {
      const nextStep = steps[currentStep];
      if (!nextStep || !userLocation) return;

      const target = nextStep.end_location
        ? { latitude: nextStep.end_location.lat, longitude: nextStep.end_location.lng }
        : lastRoute?.coordinates?.[lastRoute.coordinates.length - 1] ?? UCV_COORDS;

      const dist = distanceMeters(userLocation, target);
      const threshold = 25; // metros para considerar llegado

      // Umbrales para anuncios automáticos
      const thresholds = [300, 150, 50];
      if (!announcedRef.current[currentStep]) announcedRef.current[currentStep] = new Set<number>();

      // Anuncios automáticos de proximidad
      for (const t of thresholds) {
        if (dist <= t && !announcedRef.current[currentStep].has(t)) {
          const instruction = stripHtml(nextStep?.html_instructions || "Continúa recto");
          let message = "";
          
          if (t === 300) {
            message = `En 300 metros, ${instruction.toLowerCase()}`;
          } else if (t === 150) {
            message = `En 150 metros, ${instruction.toLowerCase()}`;
          } else if (t === 50) {
            message = `En 50 metros, ${instruction.toLowerCase()}`;
          }
          
          speak(message);
          announcedRef.current[currentStep].add(t);
          break;
        }
      }

      // Avanzar al siguiente paso automáticamente
      if (dist <= threshold) {
        if (currentStep < steps.length - 1) {
          const nextIndex = currentStep + 1;
          setCurrentStep(nextIndex);
          if (!announcedRef.current[nextIndex]) announcedRef.current[nextIndex] = new Set<number>();
          
          // Anunciar nueva instrucción
          const nextInstruction = stripHtml(steps[nextIndex]?.html_instructions || "Continúa recto");
          speak(`Ahora ${nextInstruction.toLowerCase()}`);
        } else {
          speak("¡Has llegado a tu destino! Navegación completada.");
          confirmStopNavigation();
        }
      }

      // Seguir usuario automáticamente
      if (mapRef.current && followUser && userLocation) {
        try {
          const cameraConfig = modoPrimerPlano 
            ? { 
                center: userLocation, 
                zoom: 18, 
                heading: 0, 
                pitch: 45,
                altitude: 500
              }
            : { 
                center: userLocation, 
                zoom: 17, 
                heading: 0, 
                pitch: 0 
              };
              
          mapRef.current.animateCamera(cameraConfig as any, { duration: 800 });
        } catch (e) {}
      }
    }, 1500) as unknown as number;

    return () => {
      if (navigationIntervalRef.current) {
        clearInterval(navigationIntervalRef.current as unknown as number);
        navigationIntervalRef.current = null;
      }
    };
  }, [navegando, currentStep, steps, userLocation, followUser, lastRoute, confirmStopNavigation, speak, stripHtml, distanceMeters, UCV_COORDS, modoPrimerPlano]);

  // Actualizar métricas en tiempo real
  useEffect(() => {
    if (!navegando || !userLocation) return;

    const now = Date.now();

    if (prevLocRef.current && prevTsRef.current) {
      const dt = (now - prevTsRef.current) / 1000;
      if (dt > 0) {
        const dMeters = distanceMeters(prevLocRef.current, userLocation);
        const speedMs = dMeters / dt;
        const speedKmH = speedMs * 3.6;
        setSpeedKmh(Number(speedKmH.toFixed(1)));
      }
    }

    prevLocRef.current = userLocation;
    prevTsRef.current = now;

    const finalCoord = lastRoute?.coordinates?.[lastRoute.coordinates.length - 1] ?? UCV_COORDS;
    const distRem = distanceMeters(userLocation, finalCoord);
    setDistanceRemainingMeters(Math.round(distRem));

    if (speedKmh && speedKmh > 1) {
      const speedMs = (speedKmh / 3.6);
      const mins = distRem / speedMs / 60;
      setMinutesRemaining(Number(mins.toFixed(0)));
    } else if (lastRoute?.duration) {
      const m = lastRoute.duration.match(/(\d+)\s*min/);
      setMinutesRemaining(m ? Number(m[1]) : null);
    } else setMinutesRemaining(null);
  }, [userLocation, navegando]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType={mapType}
        onPress={handleMapPress}
        initialRegion={{
          latitude: userLocation?.latitude ?? UCV_COORDS.latitude,
          longitude: userLocation?.longitude ?? UCV_COORDS.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Tu ubicación">
            <Image source={require("../../assets/images/marker-user.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
          </Marker>
        )}

        <Marker coordinate={UCV_COORDS} title="UCV Los Olivos">
          <Image source={require("../../assets/images/marker-ucv.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
        </Marker>

        {selectedPlace && (
          <Marker 
            coordinate={selectedPlace} 
            title={selectedPlace.name ?? "Lugar seleccionado"}
            onCalloutPress={handleLongPressMarker}
            onPress={handleLongPressMarker}
          />
        )}

        {lastRoute?.coordinates && (
          <Polyline 
            coordinates={lastRoute.coordinates} 
            strokeColor={navegando ? "#00FFAA" : mode === "ida" ? "#2196F3" : "#E53935"} 
            strokeWidth={navegando ? 6 : 4} 
          />
        )}

      {showCiclovias && ciclovias.map((c) => (
          <Polyline 
            key={c.id} 
            coordinates={c.coordinates} // Usará el arreglo completo de coordenadas
            strokeColor={c.color} 
            strokeWidth={4} 
          />
        ))}
      </MapView>

      {/* BOTONES SUPERIORES */}
      {!navegando && (
        <SafeAreaView style={styles.topButtons}>
          <BlurView intensity={60} tint="dark" style={styles.blurTop}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setSearchModal(true)}>
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.iconText}>Buscar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={() => setRoutesModal(true)}>
              <Ionicons name="time" size={20} color="#fff" />
              <Text style={styles.iconText}>Historial</Text>
            </TouchableOpacity>
          </BlurView>
        </SafeAreaView>
      )}

      {/* BOTÓN CICLOVÍAS */}
      {!navegando && (
        <View style={styles.cicloviaTopButtonContainer}>
          <TouchableOpacity 
            style={[styles.cicloviaTopButton, { backgroundColor: showCiclovias ? "#388E3C" : "#66bb6a" }]} 
            onPress={() => setShowCiclovias((v) => !v)}
          >
            <Ionicons name="bicycle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* BOTÓN TIPO DE MAPA */}
      {!navegando && (
        <View style={styles.reliefButtonContainer}>
          <TouchableOpacity style={styles.reliefButton} onPress={cycleMapType}>
            <Ionicons name="map" size={20} color="#fff" />
            <Text style={styles.reliefButtonText}>{mapType}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* BOTÓN UBICACIÓN */}
      <Animated.View style={[styles.locationButtonContainer, { bottom: buttonBottom }]}>
        {!navegando && (
          <TouchableOpacity style={styles.locationButton} onPress={() => { 
            if (userLocation && mapRef.current) {
              mapRef.current.animateCamera({ center: userLocation, zoom: 15 } as any); 
            }
          }}>
            <Ionicons name="locate" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* PANEL INFERIOR */}
      <BlurView intensity={40} tint="dark" style={styles.bottomPanel}>
        {!navegando ? (
          // MODO NORMAL
          <>
            <View style={styles.buttonsRow}>
              <TouchableOpacity
  style={[
    styles.routeCircleButton,
    { backgroundColor: lightTheme.primary },
    mode === "ida" && styles.routeCircleButtonActive
  ]}
  onPress={() => { setMode("ida"); handleCalculateRoute("ida"); }}
  testID="btn-ruta-ida"
  accessibilityLabel="btn-ruta-ida"     
>
  <Ionicons name="arrow-forward" size={24} color="#fff" />
</TouchableOpacity>

<TouchableOpacity
  style={[
    styles.routeCircleButton,
    { backgroundColor: "#E53935" },
    mode === "retorno" && styles.routeCircleButtonActive
  ]}
  onPress={() => { setMode("retorno"); handleCalculateRoute("retorno"); }}
  testID="btn-ruta-retorno"
  accessibilityLabel="btn-ruta-retorno" 
>
  <Ionicons name="arrow-back" size={24} color="#fff" />
</TouchableOpacity>

              <TouchableOpacity style={[styles.routeCircleButton, { backgroundColor: lightTheme.primary }]} onPress={handleSaveRoute}>
                <Ionicons name="bookmark" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {lastRoute && (
              <View style={styles.infoBox}>
                <Text style={styles.modeText}>
                  {lastRoute.mode === "ida" ? "🚴 Ruta a la UCV" : "🏠 Ruta a tu casa"}
                  {lastRoute.id.includes('simulated') && " • Estimada"}
                </Text>
                <Text style={styles.infoText}testID="resultado-distancia-ruta">📍 Distancia: {lastRoute.distance}</Text>
                <Text style={styles.infoText}>⏱️ Duración: {lastRoute.duration}</Text>
                
                <Text style={styles.routeNote}>
                  {lastRoute.mode === "ida" 
                    ? "Ruta optimizada para bicicleta y scooter hacia la UCV" 
                    : "Ruta optimizada para bicicleta y scooter hacia tu ubicación"
                  }
                  {lastRoute.id.includes('simulated') && " • Ruta estimada"}
                </Text>

                <View style={{ marginTop: 10, width: "100%" }}>
                  <TouchableOpacity onPress={startNavigation} style={styles.startNavButton}>
                    <Text style={styles.startNavText}>
                      {lastRoute.steps && lastRoute.steps.length > 0 ? "Iniciar Navegación" : "Ver Ruta"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        ) : (
          // MODO NAVEGACIÓN ACTIVA
          <View style={styles.infoBox}>
            <Text style={styles.modeText}>Navegación Activa</Text>
            <Text style={styles.infoText}>Paso {currentStep + 1} de {steps.length}</Text>
            <Text style={[styles.infoText, { marginTop: 6, textAlign: 'center' }]}>
              {steps[currentStep]?.html_instructions?.replace(/<[^>]+>/g, "") || "Sigue la ruta marcada en el mapa"}
            </Text>

            {/* CONTROLES DE NAVEGACIÓN */}
            <View style={{ flexDirection: "row", marginTop: 12, width: "100%", justifyContent: "space-between", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setMostrarDatos((v) => !v)} style={[styles.smallNavBtn, { paddingHorizontal: 16 }]}>
                <Text style={styles.smallNavText}>{mostrarDatos ? "Ocultar datos" : "Mostrar datos"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModoPrimerPlano((v) => !v)} style={[styles.smallNavBtn, { paddingHorizontal: 16 }]}>
                <Text style={styles.smallNavText}>{modoPrimerPlano ? "Vista normal" : "Vista 3D"}</Text>
              </TouchableOpacity>
            </View>

            {/* DATOS EN TIEMPO REAL */}
            {mostrarDatos && (
              <View style={{ marginTop: 12, width: "100%", alignItems: "center" }}>
                <Text style={[styles.infoText]}>📏 Distancia restante: {formatDistance(distanceRemainingMeters)}</Text>
                <Text style={[styles.infoText]}>⏱️ Tiempo estimado: {formatMinutes(minutesRemaining)}</Text>
                <Text style={[styles.infoText]}>🚴 Velocidad: {formatSpeed(speedKmh)}</Text>
              </View>
            )}

            {/* BOTÓN SALIR NAVEGACIÓN */}
            <View style={{ marginTop: 12, width: "100%" }}>
              <TouchableOpacity onPress={stopNavigation} style={[styles.smallNavBtn, { backgroundColor: "#E53935", width: '100%' }]}>
                <Text style={[styles.smallNavText, { color: "#fff", textAlign: 'center' }]}>Finalizar Navegación</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </BlurView>

      {/* MODAL BUSCADOR */}
      <Modal visible={searchModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🔍 Buscar Lugar</Text>
            <TextInput 
              placeholder="Escribe un lugar..." 
              placeholderTextColor={lightTheme.mutedText} 
              value={query} 
              onChangeText={handleSearch} 
              style={styles.input} 
            />

            <FlatList 
              data={results} 
              keyExtractor={(item) => item.place_id} 
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectPlace(item.place_id, item.description)}>
                  <Text style={styles.resultItem}>{item.description}</Text>
                </TouchableOpacity>
              )} 
            />

            <TouchableOpacity onPress={() => setSearchModal(false)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL RUTAS GUARDADAS */}
      <Modal visible={routesModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: "#f9f9f9" }]}>
            <Text style={[styles.modalTitle, { marginBottom: 10 }]}>🗺️ Rutas Guardadas</Text>

            <FlatList 
              data={savedRoutes} 
              keyExtractor={(item) => item.id} 
              renderItem={({ item }) => (
                <View style={styles.routeCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.routeTitle}>{item.name ?? "Ubicación personalizada"}</Text>
                    <Text style={styles.routeInfo}>{item.mode === "ida" ? "➡️ Hacia UCV" : "⬅️ Desde UCV"}</Text>
                    <Text style={styles.routeInfo}>Distancia: {item.distance} · Duración: {item.duration}</Text>
                    {item.id.includes('simulated') && (
                      <Text style={styles.simulatedBadge}>Ruta estimada</Text>
                    )}
                  </View>

                  <View style={{ marginLeft: 8, alignItems: "flex-end" }}>
                    <TouchableOpacity onPress={() => handleOpenSavedRoute(item)}>
                      <Ionicons name="eye" size={20} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDeleteSavedRoute(item.id, item.name || "Ruta sin nombre")} 
                      style={{ marginTop: 8 }}
                    >
                      <Ionicons name="trash" size={20} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                </View>
              )} 
              ListEmptyComponent={
                <Text style={{ textAlign: "center", color: "#555", marginTop: 20 }}>
                  No hay rutas guardadas
                </Text>
              } 
            />

            <TouchableOpacity onPress={() => setRoutesModal(false)} style={[styles.closeBtn, { marginTop: 12 }]}>
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODALES PERSONALIZADOS PARA ALERTAS */}
      
      {/* Modal Eliminar Punto Seleccionado */}
      <CustomAlertModal
        visible={deleteMarkerModal}
        onClose={() => setDeleteMarkerModal(false)}
        title="Eliminar Punto Seleccionado"
        message={`¿Estás seguro de que quieres eliminar "${selectedPlace?.name || 'Ubicación seleccionada'}"?`}
        buttons={[
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => {}
          },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => {
              setSelectedPlace(null);
              calculateRoute(mode, null);
            }
          }
        ]}
      />

      {/* Modal Guardar Ruta */}
      <CustomAlertModal
        visible={saveRouteModal}
        onClose={() => setSaveRouteModal(false)}
        title={lastRoute ? "Guardar Ruta" : "Guardar Ruta"}
        message={lastRoute 
          ? "¿Quieres guardar esta ruta en tu historial?" 
          : "Primero calcula una ruta antes de guardarla"}
        buttons={lastRoute ? [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => {}
          },
          {
            text: "Guardar",
            style: "default",
            onPress: confirmSaveRoute
          }
        ] : [
          {
            text: "Entendido",
            style: "default",
            onPress: () => {}
          }
        ]}
      />

      {/* Modal Finalizar Navegación */}
      <CustomAlertModal
        visible={stopNavigationModal}
        onClose={() => setStopNavigationModal(false)}
        title="Finalizar Navegación"
        message="¿Deseas finalizar la navegación activa?"
        buttons={[
          {
            text: "Continuar",
            style: "cancel",
            onPress: () => {}
          },
          {
            text: "Finalizar",
            style: "destructive",
            onPress: confirmStopNavigation
          }
        ]}
      />

      {/* Modal Eliminar Ruta Guardada */}
      <CustomAlertModal
        visible={deleteRouteModal}
        onClose={() => {
          setDeleteRouteModal(false);
          setRouteToDelete(null);
        }}
        title="🗑️ Eliminar Ruta"
        message={`¿Estás seguro de que quieres eliminar "${routeToDelete?.name || 'Ruta sin nombre'}"?`}
        buttons={[
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => {}
          },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: confirmDeleteRoute
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  topButtons: { position: "absolute", top: Platform.OS === "ios" ? 60 : 40, left: 10, right: 10 },
  blurTop: { flexDirection: "row", justifyContent: "space-between", borderRadius: 20, padding: 10, overflow: "hidden" },
  iconButton: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 15 },
  iconText: { color: "#fff", fontFamily: "Outfit-Medium", fontSize: 14, marginLeft: 6 },
  bottomPanel: { position: "absolute", bottom: 0, left: 0, right: 0, borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingVertical: 20, paddingHorizontal: 20 },
  buttonsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 12 },
  infoBox: { backgroundColor: "white", borderRadius: 15, padding: 12, marginTop: 10, alignItems: "center" },
  modeText: { fontFamily: "Outfit-Medium", color: lightTheme.primary, fontSize: 15, marginBottom: 4 },
  infoText: { fontFamily: "Mooli-Regular", color: "#333", fontSize: 13 },
  locationButtonContainer: { position: "absolute", right: 5},
  locationButton: { backgroundColor: lightTheme.primary, borderRadius: 50, width: 55, height: 55, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 6 },
  
  cicloviaTopButtonContainer: { 
    position: "absolute", 
    top: Platform.OS === "ios" ? 60 : 100, 
    left: 10 
  },
  cicloviaTopButton: { 
    backgroundColor: "#43A047", 
    borderRadius: 50, 
    width: 55,
    height: 55,
    justifyContent: "center", 
    alignItems: "center", 
    shadowColor: "#000", 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 6 
  },

  reliefButtonContainer: { 
    position: "absolute", 
    top: Platform.OS === "ios" ? 120 : 100, 
    right: 10 
  },
  reliefButton: { 
    flexDirection: "row",
    backgroundColor: lightTheme.primary, 
    borderRadius: 20, 
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "center", 
    alignItems: "center", 
    shadowColor: "#000", 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 6 
  },
  reliefButtonText: { 
    color: "#fff", 
    fontFamily: "Outfit-Medium", 
    fontSize: 12, 
    marginLeft: 4 
  },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalContent: { width: "100%", backgroundColor: "#fff", borderRadius: 20, padding: 20, maxHeight: "70%" },
  modalTitle: { fontFamily: "Outfit-Medium", fontSize: 18, color: lightTheme.primary, textAlign: "center" },
  modalMessage: { fontFamily: "Mooli-Regular", fontSize: 16, color: "#333", textAlign: "center", marginVertical: 15, lineHeight: 22 },
  modalButtonsContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  modalButton: { flex: 1, marginHorizontal: 5, paddingVertical: 12, borderRadius: 12, backgroundColor: lightTheme.primary },
  modalButtonCancel: { backgroundColor: "#51bc12ff" },
  modalButtonDestructive: { backgroundColor: "#E53935" },
  modalButtonText: { color: "#fff", textAlign: "center", fontFamily: "Outfit-Medium", fontSize: 16 },
  modalButtonTextDestructive: { color: "#fff" },
  input: { borderWidth: 1, borderColor: lightTheme.mutedText, borderRadius: 12, padding: 10, marginBottom: 10, color: "#333" },
  resultItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee", fontFamily: "Mooli-Regular" },
  closeBtn: { backgroundColor: lightTheme.primary, borderRadius: 20, paddingVertical: 12, marginTop: 15 },
  closeBtnText: { color: "#fff", textAlign: "center", fontFamily: "Outfit-Medium" },
  routeCard: { backgroundColor: "#fff", borderRadius: 15, padding: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 2, flexDirection: "row", justifyContent: "space-between" },
  routeTitle: { fontFamily: "Outfit-Medium", color: "#333" },
  routeInfo: { fontFamily: "Mooli-Regular", color: "#555", fontSize: 13 },
  simulatedBadge: {
    fontFamily: "Mooli-Regular", 
    color: "#FF9800", 
    fontSize: 11,
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  routeCircleButton: { width: 55, height: 55, borderRadius: 50, justifyContent: "center", alignItems: "center", marginHorizontal: 10, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  routeCircleButtonActive: { borderWidth: 3, borderColor: "#fff" },
  startNavButton: { backgroundColor: "#00C853", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, alignItems: "center" },
  startNavText: { color: "#fff", fontFamily: "Outfit-Medium", fontSize: 15 },
  smallNavBtn: { backgroundColor: "#f0f0f0", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  smallNavText: { fontFamily: "Outfit-Medium", color: "#333" },
  routeNote: {
    fontFamily: "Mooli-Regular", 
    color: "#666", 
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
  },
});