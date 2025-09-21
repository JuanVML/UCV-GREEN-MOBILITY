import React, { createContext, useState } from "react";

interface SavedRoute {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  distance: string;
  duration: string;
}

interface MapContextProps {
  savedRoutes: SavedRoute[];
  addRoute: (route: SavedRoute) => void;
}

export const MapContext = createContext<MapContextProps>({
  savedRoutes: [],
  addRoute: () => {},
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);

  const addRoute = (route: SavedRoute) => {
    setSavedRoutes((prev) => [...prev, route]);
  };

  return (
    <MapContext.Provider value={{ savedRoutes, addRoute }}>
      {children}
    </MapContext.Provider>
  );
};
