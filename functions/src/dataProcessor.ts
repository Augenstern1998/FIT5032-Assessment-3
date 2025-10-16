import * as admin from 'firebase-admin';

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

interface ResourceData {
  id: string;
  title: string;
  category: string;
  description: string;
  url?: string;
  rating?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * 处理用户数据操作
 */
export async function processUserData(operation: string, data: any): Promise<ProcessingResult> {
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
  } catch (error) {
    console.error('Data processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 创建用户记录
 */
async function createUser(userData: UserData): Promise<ProcessingResult> {
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
      data: { uid: userData.uid, ...userDoc }
    };
  } catch (error) {
    console.error('Failed to create user:', error);
    return {
      success: false,
      error: 'Failed to create user'
    };
  }
}

/**
 * 更新用户信息
 */
async function updateUser(userData: Partial<UserData> & { uid: string }): Promise<ProcessingResult> {
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
      data: { uid: userData.uid, ...updateData }
    };
  } catch (error) {
    console.error('Failed to update user:', error);
    return {
      success: false,
      error: 'Failed to update user'
    };
  }
}

/**
 * 获取用户统计信息
 */
async function getUserStats(data: any): Promise<ProcessingResult> {
  try {
    const usersSnapshot = await admin.firestore().collection('users').get();
    
    const stats = {
      totalUsers: usersSnapshot.size,
      activeUsers: 0,
      newUsersThisMonth: 0,
      categories: {} as Record<string, number>
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
  } catch (error) {
    console.error('Failed to get user stats:', error);
    return {
      success: false,
      error: 'Failed to get user statistics'
    };
  }
}

/**
 * 创建资源记录
 */
async function createResource(resourceData: Omit<ResourceData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProcessingResult> {
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
  } catch (error) {
    console.error('Failed to create resource:', error);
    return {
      success: false,
      error: 'Failed to create resource'
    };
  }
}

/**
 * 更新资源信息
 */
async function updateResource(resourceData: Partial<ResourceData> & { id: string }): Promise<ProcessingResult> {
  try {
    const resourceRef = admin.firestore().collection('resources').doc(resourceData.id);
    
    const updateData: any = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (resourceData.title) updateData.title = resourceData.title;
    if (resourceData.category) updateData.category = resourceData.category;
    if (resourceData.description) updateData.description = resourceData.description;
    if (resourceData.url) updateData.url = resourceData.url;
    if (resourceData.rating) updateData.rating = resourceData.rating;
    if (resourceData.tags) updateData.tags = resourceData.tags;

    await resourceRef.update(updateData);
    
    console.log('Resource updated successfully:', resourceData.id);
    
    return {
      success: true,
      data: { id: resourceData.id, ...updateData }
    };
  } catch (error) {
    console.error('Failed to update resource:', error);
    return {
      success: false,
      error: 'Failed to update resource'
    };
  }
}

/**
 * 获取资源统计信息
 */
async function getResourceStats(data: any): Promise<ProcessingResult> {
  try {
    const resourcesSnapshot = await admin.firestore().collection('resources').get();
    
    const stats = {
      totalResources: resourcesSnapshot.size,
      activeResources: 0,
      categories: {} as Record<string, number>,
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
      
      // 统计分类
      const category = resourceData.category || 'uncategorized';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
      
      // 统计评分
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
  } catch (error) {
    console.error('Failed to get resource stats:', error);
    return {
      success: false,
      error: 'Failed to get resource statistics'
    };
  }
}
