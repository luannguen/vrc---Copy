// Enhanced VRC Admin Diagnostics - Network Monitoring Edition
// This script specifically captures the exact format Payload CMS uses for bulk delete

console.log('🔍 Enhanced VRC Admin Network Monitor loaded');

// Store original fetch for detailed monitoring
const originalFetch = window.fetch;
const originalXHR = window.XMLHttpRequest;

// Intercept fetch requests
window.fetch = async function(...args) {
  const [url, options] = args;

  if (options && options.method === 'DELETE') {
    console.log('🗑️ FETCH DELETE REQUEST CAPTURED:');
    console.log('━'.repeat(60));
    console.log('URL:', url);
    console.log('Full Options:', JSON.stringify(options, null, 2));

    try {
      const fullUrl = new URL(url, window.location.origin);
      console.log('Full URL:', fullUrl.href);
      console.log('Query Parameters:');
      for (const [key, value] of fullUrl.searchParams.entries()) {
        console.log(`  ${key} = ${value}`);
      }
    } catch (e) {
      console.log('URL Parse Error:', e.message);
    }
    console.log('━'.repeat(60));
  }

  return originalFetch.apply(this, args);
};

// Intercept XMLHttpRequest
window.XMLHttpRequest = function() {
  const xhr = new originalXHR();
  const originalOpen = xhr.open;
  const originalSend = xhr.send;

  xhr.open = function(method, url, ...args) {
    this._method = method;
    this._url = url;
    return originalOpen.apply(this, [method, url, ...args]);
  };

  xhr.send = function(data) {
    if (this._method === 'DELETE') {
      console.log('🗑️ XHR DELETE REQUEST CAPTURED:');
      console.log('━'.repeat(60));
      console.log('Method:', this._method);
      console.log('URL:', this._url);
      console.log('Data:', data);
      console.log('━'.repeat(60));
    }
    return originalSend.apply(this, arguments);
  };

  return xhr;
};

// Monitor form submissions that might trigger bulk actions
document.addEventListener('submit', function(e) {
  const form = e.target;
  console.log('📝 FORM SUBMISSION DETECTED:');
  console.log('Action:', form.action);
  console.log('Method:', form.method);

  const formData = new FormData(form);
  console.log('Form Data:');
  for (const [key, value] of formData.entries()) {
    console.log(`  ${key} = ${value}`);
  }
}, true);

// Monitor all button clicks
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
    const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
    const text = button.textContent.trim().toLowerCase();

    if (text.includes('delete') || text.includes('xóa')) {
      console.log('🔘 DELETE BUTTON CLICKED:');
      console.log('Button text:', button.textContent);
      console.log('Button classes:', button.className);
      console.log('Button attributes:', [...button.attributes].map(a => `${a.name}="${a.value}"`).join(' '));

      // Check for selected items
      const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
      console.log('Selected items:', selectedCheckboxes.length);
      selectedCheckboxes.forEach((checkbox, i) => {
        console.log(`  Item ${i}:`, checkbox.value, checkbox.name);
      });
    }
  }
}, true);

// Monitor checkbox selections
document.addEventListener('change', function(e) {
  if (e.target.type === 'checkbox') {
    const selectedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
    console.log(`✅ Checkbox changed: ${selectedCount} total selected`);
    console.log('Changed checkbox:', e.target.value, e.target.name);
  }
}, true);

// Monitor URL changes
let lastUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== lastUrl) {
    console.log('🧭 URL CHANGED:', lastUrl, '→', window.location.href);
    lastUrl = window.location.href;
  }
}, 500);

// Test function to manually trigger bulk delete
window.testPayloadBulkDelete = function(ids) {
  console.log('🧪 Testing Payload-style bulk delete with IDs:', ids);

  // Test different URL formats that Payload might use
  const formats = [
    // Format 1: where[id][in][]
    `/api/event-registrations?${ids.map((id, i) => `where%5Bid%5D%5Bin%5D%5B${i}%5D=${id}`).join('&')}`,

    // Format 2: where[id][in]
    `/api/event-registrations?where%5Bid%5D%5Bin%5D=${ids.join(',')}`,

    // Format 3: ids[]
    `/api/event-registrations?${ids.map(id => `ids%5B%5D=${id}`).join('&')}`,

    // Format 4: ids
    `/api/event-registrations?ids=${ids.join(',')}`,
  ];

  console.log('Testing formats:');
  formats.forEach((url, i) => {
    console.log(`Format ${i + 1}: ${url}`);
  });

  // Test the most likely format (where[id][in][])
  return fetch(formats[0], {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()).then(data => {
    console.log('🧪 Test result:', data);
    return data;
  }).catch(error => {
    console.error('🧪 Test error:', error);
    return error;
  });
};

console.log('✅ Enhanced network monitoring active');
console.log('💡 Use testPayloadBulkDelete(["id1", "id2"]) to test different URL formats');
console.log('💡 All network requests and form submissions are now being monitored');
