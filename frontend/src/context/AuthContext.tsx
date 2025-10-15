import React, { createContext, useContext, useState, ReactNode } from "react";
import { loginWithEmail, registerUser } from "../../../backend/functions/src/auth/authController";
import { auth, db } from "../api/firebase";

type User = {
  name: string;
  email: string;
  photoUrl?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const result = await loginWithEmail(email, password);
    if (result.success && result.user && result.user.email) {
      setUser({
        name: result.user.displayName ?? "Usuario",
        email: result.user.email ?? "",
      });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};
