import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requiredPortal = null }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login based on path
    const loginPath = location.pathname.startsWith('/employee') 
      ? '/employee/login' 
      : '/customer/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check portal access
  if (requiredPortal) {
    if (user.portalType !== requiredPortal) {
      // Redirect to correct portal
      const redirectPath = requiredPortal === 'customer' ? '/customer' : '/employee';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Check role access
  if (requiredRole) {
    if (user.role !== requiredRole) {
      // Redirect based on user's portal type
      const redirectPath = user.portalType === 'customer' ? '/customer' : '/employee';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;