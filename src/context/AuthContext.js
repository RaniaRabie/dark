// src/context/AuthContext.js

import React, { createContext, useContext, useState } from "react";
import { clearTokens, getUser, setUser } from "services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setAuthUser] = useState(getUser());

  const login = (userData) => {
    setAuthUser(userData); 
    setUser(userData)
  };

  const logout = () => {
    setUser(null);
    clearTokens()
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
