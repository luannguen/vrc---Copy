
# API Endpoint Tests
# Run these manually to test your multilingual API

# Test 1: Products endpoint with different locales
echo "Testing Products API..."
curl -H "Accept: application/json" "http://localhost:3000/api/products?locale=vi" || echo "❌ Products VI failed"
curl -H "Accept: application/json" "http://localhost:3000/api/products?locale=en" || echo "❌ Products EN failed"
curl -H "Accept: application/json" "http://localhost:3000/api/products?locale=tr" || echo "❌ Products TR failed"

# Test 2: Services endpoint with different locales
echo "Testing Services API..."
curl -H "Accept: application/json" "http://localhost:3000/api/services?locale=vi" || echo "❌ Services VI failed"
curl -H "Accept: application/json" "http://localhost:3000/api/services?locale=en" || echo "❌ Services EN failed"
curl -H "Accept: application/json" "http://localhost:3000/api/services?locale=tr" || echo "❌ Services TR failed"

# Test 3: Company Info global endpoint
echo "Testing Company Info API..."
curl -H "Accept: application/json" "http://localhost:3000/api/globals/company-info?locale=vi" || echo "❌ Company Info VI failed"
curl -H "Accept: application/json" "http://localhost:3000/api/globals/company-info?locale=en" || echo "❌ Company Info EN failed"
curl -H "Accept: application/json" "http://localhost:3000/api/globals/company-info?locale=tr" || echo "❌ Company Info TR failed"

echo "✅ API tests completed. Check responses for multilingual content."
