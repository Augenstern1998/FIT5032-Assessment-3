import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/config/firebase.js';

// Initialize Firebase Functions
const functions = getFunctions(app);

/**
 * Cloud Functions service class
 */
class CloudFunctionService {
  constructor() {
    this.functions = functions;
  }

  /**
   * Send contact email
   * @param {Object} contactData - Contact form data
   * @returns {Promise<Object>} Send result
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
   * Get user profile
   * @returns {Promise<Object>} User profile
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
   * Get resource statistics
   * @returns {Promise<Object>} Resource statistics
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
   * Process user data
   * @param {string} operation - Operation type
   * @param {Object} data - Data
   * @returns {Promise<Object>} Processing result
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
   * Health check
   * @returns {Promise<Object>} Health status
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
   * Get cloud functions base URL
   * @returns {string} Cloud functions URL
   */
  getFunctionUrl() {
    // Use local emulator in development environment
    if (import.meta.env.DEV) {
      return 'http://localhost:5001/mens-health-app-b7749/us-central1';
    }
    
    // Use actual cloud functions URL in production environment
    return 'https://us-central1-mens-health-app-b7749.cloudfunctions.net';
  }

  /**
   * Send welcome email
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Send result
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
   * Send password reset email
   * @param {Object} resetData - Reset data
   * @returns {Promise<Object>} Send result
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

// Create singleton instance
const cloudFunctionService = new CloudFunctionService();

export default cloudFunctionService;

