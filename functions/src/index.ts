import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';
// Email service removed - using EmailJS instead

// Initialize Firebase Admin
admin.initializeApp();

// CORS configuration
const corsHandler = cors({ origin: true });

// Health check endpoint
export const healthCheck = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      message: 'FIT5032 Assessment 3 Cloud Functions are running!'
    });
  });
});

// Email sending cloud function
export const sendEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      // Only allow POST requests
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const { type, data } = req.body;

      if (!type || !data) {
        res.status(400).json({ error: 'Missing required fields: type and data' });
        return;
      }

      console.log('Email request received:', { type, data });

      // Email service removed - using EmailJS instead
      // This endpoint is kept for compatibility but does not send emails
      res.status(200).json({
        success: true,
        message: 'Email service moved to EmailJS - this endpoint is deprecated',
        id: `deprecated_${Date.now()}`,
        type: type
      });
    } catch (error) {
      console.error('Email function error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });
});

// Data processing cloud function
export const processData = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const { operation, data } = req.body;

      if (!operation || !data) {
        res.status(400).json({ error: 'Missing required fields: operation and data' });
        return;
      }

      console.log('Data processing request:', { operation, data });

      // Simulate data processing
      const result = {
        operation,
        processed: true,
        timestamp: new Date().toISOString(),
        data: {
          ...data,
          processedBy: 'cloud-function',
          id: `processed_${Date.now()}`
        }
      };

      res.status(200).json({
        success: true,
        result
      });
    } catch (error) {
      console.error('Data processing error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });
});

// User statistics cloud function
export const getUserStats = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      console.log('Getting user stats...');

      // Simulate user statistics
      const stats = {
        totalUsers: 150,
        activeUsers: 120,
        newUsersThisMonth: 25,
        lastUpdated: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });
});

// Resource statistics cloud function
export const getResourceStats = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      console.log('Getting resource stats...');

      // Simulate resource statistics
      const stats = {
        totalResources: 45,
        activeResources: 42,
        categories: {
          'health': 15,
          'fitness': 12,
          'nutrition': 8,
          'mental-health': 10
        },
        averageRating: 4.2,
        totalRatings: 38,
        lastUpdated: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Get resource stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });
});