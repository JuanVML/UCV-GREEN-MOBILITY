import * as Location from "expo-location";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_MAPS_API_KEY!;

export interface RouteInfo {
  distance: string;
  duration: string;
  polyline: string;
}

export const getRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteInfo | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const leg = data.routes[0].legs[0];
      return {
        distance: leg.distance.text,
        duration: leg.duration.text,
        polyline: data.routes[0].overview_polyline.points,
      };
    }
    return null;
  } catch (err) {
    console.error("Error fetching route:", err);
    return null;
  }
};
