// Debug script để test DELETE API với PayloadCMS query format
console.log('🧪 Testing Products DELETE API with PayloadCMS format...\n');

async function testProductsDeleteAPI() {
  try {
    // Test 1: Get products to find an ID to delete
    console.log('1. Getting products to find test ID...');
    const getResponse = await fetch('http://localhost:3000/api/products');
    const getResult = await getResponse.json();

    if (!getResult.success || !getResult.data?.docs?.length) {
      console.log('❌ No products found to test with');
      return;
    }

    const testProduct = getResult.data.docs[0];
    console.log(`Found test product: ${testProduct.id} - ${testProduct.name}`);

    // Test 2: Test the exact PayloadCMS DELETE format
    const payloadCMSUrl = `http://localhost:3000/api/products?limit=0&where%5Bid%5D%5Bin%5D%5B0%5D=${testProduct.id}`;
    console.log('\n2. Testing PayloadCMS DELETE format:');
    console.log('URL:', payloadCMSUrl);

    const deleteResponse = await fetch(payloadCMSUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', deleteResponse.status);
    console.log('Status Text:', deleteResponse.statusText);

    if (deleteResponse.ok) {
      const deleteResult = await deleteResponse.json();
      console.log('✅ DELETE Response:', JSON.stringify(deleteResult, null, 2));
    } else {
      const errorText = await deleteResponse.text();
      console.log('❌ DELETE Error:', errorText);
    }

    // Test 3: Test simple format for comparison
    console.log('\n3. Testing simple DELETE format:');
    const simpleUrl = `http://localhost:3000/api/products?id=${testProduct.id}`;
    console.log('URL:', simpleUrl);

    const simpleResponse = await fetch(simpleUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', simpleResponse.status);
    if (simpleResponse.ok) {
      const simpleResult = await simpleResponse.json();
      console.log('✅ Simple DELETE Response:', JSON.stringify(simpleResult, null, 2));
    } else {
      const errorText = await simpleResponse.text();
      console.log('❌ Simple DELETE Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProductsDeleteAPI().catch(console.error);
