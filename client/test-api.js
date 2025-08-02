const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testAPI() {
    console.log('🧪 Testing API endpoints...\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Health check passed:', healthResponse.data);

        // Test root endpoint
        console.log('\n2. Testing root endpoint...');
        const rootResponse = await axios.get(`${API_BASE_URL}/`);
        console.log('✅ Root endpoint working:', rootResponse.data);

        // Test products endpoint
        console.log('\n3. Testing products endpoint...');
        const productsResponse = await axios.get(`${API_BASE_URL}/api/products`);
        console.log('✅ Products endpoint working:', productsResponse.data.length, 'products found');

        // Test auth endpoints (without authentication)
        console.log('\n4. Testing auth endpoints...');
        try {
            const meResponse = await axios.get(`${API_BASE_URL}/api/auth/me`);
            console.log('❌ /me endpoint should require authentication');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ /me endpoint correctly requires authentication');
            } else {
                console.log('❌ Unexpected error with /me endpoint:', error.response?.status);
            }
        }

        console.log('\n🎉 API tests completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Make sure MongoDB is running');
        console.log('2. Check your .env file has correct values');
        console.log('3. Try creating a user account');
        console.log('4. Test login functionality');

    } catch (error) {
        console.error('❌ API test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Make sure the backend server is running on port 5000');
        }
    }
}

testAPI(); 