import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/url";
import type {  AuthContextType, AuthProviderProps } from "../lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔹 global token for axios
let accessTokenGlobal: string | null = null;

export const setAccessTokenGlobal = (token: string | null) => {
  accessTokenGlobal = token;
};

export const getAccessToken = () => accessTokenGlobal;

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(accessToken)

  const updateAccessToken = (token: string | null) => {
    setAccessToken(token);
    setAccessTokenGlobal(token);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        console.log("🔄 Checking session...");
        const res = await api.post("/auth/refresh");
        updateAccessToken(res.data.accessToken);
      } catch {
        updateAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken: updateAccessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};