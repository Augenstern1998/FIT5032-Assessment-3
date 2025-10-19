// Firebase Authentication utilities
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

export const AUTH_CHANGED_EVENT = 'firebase_auth_changed';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.addScope('openid');
// Set custom parameters for better OAuth flow
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Emit auth changed event
function emitAuthChanged() {
  try { 
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT)); 
  } catch (e) {
    console.warn('Could not emit auth changed event:', e);
  }
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!auth.currentUser;
}

// Register user with email and password
export async function registerUser({ name, email, password, role = 'member' }) {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: name
    });

    // Send email verification
    await sendEmailVerification(user);

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      role: role,
      createdAt: new Date().toISOString(),
      emailVerified: false,
      lastLoginAt: new Date().toISOString()
    });

    // Update last login time
    await updateDoc(doc(db, 'users', user.uid), {
      lastLoginAt: new Date().toISOString()
    });

    emitAuthChanged();
    return {
      uid: user.uid,
      name: name,
      email: email,
      role: role,
      emailVerified: false
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

// Login user with email and password
export async function loginUser({ email, password }) {
  try {
    console.log('Firebase Auth: Starting signInWithEmailAndPassword...');
    console.log('Firebase Auth: Email:', email);
    console.log('Firebase Auth: Password provided:', !!password);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Firebase Auth: Sign in successful, user:', user.uid);

    // Update last login time in Firestore
    console.log('Firebase Auth: Updating last login time...');
    await updateDoc(doc(db, 'users', user.uid), {
      lastLoginAt: new Date().toISOString()
    });

    // Get user data from Firestore
    console.log('Firebase Auth: Getting user data from Firestore...');
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    console.log('Firebase Auth: User data:', userData);

    console.log('Firebase Auth: Emitting auth changed event...');
    emitAuthChanged();
    
    const result = {
      uid: user.uid,
      name: user.displayName || userData?.name || 'User',
      email: user.email,
      role: userData?.role || 'member',
      emailVerified: user.emailVerified
    };
    
    console.log('Firebase Auth: Returning user result:', result);
    
    // ✅ Immediately write session to avoid race conditions
    import('./session.js').then(({ setSession }) => {
      setSession(user.uid, 12); // 12 hours validity
    });
    
    return result;
  } catch (error) {
    console.error('Firebase Auth: Login error:', error);
    console.error('Firebase Auth: Error code:', error.code);
    console.error('Firebase Auth: Error message:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

// Login with Google (Popup method with COOP fallback)
export async function loginWithGoogle() {
  console.log('Starting Google login process...');
  
  // ✅ Set persistence
  await setPersistence(auth, browserLocalPersistence);
  
  // ✅ If page is COOP/COEP isolated, use redirect method for stability
  if (window.crossOriginIsolated) {
    console.log('Page is crossOriginIsolated, using redirect method...');
    await signInWithRedirect(auth, googleProvider);
    return;
  }

  try {
    console.log('Starting Google login with popup...');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('Google login successful:', user);

    // Check if user document exists
    console.log('Checking user document for UID:', user.uid);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    console.log('User document exists:', userDoc.exists());
    
    if (!userDoc.exists()) {
      // Create new user document for Google sign-in
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: 'member', // Default role for Google sign-in
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
        lastLoginAt: new Date().toISOString(),
        provider: 'google'
      });
    } else {
      // Update last login time
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date().toISOString()
      });
    }

    // ✅ Immediately write session to avoid race conditions
    import('./session.js').then(({ setSession }) => {
      setSession(user.uid, 12); // 12 hours validity
    });

    const userData = userDoc.exists() ? userDoc.data() : {
      name: user.displayName,
      email: user.email,
      role: 'member',
      emailVerified: user.emailVerified
    };

    emitAuthChanged();
    return {
      uid: user.uid,
      name: userData.name || user.displayName,
      email: user.email,
      role: userData.role || 'member',
      emailVerified: user.emailVerified
    };
  } catch (error) {
    console.error('Google popup login error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // ✅ Check typical scenarios: blocked/closed/concurrent popup → auto fallback to Redirect
    const code = String(error?.code || '');
    if (
      code === 'auth/popup-blocked' ||
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/unauthorized-domain'
    ) {
      console.log('Popup blocked/closed/unauthorized domain, falling back to redirect...');
      try {
        await signInWithRedirect(auth, googleProvider);
        return;
      } catch (redirectError) {
        console.error('Redirect fallback also failed:', redirectError);
        throw new Error(getAuthErrorMessage(redirectError.code));
      }
    } else {
      throw new Error(getAuthErrorMessage(error.code));
    }
  }
}

// Logout user
export async function logout() {
  try {
    console.log('Firebase logout: Starting signOut...');
    
    // ✅ Clear local session first
    import('./session.js').then(({ clearSession }) => {
      clearSession();
    });
    
    await signOut(auth);
    console.log('Firebase logout: signOut completed');
    emitAuthChanged();
    console.log('Firebase logout: Auth changed event emitted');
  } catch (error) {
    console.error('Firebase logout error:', error);
    // Don't throw error, just log it and emit auth changed anyway
    emitAuthChanged();
    console.log('Firebase logout: Emitted auth changed despite error');
  }
}

// Send password reset email
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

// Get user data from Firestore
export async function getUserData(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Get user data error:', error);
    return null;
  }
}

// Update user data in Firestore
export async function updateUserData(uid, data) {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Update user data error:', error);
    throw new Error('Failed to update user data');
  }
}

// Get all users (admin only)
export async function getAllUsers() {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      // Remove sensitive data
      delete userData.passwordHash;
      users.push({
        id: doc.id,
        ...userData
      });
    });
    return users;
  } catch (error) {
    console.error('Get all users error:', error);
    throw new Error('Failed to fetch users');
  }
}

// Auth state listener
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Get user-friendly error messages
function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    default:
      return 'Authentication failed. Please try again.';
  }
}

// Login with Google (Redirect method - fallback)
export async function loginWithGoogleRedirect() {
  try {
    console.log('Starting Google login with redirect...');
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error('Google redirect login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

// Handle redirect result
export async function handleRedirectResult() {
  try {
    console.log('Checking for redirect result...');
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      console.log('Google redirect login successful:', user);
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document for Google sign-in
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: 'member',
          createdAt: new Date().toISOString(),
          emailVerified: user.emailVerified,
          lastLoginAt: new Date().toISOString(),
          provider: 'google'
        });
        console.log('Created new user document');
      } else {
        // Update last login time
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date().toISOString()
        });
        console.log('Updated existing user document');
      }

      emitAuthChanged();
      console.log('Auth changed event emitted');
      
      return {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: 'member',
        emailVerified: user.emailVerified
      };
    }
    console.log('No redirect result found');
    return null;
  } catch (error) {
    console.error('Handle redirect result error:', error);
    // Don't throw error, just return null to allow app to continue
    return null;
  }
}

export default {
  getCurrentUser,
  isAuthenticated,
  registerUser,
  loginUser,
  loginWithGoogle,
  loginWithGoogleRedirect,
  handleRedirectResult,
  logout,
  resetPassword,
  getUserData,
  updateUserData,
  getAllUsers,
  onAuthStateChange,
  AUTH_CHANGED_EVENT
};
