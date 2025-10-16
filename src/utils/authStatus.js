/**
 * Authentication Status Debugging Utilities
 * 用于调试认证状态同步问题
 */

import { getCurrentUser } from './auth.js';

/**
 * 检查当前认证状态
 */
export async function checkAuthStatus() {
  console.log('🔍 Checking authentication status...');
  
  try {
    const user = await getCurrentUser();
    console.log('📱 Current user:', user);
    
    // 检查 localStorage 中的用户数据
    const localUser = localStorage.getItem('currentUser');
    console.log('💾 Local storage user:', localUser ? JSON.parse(localUser) : 'No local user');
    
    // 检查 Firebase Auth 状态
    if (typeof window !== 'undefined' && window.firebase) {
      const firebaseUser = window.firebase.auth().currentUser;
      console.log('🔥 Firebase auth user:', firebaseUser);
    }
    
    return {
      hasUser: !!user,
      user: user,
      localUser: localUser ? JSON.parse(localUser) : null
    };
  } catch (error) {
    console.error('❌ Error checking auth status:', error);
    return {
      hasUser: false,
      user: null,
      error: error.message
    };
  }
}

/**
 * 强制刷新认证状态
 */
export async function refreshAuthStatus() {
  console.log('🔄 Refreshing authentication status...');
  
  try {
    // 清除可能缓存的用户数据
    localStorage.removeItem('currentUser');
    
    // 重新获取用户数据
    const user = await getCurrentUser();
    
    // 触发认证状态变化事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth_status_refreshed', { 
        detail: { user } 
      }));
    }
    
    console.log('✅ Auth status refreshed:', user);
    return user;
  } catch (error) {
    console.error('❌ Error refreshing auth status:', error);
    throw error;
  }
}

/**
 * 监听认证状态变化
 */
export function listenToAuthChanges(callback) {
  if (typeof window === 'undefined') return;
  
  const handleAuthChange = (event) => {
    console.log('🔔 Auth change detected:', event.type);
    callback(event.detail);
  };
  
  // 监听各种认证事件
  window.addEventListener('auth_status_refreshed', handleAuthChange);
  window.addEventListener('AUTH_CHANGED_EVENT', handleAuthChange);
  window.addEventListener('firebase_auth_changed', handleAuthChange);
  
  return () => {
    window.removeEventListener('auth_status_refreshed', handleAuthChange);
    window.removeEventListener('AUTH_CHANGED_EVENT', handleAuthChange);
    window.removeEventListener('firebase_auth_changed', handleAuthChange);
  };
}

// 导出到全局对象以便在浏览器控制台中使用
if (typeof window !== 'undefined') {
  window.authStatus = {
    checkAuthStatus,
    refreshAuthStatus,
    listenToAuthChanges
  };
}
