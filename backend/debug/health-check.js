// Debug Database Connection and Health
console.log('🏥 Health Check Debug...\n');

async function checkServerHealth() {
  try {
    console.log('🔍 Checking server status...');

    // Check if server is running
    const healthResponse = await fetch('http://localhost:3000/api/health');

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Server is running');
      console.log(`📊 Status: ${healthData.status || 'OK'}`);
      console.log(`⏰ Timestamp: ${healthData.timestamp || new Date().toISOString()}`);
    } else {
      console.log(`❌ Health check failed: ${healthResponse.status}`);
    }
  } catch (error) {
    console.log(`💥 Server not accessible: ${error.message}`);
    return false;
  }

  console.log(''); // Empty line
  return true;
}

async function checkDatabaseConnections() {
  console.log('🗄️ Checking database connections...\n');

  try {
    // Check MongoDB connection by trying to fetch users
    const usersResponse = await fetch('http://localhost:3000/api/users?limit=1');

    if (usersResponse.ok) {
      console.log('✅ MongoDB connection working');
      const userData = await usersResponse.json();
      console.log(`👥 Users count: ${userData.data?.totalDocs || 0}`);
    } else {
      console.log(`❌ Database connection issue: ${usersResponse.status}`);
    }
  } catch (error) {
    console.log(`💥 Database error: ${error.message}`);
  }

  console.log(''); // Empty line
}

async function checkCriticalAPIs() {
  console.log('🎯 Checking critical APIs...\n');

  const criticalAPIs = [
    { url: '/api/products', name: 'Products' },
    { url: '/api/posts', name: 'Posts' },
    { url: '/api/pages', name: 'Pages' },
    { url: '/api/media', name: 'Media' },
    { url: '/api/globals/company-info', name: 'Company Info' },
    { url: '/api/homepage-settings', name: 'Homepage Settings' },
  ];

  for (const api of criticalAPIs) {
    try {
      const response = await fetch(`http://localhost:3000${api.url}`);

      if (response.ok) {
        console.log(`✅ ${api.name}: Working`);
      } else {
        console.log(`❌ ${api.name}: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`💥 ${api.name}: ${error.message}`);
    }
  }

  console.log(''); // Empty line
}

async function runHealthCheck() {
  console.log('🚀 Starting comprehensive health check...\n');

  const serverRunning = await checkServerHealth();

  if (serverRunning) {
    await checkDatabaseConnections();
    await checkCriticalAPIs();
  } else {
    console.log('❌ Cannot proceed with detailed checks - server not running');
    console.log('💡 Try running: npm run dev');
  }

  console.log('🏁 Health check completed!');
}

runHealthCheck().catch(console.error);
