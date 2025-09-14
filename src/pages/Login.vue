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

const router = useRouter();
const route = useRoute();
const email = ref('');
const password = ref('');
const notice = ref('');
const noticeClass = ref('alert-danger');
const loginAttempts = ref(0);
const isBlocked = ref(false);

// Enhanced validation
const emailValidation = computed(() => validateEmail(email.value));

async function onSubmit() {
  notice.value = '';
  
  // Check if blocked due to too many attempts
  if (isBlocked.value) {
    notice.value = 'Too many failed attempts. Please wait before trying again.';
    return;
  }
  
  // Sanitize inputs
  const sanitizedEmail = sanitizeInput(email.value, 'email');
  
  // Enhanced validation
  if (!emailValidation.value) {
    notice.value = 'Please enter a valid email address.';
    return;
  }
  
  if (!password.value || password.value.length < 1) {
    notice.value = 'Password is required.';
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
  }
}
</script>


