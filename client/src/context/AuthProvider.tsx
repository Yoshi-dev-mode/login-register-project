import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/url";

const AuthContext = createContext(null);

// 🔹 global token for axios
let accessTokenGlobal = null;

export const setAccessTokenGlobal = (token) => {
  accessTokenGlobal = token;
};

export const getAccessToken = () => accessTokenGlobal;

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(accessToken)

  const updateAccessToken = (token) => {
    setAccessToken(token);
    setAccessTokenGlobal(token);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        console.log("🔄 Checking session...");
        const res = await api.post("/refresh");
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

export const useAuth = () => useContext(AuthContext);
