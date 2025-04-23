// // AuthContext.js
// import React, { createContext, useContext, useState } from "react";

// // @ts-ignore
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
  
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const token = localStorage.getItem("accessToken");
//   const refreshToken = localStorage.getItem("refreshToken");

//   const login = (userData) => {
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };


//   const userId = user?.id;


//   return (
//     <AuthContext.Provider value={{ user,userId, token,refreshToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);











import React, { createContext, useContext, useState, useCallback } from "react";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(getAccessToken());
  const [refreshToken, setRefreshTokenState] = useState(getRefreshToken());

  const login = useCallback((userData, accessToken, refreshToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setAccessToken(accessToken); // Use auth.js to store token
    setRefreshToken(refreshToken); // Use auth.js to store refresh token
    setUser(userData);
    setToken(accessToken);
    setRefreshTokenState(refreshToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    clearTokens(); // Clear tokens using auth.js
    setUser(null);
    setToken(null);
    setRefreshTokenState(null);
    window.location.href = "/regesteration"; // Optional: Redirect to login
  }, []);

  // Optional: Function to update tokens after refresh (called by auth.js if needed)
  const updateTokens = useCallback((newAccessToken, newRefreshToken) => {
    setToken(newAccessToken);
    if (newRefreshToken) {
      setRefreshTokenState(newRefreshToken);
    }
  }, []);

  const userId = user?.id;

  return (
    <AuthContext.Provider
      value={{ user, userId, token, refreshToken, login, logout, updateTokens }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);