import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleRequiresEmployeePortal = (role) => {
  if (!role) return false;
  return ['admin', 'driver', 'assistant'].includes(role);
};

const resolvePortalHome = (user) => {
  if (!user) return '/login';
  if (user.portalType === 'customer') {
    return '/customer';
  }
  if (user.portalType === 'employee') {
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'driver':
        return '/employee/driver';
      case 'assistant':
        return '/employee/assistant';
      default:
        return '/employee';
    }
  }
  return '/login';
};

const ProtectedRoute = ({ children, requiredRole = null, requiredPortal = null }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  const loginPath = (() => {
    if (requiredPortal === 'employee' || roleRequiresEmployeePortal(requiredRole)) {
      return '/login/employee';
    }
    if (requiredPortal === 'customer') {
      return '/login/customer';
    }
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/employee')) {
      return '/login/employee';
    }
    return '/login/customer';
  })();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check portal access
  if (requiredPortal) {
    if (user.portalType !== requiredPortal) {
      const fallback = resolvePortalHome(user);
      return <Navigate to={fallback} replace />;
    }
  }

  // Check role access
  if (requiredRole) {
    if (user.role !== requiredRole) {
      const fallback = resolvePortalHome(user);
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
