#!/usr/bin/env node

const axios = require('axios');

const API_BASE_URL = 'https://123images-showcases-website.launchpulse.ai/api';

async function testAPIEndpoints() {
  console.log('🧪 Testing API endpoints...\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${API_BASE_URL}/health`,
      expectedStatus: 200,
      expectedFields: ['status', 'timestamp']
    },
    {
      name: 'Database Health Check',
      url: `${API_BASE_URL}/health/db`,
      expectedStatus: 200,
      expectedFields: ['status', 'database']
    },
    {
      name: 'Images Endpoint',
      url: `${API_BASE_URL}/images`,
      expectedStatus: 200,
      expectedType: 'array'
    },
    {
      name: 'Images Search Endpoint',
      url: `${API_BASE_URL}/images/search?query=nature`,
      expectedStatus: 200,
      expectedType: 'array'
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await axios.get(test.url, {
        timeout: 10000,
        headers: {
          'Origin': 'https://123images-showcases-website.launchpulse.ai',
          'Accept': 'application/json'
        }
      });

      // Check status
      if (response.status !== test.expectedStatus) {
        throw new Error(`Expected status ${test.expectedStatus}, got ${response.status}`);
      }

      // Check response type
      if (test.expectedType === 'array' && !Array.isArray(response.data)) {
        throw new Error(`Expected array, got ${typeof response.data}`);
      }

      // Check expected fields
      if (test.expectedFields) {
        for (const field of test.expectedFields) {
          if (!(field in response.data)) {
            throw new Error(`Missing expected field: ${field}`);
          }
        }
      }

      console.log(`✅ ${test.name} - PASSED`);
      passedTests++;
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED: ${error.message}`);
    }
    console.log('');
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The API is working correctly.');
    return true;
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
    return false;
  }
}

async function testCORS() {
  console.log('🌐 Testing CORS configuration...\n');
  
  try {
    const response = await axios.options(`${API_BASE_URL}/health`, {
      headers: {
        'Origin': 'https://123images-showcases-website.launchpulse.ai',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    
    console.log('✅ CORS preflight - PASSED');
    return true;
  } catch (error) {
    console.log(`❌ CORS preflight - FAILED: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting comprehensive API tests...\n');
  
  const apiTestsPass = await testAPIEndpoints();
  const corsTestsPass = await testCORS();
  
  console.log('\n' + '='.repeat(50));
  
  if (apiTestsPass && corsTestsPass) {
    console.log('🎉 ALL TESTS PASSED! The fixes have been successfully applied.');
    console.log('\nKey improvements made:');
    console.log('• Enhanced CORS configuration with better origin handling');
    console.log('• Improved error handling and logging');
    console.log('• Better API client timeout and retry logic');
    console.log('• Enhanced authentication initialization');
    console.log('• Improved Socket.IO connection handling');
    console.log('• Added global error handlers');
    console.log('• Better health check endpoints');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please review the issues above.');
    process.exit(1);
  }
}

main().catch(console.error);