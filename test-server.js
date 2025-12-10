// Quick test to check if server is running
const testServer = async () => {
  try {
    console.log('Testing server connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.text();
      console.log('Health response:', healthData);
    }
    
    // Test a simple API endpoint
    const blogsResponse = await fetch('http://localhost:5000/api/blogs');
    console.log('Blogs endpoint status:', blogsResponse.status);
    
    if (blogsResponse.ok) {
      const blogsData = await blogsResponse.json();
      console.log('Blogs count:', blogsData.length);
    }
    
  } catch (error) {
    console.error('Server test failed:', error.message);
    console.log('\n❌ Server is not running or not accessible');
    console.log('💡 To start the server:');
    console.log('   cd server');
    console.log('   npm install');
    console.log('   npm start');
  }
};

testServer();
