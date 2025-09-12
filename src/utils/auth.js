// Local authentication utilities with SHA-256 hashing and session persistence

const USERS_KEY = 'mh_users';
const SESSION_KEY = 'mh_session';
export const AUTH_CHANGED_EVENT = 'mh_auth_changed';

function emitAuthChanged() {
  try { window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT)); } catch {}
}

function setSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
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

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() { setSession(null); }

export async function hashPassword(plainText) {
  const enc = new TextEncoder();
  const data = enc.encode(String(plainText));
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(digest));
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex;
}

export async function registerUser({ name, email, password, role = 'member' }) {
  const users = readUsers();
  const existing = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (existing) {
    throw new Error('Email is already registered.');
  }

  const passwordHash = await hashPassword(password);
  const user = {
    id: Date.now(),
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    role,
    passwordHash,
  };
  users.push(user);
  writeUsers(users);
  // Auto login after register
  const session = { id: user.id, name: user.name, email: user.email, role: user.role };
  setSession(session);
  return session;
}

export async function loginUser({ email, password }) {
  const users = readUsers();
  const u = users.find((x) => x.email.toLowerCase() === String(email).toLowerCase());
  if (!u) throw new Error('Account not found.');
  const passwordHash = await hashPassword(password);
  if (u.passwordHash !== passwordHash) throw new Error('Incorrect password.');
  const session = { id: u.id, name: u.name, email: u.email, role: u.role };
  setSession(session);
  return session;
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

export function getAllUsersSafe() {
  // For admin dashboards later: omit sensitive fields
  return readUsers().map(({ passwordHash, ...rest }) => rest);
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


