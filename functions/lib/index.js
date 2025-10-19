"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResourceStats = exports.getUserStats = exports.processData = exports.sendEmail = exports.healthCheck = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
// Email service removed - using EmailJS instead
// Initialize Firebase Admin
admin.initializeApp();
// CORS configuration
const corsHandler = (0, cors_1.default)({ origin: true });
// Health check endpoint
exports.healthCheck = functions.https.onRequest((req, res) => {
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
exports.sendEmail = functions.https.onRequest((req, res) => {
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
        }
        catch (error) {
            console.error('Email function error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    });
});
// Data processing cloud function
exports.processData = functions.https.onRequest((req, res) => {
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
                data: Object.assign(Object.assign({}, data), { processedBy: 'cloud-function', id: `processed_${Date.now()}` })
            };
            res.status(200).json({
                success: true,
                result
            });
        }
        catch (error) {
            console.error('Data processing error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    });
});
// User statistics cloud function
exports.getUserStats = functions.https.onRequest((req, res) => {
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
        }
        catch (error) {
            console.error('Get user stats error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    });
});
// Resource statistics cloud function
exports.getResourceStats = functions.https.onRequest((req, res) => {
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
        }
        catch (error) {
            console.error('Get resource stats error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    });
});
//# sourceMappingURL=index.js.map