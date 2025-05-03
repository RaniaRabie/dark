/*
- File Name: ProtectedRoute.js
- Author: Rania Rabie
- Date of Creation: 20/11/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  react-router-dom,
  }
- Contributors: shrouk ahmed, Nour Khaled, Rania Rabie
- Last Modified Date: 10/12/2024
- Description : determine authorized users
*/
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";


const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Default role to "Student" if not specified
  const role = user?.role || "Student";

  // Check if the user's role is allowed
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
