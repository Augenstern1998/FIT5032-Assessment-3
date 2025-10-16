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

async function load() {
  try {
    user.value = await getCurrentUser();
    console.log('User loaded:', user.value);
  } catch (error) {
    console.error('Failed to load user:', error);
    user.value = null;
  }
}

onMounted(() => {
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
  });
  
  // Store unsubscribe function for cleanup
  window._firebaseAuthUnsubscribe = unsubscribe;
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
  console.log('Starting logout process...');
  try {
    await logout();
    console.log('Logout completed');
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // 强制清除用户状态
  user.value = null;
  console.log('User state cleared');
  
  // 触发认证状态变化事件
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
  window.dispatchEvent(new CustomEvent('firebase_auth_changed'));
  
  // 立即更新 UI
  setTimeout(() => {
    router.push('/');
  }, 50);
  
  // 再次确保状态清除
  setTimeout(() => {
    user.value = null;
    console.log('Final user state check:', user.value);
  }, 200);
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
