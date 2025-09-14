// Session security utilities for idle timeout and session management

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const SESSION_KEY = 'mh_session';
const LAST_ACTIVITY_KEY = 'mh_last_activity';

let idleTimer = null;

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
  
  // Check if session has already expired
  if (lastActivity && (now - parseInt(lastActivity)) > IDLE_TIMEOUT) {
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
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  stopIdleTimer();
}

export function isSessionValid() {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!lastActivity) return false;
  
  const now = Date.now();
  return (now - parseInt(lastActivity)) <= IDLE_TIMEOUT;
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
