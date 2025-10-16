// Hybrid authentication utilities - Firebase Auth with local fallback
import { 
  getCurrentUser as getFirebaseUser,
  isAuthenticated as isFirebaseAuthenticated,
  registerUser as firebaseRegisterUser,
  loginUser as firebaseLoginUser,
  loginWithGoogle as firebaseLoginWithGoogle,
  logout as firebaseLogout,
  getAllUsers as firebaseGetAllUsers,
  AUTH_CHANGED_EVENT as FIREBASE_AUTH_CHANGED_EVENT
} from './firebaseAuth.js';

// Local authentication utilities (fallback)
const USERS_KEY = 'mh_users';
const SESSION_KEY = 'mh_session';
export const AUTH_CHANGED_EVENT = 'mh_auth_changed';

// Use Firebase as primary auth, local as fallback
const USE_FIREBASE = true;

function emitAuthChanged() {
  try { window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT)); } catch {}
}

function setSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Start idle timer for session security
    import('./session.js').then(({ startIdleTimer }) => {
      startIdleTimer(() => {
        logout();
        emitAuthChanged();
      });
    });
  } else {
    localStorage.removeItem(SESSION_KEY);
    // Stop idle timer
    import('./session.js').then(({ stopIdleTimer }) => {
      stopIdleTimer();
    });
  }
  emitAuthChanged();
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Local auth functions (fallback)
async function hashPassword(plainText) {
  const enc = new TextEncoder();
  const data = enc.encode(String(plainText));
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(digest));
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex;
}

async function localRegisterUser({ name, email, password, role = 'member' }) {
  const users = readUsers();
  const existing = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (existing) {
    throw new Error('Email is already registered.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const passwordHash = await hashPassword(password);
  const user = {
    id: Date.now(),
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    role,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  const session = { id: user.id, name: user.name, email: user.email, role: user.role };
  setSession(session);
  return session;
}

async function localLoginUser({ email, password }) {
  const users = readUsers();
  const u = users.find((x) => x.email.toLowerCase() === String(email).toLowerCase());
  if (!u) throw new Error('Account not found.');
  const passwordHash = await hashPassword(password);
  if (u.passwordHash !== passwordHash) throw new Error('Incorrect password.');
  const session = { id: u.id, name: u.name, email: u.email, role: u.role };
  setSession(session);
  return session;
}

function localGetCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function localIsAuthenticated() {
  return !!localGetCurrentUser();
}

function localGetAllUsersSafe() {
  return readUsers().map(({ passwordHash, ...rest }) => rest);
}

function localLogout() { 
  setSession(null); 
}

// Main exported functions - Firebase first, local fallback
export async function getCurrentUser() {
  if (USE_FIREBASE) {
    const firebaseUser = getFirebaseUser();
    if (firebaseUser) {
      // 尝试从 Firestore 获取用户角色
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../config/firebase.js');
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || userData.name || 'User',
            email: firebaseUser.email,
            role: userData.role || 'member',
            emailVerified: firebaseUser.emailVerified
          };
        }
      } catch (error) {
        console.warn('Failed to load user role from Firestore:', error);
      }
      
      // 回退到基本用户信息
      return {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        role: 'member',
        emailVerified: firebaseUser.emailVerified
      };
    }
  }
  return localGetCurrentUser();
}

export function isAuthenticated() {
  if (USE_FIREBASE) {
    return isFirebaseAuthenticated();
  }
  return localIsAuthenticated();
}

export async function registerUser(userData) {
  if (USE_FIREBASE) {
    try {
      return await firebaseRegisterUser(userData);
    } catch (error) {
      console.warn('Firebase registration failed, falling back to local:', error);
      return await localRegisterUser(userData);
    }
  }
  return await localRegisterUser(userData);
}

export async function loginUser(credentials) {
  if (USE_FIREBASE) {
    try {
      return await firebaseLoginUser(credentials);
    } catch (error) {
      console.warn('Firebase login failed, falling back to local:', error);
      return await localLoginUser(credentials);
    }
  }
  return await localLoginUser(credentials);
}

export async function loginWithGoogle() {
  if (USE_FIREBASE) {
    return await firebaseLoginWithGoogle();
  }
  throw new Error('Google login is only available with Firebase authentication');
}

export async function logout() {
  console.log('Auth logout: Starting logout process...');
  
  if (USE_FIREBASE) {
    try {
      console.log('Auth logout: Calling Firebase logout...');
      await firebaseLogout();
      console.log('Auth logout: Firebase logout completed');
      return;
    } catch (error) {
      console.warn('Auth logout: Firebase logout failed, falling back to local:', error);
    }
  }
  
  console.log('Auth logout: Calling local logout...');
  localLogout();
  console.log('Auth logout: Local logout completed');
}

export async function getAllUsersSafe() {
  if (USE_FIREBASE) {
    try {
      return await firebaseGetAllUsers();
    } catch (error) {
      console.warn('Firebase get users failed, falling back to local:', error);
      return localGetAllUsersSafe();
    }
  }
  return localGetAllUsersSafe();
}

export default {
  getCurrentUser,
  isAuthenticated,
  loginUser,
  registerUser,
  logout,
  hashPassword,
  getAllUsersSafe,
  AUTH_CHANGED_EVENT,
};


