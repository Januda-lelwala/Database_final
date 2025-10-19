import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/auth.service';

// Mock the auth service
jest.mock('../../services/auth.service');

describe('AuthContext - JWT Token Storage', () => {
  // Setup wrapper for hooks
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
    // Clear console errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('Admin Login - Token Storage', () => {
    it('should save JWT token to localStorage on successful admin login', async () => {
      const mockAdminResponse = {
        data: {
          token: 'admin-jwt-token-12345',
          admin: {
            admin_id: 'ADM001',
            name: 'John Admin',
            email: 'admin@kandypack.com'
          }
        }
      };

      authService.admin.login.mockResolvedValue(mockAdminResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Perform login
      await act(async () => {
        await result.current.login('ADM001', 'password123', 'admin');
      });

      // Verify token is saved in localStorage
      const savedToken = localStorage.getItem('authToken');
      expect(savedToken).toBe('admin-jwt-token-12345');

      // Verify user data is saved
      const savedUser = JSON.parse(localStorage.getItem('user'));
      expect(savedUser).toEqual({
        admin_id: 'ADM001',
        name: 'John Admin',
        email: 'admin@kandypack.com',
        role: 'admin',
        portalType: 'employee'
      });

      // Verify auth service was called correctly
      expect(authService.admin.login).toHaveBeenCalledWith({
        admin_id: 'ADM001',
        password: 'password123'
      });
    });

    it('should handle nested token path (response.data.data.token)', async () => {
      const mockResponse = {
        data: {
          data: {
            token: 'nested-jwt-token',
            admin: {
              admin_id: 'ADM002',
              name: 'Jane Admin'
            }
          }
        }
      };

      authService.admin.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('ADM002', 'password', 'admin');
      });

      const savedToken = localStorage.getItem('authToken');
      expect(savedToken).toBe('nested-jwt-token');
    });

    it('should throw error when no token is received', async () => {
      const mockResponseNoToken = {
        data: {
          admin: {
            admin_id: 'ADM003',
            name: 'Admin Without Token'
          }
          // No token field
        }
      };

      authService.admin.login.mockResolvedValue(mockResponseNoToken);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.login('ADM003', 'password', 'admin');
        })
      ).rejects.toThrow('No token received from server');

      // Verify token is NOT saved when missing
      expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('should update auth state with isAdmin flag', async () => {
      const mockResponse = {
        data: {
          token: 'admin-token',
          admin: {
            admin_id: 'ADM004',
            name: 'Admin User'
          }
        }
      };

      authService.admin.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('ADM004', 'password', 'admin');
      });

      // Verify auth flags
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isCustomer).toBe(false);
      expect(result.current.isDriver).toBe(false);
      expect(result.current.isAssistant).toBe(false);
      expect(result.current.isEmployee).toBe(true);
      expect(result.current.portalType).toBe('employee');
    });

    it('should handle authentication errors without saving token', async () => {
      const mockError = new Error('Invalid credentials');
      authService.admin.login.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.login('WRONG_ID', 'wrong_pass', 'admin');
        })
      ).rejects.toThrow();

      // Verify no token is saved on error
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Driver Login - Token Storage', () => {
    it('should save JWT token for driver login', async () => {
      const mockResponse = {
        data: {
          token: 'driver-jwt-token',
          driver: {
            driver_id: 'DRV001',
            name: 'John Driver'
          }
        }
      };

      authService.driver.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('DRV001', 'password', 'driver');
      });

      expect(localStorage.getItem('authToken')).toBe('driver-jwt-token');
      expect(result.current.isDriver).toBe(true);
      expect(result.current.isEmployee).toBe(true);
    });
  });

  describe('Assistant Login - Token Storage', () => {
    it('should save JWT token for assistant login', async () => {
      const mockResponse = {
        data: {
          token: 'assistant-jwt-token',
          assistant: {
            assistant_id: 'AST001',
            name: 'Jane Assistant'
          }
        }
      };

      authService.assistant.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('AST001', 'password', 'assistant');
      });

      expect(localStorage.getItem('authToken')).toBe('assistant-jwt-token');
      expect(result.current.isAssistant).toBe(true);
      expect(result.current.isEmployee).toBe(true);
    });
  });

  describe('Customer Login - Token Storage', () => {
    it('should save JWT token for customer login', async () => {
      const mockResponse = {
        data: {
          user: {
            customer_id: 'CUST001',
            name: 'John Customer',
            email: 'customer@example.com'
          },
          token: 'customer-jwt-token'
        }
      };

      authService.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('customer@example.com', 'password', 'customer');
      });

      expect(localStorage.getItem('authToken')).toBe('customer-jwt-token');
      expect(result.current.isCustomer).toBe(true);
      expect(result.current.isEmployee).toBe(false);
      expect(result.current.portalType).toBe('customer');
    });
  });

  describe('Logout - Token Removal', () => {
    it('should remove JWT token from localStorage on logout', async () => {
      // First, set up a logged-in state
      const mockResponse = {
        data: {
          token: 'admin-token-to-remove',
          admin: {
            admin_id: 'ADM005',
            name: 'Admin To Logout'
          }
        }
      };

      authService.admin.login.mockResolvedValue(mockResponse);
      authService.logout.mockResolvedValue();

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Login first
      await act(async () => {
        await result.current.login('ADM005', 'password', 'admin');
      });

      expect(localStorage.getItem('authToken')).toBe('admin-token-to-remove');
      expect(result.current.isAuthenticated).toBe(true);

      // Now logout
      await act(async () => {
        await result.current.logout();
      });

      // Verify token is removed
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('Token Restoration on App Load', () => {
    it('should restore user from localStorage on initialization', async () => {
      // Pre-populate localStorage
      const storedToken = 'existing-jwt-token';
      const storedUser = {
        admin_id: 'ADM006',
        name: 'Persisted Admin',
        role: 'admin',
        portalType: 'employee'
      };

      localStorage.setItem('authToken', storedToken);
      localStorage.setItem('user', JSON.stringify(storedUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify user is restored
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(storedUser);
      expect(result.current.isAdmin).toBe(true);
    });

    it('should clear invalid user data from localStorage', async () => {
      localStorage.setItem('authToken', 'invalid-token');
      localStorage.setItem('user', 'invalid-json');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify invalid data is cleared
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
