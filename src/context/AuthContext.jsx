import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // Login function
  const login = (userData) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");

    setUser(userData);
    setIsLoggedIn(true);

    window.dispatchEvent(new Event("userLogin"));
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");

    setUser(null);
    setIsLoggedIn(false);

    window.dispatchEvent(new Event("userLogout"));
  };

  // Update current user
  const updateCurrentUser = (updatedData) => {
    const updated = { ...user, ...updatedData };
    localStorage.setItem("currentUser", JSON.stringify(updated));
    setUser(updated);
  };

  // Sync authentication state across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("currentUser");
      const savedLoginStatus = localStorage.getItem("isLoggedIn");

      if (savedUser && savedLoginStatus === "true") {
        try {
          setUser(JSON.parse(savedUser));
          setIsLoggedIn(true);
        } catch {
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
