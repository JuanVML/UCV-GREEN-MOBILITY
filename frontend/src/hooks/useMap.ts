import { useEffect, useState } from "react";
import * as Location from "expo-location";

// Coordenadas UCV Los Olivos
const UCV_COORDS = { latitude: -11.9552328, longitude: -77.0685585 };

// 🔹 Decodificador polyline (sin dependencias externas)
function decodePolyline(encoded: string): { latitude: number; longitude: number }[] {
  let index = 0, lat = 0, lng = 0;
  const coordinates: { latitude: number; longitude: number }[] = [];

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    coordinates.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return coordinates;
}

interface RouteInfo {
  coordinates: { latitude: number; longitude: number }[];
  distance: string;
  duration: string;
}

export function useMap() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [lastRoute, setLastRoute] = useState<RouteInfo | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<RouteInfo[]>([]);

  // Obtener ubicación del usuario
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permiso de ubicación denegado");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // 🔹 Calcular ruta ida o retorno
  const calculateRoute = async (mode: "ida" | "retorno") => {
    if (!userLocation) return;

    const origin = mode === "ida" ? `${userLocation.latitude},${userLocation.longitude}` : `${UCV_COORDS.latitude},${UCV_COORDS.longitude}`;
    const destination = mode === "ida" ? `${UCV_COORDS.latitude},${UCV_COORDS.longitude}` : `${userLocation.latitude},${userLocation.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=AIzaSyDMSvMc0iyV-NwTwCefHrnNek7Z-efnaqM`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.routes?.length > 0) {
      const leg = data.routes[0].legs[0];
      const points = decodePolyline(data.routes[0].overview_polyline.points);

      setLastRoute({
        coordinates: points,
        distance: leg.distance.text,
        duration: leg.duration.text,
      });
    }
  };

  const saveRoute = () => {
    if (lastRoute) {
      setSavedRoutes((prev) => [...prev, lastRoute]);
    }
  };

  return {
    userLocation,
    UCV_COORDS,
    lastRoute,
    savedRoutes,
    calculateRoute,
    saveRoute,
  };
}
