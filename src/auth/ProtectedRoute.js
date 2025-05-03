import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth(); // ✅ add loading state
  const location = useLocation();

  if (loading) {
    return (
      <div className="text-center mt-5">🔄 Checking authentication...</div>
    );
  }

  if (!user) {
    // Preserve location user tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && !user.roles?.includes(`ROLE_${role}`)) {
    return (
      <div className="text-center mt-5">
        🚫 Forbidden: Insufficient permissions
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
