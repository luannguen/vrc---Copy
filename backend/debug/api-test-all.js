// API Debug Collection - Test all main APIs
console.log('🧪 Starting API Debug Collection...\n');

const BASE_URL = 'http://localhost:3000/api';

async function testAPI(endpoint, description) {
  try {
    console.log(`📡 Testing: ${description}`);
    console.log(`   URL: ${BASE_URL}${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📊 Records: ${data.data?.totalDocs || data.data?.docs?.length || 'N/A'}`);

      // Show first record if exists
      if (data.data?.docs?.length > 0) {
        const firstRecord = data.data.docs[0];
        console.log(`   📝 First record: ${firstRecord.name || firstRecord.title || firstRecord.id}`);
      }
    } else {
      console.log(`   ❌ Error: ${response.status} - ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`   💥 Network Error: ${error.message}`);
  }
  console.log(''); // Empty line
}

async function runAllAPITests() {
  const apiTests = [
    // Collections
    { endpoint: '/products', description: 'Products Collection' },
    { endpoint: '/technologies', description: 'Technologies Collection' },
    { endpoint: '/categories', description: 'Categories Collection' },
    { endpoint: '/posts', description: 'Posts Collection' },
    { endpoint: '/projects', description: 'Projects Collection' },
    { endpoint: '/events', description: 'Events Collection' },
    { endpoint: '/banners', description: 'Banners Collection' },
    { endpoint: '/media', description: 'Media Collection' },
    { endpoint: '/contact-submissions', description: 'Contact Submissions' },
    { endpoint: '/users', description: 'Users Collection' },

    // Globals
    { endpoint: '/globals/company-info', description: 'Company Info Global' },
    { endpoint: '/globals/homepage-settings', description: 'Homepage Settings Global' },

    // Custom APIs
    { endpoint: '/homepage-settings', description: 'Custom Homepage Settings API' },
    { endpoint: '/health', description: 'Health Check Endpoint' },
  ];

  console.log(`🎯 Testing ${apiTests.length} API endpoints...\n`);

  for (const test of apiTests) {
    await testAPI(test.endpoint, test.description);
  }

  console.log('🏁 API Debug Collection completed!');
}

runAllAPITests().catch(console.error);
