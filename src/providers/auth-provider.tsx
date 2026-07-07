"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/authService";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loginGlobal: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    return typeof window !== "undefined" && !!localStorage.getItem("token");
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      authService.getMe()
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false); 
        });
    }
  }, []);

  const loginGlobal = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loginGlobal, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
