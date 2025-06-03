// Test script to check current bulk delete response format
window.testCurrentFormat = function() {
  console.log("=== TESTING CURRENT BULK DELETE RESPONSE FORMAT ===");

  // Test with our current format
  console.log("Testing current format...");

  const url = "/api/event-registrations?where[id][in][0]=test1&where[id][in][1]=test2";

  fetch(url, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  })
  .then(async response => {
    const data = await response.json();
    console.log("=== CURRENT FORMAT RESPONSE ===");
    console.log("Status:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    console.log("Data:", JSON.stringify(data, null, 2));

    // Test what Payload expects vs what we return
    console.log("=== ANALYSIS ===");
    console.log("Has 'message' field:", !!data.message);
    console.log("Has 'docs' field:", !!data.docs);
    console.log("Has 'totalDocs' field:", !!data.totalDocs);
    console.log("Has 'errors' field:", !!data.errors);
    console.log("Has 'error' field:", !!data.error);
    console.log("Has 'success' field:", !!data.success);
  })
  .catch(err => {
    console.error("Error:", err);
  });
};

// Auto-run after 1 second
setTimeout(() => {
  if (typeof window !== 'undefined') {
    window.testCurrentFormat();
  }
}, 1000);
