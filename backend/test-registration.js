const testRegistration = async () => {
  try {
    const registrationData = {
      fullName: "Test User",
      email: "test@example.com",
      phone: "0901234567",
      organization: "Test Company",
      jobTitle: "Developer",
      eventId: "1",
      eventTitle: "Test Event",
      participationType: "in-person",
      dietaryRequirements: "none", // Valid option instead of empty string
      accessibilityNeeds: "",
      marketingConsent: false,
      privacyConsent: true
    };

    console.log('Testing event registration API...');
    console.log('Registration data:', registrationData);

    const response = await fetch('http://localhost:3000/api/event-registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    const result = await response.json();

    console.log('Response status:', response.status);
    console.log('Response data:', result);

    if (response.ok) {
      console.log('✅ Registration created successfully!');
      console.log('Registration ID:', result.registration.id);
    } else {
      console.log('❌ Registration failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testRegistration();
