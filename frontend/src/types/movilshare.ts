import { ImageSourcePropType } from 'react-native';

export interface MovilShareUser {
  id: string;
  name: string;
  location: string;
  time: string;
  avatar: ImageSourcePropType;
}

// TODO: Cuando se implemente el backend, este interface debería reflejar 
// la estructura de datos real que viene del servidor
export interface MovilShareResponse {
  users: MovilShareUser[];
  totalUsers: number;
  lastUpdated: string;
}

// TODO: Interface para crear un nuevo punto de encuentro
export interface CreateMeetingPoint {
  location: string;
  time: string;
  maxParticipants?: number;
  description?: string;
}