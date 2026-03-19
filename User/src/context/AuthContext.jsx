// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = (userData, token) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error("useAuth must be used within an AuthProvider");
// //   }
// //   return context;
// // };

// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext(undefined);

// Provider component – wrap your entire app with this
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setUser(null);
    setToken(null);
  };

  // Login function – called after successful API login
const login = (userData, authToken) => {
  const { id, role, username, email } = userData;

  const storedUser = { id, role, username, email }; // ensure role is included
  localStorage.setItem("token", authToken);
  localStorage.setItem("user", JSON.stringify(storedUser));
  localStorage.setItem("role", role);

  setUser(storedUser);
  setToken(authToken);
};

  // Load user from localStorage + validate token on mount
  useEffect(() => {
    const loadAuth = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        } catch (err) {
          console.error("Failed to parse stored user:", err);
          logout(); // Clear invalid data
        }
      }
      setIsLoading(false);
    };

    loadAuth();
  }, []);

  // Optional: Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook – throws error if used outside provider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
