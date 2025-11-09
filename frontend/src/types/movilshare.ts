import { ImageSourcePropType } from 'react-native';

// Puertas del campus UCV Lima Norte
export type CampusGate = 'Puerta Principal' | 'Puerta 2' | 'Puerta 3';

// Tipo de movilidad disponible
export type VehicleType = 'bicycle' | 'scooter';

// Estado del préstamo
export type LoanStatus = 'available' | 'reserved' | 'in_use' | 'completed';

// Interfaz principal para préstamo de movilidad
export interface MovilShareUser {
  id: string;
  ownerId: string; // ID del usuario que presta
  ownerName: string; // Nombre del dueño
  avatar: ImageSourcePropType;
  
  // Información de la movilidad
  vehicleType: VehicleType;
  vehicleDescription?: string; // "Bicicleta MTB roja", "Scooter eléctrico negro"
  
  // Ubicación
  campusGate: CampusGate;
  
  // Horario - Simplificado
  returnTime: string; // Hora máxima de devolución "11:30 AM"
  // La bici está disponible desde que se crea el punto hasta returnTime
  
  // Coordinación de encuentro
  waitingTime: number; // Minutos de espera: 5, 10, 15
  arrivalInstructions?: string; // "Bajo del 3er piso, esperarme"
  
  // Estado y condiciones
  status: LoanStatus;
  requirements?: string; // "Traer candado"
  
  // Datos adicionales
  createdAt: Date;
  isNew?: boolean;
}

// Interfaz para crear un nuevo punto de préstamo
export interface CreateLoanRequest {
  vehicleType: VehicleType;
  vehicleDescription?: string;
  campusGate: CampusGate;
  returnTime: string; // Solo hora de devolución
  waitingTime: number; // 5, 10, 15 minutos
  arrivalInstructions?: string;
  requirements?: string;
}

// Interfaz para solicitar préstamo
export interface LoanRequest {
  id: string;
  loanId: string; // ID del préstamo
  requesterId: string; // ID del solicitante
  requesterName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  message?: string;
}

// Interfaz para detalles completos del préstamo
export interface LoanDetails extends MovilShareUser {
  ownerPhone?: string;
  ownerEmail?: string;
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