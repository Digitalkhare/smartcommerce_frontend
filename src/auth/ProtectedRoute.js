import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user)
    // Pass along the page the user was trying to visit
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (role && !user.roles?.includes(`ROLE_${role}`)) {
    return <div className="text-center mt-5">🚫 Forbidden</div>;
  }

  return children;
};

export default ProtectedRoute;
