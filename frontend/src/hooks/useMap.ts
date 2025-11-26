// src/hooks/useMap.ts
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "../api/config";

// Coordenadas de la UCV Los Olivos
export const UCV_COORDS = { latitude: -11.9552328, longitude: -77.0685585 };

// Tipos personalizados
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
  steps?: any[];
}

// Decodificar polilínea de Google Maps
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

//  Hook principal
export function useMap() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [lastRoute, setLastRoute] = useState<RouteInfo | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<RouteInfo[]>([]);
  const [mapType, setMapType] = useState<
    "standard" | "satellite" | "terrain" | "hybrid"
  >("standard");

  // Obtener ubicación del usuario
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
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
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

  /**
   * SOLUCIÓN REAL: Usar driving pero simular que es para bicicletas
   * En Perú no hay soporte para bicycling, así que usamos driving
   * pero adaptamos los tiempos y distancias para bicicleta
   */
  const calculateRoute = async (
    mode: "ida" | "retorno",
    selectedPlace?: Coordinates | null
  ): Promise<RouteInfo | null> => {
    if (!userLocation && !selectedPlace) {
      console.warn("No hay ubicación del usuario ni lugar seleccionado");
      return null;
    }

    const originStr =
      mode === "ida"
        ? `${selectedPlace?.latitude ?? userLocation?.latitude},${selectedPlace?.longitude ?? userLocation?.longitude}`
        : `${UCV_COORDS.latitude},${UCV_COORDS.longitude}`;

    const destinationStr =
      mode === "ida"
        ? `${UCV_COORDS.latitude},${UCV_COORDS.longitude}`
        : `${selectedPlace?.latitude ?? userLocation?.latitude},${selectedPlace?.longitude ?? userLocation?.longitude}`;

    try {
      // USAR DRIVING (que sí funciona en Perú) pero adaptar para bicicleta
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        originStr
      )}&destination=${encodeURIComponent(destinationStr)}&key=${GOOGLE_MAPS_API_KEY}&mode=driving&units=metric&alternatives=true`;
      
      console.log("Calculando ruta con driving (adaptada para bici)...");
      
      const res = await fetch(url);
      const data: any = await res.json();

      console.log("📡 Respuesta API:", data.status);

      if (data.status === "OK" && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs && route.legs[0];
        const points = route.overview_polyline
          ? decodePolyline(route.overview_polyline.points)
          : [];

        // ADAPTAR TIEMPO Y DISTANCIA PARA BICICLETA
        const originalDistance = leg?.distance?.value ?? 0; // en metros
        const originalDuration = leg?.duration?.value ?? 0; // en segundos

        // Para bicicleta: misma distancia pero tiempo 3x mayor (velocidad promedio 15 km/h vs 50 km/h auto)
        const bikeDistanceMeters = originalDistance;
        const bikeDurationSeconds = Math.round(originalDuration * 2.5); // 2.5x más tiempo

        // Formatear distancia
        let distanceText;
        if (bikeDistanceMeters >= 1000) {
          distanceText = `${(bikeDistanceMeters / 1000).toFixed(1)} km`;
        } else {
          distanceText = `${bikeDistanceMeters} m`;
        }

        // Formatear duración
        let durationText;
        const minutes = Math.round(bikeDurationSeconds / 60);
        if (minutes >= 60) {
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          durationText = remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
        } else {
          durationText = `${minutes} min`;
        }

        const newRoute: RouteInfo = {
          id: `${Date.now()}`,
          coordinates: points,
          distance: distanceText,
          duration: durationText,
          name: mode === "ida" ? "Hacia UCV" : "Hacia casa",
          mode,
          createdAt: new Date().toISOString(),
          steps: leg?.steps ?? [],
        };

        console.log("✅ Ruta calculada exitosamente (adaptada para bicicleta)");
        console.log(`📏 Distancia: ${distanceText}, ⏱️ Tiempo: ${durationText}`);
        
        setLastRoute(newRoute);
        return newRoute;
      } else {
        console.warn("❌ No se pudo calcular la ruta:", data.status);
        
        // CREAR RUTA SIMULADA como fallback
        if (userLocation) {
          console.log("🔄 Creando ruta simulada...");
          return createSimulatedRoute(userLocation, mode, selectedPlace);
        }
        
        return null;
      }

    } catch (err) {
      console.error("❌ Error obteniendo ruta:", err);
      
      // 🔥 CREAR RUTA SIMULADA en caso de error
      if (userLocation) {
        console.log("🔄 Creando ruta simulada por error...");
        return createSimulatedRoute(userLocation, mode, selectedPlace);
      }
      
      return null;
    }
  };

  /**
   * CREAR RUTA SIMULADA cuando la API falle
   */
  const createSimulatedRoute = (
    userLoc: Coordinates,
    mode: "ida" | "retorno",
    selectedPlace?: Coordinates | null
  ): RouteInfo => {
    const origin = mode === "ida" ? (selectedPlace || userLoc) : UCV_COORDS;
    const destination = mode === "ida" ? UCV_COORDS : (selectedPlace || userLoc);

    // Calcular distancia aproximada
    const distanceMeters = calculateDirectDistance(origin, destination);
    const distanceText = distanceMeters >= 1000 ? 
      `${(distanceMeters / 1000).toFixed(1)} km` : 
      `${Math.round(distanceMeters)} m`;

    // Calcular tiempo aproximado para bicicleta (15 km/h promedio)
    const bikeSpeedKmh = 15;
    const durationMinutes = Math.round((distanceMeters / 1000) / bikeSpeedKmh * 60);
    const durationText = durationMinutes >= 60 ? 
      `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}min` : 
      `${durationMinutes} min`;

    // Crear ruta lineal simple
    const coordinates = [origin, destination];

    const simulatedRoute: RouteInfo = {
      id: `${Date.now()}-simulated`,
      coordinates,
      distance: distanceText,
      duration: durationText,
      name: mode === "ida" ? "Hacia UCV (simulada)" : "Hacia casa (simulada)",
      mode,
      createdAt: new Date().toISOString(),
      steps: [
        {
          html_instructions: "Dirígete hacia el destino",
          distance: { text: distanceText },
          duration: { text: durationText }
        }
      ],
    };

    console.log("🔄 Ruta simulada creada:", simulatedRoute);
    setLastRoute(simulatedRoute);
    return simulatedRoute;
  };

  /**
   * Calcular distancia en línea recta (Haversine)
   */
  const calculateDirectDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calcular ruta entre dos coordenadas
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
      )}&destination=${encodeURIComponent(destStr)}&key=${GOOGLE_MAPS_API_KEY}&mode=driving&units=metric`;
      
      const res = await fetch(url);
      const data: any = await res.json();

      if (!data?.routes?.length) {
        // Crear ruta simulada si falla
        return createSimulatedRoute(origin, mode, destination);
      }

      const route = data.routes[0];
      const leg = route.legs && route.legs[0];
      const points = route.overview_polyline ? decodePolyline(route.overview_polyline.points) : [];

      // Adaptar para bicicleta
      const originalDistance = leg?.distance?.value ?? 0;
      const originalDuration = leg?.duration?.value ?? 0;
      const bikeDistanceMeters = originalDistance;
      const bikeDurationSeconds = Math.round(originalDuration * 2.5);

      const distanceText = bikeDistanceMeters >= 1000 ? 
        `${(bikeDistanceMeters / 1000).toFixed(1)} km` : 
        `${bikeDistanceMeters} m`;

      const minutes = Math.round(bikeDurationSeconds / 60);
      const durationText = minutes >= 60 ? 
        `${Math.floor(minutes / 60)}h ${minutes % 60}min` : 
        `${minutes} min`;

      const newRoute: RouteInfo = {
        id: `${Date.now()}`,
        coordinates: points,
        distance: distanceText,
        duration: durationText,
        name: `${origin.name ?? "Origen"} ↔ ${destination.name ?? "Destino"}`,
        mode,
        createdAt: new Date().toISOString(),
        steps: leg?.steps ?? [],
      };

      setLastRoute(newRoute);
      return newRoute;
    } catch (err) {
      console.error("Error obtener ruta entre coords:", err);
      return createSimulatedRoute(origin, mode, destination);
    }
  };

  // Guardar ruta
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