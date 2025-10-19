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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUserData = processUserData;
const admin = __importStar(require("firebase-admin"));
/**
 * Process user data operations
 */
async function processUserData(operation, data) {
    try {
        switch (operation) {
            case 'createUser':
                return await createUser(data);
            case 'updateUser':
                return await updateUser(data);
            case 'getUserStats':
                return await getUserStats(data);
            case 'createResource':
                return await createResource(data);
            case 'updateResource':
                return await updateResource(data);
            case 'getResourceStats':
                return await getResourceStats(data);
            default:
                return {
                    success: false,
                    error: 'Invalid operation'
                };
        }
    }
    catch (error) {
        console.error('Data processing error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
/**
 * Create user record
 */
async function createUser(userData) {
    try {
        const userRef = admin.firestore().collection('users').doc(userData.uid);
        const userDoc = {
            email: userData.email,
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            isActive: true
        };
        await userRef.set(userDoc);
        console.log('User created successfully:', userData.uid);
        return {
            success: true,
            data: Object.assign({ uid: userData.uid }, userDoc)
        };
    }
    catch (error) {
        console.error('Failed to create user:', error);
        return {
            success: false,
            error: 'Failed to create user'
        };
    }
}
/**
 * Update user information
 */
async function updateUser(userData) {
    try {
        const userRef = admin.firestore().collection('users').doc(userData.uid);
        const updateData = {
            email: userData.email,
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        await userRef.update(updateData);
        console.log('User updated successfully:', userData.uid);
        return {
            success: true,
            data: Object.assign({ uid: userData.uid }, updateData)
        };
    }
    catch (error) {
        console.error('Failed to update user:', error);
        return {
            success: false,
            error: 'Failed to update user'
        };
    }
}
/**
 * Get user statistics
 */
async function getUserStats(data) {
    try {
        const usersSnapshot = await admin.firestore().collection('users').get();
        const stats = {
            totalUsers: usersSnapshot.size,
            activeUsers: 0,
            newUsersThisMonth: 0,
            categories: {}
        };
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.isActive) {
                stats.activeUsers++;
            }
            if (userData.createdAt && userData.createdAt.toDate() >= startOfMonth) {
                stats.newUsersThisMonth++;
            }
        });
        return {
            success: true,
            data: stats
        };
    }
    catch (error) {
        console.error('Failed to get user stats:', error);
        return {
            success: false,
            error: 'Failed to get user statistics'
        };
    }
}
/**
 * Create resource record
 */
async function createResource(resourceData) {
    try {
        const resourceRef = admin.firestore().collection('resources').doc();
        const resourceDoc = {
            title: resourceData.title,
            category: resourceData.category,
            description: resourceData.description,
            url: resourceData.url,
            rating: resourceData.rating,
            tags: resourceData.tags,
            id: resourceRef.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            isActive: true
        };
        await resourceRef.set(resourceDoc);
        console.log('Resource created successfully:', resourceRef.id);
        return {
            success: true,
            data: resourceDoc
        };
    }
    catch (error) {
        console.error('Failed to create resource:', error);
        return {
            success: false,
            error: 'Failed to create resource'
        };
    }
}
/**
 * Update resource information
 */
async function updateResource(resourceData) {
    try {
        const resourceRef = admin.firestore().collection('resources').doc(resourceData.id);
        const updateData = {
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        if (resourceData.title)
            updateData.title = resourceData.title;
        if (resourceData.category)
            updateData.category = resourceData.category;
        if (resourceData.description)
            updateData.description = resourceData.description;
        if (resourceData.url)
            updateData.url = resourceData.url;
        if (resourceData.rating)
            updateData.rating = resourceData.rating;
        if (resourceData.tags)
            updateData.tags = resourceData.tags;
        await resourceRef.update(updateData);
        console.log('Resource updated successfully:', resourceData.id);
        return {
            success: true,
            data: Object.assign({ id: resourceData.id }, updateData)
        };
    }
    catch (error) {
        console.error('Failed to update resource:', error);
        return {
            success: false,
            error: 'Failed to update resource'
        };
    }
}
/**
 * Get resource statistics
 */
async function getResourceStats(data) {
    try {
        const resourcesSnapshot = await admin.firestore().collection('resources').get();
        const stats = {
            totalResources: resourcesSnapshot.size,
            activeResources: 0,
            categories: {},
            averageRating: 0,
            totalRatings: 0
        };
        let totalRatingSum = 0;
        let ratingCount = 0;
        resourcesSnapshot.forEach(doc => {
            const resourceData = doc.data();
            if (resourceData.isActive) {
                stats.activeResources++;
            }
            // Count categories
            const category = resourceData.category || 'uncategorized';
            stats.categories[category] = (stats.categories[category] || 0) + 1;
            // Count ratings
            if (resourceData.rating && typeof resourceData.rating === 'number') {
                totalRatingSum += resourceData.rating;
                ratingCount++;
            }
        });
        if (ratingCount > 0) {
            stats.averageRating = totalRatingSum / ratingCount;
            stats.totalRatings = ratingCount;
        }
        return {
            success: true,
            data: stats
        };
    }
    catch (error) {
        console.error('Failed to get resource stats:', error);
        return {
            success: false,
            error: 'Failed to get resource statistics'
        };
    }
}
//# sourceMappingURL=dataProcessor.js.map