// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// simplified wrapper using context
// props: children + roles (array of allowed roles)
export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    // Only redirect non-admins away from admin routes
    if (roles.includes("admin") && user.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    // For other role mismatches, redirect to appropriate dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
