import { useState, useEffect } from 'react';

export interface DashboardStats {
  totalTrips: number;
  carbonSaved: number;
  moneySaved: number;
  activeRoutes: number;
  weeklyTrips: number;
  monthlyDistance: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de estadísticas
    const loadStats = async () => {
      setIsLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos mock - en producción vendrían del backend
      const mockStats: DashboardStats = {
        totalTrips: 7,
        carbonSaved: 15.7, // kg CO2
        moneySaved: 10.50, // soles
        activeRoutes: 3,
        weeklyTrips: 8,
        monthlyDistance: 25, // km
      };
      
      setStats(mockStats);
      setIsLoading(false);
    };

    loadStats();
  }, []);

  const refreshStats = async () => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Recargar estadísticas
    const mockStats: DashboardStats = {
      totalTrips: Math.floor(Math.random() * 100) + 20,
      carbonSaved: Math.round((Math.random() * 30 + 10) * 10) / 10,
      moneySaved: Math.round((Math.random() * 300 + 100) * 100) / 100,
      activeRoutes: Math.floor(Math.random() * 5) + 1,
      weeklyTrips: Math.floor(Math.random() * 15) + 5,
      monthlyDistance: Math.floor(Math.random() * 300) + 200,
    };
    
    setStats(mockStats);
    setIsLoading(false);
  };

  return {
    stats,
    isLoading,
    refreshStats,
  };
}

// Hook para obtener datos del clima (opcional)
export function useWeatherInfo() {
  const [weather, setWeather] = useState({
    condition: 'sunny',
    temperature: 24,
    description: 'Perfecto para andar en bicicleta'
  });

  return weather;
}

// Hook para rutas recomendadas
export function useRecommendedRoutes() {
  const [routes, setRoutes] = useState([
    { 
      id: '1', 
      name: 'Ruta San Martín - UCV', 
      time: '6:00 AM', 
      spots: 3 
    },
    { 
      id: '2', 
      name: 'Ruta Naranjal - UCV', 
      time: '7:00 AM', 
      spots: 2 
    }
  ]);

  return routes;
}