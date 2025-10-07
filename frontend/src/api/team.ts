// NOTA: Este archivo contiene funciones mockadas para la funcionalidad de Team
// En una implementación real, estas funciones harían llamadas HTTP a un backend

export interface TeamRoute {
  id: string;
  title: string;
  users: number;
  time: string;
  maxUsers: number;
  description?: string;
  meetingPoint?: string;
  createdBy?: string;
  isActive?: boolean;
}

export interface CreateGroupRequest {
  title: string;
  description?: string;
  maxUsers: number;
  departureTime: string;
  meetingPoint: string;
  routePoints?: Array<{lat: number, lng: number}>;
}

export interface JoinRouteRequest {
  routeId: string;
  userId: string;
}

// BACKEND NECESARIO:
// 1. GET /api/routes - Obtener todas las rutas disponibles
// 2. POST /api/routes - Crear una nueva ruta/grupo
// 3. POST /api/routes/:id/join - Unirse a una ruta existente
// 4. DELETE /api/routes/:id/leave - Salir de una ruta
// 5. GET /api/routes/:id/members - Obtener miembros de una ruta
// 6. PUT /api/routes/:id - Actualizar información de la ruta

class TeamService {
  // Obtener todas las rutas disponibles
  static async getRoutes(): Promise<TeamRoute[]> {
    // MOCK: En producción, esto sería una llamada HTTP
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Ruta Av. Universitaria - UCV',
            users: 5,
            time: '6:30 AM',
            maxUsers: 8,
            description: 'Ruta diaria compartida por Av. Universitaria hasta la UCV. Pasamos por principales paraderos y estaciones.',
            meetingPoint: 'Estación Metropolitano - Naranjal',
            createdBy: 'Carlos Mendoza',
            isActive: true,
          },
          {
            id: '2',
            title: 'Ruta San Martín - UCV',
            users: 5,
            time: '6:00 AM',
            maxUsers: 10,
            description: 'Ruta desde San Martín de Porres hacia la UCV. Recorrido directo y eficiente.',
            meetingPoint: 'Plaza de Armas de San Martín',
            createdBy: 'Ana García',
            isActive: true,
          },
          {
            id: '3',
            title: 'Ruta Los Proceres - UCV',
            users: 8,
            time: '5:00 AM',
            maxUsers: 12,
            description: 'Salida temprana desde Los Proceres. Ideal para quienes tienen clases de primera hora.',
            meetingPoint: 'Estación Los Proceres',
            createdBy: 'Luis Rodríguez',
            isActive: true,
          },
          {
            id: '4',
            title: 'Ruta Est. Naranjal - UCV',
            users: 10,
            time: '7:00 AM',
            maxUsers: 15,
            description: 'Ruta popular desde Estación Naranjal. Múltiples paradas en el camino hacia la universidad.',
            meetingPoint: 'Estación Naranjal - Entrada Principal',
            createdBy: 'María López',
            isActive: true,
          },
        ]);
      }, 500);
    });

    // Implementación real sería:
    // const response = await fetch('/api/routes');
    // return await response.json();
  }

  // Crear una nueva ruta/grupo
  static async createRoute(routeData: CreateGroupRequest): Promise<TeamRoute> {
    // MOCK: En producción, esto sería una llamada HTTP POST
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          title: routeData.title,
          users: 1, // El creador es el primer usuario
          time: routeData.departureTime,
          maxUsers: routeData.maxUsers,
          description: routeData.description,
          meetingPoint: routeData.meetingPoint,
          createdBy: 'Usuario Actual', // En producción sería el usuario autenticado
          isActive: true,
        });
      }, 800); // Simular tiempo más realista para crear
    });

    // Implementación real sería:
    // const response = await fetch('/api/routes', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(routeData),
    // });
    // return await response.json();
  }

  // Unirse a una ruta existente
  static async joinRoute(routeId: string, userId: string): Promise<boolean> {
    // MOCK: En producción, esto sería una llamada HTTP POST
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 800);
    });

    // Implementación real sería:
    // const response = await fetch(`/api/routes/${routeId}/join`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId }),
    // });
    // return response.ok;
  }

  // Obtener detalles de una ruta específica
  static async getRouteDetails(routeId: string): Promise<TeamRoute | null> {
    // MOCK: En producción, esto sería una llamada HTTP GET
    const allRoutes = await this.getRoutes();
    const route = allRoutes.find(r => r.id === routeId);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(route || null);
      }, 300);
    });

    // Implementación real sería:
    // const response = await fetch(`/api/routes/${routeId}`);
    // if (response.ok) {
    //   return await response.json();
    // }
    // return null;
  }

  // Salir de una ruta
  static async leaveRoute(routeId: string, userId: string): Promise<boolean> {
    // MOCK: En producción, esto sería una llamada HTTP DELETE
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });

    // Implementación real sería:
    // const response = await fetch(`/api/routes/${routeId}/leave`, {
    //   method: 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId }),
    // });
    // return response.ok;
  }
}

export default TeamService;