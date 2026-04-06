import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-lg text-primary"></div>
          <p className="text-sm font-bold text-primary animate-pulse tracking-widest uppercase">Securing Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the attempted path
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Role not authorized
    return <Navigate to="/system/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
