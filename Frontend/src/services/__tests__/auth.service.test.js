import { authService } from '../auth.service';
import api from '../api';

// Mock the api module
jest.mock('../api');

describe('Auth Service - JWT Token Validation', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  describe('Admin Login - JWT Token Response', () => {
    it('should receive JWT token from backend on successful admin login', async () => {
      // Mock backend response with token
      const mockResponse = {
        data: {
          success: true,
          data: {
            admin: {
              admin_id: 'ADM001',
              name: 'John Admin',
              email: 'admin@kandypack.com'
            },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6IkFETTAwMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYzMjg1MDAwMH0.test-signature'
          }
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const credentials = {
        admin_id: 'ADM001',
        password: 'admin123'
      };

      // Call admin login
      const result = await authService.admin.login(credentials);

      // Verify API was called with correct endpoint and credentials
      expect(api.post).toHaveBeenCalledWith('/auth/admin/login', credentials);
      expect(api.post).toHaveBeenCalledTimes(1);

      // Verify token is in response
      expect(result.data.token).toBeDefined();
      expect(result.data.token).toBe(mockResponse.data.data.token);
      expect(typeof result.data.token).toBe('string');
      expect(result.data.token.length).toBeGreaterThan(0);
    });

    it('should handle token in response.data.token format', async () => {
      const mockResponse = {
        data: {
          token: 'jwt-token-format-1',
          admin: {
            admin_id: 'ADM001',
            name: 'John Admin'
          }
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.admin.login({
        admin_id: 'ADM001',
        password: 'password'
      });

      expect(result.data.token).toBe('jwt-token-format-1');
    });

    it('should handle token in response.token format (legacy)', async () => {
      const mockResponse = {
        token: 'jwt-token-legacy-format',
        admin: {
          admin_id: 'ADM001',
          name: 'John Admin'
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.admin.login({
        admin_id: 'ADM001',
        password: 'password'
      });

      expect(result.token).toBe('jwt-token-legacy-format');
    });

    it('should throw error when token is missing from response', async () => {
      const mockResponse = {
        data: {
          admin: {
            admin_id: 'ADM001',
            name: 'John Admin'
          }
          // No token field
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.admin.login({
        admin_id: 'ADM001',
        password: 'password'
      });

      // Token should be undefined
      expect(result.data.token).toBeUndefined();
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network Error');
      api.post.mockRejectedValue(networkError);

      await expect(
        authService.admin.login({
          admin_id: 'ADM001',
          password: 'password'
        })
      ).rejects.toThrow('Network Error');
    });

    it('should handle 401 Unauthorized error', async () => {
      const unauthorizedError = {
        response: {
          status: 401,
          data: {
            error: 'Invalid credentials'
          }
        }
      };

      api.post.mockRejectedValue(unauthorizedError);

      await expect(
        authService.admin.login({
          admin_id: 'WRONG_ID',
          password: 'wrong_password'
        })
      ).rejects.toEqual(unauthorizedError);
    });

    it('should verify token structure (JWT format)', async () => {
      const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6IkFETTAwMSJ9.signature';
      
      const mockResponse = {
        data: {
          data: {
            token: validJWT,
            admin: { admin_id: 'ADM001' }
          }
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.admin.login({
        admin_id: 'ADM001',
        password: 'password'
      });

      const token = result.data.data.token;
      
      // Verify JWT structure (header.payload.signature)
      const jwtParts = token.split('.');
      expect(jwtParts).toHaveLength(3);
      expect(jwtParts[0]).toBeTruthy(); // header
      expect(jwtParts[1]).toBeTruthy(); // payload
      expect(jwtParts[2]).toBeTruthy(); // signature
    });
  });

  describe('Driver Login - JWT Token Response', () => {
    it('should receive JWT token for driver login', async () => {
      const mockResponse = {
        data: {
          data: {
            driver: {
              driver_id: 'DRV001',
              name: 'John Driver'
            },
            token: 'driver-jwt-token'
          }
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.driver.login({
        driver_id: 'DRV001',
        password: 'password'
      });

      expect(result.data.data.token).toBe('driver-jwt-token');
      expect(api.post).toHaveBeenCalledWith('/auth/driver/login', {
        driver_id: 'DRV001',
        password: 'password'
      });
    });
  });

  describe('Assistant Login - JWT Token Response', () => {
    it('should receive JWT token for assistant login', async () => {
      const mockResponse = {
        data: {
          data: {
            assistant: {
              assistant_id: 'AST001',
              name: 'John Assistant'
            },
            token: 'assistant-jwt-token'
          }
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.assistant.login({
        assistant_id: 'AST001',
        password: 'password'
      });

      expect(result.data.data.token).toBe('assistant-jwt-token');
      expect(api.post).toHaveBeenCalledWith('/auth/assistant/login', {
        assistant_id: 'AST001',
        password: 'password'
      });
    });
  });

  describe('Customer Login - JWT Token Response', () => {
    it('should receive JWT token for customer login', async () => {
      const mockResponse = {
        data: {
          data: {
            customer: {
              customer_id: 'CUST001',
              name: 'John Customer',
              email: 'customer@example.com'
            },
            token: 'customer-jwt-token'
          }
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'customer@example.com',
        password: 'password'
      });

      expect(result.data.data.token).toBe('customer-jwt-token');
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'customer@example.com',
        password: 'password'
      });
    });
  });
});
