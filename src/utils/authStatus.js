/**
 * Authentication Status Debugging Utilities
 * For debugging authentication state synchronization issues
 */

import { getCurrentUser } from './auth.js';

/**
 * Check current authentication status
 */
export async function checkAuthStatus() {
  console.log('🔍 Checking authentication status...');
  
  try {
    const user = await getCurrentUser();
    console.log('📱 Current user:', user);
    
    // Check user data in localStorage
    const localUser = localStorage.getItem('currentUser');
    console.log('💾 Local storage user:', localUser ? JSON.parse(localUser) : 'No local user');
    
    // Check Firebase Auth status
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
 * Force refresh authentication status
 */
export async function refreshAuthStatus() {
  console.log('🔄 Refreshing authentication status...');
  
  try {
    // Clear potentially cached user data
    localStorage.removeItem('currentUser');
    
    // Re-fetch user data
    const user = await getCurrentUser();
    
    // Trigger authentication state change event
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
 * Listen to authentication state changes
 */
export function listenToAuthChanges(callback) {
  if (typeof window === 'undefined') return;
  
  const handleAuthChange = (event) => {
    console.log('🔔 Auth change detected:', event.type);
    callback(event.detail);
  };
  
  // Listen to various authentication events
  window.addEventListener('auth_status_refreshed', handleAuthChange);
  window.addEventListener('AUTH_CHANGED_EVENT', handleAuthChange);
  window.addEventListener('firebase_auth_changed', handleAuthChange);
  
  return () => {
    window.removeEventListener('auth_status_refreshed', handleAuthChange);
    window.removeEventListener('AUTH_CHANGED_EVENT', handleAuthChange);
    window.removeEventListener('firebase_auth_changed', handleAuthChange);
  };
}

// Export to global object for use in browser console
if (typeof window !== 'undefined') {
  window.authStatus = {
    checkAuthStatus,
    refreshAuthStatus,
    listenToAuthChanges
  };
}
