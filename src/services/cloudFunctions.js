import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/config/firebase.js';

// 初始化 Firebase Functions
const functions = getFunctions(app);

/**
 * 云函数服务类
 */
class CloudFunctionService {
  constructor() {
    this.functions = functions;
  }

  /**
   * 发送联系邮件
   * @param {Object} contactData - 联系表单数据
   * @returns {Promise<Object>} 发送结果
   */
  async sendContactEmail(contactData) {
    try {
      console.log('Sending contact email via cloud function:', contactData);
      
      const response = await fetch(`${this.getFunctionUrl()}/sendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          data: contactData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Contact email result:', result);
      
      return result;
    } catch (error) {
      console.error('Failed to send contact email via cloud function:', error);
      throw error;
    }
  }

  /**
   * 获取用户资料
   * @returns {Promise<Object>} 用户资料
   */
  async getUserProfile() {
    try {
      const getUserProfile = httpsCallable(this.functions, 'getUserProfile');
      const result = await getUserProfile();
      
      console.log('User profile result:', result.data);
      return result.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  /**
   * 获取资源统计信息
   * @returns {Promise<Object>} 资源统计
   */
  async getResourceStats() {
    try {
      const getResourceStats = httpsCallable(this.functions, 'getResourceStats');
      const result = await getResourceStats();
      
      console.log('Resource stats result:', result.data);
      return result.data;
    } catch (error) {
      console.error('Failed to get resource stats:', error);
      throw error;
    }
  }

  /**
   * 处理用户数据
   * @param {string} operation - 操作类型
   * @param {Object} data - 数据
   * @returns {Promise<Object>} 处理结果
   */
  async processUserData(operation, data) {
    try {
      const response = await fetch(`${this.getFunctionUrl()}/processData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation,
          data
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Data processing result:', result);
      
      return result;
    } catch (error) {
      console.error('Failed to process user data:', error);
      throw error;
    }
  }

  /**
   * 健康检查
   * @returns {Promise<Object>} 健康状态
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.getFunctionUrl()}/healthCheck`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Health check result:', result);
      
      return result;
    } catch (error) {
      console.error('Failed to perform health check:', error);
      throw error;
    }
  }

  /**
   * 获取云函数基础 URL
   * @returns {string} 云函数 URL
   */
  getFunctionUrl() {
    // 在开发环境中使用本地模拟器
    if (import.meta.env.DEV) {
      return 'http://localhost:5001/mens-health-app-b7749/us-central1';
    }
    
    // 在生产环境中使用实际的云函数 URL
    return 'https://us-central1-mens-health-app-b7749.cloudfunctions.net';
  }

  /**
   * 发送欢迎邮件
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 发送结果
   */
  async sendWelcomeEmail(userData) {
    try {
      const response = await fetch(`${this.getFunctionUrl()}/sendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'welcome',
          data: userData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Welcome email result:', result);
      
      return result;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  /**
   * 发送密码重置邮件
   * @param {Object} resetData - 重置数据
   * @returns {Promise<Object>} 发送结果
   */
  async sendPasswordResetEmail(resetData) {
    try {
      const response = await fetch(`${this.getFunctionUrl()}/sendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'passwordReset',
          data: resetData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Password reset email result:', result);
      
      return result;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }
}

// 创建单例实例
const cloudFunctionService = new CloudFunctionService();

export default cloudFunctionService;

