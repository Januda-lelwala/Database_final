import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Employee Portal Components
import Admin from './Admin_Page/Admin.js';
import DriverDashboard from './Driver_Page/DriverDashboard.js';
import AssistantDashboard from './Assistant_Page/AssistantDashboard.js';
import EmployeeProfile from './EmployeeProfile';
import EmployeeSettings from './EmployeeSettings';
import PasswordChangeModal from '../../components/PasswordChangeModal';


const getNonEmployeeRedirect = (user) => {
  if (user?.portalType === 'customer') {
    return '/customer';
  }
  if (user?.portalType === 'employee') {
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
  return '/login/employee';
};

const EmployeePortalRouter = () => {
  const { user, isEmployee, isAdmin, isDriver, isAssistant, loading, changePassword } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [passwordChangeError, setPasswordChangeError] = useState(null);

  // Check if user needs to change password on mount and when user changes
  useEffect(() => {
    if (!loading && user && (isDriver || isAssistant)) {
      // Show modal if must_change_password is true
      if (user.must_change_password === true) {
        setShowPasswordModal(true);
      }
    }
  }, [user, loading, isDriver, isAssistant]);

  const handlePasswordChange = async (passwordData) => {
    try {
      setPasswordChangeError(null);
      await changePassword(passwordData);
      setShowPasswordModal(false);
      alert('Password changed successfully! You can now access the system.');
    } catch (error) {
      setPasswordChangeError(error.message || 'Failed to change password');
      throw error; // Re-throw so modal can show error
    }
  };

  // Show loading screen while authentication state is being restored
  if (loading) {
    return (
      <div className="loading-screen" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#667eea'
      }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Redirect non-employees to their appropriate home instead of a login loop
  if (!isEmployee) {
    const redirectPath = getNonEmployeeRedirect(user);
    return <Navigate to={redirectPath} replace />;
  }

  const getDashboardComponent = () => {
    if (isAdmin) return <Admin />;
    if (isDriver) return <DriverDashboard />;
    if (isAssistant) return <AssistantDashboard />;
    return <Navigate to="/login" replace />;
  };

  return (
      <>
        <div className="employee-portal">
          <Routes>
            {/* Ensure base path redirects to the correct dashboard route so nested routing works */}
            <Route
              path="/"
              element={
                isAdmin ? (
                  <Admin />
                ) : isDriver ? (
                  <Navigate to="/employee/driver" replace />
                ) : isAssistant ? (
                  <Navigate to="/employee/assistant" replace />
                ) : (
                  <Navigate to="/login/employee" replace />
                )
              }
            />
            <Route path="/profile" element={<EmployeeProfile />} />
            <Route path="/settings" element={<EmployeeSettings />} />
          
            {/* Admin-specific routes */}
            {isAdmin && (
              <>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/*" element={<Admin />} />
              </>
            )}
          
            {/* Driver-specific routes */}
            {isDriver && (
              <>
                {/* Allow nested driver routes like /employee/driver/overview */}
                <Route path="/driver/*" element={<DriverDashboard />} />
              </>
            )}
          
            {/* Assistant-specific routes */}
            {isAssistant && (
              <>
                {/* Support nested assistant routes if needed */}
                <Route path="/assistant/*" element={<AssistantDashboard />} />
              </>
            )}
          
            <Route path="*" element={<Navigate to="/employee" replace />} />
          </Routes>
        </div>

        {/* Password Change Modal - Only for drivers/assistants on first login */}
        {(isDriver || isAssistant) && (
          <PasswordChangeModal
            isOpen={showPasswordModal}
            onClose={() => {}} // Cannot close - must change password
            onSubmit={handlePasswordChange}
            userRole={user?.role}
            userName={user?.user_name}
          />
        )}
      </>
  );
};

export default EmployeePortalRouter;
