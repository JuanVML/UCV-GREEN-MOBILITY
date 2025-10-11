// src/hooks/useMap.ts
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "../api/config";

// 🔹 Coordenadas de la UCV Los Olivos
export const UCV_COORDS = { latitude: -11.9552328, longitude: -77.0685585 };

// 🔹 Tipos personalizados
export interface Coordinates {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface RouteInfo {
  id: string;
  coordinates: Coordinates[];
  distance: string;
  duration: string;
  name?: string;
  mode: "ida" | "retorno";
  createdAt?: string;
}

// 🔹 Decodificar polilínea de Google Maps (returns array of Coordinates)
function decodePolyline(encoded: string): Coordinates[] {
  let index = 0,
    lat = 0,
    lng = 0;
  const coordinates: Coordinates[] = [];

  while (index < encoded.length) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return coordinates;
}

// 🔹 Hook principal
export function useMap() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [lastRoute, setLastRoute] = useState<RouteInfo | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<RouteInfo[]>([]);
  const [mapType, setMapType] = useState<
    "standard" | "satellite" | "terrain" | "hybrid"
  >("standard");

  // 🛰️ Obtener ubicación del usuario (y escuchar cambios)
  useEffect(() => {
    let watcher: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permiso de ubicación denegado");
        return;
      }

      try {
        const pos = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          name: "Tu ubicación",
        });
      } catch (err) {
        console.warn("No se pudo obtener ubicación inicial:", err);
      }

      watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 4000,
          distanceInterval: 5,
        },
        (loc) => {
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            name: "Tu ubicación",
          });
        }
      );
    };

    startWatching();

    return () => {
      watcher?.remove();
    };
  }, []);

  // Helper: parse "lat,lng" string into Coordinates (no name)
  const parseLatLngString = (s: string): Coordinates => {
    const [latStr, lngStr] = s.split(",");
    return { latitude: parseFloat(latStr), longitude: parseFloat(lngStr) };
  };

  /**
   * Calcula ruta:
   * - mode "ida": origen = selectedPlace || userLocation ; destino = UCV
   * - mode "retorno": origen = UCV ; destino = selectedPlace || userLocation
   */
  const calculateRoute = async (
    mode: "ida" | "retorno",
    selectedPlace?: Coordinates | null
  ): Promise<RouteInfo | null> => {
    // si no hay userLocation ni selectedPlace no podemos calcular
    if (!userLocation && !selectedPlace) return null;

    const originStr =
      mode === "ida"
        ? `${selectedPlace?.latitude ?? userLocation?.latitude},${selectedPlace?.longitude ?? userLocation?.longitude}`
        : `${UCV_COORDS.latitude},${UCV_COORDS.longitude}`;

    const destinationStr =
      mode === "ida"
        ? `${UCV_COORDS.latitude},${UCV_COORDS.longitude}`
        : `${selectedPlace?.latitude ?? userLocation?.latitude},${selectedPlace?.longitude ?? userLocation?.longitude}`;

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        originStr
      )}&destination=${encodeURIComponent(destinationStr)}&key=${GOOGLE_MAPS_API_KEY}`;
      const res = await fetch(url);
      const data: any = await res.json();

      if (!data || !data.routes || data.routes.length === 0) {
        console.warn("Directions API no devolvió rutas", data);
        return null;
      }

      const route = data.routes[0];
      const leg = route.legs && route.legs[0];
      const points = route.overview_polyline
        ? decodePolyline(route.overview_polyline.points)
        : [];

      const distance = leg?.distance?.text ?? "N/A";
      const duration = leg?.duration?.text ?? "N/A";

      const newRoute: RouteInfo = {
        id: `${Date.now()}`,
        coordinates: points,
        distance,
        duration,
        name: selectedPlace?.name ?? (mode === "ida" ? "Desde ubicación" : "Hacia ubicación"),
        mode,
        createdAt: new Date().toISOString(),
      };

      setLastRoute(newRoute);
      return newRoute;
    } catch (err) {
      console.error("Error obteniendo ruta:", err);
      return null;
    }
  };

  // Calcular ruta entre dos coordenadas explícitas
  const calculateRouteBetweenCoords = async (
    origin: Coordinates,
    destination: Coordinates,
    mode: "ida" | "retorno" = "ida"
  ): Promise<RouteInfo | null> => {
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destStr = `${destination.latitude},${destination.longitude}`;

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        originStr
      )}&destination=${encodeURIComponent(destStr)}&key=${GOOGLE_MAPS_API_KEY}`;
      const res = await fetch(url);
      const data: any = await res.json();

      if (!data?.routes?.length) return null;

      const route = data.routes[0];
      const leg = route.legs && route.legs[0];
      const points = route.overview_polyline ? decodePolyline(route.overview_polyline.points) : [];

      const distance = leg?.distance?.text ?? "N/A";
      const duration = leg?.duration?.text ?? "N/A";

      const newRoute: RouteInfo = {
        id: `${Date.now()}`,
        coordinates: points,
        distance,
        duration,
        name: `${origin.name ?? "Origen"} ↔ ${destination.name ?? "Destino"}`,
        mode,
        createdAt: new Date().toISOString(),
      };

      setLastRoute(newRoute);
      return newRoute;
    } catch (err) {
      console.error("Error obtener ruta entre coords:", err);
      return null;
    }
  };

  // 💾 Guardar la última ruta en memoria (genera id si hace falta)
  const saveRoute = (selectedPlace: Coordinates | null, mode: "ida" | "retorno") => {
    if (!lastRoute) return;

    const routeName =
      selectedPlace?.name ?? (mode === "ida" ? "Desde tu ubicación" : "Hacia tu ubicación");

    const newRoute: RouteInfo = {
      ...lastRoute,
      id: lastRoute.id ?? `${Date.now()}`,
      name: routeName,
      mode,
      createdAt: lastRoute.createdAt ?? new Date().toISOString(),
    };

    setSavedRoutes((prev) => [...prev, newRoute]);
  };

  const deleteRoute = (id: string) => {
    setSavedRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const loadSavedRouteOnMap = (id: string) => {
    const r = savedRoutes.find((s) => s.id === id);
    if (r) setLastRoute(r);
  };

  return {
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
  };
}
