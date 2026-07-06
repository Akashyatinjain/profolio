const testMail = async () => {
  const accessKey = '4f104b7a-1c3e-4cc2-b241-1b47e0657dc4';
  console.log('Testing Web3Forms API with key:', accessKey);
  
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: "Test Runner",
        email: "test@example.com",
        subject: "Integration Test",
        message: "Hello from local portfolio runner! This is a test email.",
        from_name: "Portfolio Test"
      })
    });

    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);
    
    const text = await response.text();
    console.log('Response Text (first 500 chars):', text.slice(0, 500));
  } catch (error) {
    console.error('Network error during Web3Forms test:', error);
  }
};

testMail();
