// src/screens/Map.tsx
import React, { useRef, useEffect, useState } from "react";
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
} from "react-native";
import MapView, { Marker, Polyline, MapPressEvent } from "react-native-maps";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useMap, RouteInfo, Coordinates } from "../hooks/useMap";
import { GOOGLE_MAPS_API_KEY } from "../api/config";
import { lightTheme } from "../theme/colors";

export default function Map() {
  const mapRef = useRef<MapView | null>(null);
  const {
    userLocation,
    UCV_COORDS,
    lastRoute,
    savedRoutes,
    calculateRoute,
    calculateRouteBetweenCoords,
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
  const [results, setResults] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Coordinates | null>(null);

  // 🔹 Animación del botón de ubicación
  const [buttonBottom] = useState(new Animated.Value(140));

  useEffect(() => {
    Animated.timing(buttonBottom, {
      toValue: lastRoute ? 250 : 160,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [lastRoute]);

  // Centrar mapa al obtener userLocation
  useEffect(() => {
    if (mapRef.current && userLocation) {
      try {
        mapRef.current.animateCamera({ center: userLocation, zoom: 15 });
      } catch (e) {}
    }
  }, [userLocation]);

  // Ajustar vista a la ruta
  useEffect(() => {
    if (lastRoute?.coordinates && mapRef.current) {
      try {
        mapRef.current.fitToCoordinates(lastRoute.coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      } catch (e) {}
    }
  }, [lastRoute]);

  // Buscar lugar (Google Places Autocomplete)
  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 3 || !userLocation) return setResults([]);

    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        text
      )}&location=${userLocation.latitude},${userLocation.longitude}&radius=5000&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.predictions) setResults(data.predictions);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }
  };

  // Seleccionar un lugar del buscador -> obtener detalles
  const selectPlace = async (placeId: string, description: string) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      const loc = data?.result?.geometry?.location;
      if (!loc) return;

      const coords: Coordinates = { latitude: loc.lat, longitude: loc.lng, name: description };
      setSelectedPlace(coords);

      mapRef.current?.animateToRegion(
        {
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );

      setSearchModal(false);
      setQuery("");
      setResults([]);
    } catch (error) {
      console.error("Error seleccionando lugar:", error);
    }
  };

  // Tap en mapa
  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedPlace({ latitude, longitude, name: "Ubicación seleccionada" });
  };

  // Opciones para el lugar seleccionado
  const handleRouteFromPlaceToUCV = async () => {
    if (!selectedPlace) {
      Alert.alert("Selecciona un lugar primero");
      return;
    }
    await calculateRoute("ida", selectedPlace);
  };

  const handleRouteFromUCVToPlace = async () => {
    if (!selectedPlace) {
      Alert.alert("Selecciona un lugar primero");
      return;
    }
    await calculateRoute("retorno", selectedPlace);
  };

  const handleRouteFromMyLocationToPlace = async () => {
    if (!selectedPlace) {
      Alert.alert("Selecciona un lugar primero");
      return;
    }
    if (!userLocation) {
      Alert.alert("Ubicación", "Aún no se detectó tu ubicación.");
      return;
    }
    await calculateRouteBetweenCoords(userLocation, selectedPlace, "ida");
  };

  const cycleMapType = () => {
    const types: ("standard" | "satellite" | "terrain" | "hybrid")[] = [
      "standard",
      "satellite",
      "terrain",
      "hybrid",
    ];
    const current = types.indexOf(mapType);
    const next = types[(current + 1) % types.length];
    setMapType(next);
  };

  // Guardar la última ruta
  const handleSaveRoute = () => {
    if (!lastRoute) {
      Alert.alert("No hay ruta", "Calcula una ruta antes de guardarla.");
      return;
    }
    saveRoute(selectedPlace, mode);
    Alert.alert("Guardado", "Ruta guardada correctamente.");
  };

  const handleOpenSavedRoute = (route: RouteInfo) => {
    loadSavedRouteOnMap(route.id);
    setRoutesModal(false);
  };

  const handleDeleteSavedRoute = (id: string) => {
    Alert.alert("Eliminar ruta", "¿Seguro que quieres eliminar esta ruta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteRoute(id),
      },
    ]);
  };

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
        showsMyLocationButton={false} // 👈 Añade esta línea aquí
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Tu ubicación">
            <Image
              source={require("../../assets/images/marker-user.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </Marker>
        )}

        <Marker coordinate={UCV_COORDS} title="UCV Los Olivos">
          <Image
            source={require("../../assets/images/marker-ucv.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </Marker>

        {selectedPlace && (
          <Marker coordinate={selectedPlace} title={selectedPlace.name ?? "Lugar seleccionado"} />
        )}

        {lastRoute?.coordinates && (
          <Polyline
            coordinates={lastRoute.coordinates}
            strokeColor={mode === "ida" ? "#2196F3" : "#E53935"}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* 🔹 Botones superiores */}
      <SafeAreaView style={styles.topButtons}>
        <BlurView intensity={60} tint="dark" style={styles.blurTop}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setSearchModal(true)}>
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.iconText}>Buscar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={cycleMapType}>
            <Ionicons name="map" size={20} color="#fff" />
            <Text style={styles.iconText}>{mapType}</Text>
          </TouchableOpacity>
        </BlurView>
      </SafeAreaView>

      {/* 🔹 Botón de ubicación flotante */}
      <Animated.View style={[styles.locationButtonContainer, { bottom: buttonBottom }]}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => {
            if (userLocation && mapRef.current) {
              mapRef.current.animateCamera({
                center: userLocation,
                zoom: 15,
              });
            }
          }}
        >
          <Ionicons name="locate" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* 🔹 Panel inferior */}
      <BlurView intensity={40} tint="dark" style={styles.bottomPanel}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: lightTheme.primary }]}
            onPress={() => {
              setMode("ida");
              calculateRoute("ida", selectedPlace);
            }}
          >
            <Text style={styles.buttonText}>Ruta de ida</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#E53935" }]}
            onPress={() => {
              setMode("retorno");
              calculateRoute("retorno", selectedPlace);
            }}
          >
            <Text style={styles.buttonText}>Ruta retorno</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: lightTheme.primary, flex: 1 }]}
            onPress={handleSaveRoute}
          >
            <Text style={styles.saveButtonText}>Guardar ruta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: "#6c757d", flex: 1, marginLeft: 10 }]}
            onPress={() => setRoutesModal(true)}
          >
            <Text style={styles.saveButtonText}>Rutas guardadas</Text>
          </TouchableOpacity>
        </View>

        {lastRoute && (
          <View style={styles.infoBox}>
            <Text style={styles.modeText}>🚗 Ruta {lastRoute.mode === "ida" ? "de ida" : "de retorno"}</Text>
            <Text style={styles.infoText}>📍 Distancia: {lastRoute.distance}</Text>
            <Text style={styles.infoText}>⏱️ Duración: {lastRoute.duration}</Text>
          </View>
        )}
      </BlurView>

      {/* 🔹 Modal buscador */}
      <Modal visible={searchModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buscar lugar</Text>
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

      {/* 🔹 Modal rutas guardadas */}
      <Modal visible={routesModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: "#f9f9f9" }]}>
            <Text style={[styles.modalTitle, { marginBottom: 10 }]}>🗺️ Rutas guardadas</Text>

            <FlatList
              data={savedRoutes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.routeCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.routeTitle}>{item.name ?? "Ubicación personalizada"}</Text>
                    <Text style={styles.routeInfo}>{item.mode === "ida" ? "➡️ Hacia UCV" : "⬅️ Desde UCV"}</Text>
                    <Text style={styles.routeInfo}>Distancia: {item.distance} · Duración: {item.duration}</Text>
                  </View>

                  <View style={{ marginLeft: 8, alignItems: "flex-end" }}>
                    <TouchableOpacity onPress={() => handleOpenSavedRoute(item)}>
                      <Ionicons name="eye" size={20} color="#333" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDeleteSavedRoute(item.id)} style={{ marginTop: 8 }}>
                      <Ionicons name="trash" size={20} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={{ textAlign: "center", color: "#555" }}>No hay rutas guardadas</Text>}
            />

            <TouchableOpacity onPress={() => setRoutesModal(false)} style={[styles.closeBtn, { marginTop: 12 }]}>
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  topButtons: {
    position: "absolute",
    top: 60,
    left: 10,
    right: 10,
  },
  blurTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 10,
    overflow: "hidden",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 15,
  },
  iconText: {
    color: "#fff",
    fontFamily: "Outfit-Medium",
    fontSize: 14,
    marginLeft: 6,
  },

  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Outfit-Medium",
    fontSize: 14,
  },
  saveButton: {
    borderRadius: 25,
    paddingVertical: 12,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "Outfit-Medium",
    fontSize: 15,
  },
  infoBox: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 12,
    marginTop: 10,
    alignItems: "center",
  },
  modeText: {
    fontFamily: "Outfit-Medium",
    color: lightTheme.primary,
    fontSize: 15,
    marginBottom: 4,
  },
  infoText: {
    fontFamily: "Mooli-Regular",
    color: "#333",
    fontSize: 13,
  },

  // 🔹 Estilos del botón flotante de ubicación
  locationButtonContainer: {
    position: "absolute",
    right: 10,
  },
  locationButton: {
    backgroundColor: lightTheme.primary,
    borderRadius: 50,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontFamily: "Outfit-Medium",
    fontSize: 18,
    color: lightTheme.primary,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: lightTheme.mutedText,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    color: "#333",
  },
  resultItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontFamily: "Mooli-Regular",
  },
  closeBtn: {
    backgroundColor: lightTheme.primary,
    borderRadius: 20,
    paddingVertical: 12,
    marginTop: 15,
  },
  closeBtnText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Outfit-Medium",
  },
  routeCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  routeTitle: {
    fontFamily: "Outfit-Medium",
    color: "#333",
  },
  routeInfo: {
    fontFamily: "Mooli-Regular",
    color: "#555",
    fontSize: 13,
  },
});
