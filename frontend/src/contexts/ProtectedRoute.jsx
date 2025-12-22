import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";
import React from "react";

function ProtectedRoute({ children }) {
    
    const { authUser } = useAuthStore();
    if (!authUser) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;
