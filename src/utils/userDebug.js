/**
 * User Debug Utilities
 * 用于调试和修复用户认证问题
 */

import { auth, db } from '../config/firebase.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';

/**
 * 创建测试用户（仅用于开发环境）
 */
export async function createTestUser(email, password, name = 'Test User', role = 'admin') {
  try {
    console.log('Creating test user...', { email, name, role });
    
    // 创建 Firebase 认证用户
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 更新用户显示名称
    await updateProfile(user, {
      displayName: name
    });
    
    // 在 Firestore 中创建用户文档
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      role: role,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    });
    
    console.log('Test user created successfully:', {
      uid: user.uid,
      email: user.email,
      name: name,
      role: role
    });
    
    return {
      uid: user.uid,
      name: name,
      email: email,
      role: role,
      emailVerified: false
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

/**
 * 重置用户密码
 */
export async function resetUserPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error;
  }
}

/**
 * 检查用户是否存在
 */
export async function checkUserExists(email) {
  try {
    // 尝试登录来检查用户是否存在
    // 注意：这会失败，但我们可以从错误信息中判断
    await signInWithEmailAndPassword(auth, email, 'dummy-password');
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log('User does not exist:', email);
      return false;
    } else if (error.code === 'auth/wrong-password') {
      console.log('User exists but wrong password:', email);
      return true;
    } else {
      console.error('Error checking user:', error);
      throw error;
    }
  }
  return true;
}

/**
 * 获取用户信息（不登录）
 */
export async function getUserInfo(email) {
  try {
    // 这个方法只能用于已登录的用户
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      return userDoc.exists() ? userDoc.data() : null;
    }
    return null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
}

/**
 * 更新用户角色
 */
export async function updateUserRole(uid, newRole) {
  try {
    await updateDoc(doc(db, 'users', uid), {
      role: newRole,
      updatedAt: new Date().toISOString()
    });
    console.log('User role updated:', { uid, newRole });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * 列出所有用户（仅用于调试）
 */
export async function listAllUsers() {
  try {
    if (auth.currentUser) {
      console.log('Current user:', auth.currentUser.email);
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      console.log('User data:', userDoc.exists() ? userDoc.data() : 'No data');
    }
  } catch (error) {
    console.error('Error listing users:', error);
  }
}

/**
 * 开发环境快速设置
 */
export async function quickSetup() {
  console.log('🚀 Starting quick setup for development...');
  
  try {
    // 创建默认的 admin 用户
    const adminEmail = 'admin@menshealth.com';
    const adminPassword = 'admin123';
    
    console.log('Creating admin user...');
    const adminUser = await createTestUser(adminEmail, adminPassword, 'Admin User', 'admin');
    
    console.log('✅ Quick setup completed!');
    console.log('📧 Admin Email:', adminEmail);
    console.log('🔑 Admin Password:', adminPassword);
    console.log('👤 User Data:', adminUser);
    
    return {
      success: true,
      adminEmail,
      adminPassword,
      adminUser
    };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('✅ Admin user already exists');
      return {
        success: true,
        message: 'Admin user already exists',
        adminEmail: 'admin@menshealth.com',
        adminPassword: 'admin123'
      };
    } else {
      console.error('❌ Quick setup failed:', error);
      throw error;
    }
  }
}

// 导出到全局对象以便在浏览器控制台中使用
if (typeof window !== 'undefined') {
  window.userDebug = {
    createTestUser,
    resetUserPassword,
    checkUserExists,
    getUserInfo,
    updateUserRole,
    listAllUsers,
    quickSetup
  };
}
