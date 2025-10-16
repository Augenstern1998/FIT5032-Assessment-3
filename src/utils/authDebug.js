/**
 * Authentication Debug Utilities
 * 用于调试认证状态和用户信息
 */

import { auth, db } from '../config/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { getCurrentUser } from './auth.js';

/**
 * 获取详细的用户信息用于调试
 */
export async function getDebugUserInfo() {
  console.log('🔍 Debugging user authentication...');
  
  // 1. 检查 Firebase Auth 状态
  console.log('📱 Firebase Auth Current User:', auth.currentUser);
  
  if (auth.currentUser) {
    console.log('✅ Firebase Auth Info:', {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName,
      emailVerified: auth.currentUser.emailVerified
    });
    
    // 2. 检查 Firestore 中的用户数据
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      console.log('📄 Firestore User Document:', userDoc.exists() ? userDoc.data() : 'Document does not exist');
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('👤 User Data from Firestore:', {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: userData.createdAt
        });
      }
    } catch (error) {
      console.error('❌ Error reading from Firestore:', error);
    }
  } else {
    console.log('❌ No Firebase Auth user found');
  }
  
  // 3. 检查 getCurrentUser() 函数结果
  try {
    const currentUser = await getCurrentUser();
    console.log('🎯 getCurrentUser() result:', currentUser);
    return currentUser;
  } catch (error) {
    console.error('❌ Error in getCurrentUser():', error);
    return null;
  }
}

/**
 * 检查用户是否有 admin 权限
 */
export async function checkAdminPermission() {
  console.log('🔐 Checking admin permission...');
  
  const user = await getCurrentUser();
  console.log('👤 Current user:', user);
  
  if (!user) {
    console.log('❌ No user found - not authenticated');
    return false;
  }
  
  console.log('👤 User role:', user.role);
  const isAdmin = user.role === 'admin';
  console.log('✅ Is admin:', isAdmin);
  
  return isAdmin;
}

/**
 * 强制更新用户角色
 */
export async function updateUserRoleToAdmin(userEmail = 'admin@menshealth.com') {
  console.log('🔄 Updating user role to admin...');
  
  if (!auth.currentUser) {
    console.log('❌ No user logged in');
    return false;
  }
  
  try {
    // 更新 Firestore 中的用户角色
    const { updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      role: 'admin',
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ User role updated to admin');
    return true;
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    return false;
  }
}

/**
 * 创建 admin 用户（如果不存在）
 */
export async function ensureAdminUser() {
  console.log('🚀 Ensuring admin user exists...');
  
  try {
    // 导入用户创建函数
    const { createTestUser } = await import('./userDebug.js');
    
    // 尝试创建 admin 用户
    const adminUser = await createTestUser(
      'admin@menshealth.com',
      'admin123',
      'Admin User',
      'admin'
    );
    
    console.log('✅ Admin user ensured:', adminUser);
    return adminUser;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('✅ Admin user already exists');
      return { success: true, message: 'Admin user already exists' };
    } else {
      console.error('❌ Error ensuring admin user:', error);
      throw error;
    }
  }
}

/**
 * 完整的认证状态检查
 */
export async function fullAuthCheck() {
  console.log('🔍 === FULL AUTHENTICATION CHECK ===');
  
  // 1. 检查 Firebase Auth
  console.log('\n1. Firebase Auth Status:');
  console.log('Current User:', auth.currentUser);
  
  // 2. 检查用户数据
  console.log('\n2. User Data Check:');
  const user = await getDebugUserInfo();
  
  // 3. 检查权限
  console.log('\n3. Permission Check:');
  const isAdmin = await checkAdminPermission();
  
  // 4. 总结
  console.log('\n📊 === SUMMARY ===');
  console.log('Authenticated:', !!auth.currentUser);
  console.log('User Data Available:', !!user);
  console.log('Is Admin:', isAdmin);
  console.log('Can Access Admin:', isAdmin);
  
  return {
    authenticated: !!auth.currentUser,
    user: user,
    isAdmin: isAdmin,
    canAccessAdmin: isAdmin
  };
}

// 导出到全局对象以便在浏览器控制台中使用
if (typeof window !== 'undefined') {
  window.authDebug = {
    getDebugUserInfo,
    checkAdminPermission,
    updateUserRoleToAdmin,
    ensureAdminUser,
    fullAuthCheck
  };
}
