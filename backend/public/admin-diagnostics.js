/**
 * Script to inject into browser console to enable and monitor bulk operations
 * and dashboard auto-refresh functionality
 */

// 1. Check if bulk operations checkboxes are present
function checkBulkOperations() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"][data-list-row]');
  const selectAllCheckbox = document.querySelector('input[type="checkbox"][data-select-all]');

  console.log('🔍 Bulk Operations Check:');
  console.log('- Row checkboxes found:', checkboxes.length);
  console.log('- Select all checkbox found:', selectAllCheckbox ? 'Yes' : 'No');

  if (checkboxes.length === 0) {
    console.log('❌ No bulk operation checkboxes found');
    console.log('💡 This might be due to:');
    console.log('  - Collection config missing bulk operation settings');
    console.log('  - User permissions issue');
    console.log('  - Payload CMS version bug');
  } else {
    console.log('✅ Bulk operations appear to be available');
  }

  return { checkboxes: checkboxes.length, selectAll: !!selectAllCheckbox };
}

// 2. Monitor dashboard refresh events
function monitorDashboardRefresh() {
  console.log('🔄 Setting up dashboard refresh monitoring...');

  // Listen for custom dashboard refresh events
  window.addEventListener('dashboardRefresh', () => {
    console.log('📊 Dashboard refresh event triggered');
  });

  // Monitor focus events
  window.addEventListener('focus', () => {
    console.log('👁️ Window focus - dashboard should refresh');
  });

  // Monitor visibility changes
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('🔍 Tab visible - dashboard should refresh');
    }
  });

  console.log('✅ Dashboard monitoring active');
}

// 3. Test dashboard refresh functionality
function testDashboardRefresh() {
  console.log('🧪 Testing dashboard refresh...');

  // Trigger custom refresh event
  window.dispatchEvent(new CustomEvent('dashboardRefresh'));

  // Simulate focus event
  window.dispatchEvent(new Event('focus'));

  console.log('✅ Refresh events triggered');
}

// 4. Check current page location
function checkPageLocation() {
  const url = window.location.href;
  console.log('📍 Current URL:', url);

  if (url.includes('/admin/collections/event-registrations')) {
    if (!url.includes('/edit') && !url.includes('/create')) {
      console.log('✅ On main event-registrations list page');
      return 'list';
    } else {
      console.log('📝 On edit/create page');
      return 'edit';
    }
  } else {
    console.log('❓ Not on event-registrations page');
    return 'other';
  }
}

// 5. Force dashboard refresh
function forceDashboardRefresh() {
  console.log('🔄 Force refreshing dashboard...');

  // Try multiple methods to trigger refresh
  window.dispatchEvent(new CustomEvent('dashboardRefresh'));

  // Simulate navigation back to list
  if (window.location.href.includes('/admin/collections/event-registrations')) {
    window.dispatchEvent(new Event('popstate'));
  }

  // Focus simulation
  window.dispatchEvent(new Event('focus'));

  console.log('✅ Multiple refresh triggers sent');
}

// Auto-run diagnostics
console.log('🚀 Running VRC Admin Diagnostics...');
console.log('='.repeat(50));

checkPageLocation();
checkBulkOperations();
monitorDashboardRefresh();

console.log('='.repeat(50));
console.log('💡 Available functions:');
console.log('- checkBulkOperations() - Check if bulk delete is available');
console.log('- testDashboardRefresh() - Test dashboard auto-refresh');
console.log('- forceDashboardRefresh() - Force dashboard to refresh');
console.log('- checkPageLocation() - Check current page location');
console.log('='.repeat(50));
