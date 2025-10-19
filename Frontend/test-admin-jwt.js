#!/usr/bin/env node

/**
 * Quick Manual Test Script for Admin JWT Token
 * 
 * This script tests if the backend is properly sending JWT tokens
 * for admin authentication.
 * 
 * USAGE:
 *   node test-admin-jwt.js
 * 
 * REQUIREMENTS:
 *   - Backend must be running on http://localhost:3000
 *   - Update the credentials below
 */

const https = require('https');
const http = require('http');

const API_URL = 'http://localhost:3000/api/auth/admin/login';

// ⚠️ UPDATE THESE CREDENTIALS
const ADMIN_CREDENTIALS = {
  admin_id: 'ADM001',
  password: 'admin123'
};

console.log('\n🔍 Testing Admin JWT Token Response...\n');
console.log('📍 Endpoint:', API_URL);
console.log('👤 Admin ID:', ADMIN_CREDENTIALS.admin_id);
console.log('\n' + '='.repeat(60) + '\n');

const postData = JSON.stringify(ADMIN_CREDENTIALS);

const url = new URL(API_URL);
const options = {
  hostname: url.hostname,
  port: url.port || 3000,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📊 Response Status:', res.statusCode);
    console.log('📋 Response Headers:', JSON.stringify(res.headers, null, 2));
    console.log('\n📦 Response Body:');
    console.log(data);
    console.log('\n' + '='.repeat(60) + '\n');

    try {
      const response = JSON.parse(data);
      
      // Check for token in various possible locations
      const token = response?.data?.token || 
                   response?.token || 
                   response?.data?.data?.token;

      if (token) {
        console.log('✅ SUCCESS: JWT Token Found!');
        console.log('\n🔑 Token (first 50 chars):', token.substring(0, 50) + '...');
        console.log('📏 Token Length:', token.length, 'characters');
        
        // Validate JWT structure
        const parts = token.split('.');
        if (parts.length === 3) {
          console.log('✅ Valid JWT Structure: header.payload.signature');
          
          // Try to decode payload
          try {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            console.log('\n📄 Decoded Payload:');
            console.log(JSON.stringify(payload, null, 2));
            
            if (payload.admin_id) {
              console.log('\n✅ Payload contains admin_id:', payload.admin_id);
            }
            if (payload.exp) {
              const expDate = new Date(payload.exp * 1000);
              console.log('⏰ Token Expires:', expDate.toLocaleString());
            }
          } catch (decodeErr) {
            console.log('⚠️  Could not decode payload:', decodeErr.message);
          }
        } else {
          console.log('❌ Invalid JWT Structure');
        }

        // Check admin data
        const adminData = response?.data?.admin || 
                         response?.admin || 
                         response?.data?.data?.admin;
        
        if (adminData) {
          console.log('\n👤 Admin Data:');
          console.log(JSON.stringify(adminData, null, 2));
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ TEST PASSED: Backend is sending JWT token correctly!');
        console.log('='.repeat(60) + '\n');

      } else {
        console.log('❌ FAILED: No JWT token found in response!');
        console.log('\nResponse structure:');
        console.log(JSON.stringify(response, null, 2));
        console.log('\n⚠️  Expected token at one of these paths:');
        console.log('   - response.data.token');
        console.log('   - response.token');
        console.log('   - response.data.data.token');
        console.log('\n' + '='.repeat(60) + '\n');
        process.exit(1);
      }

    } catch (parseError) {
      console.log('❌ ERROR: Could not parse response as JSON');
      console.log(parseError.message);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('\n❌ REQUEST FAILED\n');
  
  if (error.code === 'ECONNREFUSED') {
    console.log('❌ Cannot connect to backend server');
    console.log('\n💡 Make sure your backend is running:');
    console.log('   - Check if the server is running on http://localhost:3000');
    console.log('   - Try: curl http://localhost:3000/api/health\n');
  } else if (error.code === 'ENOTFOUND') {
    console.log('❌ Hostname not found:', url.hostname);
  } else {
    console.log('❌ Error:', error.message);
    console.log('   Code:', error.code);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  process.exit(1);
});

// Send request
req.write(postData);
req.end();
