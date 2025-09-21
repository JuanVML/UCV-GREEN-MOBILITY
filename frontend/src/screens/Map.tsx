import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useMap } from "../hooks/useMap";

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const { userLocation, UCV_COORDS, lastRoute, savedRoutes, calculateRoute, saveRoute } = useMap();

  const [mode, setMode] = useState<"ida" | "retorno">("ida");

  // Ajustar zoom automáticamente
  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.fitToCoordinates([userLocation, UCV_COORDS], {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  }, [userLocation, lastRoute]);

  // 🔹 Pin estilo Google Maps
  const MarkerPin = ({ label, color }: { label: string; color: string }) => (
    <View style={styles.pinContainer}>
      <View style={[styles.pinHead, { backgroundColor: color }]}>
        <Text style={styles.pinText}>{label}</Text>
      </View>
      <View style={[styles.pinTail, { borderTopColor: color }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* MAPA */}
      <MapView ref={mapRef} style={styles.map}>
        {userLocation &&
          (mode === "ida" ? (
            <>
              <Marker coordinate={userLocation}>
                <MarkerPin label="A" color="blue" />
              </Marker>
              <Marker coordinate={UCV_COORDS}>
                <MarkerPin label="B" color="red" />
              </Marker>
            </>
          ) : (
            <>
              <Marker coordinate={UCV_COORDS}>
                <MarkerPin label="A" color="red" />
              </Marker>
              <Marker coordinate={userLocation}>
                <MarkerPin label="B" color="blue" />
              </Marker>
            </>
          ))}

        {lastRoute?.coordinates && (
          <Polyline
            coordinates={lastRoute.coordinates}
            strokeColor={mode === "ida" ? "#2196F3" : "#E53935"}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Panel inferior flotante (gris como antes) */}
      <View style={styles.bottomPanel}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setMode("ida");
              calculateRoute("ida");
            }}
          >
            <Text style={styles.buttonText}>Ruta de ida</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setMode("retorno");
              calculateRoute("retorno");
            }}
          >
            <Text style={styles.buttonText}>Ruta Retorno</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={saveRoute}>
            <Text style={styles.buttonText}>Guardar Ruta</Text>
          </TouchableOpacity>
        </View>

        {lastRoute && (
          <View style={styles.infoBox}>
            <Text style={styles.modeText}>
              🚗 Ruta de:  <Text style={{ color: mode === "ida" ? "blue" : "red" }}>A</Text> ➝{" "}
              <Text style={{ color: mode === "ida" ? "red" : "blue" }}>B</Text>
            </Text>
            <Text style={styles.infoText}>📍 Distancia: {lastRoute.distance}</Text>
            <Text style={styles.infoText}>⏱️ Duración: {lastRoute.duration}</Text>
          </View>
        )}

        {savedRoutes.length > 0 && (
          <FlatList
            data={savedRoutes}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <Text style={styles.savedItem}>
                #{index + 1} - {item.distance} | {item.duration}
              </Text>
            )}
            style={styles.savedList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // 🔹 Pin estilo Google Maps
  pinContainer: {
    alignItems: "center",
  },
  pinHead: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  pinText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -2,
  },

  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.97)",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 13 },

  infoBox: {
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    alignItems: "center", // 🔹 Centrar texto
  },
  modeText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 2,
  },
  savedList: {
    marginTop: 8,
    maxHeight: 80,
  },
  savedItem: { fontSize: 12, paddingVertical: 2 },
});
