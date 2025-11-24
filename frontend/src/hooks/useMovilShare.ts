import { useState, useEffect } from 'react';
import { MovilShareUser, CreateLoanRequest, LoanDetails } from '../types/movilshare';

// TODO: Reemplazar con datos reales del backend
const mockLoans: MovilShareUser[] = [
  {
    id: '1',
    ownerId: 'user1',
    ownerName: 'Fabrizzio Medina',
    avatar: { uri: 'https://avatars.dicebear.com/api/identicon/ucv-user.png' },
    vehicleType: 'bicycle',
    vehicleDescription: 'Bicicleta MTB roja en buen estado',
    campusGate: 'Puerta Principal',
    returnTime: '11:30 AM',
    waitingTime: 5,
    arrivalInstructions: 'Bajo del 3er piso, esperarme unos minutos',
    status: 'available',
    requirements: 'Traer candado propio',
    createdAt: new Date(),
  },
  {
    id: '2',
    ownerId: 'user2',
    ownerName: 'Alberth Lopez',
    avatar: { uri: 'https://avatars.dicebear.com/api/identicon/ucv-user.png' },
    vehicleType: 'scooter',
    vehicleDescription: 'Scooter eléctrico negro Xiaomi',
    campusGate: 'Puerta 2',
    returnTime: '12:30 PM',
    waitingTime: 10,
    status: 'available',
    requirements: 'Devolver con batería cargada',
    createdAt: new Date(),
  },
  {
    id: '3',
    ownerId: 'user3',
    ownerName: 'Juan Muños',
    avatar: { uri: 'https://avatars.dicebear.com/api/identicon/ucv-user.png' },
    vehicleType: 'bicycle',
    vehicleDescription: 'Bicicleta de paseo azul',
    campusGate: 'Puerta Principal',
    returnTime: '4:30 PM',
    waitingTime: 5,
    arrivalInstructions: 'Salgo de laboratorio, esperarme máximo 10 min',
    status: 'available',
    createdAt: new Date(),
  },
  {
    id: '4',
    ownerId: 'user4',
    ownerName: 'Rony Guanachin',
    avatar: { uri: 'https://avatars.dicebear.com/api/identicon/ucv-user.png' },
    vehicleType: 'scooter',
    campusGate: 'Puerta 3',
    returnTime: '5:30 PM',
    waitingTime: 15,
    status: 'reserved',
    createdAt: new Date(),
  },
];

export const useMovilShare = () => {
  const [loans, setLoans] = useState<MovilShareUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular carga de datos
  useEffect(() => {
    const loadLoans = async () => {
      try {
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLoans(mockLoans);
        setError(null);
      } catch (err) {
        setError('Error al cargar los préstamos');
        console.error('Error loading MovilShare loans:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLoans();
  }, []);

  const refreshLoans = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoans(mockLoans);
    setIsLoading(false);
  };

  const createLoan = async (loanData: CreateLoanRequest): Promise<boolean> => {
    try {
      setIsCreating(true);

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLoan: MovilShareUser = {
        id: `loan_${Date.now()}`,
        ownerId: 'current_user',
        ownerName: 'Tú',
        avatar: { uri: 'https://avatars.dicebear.com/api/identicon/ucv-user.png' },
        ...loanData,
        status: 'available',
        createdAt: new Date(),
        isNew: true,
      };

      setLoans(prevLoans => [newLoan, ...prevLoans]);

      // Quitar marca de nuevo
      setTimeout(() => {
        setLoans(prevLoans =>
          prevLoans.map(loan =>
            loan.id === newLoan.id ? { ...loan, isNew: false } : loan
          )
        );
      }, 5000);
      
      return true;
    } catch (err) {
      console.error('Error creating loan:', err);
      setError('Error al crear el préstamo');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const getLoanDetails = async (loanId: string): Promise<LoanDetails | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const loan = loans.find(l => l.id === loanId);
      if (!loan) return null;

      const details: LoanDetails = {
        ...loan,
        ownerPhone: '+51 999 888 777',
        ownerEmail: 'usuario@ucv.edu.pe',
      };
      
      return details;
    } catch (err) {
      console.error('Error getting loan details:', err);
      return null;
    }
  };

  const requestLoan = async (loanId: string): Promise<boolean> => {
    try {
      setIsRequesting(true);

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoans(prevLoans =>
        prevLoans.map(loan =>
          loan.id === loanId ? { ...loan, status: 'reserved' } : loan
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error requesting loan:', err);
      setError('Error al solicitar el préstamo');
      return false;
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    loans,
    isLoading,
    isCreating,
    isRequesting,
    error,
    refreshLoans,
    createLoan,
    getLoanDetails,
    requestLoan,
  };
};
