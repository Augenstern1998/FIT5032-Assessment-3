// Session security utilities for idle timeout and session management

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const SESSION_KEY = 'mh_session';
const LAST_ACTIVITY_KEY = 'mh_last_activity';

let idleTimer = null;

// AppSession type definition
export function setSession(uid, ttlHours = 12) {
  const expiresAt = Date.now() + ttlHours * 60 * 60 * 1000; // 毫秒时间戳
  const session = { uid, expiresAt };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  console.log('Session set:', { uid, expiresAt, ttlHours });
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  stopIdleTimer();
  console.log('Session cleared');
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (typeof obj.expiresAt !== 'number' || Number.isNaN(obj.expiresAt)) {
      console.log('Invalid session data, clearing...');
      clearSession();
      return null;
    }
    return obj;
  } catch (error) {
    console.log('Session parse error, clearing...', error);
    clearSession();
    return null;
  }
}

export function isSessionValid() {
  const session = getSession();
  if (!session) return false;
  
  const isValid = Date.now() < session.expiresAt; // 毫秒对毫秒比较
  console.log('Session validation:', { 
    now: Date.now(), 
    expiresAt: session.expiresAt, 
    isValid,
    timeLeft: session.expiresAt - Date.now()
  });
  
  if (!isValid) {
    clearSession();
  }
  
  return isValid;
}

export function startIdleTimer(logoutCallback) {
  // Clear existing timer
  if (idleTimer) {
    clearTimeout(idleTimer);
  }
  
  // Update last activity timestamp
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  
  // Set new timer
  idleTimer = setTimeout(() => {
    console.log('Session expired due to inactivity');
    logoutCallback();
  }, IDLE_TIMEOUT);
}

export function resetIdleTimer(logoutCallback) {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  const now = Date.now();
  
  // Check if session has already expired (with 5 second buffer to avoid race conditions)
  if (lastActivity && (now - parseInt(lastActivity)) > (IDLE_TIMEOUT + 5000)) {
    console.log('Session already expired');
    logoutCallback();
    return;
  }
  
  // Reset timer
  startIdleTimer(logoutCallback);
}

export function stopIdleTimer() {
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
}

export function clearSessionData() {
  clearSession();
}

export function getSessionDuration() {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!lastActivity) return 0;
  
  return Date.now() - parseInt(lastActivity);
}

export function getTimeUntilExpiry() {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!lastActivity) return 0;
  
  const elapsed = Date.now() - parseInt(lastActivity);
  return Math.max(0, IDLE_TIMEOUT - elapsed);
}

export default {
  startIdleTimer,
  resetIdleTimer,
  stopIdleTimer,
  clearSessionData,
  isSessionValid,
  getSessionDuration,
  getTimeUntilExpiry,
};
