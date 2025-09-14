<!-- Navigation bar component with authentication state management and session handling -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
    <div class="container">
      <!-- Brand/logo link -->
      <RouterLink class="navbar-brand fw-semibold" to="/">Men's Health</RouterLink>

      <!-- Mobile menu toggle button -->
      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#nav"
              aria-controls="nav" aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span> 
      </button>

      <!-- Navigation menu -->
      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2">
          <!-- Public navigation links -->
          <li class="nav-item"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/resources">Resources</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/join">Join Community</RouterLink></li>
          
          <!-- Admin-only navigation link -->
          <li class="nav-item" v-if="user && user.role === 'admin'"><RouterLink class="nav-link" to="/admin">Admin</RouterLink></li>
          
          <!-- Authentication buttons for non-logged-in users -->
          <li class="nav-item" v-if="!user"><RouterLink class="btn btn-sm btn-outline-primary" to="/login">Login</RouterLink></li>
          <li class="nav-item" v-if="!user"><RouterLink class="btn btn-sm btn-primary" to="/register">Register</RouterLink></li>
          
          <!-- User dropdown menu for logged-in users -->
          <li class="nav-item dropdown" v-if="user">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" role="button" aria-expanded="false">{{ user.name }}</a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><span class="dropdown-item-text">Role: {{ user.role }}</span></li>
              <li><hr class="dropdown-divider" /></li>
              <li><button class="dropdown-item" @click="onLogout">Logout</button></li>
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
import { resetIdleTimer } from '../utils/session.js';

// Router instance
const router = useRouter();

// Current user state
const user = ref(null);

/**
 * Load current user data from authentication state
 */
function load() {
  user.value = getCurrentUser();
}

// Component lifecycle hooks
onMounted(() => {
  // Load initial user state
  load();
  
  // Listen for authentication state changes
  window.addEventListener(AUTH_CHANGED_EVENT, load);
  
  // Reset idle timer for session management
  if (getCurrentUser()) {
    resetIdleTimer(() => {
      logout();
      load();
    });
  }
});

onBeforeUnmount(() => {
  // Clean up event listener
  window.removeEventListener(AUTH_CHANGED_EVENT, load);
});

/**
 * Handle user logout
 */
function onLogout() {
  logout();
  load();
  router.push('/');
}
</script>

<style scoped>
/* Hide the hamburger icon for mobile menu */
.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
  content: none !important;
}

/* Style the mobile menu toggle button */
.navbar-toggler { 
  border: 1px solid #ddd; 
  border-radius: 6px; 
  padding: .25rem .5rem; 
}
</style>
