import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

/*
  ProtectedRoute
  - Props:
    - children
    - roles: array of allowed roles (e.g. ['admin','editor'])
  - Behavior:
    - While auth.loading is true, returns null (you can replace with spinner)
    - If not authenticated redirects to /login
    - If authenticated but not authorized redirects to "/" and shows a toast
*/

export default function ProtectedRoute({ children, roles = [] }) {
  const auth = useAuth();

  if (auth.loading) return null; // or return a spinner

  if (!auth.user) {
    // Not authenticated -> redirect to login
    toast.info("Inicia sesión para acceder a esta página", { toastId: "protected-login" });
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0) {
    const ok = roles.includes(auth.user.role) || (Array.isArray(auth.user.roles) && auth.user.roles.some(r => roles.includes(r)));
    if (!ok) {
      toast.error("No tienes permisos para ver esta sección", { toastId: "protected-denied" });
      return <Navigate to="/" replace />;
    }
  }

  return children;
}