// src/context/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

type UserData = {
  name: string;
  email: string;
  avatar: string | null;
};

type UserContextType = {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  updateAvatar: (uri: string) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  updateAvatar: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  const updateAvatar = (uri: string) => {
    if (user) setUser({ ...user, avatar: uri });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
