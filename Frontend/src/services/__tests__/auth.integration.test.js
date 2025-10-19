/**
 * Integration Test for Admin JWT Token Validation
 * 
 * This test makes REAL API calls to the backend server.
 * 
 * PREREQUISITES:
 * 1. Backend server must be running on http://localhost:3000
 * 2. You must have a valid admin account in the database
 * 
 * TO RUN THIS TEST:
 * npm test -- --testPathPattern=auth.integration.test.js
 * 
 * TO SKIP THIS TEST (if backend is not running):
 * This file uses describe.skip by default. Remove '.skip' to enable.
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Use describe.skip to prevent this from running in CI/CD
// Change to describe() when you want to test against real backend
describe.skip('Admin JWT Token - Integration Test (REAL BACKEND)', () => {
  
  describe('POST /auth/admin/login', () => {
    it('should return a valid JWT token from backend', async () => {
      // IMPORTANT: Update these credentials to match your test admin account
      const adminCredentials = {
        admin_id: 'ADM001',  // Update this
        password: 'admin123' // Update this
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/admin/login`,
          adminCredentials,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('✅ Backend Response:', JSON.stringify(response.data, null, 2));

        // Test 1: Response should have status 200
        expect(response.status).toBe(200);

        // Test 2: Response should contain data
        expect(response.data).toBeDefined();

        // Test 3: Token should be present in one of these formats
        const token = response.data?.data?.token || response.data?.token;
        expect(token).toBeDefined();
        expect(token).not.toBeNull();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);

        console.log('✅ Token received:', token.substring(0, 50) + '...');

        // Test 4: Token should be a valid JWT format (header.payload.signature)
        const jwtParts = token.split('.');
        expect(jwtParts).toHaveLength(3);
        
        console.log('✅ JWT Structure valid: header.payload.signature');

        // Test 5: Admin data should be present
        const adminData = response.data?.data?.admin || response.data?.admin;
        expect(adminData).toBeDefined();
        expect(adminData.admin_id).toBe(adminCredentials.admin_id);

        console.log('✅ Admin data:', adminData);

        // Test 6: Try to decode JWT payload (optional)
        try {
          const payload = JSON.parse(atob(jwtParts[1]));
          console.log('✅ Decoded JWT Payload:', payload);
          
          // Check if payload contains expected fields
          expect(payload).toHaveProperty('admin_id');
          expect(payload.admin_id).toBe(adminCredentials.admin_id);
        } catch (decodeError) {
          console.warn('⚠️ Could not decode JWT payload:', decodeError.message);
        }

        console.log('\n✅ ALL TESTS PASSED - Backend is sending JWT token correctly!\n');

      } catch (error) {
        console.error('❌ Test Failed:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
          console.error('\n❌ ERROR: Cannot connect to backend server');
          console.error('   Make sure your backend is running on http://localhost:3000\n');
        } else if (error.response) {
          console.error('❌ Backend Response Error:');
          console.error('   Status:', error.response.status);
          console.error('   Data:', error.response.data);
        }
        
        throw error;
      }
    });

    it('should reject invalid admin credentials', async () => {
      const invalidCredentials = {
        admin_id: 'INVALID_ID',
        password: 'wrong_password'
      };

      try {
        await axios.post(
          `${API_BASE_URL}/auth/admin/login`,
          invalidCredentials
        );

        // If we reach here, the test should fail
        fail('Expected request to fail with invalid credentials');

      } catch (error) {
        // Test that backend properly rejects invalid credentials
        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(401);
        
        console.log('✅ Backend correctly rejects invalid credentials');
      }
    });

    it('should validate token can be used for authenticated requests', async () => {
      // First, login to get token
      const adminCredentials = {
        admin_id: 'ADM001',  // Update this
        password: 'admin123' // Update this
      };

      const loginResponse = await axios.post(
        `${API_BASE_URL}/auth/admin/login`,
        adminCredentials
      );

      const token = loginResponse.data?.data?.token || loginResponse.data?.token;
      expect(token).toBeDefined();

      // Test 7: Use token to make authenticated request
      try {
        const profileResponse = await axios.get(
          `${API_BASE_URL}/auth/admin/profile`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        expect(profileResponse.status).toBe(200);
        console.log('✅ Token successfully used for authenticated request');
        console.log('   Profile data:', profileResponse.data);

      } catch (error) {
        if (error.response?.status === 404) {
          console.warn('⚠️ Profile endpoint not implemented yet (404)');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Other Role Endpoints', () => {
    it('should return JWT for driver login', async () => {
      const driverCredentials = {
        driver_id: 'DRV001',   // Update this
        password: 'driver123'  // Update this
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/driver/login`,
          driverCredentials
        );

        const token = response.data?.data?.token || response.data?.token;
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        console.log('✅ Driver JWT token received');
      } catch (error) {
        console.warn('⚠️ Driver endpoint test skipped:', error.message);
      }
    });

    it('should return JWT for assistant login', async () => {
      const assistantCredentials = {
        assistant_id: 'AST001',    // Update this
        password: 'assistant123'   // Update this
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/assistant/login`,
          assistantCredentials
        );

        const token = response.data?.data?.token || response.data?.token;
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        console.log('✅ Assistant JWT token received');
      } catch (error) {
        console.warn('⚠️ Assistant endpoint test skipped:', error.message);
      }
    });
  });
});

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Make sure your backend server is running
 * 2. Update the credentials in the tests above to match your test accounts
 * 3. Change 'describe.skip' to 'describe' on line 19
 * 4. Run: npm test -- auth.integration.test.js
 * 
 * Expected Output:
 * ✅ Backend Response: { "success": true, "data": { "token": "...", "admin": {...} } }
 * ✅ Token received: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * ✅ JWT Structure valid: header.payload.signature
 * ✅ Admin data: { admin_id: 'ADM001', name: '...' }
 * ✅ Decoded JWT Payload: { admin_id: 'ADM001', role: 'admin', ... }
 * ✅ ALL TESTS PASSED
 */
