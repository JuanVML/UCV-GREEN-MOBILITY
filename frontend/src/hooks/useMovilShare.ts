import { useState, useEffect } from 'react';
import { MovilShareUser } from '../types/movilshare';

// TODO: Reemplazar con datos reales del backend
const mockUsers: MovilShareUser[] = [
  {
    id: '1',
    name: 'Fabrizzio Medina',
    location: 'Puerta Principal',
    time: '7:30 am',
    avatar: require('../../assets/images/avatar.png')
  },
  {
    id: '2',
    name: 'Alberth Lopez', 
    location: 'Puerta 2',
    time: '7:30 am',
    avatar: require('../../assets/images/avatar.png')
  },
  {
    id: '3',
    name: 'Juan Muños',
    location: 'Puerta Principal',
    time: '12:30 pm',
    avatar: require('../../assets/images/avatar.png')
  },
  {
    id: '4',
    name: 'Rony Guanachin',
    location: 'Puerta 3',
    time: '1:30 pm',
    avatar: require('../../assets/images/avatar.png')
  }
];

export const useMovilShare = () => {
  const [users, setUsers] = useState<MovilShareUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simular carga de datos
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        // TODO: Reemplazar con llamada real a la API
        // const response = await api.getMovilShareUsers();
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUsers(mockUsers);
        setError(null);
      } catch (err) {
        setError('Error al cargar los usuarios');
        console.error('Error loading MovilShare users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const refreshUsers = async () => {
    // TODO: Implementar refresh real de datos
    console.log('Refreshing MovilShare users...');
  };

  const createMeetingPoint = async (location: string, time: string) => {
    // TODO: Implementar creación de punto de encuentro
    console.log('Creating meeting point:', { location, time });
  };

  const joinUser = async (userId: string) => {
    // TODO: Implementar unirse a un usuario
    console.log('Joining user:', userId);
  };

  return {
    users,
    isLoading,
    error,
    refreshUsers,
    createMeetingPoint,
    joinUser,
  };
};