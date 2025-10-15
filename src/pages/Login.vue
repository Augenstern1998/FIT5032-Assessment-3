<template>
  <section class="container py-4" style="max-width: 560px">
    <h2 class="h4 mb-3">Login</h2>

    <div v-if="notice" class="alert" :class="noticeClass" role="alert">{{ notice }}</div>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="mb-3">
        <label for="email" class="form-label">Email *</label>
        <input id="email" type="email" class="form-control" v-model.trim="email" required />
      </div>
      <div class="mb-3">
        <label for="pwd" class="form-label">Password *</label>
        <input id="pwd" type="password" class="form-control" v-model="password" minlength="6" required />
        <div class="text-end mt-1">
          <RouterLink to="/forgot-password" class="text-decoration-none small">
            Forgot your password?
          </RouterLink>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <!-- Divider -->
    <div class="text-center my-3">
      <span class="text-muted">or</span>
    </div>

    <!-- Google Login Button -->
    <div class="d-grid">
      <button type="button" class="btn btn-outline-danger" @click="onGoogleLogin" :disabled="isLoading">
        <svg width="18" height="18" viewBox="0 0 24 24" class="me-2">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {{ isLoading ? 'Signing in...' : 'Continue with Google' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';
import { loginUser, loginWithGoogle } from '../utils/auth.js';
import { validateEmail, sanitizeInput } from '../utils/security.js';

const router = useRouter();
const route = useRoute();
const email = ref('');
const password = ref('');
const notice = ref('');
const noticeClass = ref('alert-danger');
const loginAttempts = ref(0);
const isBlocked = ref(false);
const isLoading = ref(false);

// Enhanced validation
const emailValidation = computed(() => validateEmail(email.value));

async function onSubmit() {
  notice.value = '';
  isLoading.value = true;
  
  // Check if blocked due to too many attempts
  if (isBlocked.value) {
    notice.value = 'Too many failed attempts. Please wait before trying again.';
    isLoading.value = false;
    return;
  }
  
  // Sanitize inputs
  const sanitizedEmail = sanitizeInput(email.value, 'email');
  
  // Enhanced validation
  if (!emailValidation.value) {
    notice.value = 'Please enter a valid email address.';
    isLoading.value = false;
    return;
  }
  
  if (!password.value || password.value.length < 1) {
    notice.value = 'Password is required.';
    isLoading.value = false;
    return;
  }
  
  try {
    await loginUser({ email: sanitizedEmail, password: password.value });
    noticeClass.value = 'alert-success';
    notice.value = 'Login successful! Redirecting...';
    loginAttempts.value = 0; // Reset attempts on success
    const redirect = route.query.redirect || '/';
    setTimeout(() => router.push(String(redirect)), 300);
  } catch (e) {
    noticeClass.value = 'alert-danger';
    notice.value = e?.message || 'Login failed.';
    loginAttempts.value++;
    
    // Block after 3 failed attempts
    if (loginAttempts.value >= 3) {
      isBlocked.value = true;
      setTimeout(() => {
        isBlocked.value = false;
        loginAttempts.value = 0;
      }, 30000); // 30 second cooldown
    }
  } finally {
    isLoading.value = false;
  }
}

async function onGoogleLogin() {
  notice.value = '';
  isLoading.value = true;
  
  try {
    await loginWithGoogle();
    noticeClass.value = 'alert-success';
    notice.value = 'Google login successful! Redirecting...';
    const redirect = route.query.redirect || '/';
    setTimeout(() => router.push(String(redirect)), 300);
  } catch (e) {
    noticeClass.value = 'alert-danger';
    notice.value = e?.message || 'Google login failed.';
  } finally {
    isLoading.value = false;
  }
}
</script>


