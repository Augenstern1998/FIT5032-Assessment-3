// 测试云函数配置的脚本
import cloudFunctionService from './src/services/cloudFunctions.js';

async function testCloudFunctions() {
  console.log('🧪 开始测试云函数配置...\n');

  try {
    // 测试健康检查
    console.log('1. 测试健康检查...');
    const healthResult = await cloudFunctionService.healthCheck();
    console.log('✅ 健康检查结果:', healthResult);
  } catch (error) {
    console.log('⚠️ 健康检查失败 (这是正常的，因为云函数可能还未部署):', error.message);
  }

  try {
    // 测试联系邮件（模拟数据）
    console.log('\n2. 测试联系邮件发送...');
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message from the cloud function test script.',
      subscribeNewsletter: false
    };
    
    const emailResult = await cloudFunctionService.sendContactEmail(contactData);
    console.log('✅ 联系邮件结果:', emailResult);
  } catch (error) {
    console.log('⚠️ 联系邮件测试失败 (这是正常的，因为云函数可能还未部署):', error.message);
  }

  try {
    // 测试资源统计
    console.log('\n3. 测试资源统计...');
    const statsResult = await cloudFunctionService.getResourceStats();
    console.log('✅ 资源统计结果:', statsResult);
  } catch (error) {
    console.log('⚠️ 资源统计测试失败 (这是正常的，因为云函数可能还未部署):', error.message);
  }

  console.log('\n🎯 云函数测试完成！');
  console.log('📝 注意: 如果看到警告信息，这是正常的，因为云函数需要先部署到 Firebase 才能正常工作。');
  console.log('🚀 要部署云函数，请运行: npm run deploy:functions');
}

// 运行测试
testCloudFunctions().catch(console.error);

