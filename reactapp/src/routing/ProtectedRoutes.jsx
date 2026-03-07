import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Use .toLowerCase() to avoid "Manager" vs "manager" mismatch
  const role = localStorage.getItem("userRole")?.toLowerCase();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Ensure allowedRoles is compared against the lowercase role
  if (!allowedRoles.map(r => r.toLowerCase()).includes(role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;