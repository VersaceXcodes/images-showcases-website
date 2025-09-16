const axios = require('axios');

const API_BASE_URL = 'https://123images-showcases-website.launchpulse.ai';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  try {
    // Test database health
    console.log('\n2. Testing database health...');
    const dbHealthResponse = await axios.get(`${API_BASE_URL}/api/health/db`);
    console.log('✅ Database health:', dbHealthResponse.data);
  } catch (error) {
    console.log('❌ Database health failed:', error.message);
  }

  try {
    // Test images endpoint
    console.log('\n3. Testing images endpoint...');
    const imagesResponse = await axios.get(`${API_BASE_URL}/api/images`);
    console.log('✅ Images endpoint:', `Found ${imagesResponse.data.length} images`);
    if (imagesResponse.data.length > 0) {
      console.log('   Sample image:', {
        id: imagesResponse.data[0].image_id,
        title: imagesResponse.data[0].title,
        url: imagesResponse.data[0].image_url
      });
    }
  } catch (error) {
    console.log('❌ Images endpoint failed:', error.message);
  }

  try {
    // Test search endpoint
    console.log('\n4. Testing search endpoint...');
    const searchResponse = await axios.get(`${API_BASE_URL}/api/images/search?query=nature`);
    console.log('✅ Search endpoint:', `Found ${searchResponse.data.length} results for "nature"`);
  } catch (error) {
    console.log('❌ Search endpoint failed:', error.message);
  }

  console.log('\nAPI testing completed.');
}

testAPI().catch(console.error);