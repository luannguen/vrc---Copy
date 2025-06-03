// Quick test script to check exact Payload bulk delete response format
console.log('🔬 Testing Payload bulk delete response format...');

// Create test data first
fetch('/api/event-registrations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Test User For Delete',
    email: 'testdelete@example.com',
    phone: '0123456789',
    organization: 'Test Org',
    jobTitle: 'Tester',
    eventTitle: 'Test Event For Delete',
    participationType: 'online',
    dietaryRequirements: 'none'
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ Test record created:', data);
  if (data.registration && data.registration.id) {
    const testId = data.registration.id;
    console.log('🎯 Testing bulk delete with ID:', testId);

    // Test the exact format Payload admin uses
    const testUrl = `/api/event-registrations?where%5Bid%5D%5Bin%5D%5B0%5D=${testId}`;
    console.log('🔗 Test URL:', testUrl);

    return fetch(testUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
  }
})
.then(response => {
  console.log('📊 Response status:', response.status);
  console.log('📊 Response headers:', [...response.headers.entries()]);
  return response.json();
})
.then(data => {
  console.log('📋 DELETE Response:', JSON.stringify(data, null, 2));
  console.log('📋 Response keys:', Object.keys(data));

  // Check if response matches Payload expectation
  const hasMessage = 'message' in data;
  const hasDocs = 'docs' in data;
  const hasTotalDocs = 'totalDocs' in data;
  const hasErrors = 'errors' in data;

  console.log('✅ Format check:');
  console.log('  - message:', hasMessage);
  console.log('  - docs:', hasDocs);
  console.log('  - totalDocs:', hasTotalDocs);
  console.log('  - errors:', hasErrors);

  if (hasMessage && hasDocs && hasTotalDocs && !hasErrors) {
    console.log('🎉 Response format looks correct for Payload');
  } else {
    console.log('⚠️ Response format might not match Payload expectations');
  }
})
.catch(error => {
  console.error('❌ Test error:', error);
});

console.log('💡 Check console for results...');
