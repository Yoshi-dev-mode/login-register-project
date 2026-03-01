import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"
import type { AuthProviderProps } from "../lib/types";

export default function ProtectedRoute({ children }: AuthProviderProps) {
    const { accessToken, loading } = useAuth();

    // Crucial for refreshing the website
    if (loading) return <p>Loading...</p>;
    
    if (!accessToken) return <Navigate to="/login" />;
    return children
}
