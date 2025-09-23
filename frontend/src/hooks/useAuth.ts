import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { user, login, logout } = useAuthContext();
  return { user, login, logout };
};
