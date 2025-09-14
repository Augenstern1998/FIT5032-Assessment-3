<!-- Login page component with authentication and security features -->
<template>
  <section class="container py-4" style="max-width: 560px">
    <h2 class="h4 mb-3">Login</h2>

    <!-- Status message display -->
    <div v-if="notice" class="alert" :class="noticeClass" role="alert">{{ notice }}</div>

    <!-- Login form with validation -->
    <form @submit.prevent="onSubmit" novalidate>
      <div class="mb-3">
        <label for="email" class="form-label">Email *</label>
        <input id="email" type="email" class="form-control" v-model.trim="email" required />
      </div>
      <div class="mb-3">
        <label for="pwd" class="form-label">Password *</label>
        <input id="pwd" type="password" class="form-control" v-model="password" minlength="6" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { loginUser } from '../utils/auth.js';
import { validateEmail, sanitizeInput } from '../utils/security.js';

// Router and route instances
const router = useRouter();
const route = useRoute();

// Form data reactive references
const email = ref('');
const password = ref('');
const notice = ref('');
const noticeClass = ref('alert-danger');

// Security features for login attempts
const loginAttempts = ref(0);
const isBlocked = ref(false);

// Email validation computed property
const emailValidation = computed(() => validateEmail(email.value));

/**
 * Handle form submission with validation and security checks
 */
async function onSubmit() {
  notice.value = '';
  
  // Check if user is blocked due to too many failed attempts
  if (isBlocked.value) {
    notice.value = 'Too many failed attempts. Please wait before trying again.';
    return;
  }
  
  // Sanitize user inputs for security
  const sanitizedEmail = sanitizeInput(email.value, 'email');
  
  // Validate email format
  if (!emailValidation.value) {
    notice.value = 'Please enter a valid email address.';
    return;
  }
  
  // Validate password presence
  if (!password.value || password.value.length < 1) {
    notice.value = 'Password is required.';
    return;
  }
  
  try {
    // Attempt login with sanitized credentials
    await loginUser({ email: sanitizedEmail, password: password.value });
    noticeClass.value = 'alert-success';
    notice.value = 'Login successful! Redirecting...';
    loginAttempts.value = 0; // Reset attempts on successful login
    
    // Redirect to intended page or home
    const redirect = route.query.redirect || '/';
    setTimeout(() => router.push(String(redirect)), 300);
  } catch (e) {
    // Handle login failure
    noticeClass.value = 'alert-danger';
    notice.value = e?.message || 'Login failed.';
    loginAttempts.value++;
    
    // Block user after 3 failed attempts with 30-second cooldown
    if (loginAttempts.value >= 3) {
      isBlocked.value = true;
      setTimeout(() => {
        isBlocked.value = false;
        loginAttempts.value = 0;
      }, 30000); // 30 second cooldown period
    }
  }
}
</script>


