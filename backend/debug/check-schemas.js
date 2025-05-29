// Debug Collection Schemas - Check all collection configurations
console.log('🔍 Checking Collection Schemas...\n');

const collections = [
  'Products',
  'Technologies',
  'Categories',
  'Posts',
  'Projects',
  'Events',
  'Banners',
  'Media',
  'ContactSubmissions',
  'Users',
  'ProductCategories',
  'ProjectCategories',
  'EventCategories',
  'NewsCategories',
  'ServiceCategories',
  'Services',
  'Tools',
  'Resources',
  'Navigation'
];

async function checkCollectionSchema(collectionName) {
  try {
    console.log(`📋 ${collectionName} Collection:`);

    // Try to get collection info from API
    const endpoint = `http://localhost:3000/api/${collectionName.toLowerCase()}`;
    const response = await fetch(endpoint);

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ API Accessible`);
      console.log(`   📊 Total Docs: ${data.data?.totalDocs || 0}`);
      console.log(`   📄 Current Page: ${data.data?.page || 1}/${data.data?.totalPages || 1}`);

      // Check if has relationship fields
      if (data.data?.docs?.length > 0) {
        const firstDoc = data.data.docs[0];
        const relationshipFields = [];

        for (const [key, value] of Object.entries(firstDoc)) {
          if (typeof value === 'object' && value !== null) {
            if (value.id || Array.isArray(value)) {
              relationshipFields.push(key);
            }
          }
        }

        if (relationshipFields.length > 0) {
          console.log(`   🔗 Relationship Fields: ${relationshipFields.join(', ')}`);
        }
      }
    } else {
      console.log(`   ❌ API Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`   💥 Network Error: ${error.message}`);
  }
  console.log(''); // Empty line
}

async function checkAllSchemas() {
  console.log(`🎯 Checking ${collections.length} collection schemas...\n`);

  for (const collection of collections) {
    await checkCollectionSchema(collection);
  }

  // Check globals
  console.log('🌍 Checking Global Schemas...\n');

  const globals = ['company-info', 'homepage-settings'];

  for (const global of globals) {
    try {
      console.log(`🌐 ${global} Global:`);
      const response = await fetch(`http://localhost:3000/api/globals/${global}`);

      if (response.ok) {
        console.log(`   ✅ API Accessible`);
      } else {
        console.log(`   ❌ API Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`   💥 Network Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('🏁 Schema check completed!');
}

checkAllSchemas().catch(console.error);
