import { useState, useEffect } from 'react';
import TeamService, { TeamRoute, CreateGroupRequest } from '../api/team';

export interface Route {
  id: string;
  title: string;
  users: number;
  time: string;
  maxUsers?: number;
  description?: string;
  createdBy?: string;
  isNew?: boolean;
}

export function useTeam() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoutesDetails, setCreatedRoutesDetails] = useState<Map<string, TeamRoute>>(new Map());

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setIsLoading(true);
      const teamRoutes = await TeamService.getRoutes();
      // Convertir TeamRoute a Route para compatibilidad
      const convertedRoutes: Route[] = teamRoutes.map(route => ({
        id: route.id,
        title: route.title,
        users: route.users,
        time: route.time,
        maxUsers: route.maxUsers,
        description: route.description,
        createdBy: route.createdBy,
      }));
      setRoutes(convertedRoutes);
    } catch (error) {
      console.error('Error loading routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoute = async (routeId: string) => {
    try {
      setIsJoining(true);
      // En una app real, obtendríamos el userId del contexto de autenticación
      const userId = 'current-user-id'; // Mock user ID
      const success = await TeamService.joinRoute(routeId, userId);
      
      if (success) {
        // Actualizar la lista de rutas para reflejar el cambio
        await loadRoutes();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error joining route:', error);
      return false;
    } finally {
      setIsJoining(false);
    }
  };

  const createGroup = async (groupData: CreateGroupRequest): Promise<boolean> => {
    try {
      setIsCreating(true);
      console.log('Hook: Creating new group with data:', groupData);
      
      const newRoute = await TeamService.createRoute(groupData);
      console.log('Hook: Route created successfully:', newRoute);
      
      // Agregar la nueva ruta inmediatamente a la lista local
      const newRouteConverted: Route = {
        id: newRoute.id,
        title: newRoute.title,
        users: newRoute.users,
        time: newRoute.time,
        maxUsers: newRoute.maxUsers,
        isNew: true,
      };
      
      setRoutes(prevRoutes => [newRouteConverted, ...prevRoutes]);
      
      // Almacenar los detalles completos de la ruta creada
      setCreatedRoutesDetails(prevMap => {
        const newMap = new Map(prevMap);
        newMap.set(newRoute.id, newRoute);
        return newMap;
      });
      
      console.log('Hook: Route added to list successfully');
      
      // Quitar el indicador "nuevo" después de unos segundos
      setTimeout(() => {
        setRoutes(prevRoutes => 
          prevRoutes.map(route => 
            route.id === newRoute.id ? { ...route, isNew: false } : route
          )
        );
        
        // Nota: Mantenemos los detalles en caché para poder seguir accediendo a ellos
        // En una implementación real, estos se sincronizarían con el servidor
      }, 3000);
      
      console.log('Hook: Returning true - group created successfully');
      return true;
    } catch (error) {
      console.error('Error creating group:', error);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const getRouteDetails = async (routeId: string) => {
    try {
      // Primero verificar si es una ruta recién creada que tenemos en memoria
      const createdRouteDetails = createdRoutesDetails.get(routeId);
      if (createdRouteDetails) {
        console.log('Getting details for newly created route from local cache');
        return createdRouteDetails;
      }
      
      // Para rutas existentes, usar el servicio normal
      const routeDetails = await TeamService.getRouteDetails(routeId);
      return routeDetails;
    } catch (error) {
      console.error('Error getting route details:', error);
      return null;
    }
  };

  return {
    routes,
    isLoading,
    isJoining,
    isCreating,
    joinRoute,
    createGroup,
    getRouteDetails,
    refreshRoutes: loadRoutes,
  };
}