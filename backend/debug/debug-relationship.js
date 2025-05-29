// Debug script to test relationship field configuration

async function testRelationshipField() {
  console.log('🔍 Testing Technologies relationship field...\n');

  try {
    // Test 1: Get all technologies
    console.log('1. Fetching technologies...');
    const techResponse = await fetch('http://localhost:3000/api/technologies?depth=1');
    const techData = await techResponse.json();
    console.log('Technologies count:', techData.data?.totalDocs || 0);

    // Test 2: Get all products
    console.log('\n2. Fetching products...');
    const productResponse = await fetch('http://localhost:3000/api/products');
    const productData = await productResponse.json();
    console.log('Products count:', productData.data?.totalDocs || 0);

    // Test 3: Get a specific technology with relationships populated
    if (techData.data?.docs?.length > 0) {
      const firstTech = techData.data.docs[0];
      console.log('\n3. First technology:', {
        id: firstTech.id,
        name: firstTech.name,
        products: firstTech.products || 'No products field'
      });

      // Test 4: Try to update the technology with a product relationship
      if (productData.data?.docs?.length > 0) {
        const firstProduct = productData.data.docs[0];
        console.log('\n4. Attempting to update technology with product relationship...');

        const updateData = {
          products: [firstProduct.id]
        };

        console.log('Update payload:', JSON.stringify(updateData, null, 2));

        const updateResponse = await fetch(`http://localhost:3000/api/technologies/${firstTech.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });

        if (updateResponse.ok) {
          const updatedTech = await updateResponse.json();
          console.log('✅ Update successful!');
          console.log('Updated products field:', updatedTech.doc?.products || 'Still no products field');
        } else {
          const error = await updateResponse.text();
          console.log('❌ Update failed:', error);
        }
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if we're running in Node environment
// Modern Node.js includes fetch globally

testRelationshipField().catch(console.error);
