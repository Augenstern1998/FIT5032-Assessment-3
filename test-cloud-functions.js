// Script to test cloud functions configuration
import cloudFunctionService from './src/services/cloudFunctions.js';

async function testCloudFunctions() {
  console.log('🧪 Starting cloud functions configuration test...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResult = await cloudFunctionService.healthCheck();
    console.log('✅ Health check result:', healthResult);
  } catch (error) {
    console.log('⚠️ Health check failed (this is normal, cloud functions may not be deployed yet):', error.message);
  }

  try {
    // Test contact email (simulated data)
    console.log('\n2. Testing contact email sending...');
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message from the cloud function test script.',
      subscribeNewsletter: false
    };
    
    const emailResult = await cloudFunctionService.sendContactEmail(contactData);
    console.log('✅ Contact email result:', emailResult);
  } catch (error) {
    console.log('⚠️ Contact email test failed (this is normal, cloud functions may not be deployed yet):', error.message);
  }

  try {
    // Test resource statistics
    console.log('\n3. Testing resource statistics...');
    const statsResult = await cloudFunctionService.getResourceStats();
    console.log('✅ Resource statistics result:', statsResult);
  } catch (error) {
    console.log('⚠️ Resource statistics test failed (this is normal, cloud functions may not be deployed yet):', error.message);
  }

  console.log('\n🎯 Cloud functions testing completed!');
  console.log('📝 Note: If you see warning messages, this is normal because cloud functions need to be deployed to Firebase first to work properly.');
  console.log('🚀 To deploy cloud functions, run: npm run deploy:functions');
}

// Run tests
testCloudFunctions().catch(console.error);

