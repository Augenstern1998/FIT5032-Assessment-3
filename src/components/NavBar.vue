<!-- NavBar.vue -->
<template>
  <nav id="navigation" class="navbar navbar-expand-lg navbar-light bg-light border-bottom" role="navigation" aria-label="Main navigation">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold" to="/" aria-label="Men's Health - Home">
        <i class="fas fa-heartbeat me-2" aria-hidden="true"></i>
        Men's Health
      </RouterLink>

      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#nav"
              aria-controls="nav" aria-expanded="false"
              aria-label="Toggle navigation menu">
        <span class="navbar-toggler-icon" aria-hidden="true"></span> 
      </button>

      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2" role="menubar">
              <li class="nav-item" role="none"><RouterLink class="nav-link" to="/" role="menuitem" aria-label="Go to home page">Home</RouterLink></li>
              <li class="nav-item" role="none"><RouterLink class="nav-link" to="/resources" role="menuitem" aria-label="View health resources">Resources</RouterLink></li>
              <li class="nav-item" role="none"><RouterLink class="nav-link" to="/health-services" role="menuitem" aria-label="Find health services near you">Health Services</RouterLink></li>
              <li class="nav-item" role="none"><RouterLink class="nav-link" to="/contact" role="menuitem" aria-label="Contact us">Contact</RouterLink></li>
              <li class="nav-item" role="none"><RouterLink class="nav-link" to="/join" role="menuitem" aria-label="Join our community">Join Community</RouterLink></li>
          <li class="nav-item dropdown" v-if="user && user.role === 'admin'" role="none">
            <button class="nav-link dropdown-toggle btn btn-link p-0 border-0" data-bs-toggle="dropdown" role="button" aria-expanded="false" aria-haspopup="true" aria-label="Admin menu">Admin</button>
            <ul class="dropdown-menu" role="menu" aria-label="Admin menu">
              <li role="none"><RouterLink class="dropdown-item" to="/admin" role="menuitem" aria-label="Go to admin dashboard">Dashboard</RouterLink></li>
              <li role="none"><RouterLink class="dropdown-item" to="/admin/resources" role="menuitem" aria-label="Manage resources">Resource Management</RouterLink></li>
            </ul>
          </li>
          <li class="nav-item" v-if="!user" role="none"><RouterLink class="btn btn-sm btn-outline-primary" to="/login" role="menuitem" aria-label="Sign in to your account">Login</RouterLink></li>
          <li class="nav-item" v-if="!user" role="none"><RouterLink class="btn btn-sm btn-primary" to="/register" role="menuitem" aria-label="Create a new account">Register</RouterLink></li>
          <li class="nav-item dropdown" v-if="user" role="none">
            <button class="nav-link dropdown-toggle btn btn-link p-0 border-0" data-bs-toggle="dropdown" role="button" aria-expanded="false" aria-haspopup="true" :aria-label="`User menu for ${user.name}`">{{ user.name }}</button>
            <ul class="dropdown-menu dropdown-menu-end" role="menu" :aria-label="`User menu for ${user.name}`">
              <li role="none"><span class="dropdown-item-text" role="menuitem" aria-label="User role">{{ user.role }}</span></li>
              <li><hr class="dropdown-divider" role="separator" /></li>
              <li role="none"><button class="dropdown-item" @click="onLogout" type="button" role="menuitem" aria-label="Sign out of your account">Logout</button></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getCurrentUser, logout, AUTH_CHANGED_EVENT } from '../utils/auth.js';
import { onAuthStateChange } from '../utils/firebaseAuth.js';
import { resetIdleTimer } from '../utils/session.js';

const router = useRouter();
const user = ref(null);

async function load() {
  try {
    const currentUser = await getCurrentUser();
    console.log('User loaded:', currentUser);
    
    // Check if user has valid data
    if (currentUser && currentUser.name && currentUser.email) {
      user.value = currentUser;
    } else {
      console.log('Invalid user data, clearing...');
      user.value = null;
      // Clear invalid session data
      localStorage.removeItem('mh_session');
    }
  } catch (error) {
    console.error('Failed to load user:', error);
    user.value = null;
  }
}

onMounted(() => {
  // Clear any invalid session data on mount
  const sessionData = localStorage.getItem('mh_session');
  if (sessionData) {
    try {
      const parsed = JSON.parse(sessionData);
      if (!parsed.name || !parsed.email) {
        console.log('Invalid session data found, clearing...');
        localStorage.removeItem('mh_session');
      }
    } catch (error) {
      console.log('Corrupted session data found, clearing...');
      localStorage.removeItem('mh_session');
    }
  }
  
  load();
  
  // Listen to both local and Firebase auth changes
  window.addEventListener(AUTH_CHANGED_EVENT, load);
  window.addEventListener('firebase_auth_changed', load);
  
  // Listen to Firebase auth state changes
  const unsubscribe = onAuthStateChange(async (firebaseUser) => {
    console.log('Firebase auth state changed:', firebaseUser ? 'signed in' : 'signed out');
    if (firebaseUser) {
      // User is signed in
      await load();
      // Reset idle timer on user activity
      resetIdleTimer(() => {
        logout();
        load();
      });
    } else {
      // User is signed out
      user.value = null;
      console.log('User signed out, clearing state');
    }
    
    // Force UI update
    setTimeout(() => {
      load();
    }, 100);
  });
  
  // Store unsubscribe function for cleanup
  window._firebaseAuthUnsubscribe = unsubscribe;
  
  // Additional auth status refresh on page visibility change
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      console.log('Page became visible, refreshing auth status');
      load();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
});

onBeforeUnmount(() => {
  window.removeEventListener(AUTH_CHANGED_EVENT, load);
  window.removeEventListener('firebase_auth_changed', load);
  
  // Unsubscribe from Firebase auth state changes
  if (window._firebaseAuthUnsubscribe) {
    window._firebaseAuthUnsubscribe();
  }
});

async function onLogout() {
  console.log('onLogout function called!');
  console.log('Starting logout...');
  console.log('Current user before logout:', user.value);
  
  try {
    // Close any open dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('show');
    });
    console.log('Dropdowns closed');
    
    // Clear local state first
    user.value = null;
    console.log('Local state cleared');
    
    // Clear all session data
    localStorage.removeItem('mh_session');
    localStorage.removeItem('mh_users');
    console.log('Local storage cleared');
    
    // Call logout function
    await logout();
    console.log('Logout function completed');
    
    // Trigger authentication state change event
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
    window.dispatchEvent(new CustomEvent('firebase_auth_changed'));
    console.log('Auth events dispatched');
    
    // Navigate to home page
    router.push('/');
    console.log('Redirected to home');
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Clear local state even if error occurs
    user.value = null;
    localStorage.removeItem('mh_session');
    localStorage.removeItem('mh_users');
    
    // Trigger authentication state change event
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
    window.dispatchEvent(new CustomEvent('firebase_auth_changed'));
    
    // Navigate to home page
    router.push('/');
    console.log('Fallback logout completed');
  }
}
</script>

<style scoped>
/* Modern Navbar Styling */
.navbar {
  background: var(--white) !important;
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4) 0;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-brand {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
  color: var(--gray-900) !important;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar-brand::before {
  content: '🏥';
  font-size: 1.5rem;
}

.navbar-nav {
  gap: 0.5rem;
}

.nav-link {
  font-weight: var(--font-weight-medium);
  color: var(--gray-600) !important;
  transition: all var(--transition-fast);
  padding: 0.75rem 1rem !important;
  border-radius: var(--radius-lg);
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--primary-gradient);
  transition: all var(--transition-fast);
  transform: translateX(-50%);
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-color) !important;
  background: rgba(102, 126, 234, 0.1);
  text-decoration: none;
}

.nav-link:hover::before,
.nav-link.active::before {
  width: 80%;
}

.dropdown-menu {
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  transition: all var(--transition-fast);
  border-radius: 0;
}

.dropdown-item:hover {
  background: var(--primary-color);
  color: white;
}

.dropdown-item-text {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: var(--gray-500);
  font-weight: var(--font-weight-normal);
}

.dropdown-divider {
  margin: 0.5rem 0;
  border-color: var(--gray-200);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.btn-outline-primary {
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  background: transparent;
}

.btn-outline-primary:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary {
  background: var(--primary-gradient);
  border: none;
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  color: white;
}

/* Hide the hamburger icon */
.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
  content: none !important;
}

.navbar-toggler {
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 0.5rem 0.75rem;
  transition: all var(--transition-fast);
}

.navbar-toggler:hover {
  border-color: var(--primary-color);
  background: rgba(102, 126, 234, 0.1);
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* User dropdown styling */
.nav-item.dropdown .nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item.dropdown .nav-link::after {
  margin-left: 0;
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}

/* Responsive Design */
@media (max-width: 991px) {
  .navbar-nav {
    padding: 1rem 0;
    gap: 0.25rem;
  }
  
  .nav-link {
    padding: 0.75rem 1rem !important;
    border-radius: var(--radius-md);
  }
  
  .dropdown-menu {
    margin-top: 0.25rem;
    border-radius: var(--radius-md);
  }
}

@media (max-width: 576px) {
  .navbar-brand {
    font-size: var(--font-size-lg);
  }
  
  .navbar-brand::before {
    font-size: 1.25rem;
  }
  
  .btn-sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}

/* Animation for mobile menu */
.navbar-collapse {
  transition: all var(--transition-normal);
}

.navbar-collapse.collapsing {
  transition: height 0.35s ease;
}

/* Active state for current page */
.router-link-active.nav-link {
  color: var(--primary-color) !important;
  background: rgba(102, 126, 234, 0.1);
}

.router-link-active.nav-link::before {
  width: 80%;
}
</style>
