import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (isAuthenticated === null) {
    return <div>Not authenticated: Loading...</div>;
  }
  
  if (!isAuthenticated) {
    // Redirect to the login page but save the current location
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return children;
}

export default RequireAuth;