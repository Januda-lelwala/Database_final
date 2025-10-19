# JWT Token Testing Guide

This guide explains how to test whether the backend is properly sending JWT tokens during admin authentication.

## 📁 Test Files Created

1. **`src/services/__tests__/auth.service.test.js`**
   - Unit tests for authentication service
   - Mocks backend responses
   - Tests all user roles (admin, driver, assistant, customer)

2. **`src/context/__tests__/AuthContext.test.js`**
   - Tests JWT token storage in localStorage
   - Tests authentication state management
   - Tests token restoration on app load

3. **`src/services/__tests__/auth.integration.test.js`**
   - Integration tests with REAL backend
   - Validates actual JWT token from server
   - Skipped by default (requires running backend)

4. **`test-admin-jwt.js`**
   - Standalone Node.js script for quick manual testing
   - No dependencies required
   - Provides detailed output

---

## 🚀 Quick Start

### Option 1: Quick Manual Test (Recommended)

Run the standalone script:

```bash
node test-admin-jwt.js
```

**Update credentials first:**
```javascript
// In test-admin-jwt.js, line 22-25
const ADMIN_CREDENTIALS = {
  admin_id: 'ADM001',     // ← Change this
  password: 'admin123'    // ← Change this
};
```

**Expected Output:**
```
✅ SUCCESS: JWT Token Found!
🔑 Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ Valid JWT Structure: header.payload.signature
📄 Decoded Payload: { admin_id: 'ADM001', role: 'admin', ... }
✅ TEST PASSED: Backend is sending JWT token correctly!
```

---

### Option 2: Run Unit Tests

Run all unit tests:

```bash
npm test
```

Run specific test files:

```bash
# Test auth service
npm test -- auth.service.test.js

# Test AuthContext
npm test -- AuthContext.test.js
```

Run tests in watch mode:

```bash
npm test -- --watch
```

---

### Option 3: Run Integration Tests (Real Backend)

⚠️ **Prerequisites:**
- Backend server must be running on `http://localhost:3000`
- Valid admin account must exist in database

**Steps:**

1. **Update credentials** in `src/services/__tests__/auth.integration.test.js`:
   ```javascript
   const adminCredentials = {
     admin_id: 'ADM001',    // ← Your test admin ID
     password: 'admin123'   // ← Your test admin password
   };
   ```

2. **Enable the test** by changing `describe.skip` to `describe` on line 19:
   ```javascript
   // Before:
   describe.skip('Admin JWT Token - Integration Test...

   // After:
   describe('Admin JWT Token - Integration Test...
   ```

3. **Run the test:**
   ```bash
   npm test -- auth.integration.test.js
   ```

---

## 🔍 What Each Test Validates

### Unit Tests (`auth.service.test.js`)
- ✅ Backend sends JWT token in response
- ✅ Token exists at correct path (`response.data.token`)
- ✅ Token is a non-empty string
- ✅ Handles different response formats
- ✅ Validates JWT structure (header.payload.signature)
- ✅ Handles error cases (401, network errors)
- ✅ Tests all roles: admin, driver, assistant, customer

### Context Tests (`AuthContext.test.js`)
- ✅ Token is saved to localStorage after login
- ✅ User data is saved with correct role
- ✅ Auth flags are set correctly (isAdmin, isEmployee, etc.)
- ✅ Token is removed on logout
- ✅ Token is restored on app reload
- ✅ Invalid tokens are cleared
- ✅ Error handling prevents token storage

### Integration Tests (`auth.integration.test.js`)
- ✅ Real backend returns JWT token
- ✅ Token is valid JWT format
- ✅ Token can be decoded
- ✅ Token works for authenticated requests
- ✅ Invalid credentials are rejected (401)

---

## 🐛 Troubleshooting

### "ECONNREFUSED" Error
```
❌ Cannot connect to backend server
```
**Solution:** Make sure your backend is running:
```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Or start your backend server
cd ../backend
npm start
```

### "No token received from server"
```
❌ FAILED: No JWT token found in response!
```
**Solution:** Check your backend response format. Token should be at:
- `response.data.token` OR
- `response.data.data.token` OR
- `response.token`

### "Invalid credentials" (401)
```
❌ Backend Response Error: Status: 401
```
**Solution:** Update the admin credentials in the test file to match your database.

### Tests Pass but Login Still Fails
**Check:**
1. Browser console for errors
2. Network tab in DevTools to see actual response
3. localStorage to verify token is being saved
4. Backend logs for error messages

---

## 📊 Expected Backend Response Format

Your backend should return JWT token in one of these formats:

### Format 1 (Current)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "admin_id": "ADM001",
      "name": "John Admin",
      "email": "admin@kandypack.com"
    }
  }
}
```

### Format 2 (Legacy)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "admin_id": "ADM001",
    "name": "John Admin"
  }
}
```

Both formats are supported by the frontend code.

---

## 🔐 JWT Token Requirements

Your JWT token should:
- ✅ Be a string with format: `header.payload.signature`
- ✅ Have 3 parts separated by dots (`.`)
- ✅ Contain admin_id in the payload
- ✅ Be signed with your secret key
- ✅ Optionally include expiration time (exp)

Example decoded payload:
```json
{
  "admin_id": "ADM001",
  "role": "admin",
  "iat": 1634567890,
  "exp": 1634654290
}
```

---

## 📝 Files Modified

The test files check the JWT handling in these existing files:

- **`src/context/AuthContext.js`** (line 73-74)
  - Saves token to localStorage
  
- **`src/services/auth.service.js`** (line 47-49)
  - Calls admin login endpoint
  
- **`src/services/api.js`** (line 19-23)
  - Adds token to request headers

---

## ✅ Success Checklist

- [ ] Backend server is running
- [ ] Admin account exists in database
- [ ] Credentials updated in test files
- [ ] `npm test` runs without errors
- [ ] `node test-admin-jwt.js` shows JWT token
- [ ] Token is saved to localStorage
- [ ] Admin dashboard loads after login
- [ ] Token works for authenticated API requests

---

## 🆘 Need Help?

If tests are failing:

1. **Check backend logs** for errors
2. **Verify database** has admin account
3. **Test with curl:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/admin/login \
     -H "Content-Type: application/json" \
     -d '{"admin_id":"ADM001","password":"admin123"}'
   ```
4. **Check response format** matches expected structure
5. **Verify JWT secret** is configured in backend

---

## 📚 Additional Resources

- JWT Documentation: https://jwt.io/
- Testing Library Docs: https://testing-library.com/docs/react-testing-library/intro/
- Jest Documentation: https://jestjs.io/docs/getting-started
