import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { handleAPIError } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, role: 'customer'|'admin'|'driver'|'assistant', portalType: 'customer'|'employee' }
  const [loading, setLoading] = useState(true);

  // Lightweight JWT payload decoder (no verification, just base64url decode)
  const decodeJwt = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(base64).split('').map(c => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Restore user from localStorage
          let parsed = JSON.parse(savedUser);
          const payload = decodeJwt(token);
          console.log('[AuthContext:init] restored user from storage:', parsed);
          console.log('[AuthContext:init] decoded token payload:', payload);
          // If role is missing, infer from token
          if (!parsed?.role && payload?.role) {
            parsed = { ...parsed, role: payload.role };
          }
          // If portalType missing, infer
          if (!parsed?.portalType && parsed?.role) {
            parsed = { ...parsed, portalType: parsed.role === 'customer' ? 'customer' : 'employee' };
          }
          // Repair missing customer_id for customer role using token payload id
          if (parsed?.role === 'customer' && !parsed?.customer_id && payload) {
            const cid = payload?.id || payload?.customer_id;
            if (cid) {
              parsed = { ...parsed, customer_id: cid };
            }
          }
          // Persist repaired user if changed
          localStorage.setItem('user', JSON.stringify(parsed));
          console.log('[AuthContext:init] final restored user:', parsed);
          setUser(parsed);
        } catch (error) {
          console.error('User restore failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password, role, portalType = 'auto') => {
    try {
      let response;
      let credentials;
      // Route to appropriate login endpoint based on role with correct credential format
      switch (role) {
        case 'admin':
          credentials = { admin_id: username, password };
          response = await authService.admin.login(credentials);
          break;
        case 'driver':
          credentials = { user_name: username, password };
          response = await authService.driver.login(credentials);
          break;
        case 'assistant':
          credentials = { user_name: username, password };
          response = await authService.assistant.login(credentials);
          break;
        case 'customer':
        default:
          credentials = { user_name: username, password };
          response = await authService.login(credentials);
          break;
      }
      // Normalize backend payloads
      const root = response?.data || response; // authService returns response.data
      const data = root?.data || root; // inner data if present, else root
      const token = root?.data?.token || root?.token || data?.token;
      // Extract user block from all known shapes
      let userData =
        data?.admin ||
        data?.customer ||
        data?.driver ||
        data?.assistant ||
        data?.user ||
        root?.customer ||
        root?.admin ||
        root?.driver ||
        root?.assistant ||
        root?.user ||
        data;
      // Defensive: ensure customer_id exists for customer role
      if (role === 'customer' && (!userData || !userData.customer_id)) {
        const cid =
          (userData && (userData.customer_id || userData.id || userData.user_id || userData.customerId || userData.customerID)) ||
          data?.customer_id ||
          root?.customer_id;
        userData = { ...(userData || {}), customer_id: cid };
      }
      // Determine portal type based on role if not specified
      const finalPortalType = portalType === 'auto' 
        ? (role === 'customer' ? 'customer' : 'employee')
        : portalType;
      
        // Extract must_change_password flag from response (for drivers/assistants)
        const mustChangePassword = root?.must_change_password || data?.must_change_password || userData?.must_change_password;
      
        const userWithPortal = { 
          ...userData, 
          role, 
          portalType: finalPortalType,
          ...(mustChangePassword !== undefined && { must_change_password: mustChangePassword })
        };
      
  console.log('[AuthContext:login] normalized user:', userWithPortal);
  console.log('[AuthContext:login] token present:', !!token);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithPortal));
      setUser(userWithPortal);
      return userWithPortal;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  const register = async (userData, portalType = 'customer') => {
    try {
      const response = await authService.register(userData);
      const root = response?.data || response;
      const data = root?.data || root;
      const token = root?.data?.token || root?.token || data?.token;
      let newUser = data?.customer || root?.customer || data?.user || root?.user || data;
      // Defensive: ensure customer_id is present
      if (!newUser?.customer_id) {
        const cid =
          newUser?.customer_id ||
          newUser?.id ||
          newUser?.user_id ||
          newUser?.customerId ||
          newUser?.customerID ||
          data?.customer_id ||
          root?.customer_id;
        newUser = { ...newUser, customer_id: cid };
      }
  const userWithPortal = { ...newUser, role: 'customer', portalType: 'customer' };
  console.log('[AuthContext:register] normalized user:', userWithPortal);
  console.log('[AuthContext:register] token present:', !!token);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithPortal));
      setUser(userWithPortal);
      return userWithPortal;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const changePassword = useCallback(async (passwordData) => {
    try {
      if (!user || !user.role) {
        throw new Error('User not authenticated');
      }

      let response;
      const userId = user.driver_id || user.assistant_id || user.id || user.user_id;
      if (!userId) {
        throw new Error('User identifier not found');
      }

      // Route to appropriate password change endpoint based on role
      switch (user.role) {
        case 'driver':
          response = await authService.driver.changePassword(userId, passwordData);
          break;
        case 'assistant':
          response = await authService.assistant.changePassword(userId, passwordData);
          break;
        default:
          throw new Error(`Password change not supported for role: ${user.role}`);
      }

      // Update user data in state and localStorage
      const updatedUser = { 
        ...user, 
        must_change_password: false,
        // Update username if it was changed
        user_name: passwordData.new_user_name || user.user_name
      };
    
      console.log('[AuthContext:changePassword] updated user:', updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    
      return response;
    } catch (error) {
      console.error('[AuthContext:changePassword] error:', error);
      throw new Error(handleAPIError(error));
    }
  }, [user]);

  const value = useMemo(() => ({ 
    user, 
    loading, 
    login, 
    register,
    logout,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    isDriver: user?.role === 'driver',
    isAssistant: user?.role === 'assistant',
    isEmployee: user?.portalType === 'employee',
    portalType: user?.portalType || null
  }), [user, loading, changePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
