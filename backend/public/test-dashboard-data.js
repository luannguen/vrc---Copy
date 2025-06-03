// Test script to verify dashboard data accuracy
console.log('🧪 Testing dashboard data accuracy...');

async function testDashboardData() {
  try {
    // Fetch all registrations
    const response = await fetch('/api/event-registrations', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📊 Raw API Response:', data);

    const registrations = data.docs || data.registrations || [];
    console.log('📋 Total registrations found:', registrations.length);

    // Analyze each registration
    console.log('\n🔍 Registration Analysis:');
    registrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.fullName || 'No name'}`);
      console.log(`   Status: ${reg.status || 'No status'}`);
      console.log(`   Participation: ${reg.participationType || 'No participation type'}`);
      console.log(`   Email: ${reg.email || 'No email'}`);
      console.log(`   Event: ${reg.eventTitle || 'No event title'}`);
      console.log(`   Created: ${reg.createdAt || 'No date'}`);
      console.log('');
    });

    // Calculate statistics manually
    const stats = {
      total: registrations.length,
      pending: registrations.filter(r => r.status === 'pending').length,
      confirmed: registrations.filter(r => r.status === 'confirmed').length,
      cancelled: registrations.filter(r => r.status === 'cancelled').length,
      byParticipationType: {
        'in-person': registrations.filter(r => r.participationType === 'in-person').length,
        'online': registrations.filter(r => r.participationType === 'online').length,
        'hybrid': registrations.filter(r => r.participationType === 'hybrid').length,
      }
    };

    console.log('📈 Calculated Statistics:');
    console.log(`Total: ${stats.total}`);
    console.log(`Pending: ${stats.pending}`);
    console.log(`Confirmed: ${stats.confirmed}`);
    console.log(`Cancelled: ${stats.cancelled}`);
    console.log(`In-person: ${stats.byParticipationType['in-person']}`);
    console.log(`Online: ${stats.byParticipationType['online']}`);
    console.log(`Hybrid: ${stats.byParticipationType['hybrid']}`);

    // Check for data issues
    console.log('\n⚠️  Data Validation:');
    const statusIssues = registrations.filter(r => !r.status || !['pending', 'confirmed', 'cancelled'].includes(r.status));
    const participationIssues = registrations.filter(r => !r.participationType || !['in-person', 'online', 'hybrid'].includes(r.participationType));

    if (statusIssues.length > 0) {
      console.log(`❌ ${statusIssues.length} registrations have invalid status:`, statusIssues.map(r => `${r.fullName}: ${r.status}`));
    }

    if (participationIssues.length > 0) {
      console.log(`❌ ${participationIssues.length} registrations have invalid participation type:`, participationIssues.map(r => `${r.fullName}: ${r.participationType}`));
    }

    if (statusIssues.length === 0 && participationIssues.length === 0) {
      console.log('✅ All registrations have valid data');
    }

    return stats;

  } catch (error) {
    console.error('❌ Error testing dashboard data:', error);
    return null;
  }
}

// Run the test
testDashboardData();
