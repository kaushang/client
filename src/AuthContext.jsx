import React, { createContext, useState, useContext, useEffect } from "react";

// Create the auth context
export const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null for loading state
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Optional: Verify token with your backend
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token, userData = null) => {
    // Store token and update auth state
    localStorage.setItem("token", token);
    setIsAuthenticated(true);

    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    // Remove token and update auth state
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Auth context value
  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
