"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type AuthState = {
  token: string;
  deviceId: string;
  doctorName: string;
} | null;

type AuthContextType = {
  auth: AuthState;
  setAuth: (auth: AuthState) => void;
  logout: () => void;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthState>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("labass_auth");
    return saved ? JSON.parse(saved) : null;
  });

  const setAuth = useCallback((newAuth: AuthState) => {
    setAuthState(newAuth);
    if (newAuth) {
      localStorage.setItem("labass_auth", JSON.stringify(newAuth));
    } else {
      localStorage.removeItem("labass_auth");
    }
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
  }, [setAuth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, isLoggedIn: !!auth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

