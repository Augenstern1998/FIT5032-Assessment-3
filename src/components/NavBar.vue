<!-- NavBar.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold" to="/">Men's Health</RouterLink>

      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#nav"
              aria-controls="nav" aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span> 
      </button>

      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2">
          <li class="nav-item"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/resources">Resources</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/contact">Contact</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/join">Join Community</RouterLink></li>
          <li class="nav-item dropdown" v-if="user && user.role === 'admin'">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" role="button" aria-expanded="false">Admin</a>
            <ul class="dropdown-menu">
              <li><RouterLink class="dropdown-item" to="/admin">Dashboard</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/admin/resources">Resource Management</RouterLink></li>
            </ul>
          </li>
          <li class="nav-item" v-if="!user"><RouterLink class="btn btn-sm btn-outline-primary" to="/login">Login</RouterLink></li>
          <li class="nav-item" v-if="!user"><RouterLink class="btn btn-sm btn-primary" to="/register">Register</RouterLink></li>
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
import { onAuthStateChange } from '../utils/firebaseAuth.js';
import { resetIdleTimer } from '../utils/session.js';

const router = useRouter();
const user = ref(null);

function load() {
  user.value = getCurrentUser();
}

onMounted(() => {
  load();
  
  // Listen to both local and Firebase auth changes
  window.addEventListener(AUTH_CHANGED_EVENT, load);
  
  // Listen to Firebase auth state changes
  const unsubscribe = onAuthStateChange((firebaseUser) => {
    if (firebaseUser) {
      // User is signed in
      load();
      // Reset idle timer on user activity
      resetIdleTimer(() => {
        logout();
        load();
      });
    } else {
      // User is signed out
      user.value = null;
    }
  });
  
  // Store unsubscribe function for cleanup
  window._firebaseAuthUnsubscribe = unsubscribe;
});

onBeforeUnmount(() => {
  window.removeEventListener(AUTH_CHANGED_EVENT, load);
  
  // Unsubscribe from Firebase auth state changes
  if (window._firebaseAuthUnsubscribe) {
    window._firebaseAuthUnsubscribe();
  }
});

async function onLogout() {
  try {
    await logout();
    load();
    router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
    // Force logout even if there's an error
    user.value = null;
    router.push('/');
  }
}
</script>

<style scoped>
/* Hide the hamburger icon */
.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
  content: none !important;
}

.navbar-toggler { border: 1px solid #ddd; border-radius: 6px; padding: .25rem .5rem; }
</style>
