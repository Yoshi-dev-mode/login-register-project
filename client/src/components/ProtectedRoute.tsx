import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"

export default function ProtectedRoute({ children }) {
    const { accessToken, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    if (!accessToken) return <Navigate to="/login" />;
    return children
}
