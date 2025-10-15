<template>
  <section class="container py-4" style="max-width: 640px">
    <h2 class="h4 mb-3">Create Account</h2>

    <div v-if="notice" class="alert" :class="noticeClass" role="alert">{{ notice }}</div>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="mb-3">
        <label class="form-label" for="name">Full name *</label>
        <input id="name" class="form-control" v-model.trim="name" required />
      </div>
      <div class="mb-3">
        <label class="form-label" for="email">Email *</label>
        <input id="email" type="email" class="form-control" v-model.trim="email" required />
      </div>
      <div class="mb-3">
        <label class="form-label" for="pwd">Password (min 6) *</label>
        <input id="pwd" type="password" class="form-control" v-model="password" minlength="6" required />
      </div>
      <div class="mb-3">
        <label class="form-label" for="role">Role *</label>
        <select id="role" class="form-select" v-model="role" required>
          <option value="member">Member</option>
          <option value="admin">Admin (for demo)</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {{ isLoading ? 'Creating Account...' : 'Register' }}
      </button>
    </form>

    <!-- Divider -->
    <div class="text-center my-3">
      <span class="text-muted">or</span>
    </div>

    <!-- Google Registration Button -->
    <div class="d-grid">
      <button type="button" class="btn btn-outline-danger" @click="onGoogleLogin" :disabled="isLoading">
        <svg width="18" height="18" viewBox="0 0 24 24" class="me-2">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {{ isLoading ? 'Signing up...' : 'Continue with Google' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { registerUser, loginWithGoogle } from '../utils/auth.js';
import { validateEmail, validatePassword, validateName, sanitizeInput } from '../utils/security.js';
// 注意：欢迎邮件功能已禁用，因为EmailJS免费版只允许2个模板

const router = useRouter();
const route = useRoute();
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('member');
const notice = ref('');
const noticeClass = ref('alert-danger');
const isLoading = ref(false);

// Enhanced validation
const nameValidation = computed(() => validateName(name.value));
const emailValidation = computed(() => validateEmail(email.value));
const passwordValidation = computed(() => validatePassword(password.value));

const isFormValid = computed(() => {
  return nameValidation.value.isValid && 
         emailValidation.value && 
         passwordValidation.value.isValid;
});

async function onSubmit() {
  notice.value = '';
  isLoading.value = true;
  
  // Sanitize inputs
  const sanitizedName = sanitizeInput(name.value, 'name');
  const sanitizedEmail = sanitizeInput(email.value, 'email');
  
  // Enhanced validation
  if (!nameValidation.value.isValid) {
    notice.value = 'Name must be 2-50 characters and contain only letters and spaces.';
    isLoading.value = false;
    return;
  }
  
  if (!emailValidation.value) {
    notice.value = 'Please enter a valid email address.';
    isLoading.value = false;
    return;
  }
  
  if (!passwordValidation.value.isValid) {
    notice.value = 'Password must be at least 6 characters long.';
    isLoading.value = false;
    return;
  }
  
  try {
    const user = await registerUser({ 
      name: sanitizedName, 
      email: sanitizedEmail, 
      password: password.value, 
      role: role.value 
    });

    // 注意：欢迎邮件功能暂时禁用，因为EmailJS免费版只允许2个模板
    // 如果需要欢迎邮件，可以升级到付费版或使用其他邮件服务
    console.log('Registration successful - Welcome email disabled due to EmailJS template limit');
    noticeClass.value = 'alert-success';
    notice.value = 'Account created successfully! Redirecting...';
    
    const redirect = route.query.redirect || '/';
    setTimeout(() => router.push(String(redirect)), 1000);
  } catch (e) {
    noticeClass.value = 'alert-danger';
    notice.value = e?.message || 'Registration failed.';
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
    notice.value = 'Google registration successful! Redirecting...';
    const redirect = route.query.redirect || '/';
    setTimeout(() => router.push(String(redirect)), 300);
  } catch (e) {
    noticeClass.value = 'alert-danger';
    notice.value = e?.message || 'Google registration failed.';
  } finally {
    isLoading.value = false;
  }
}
</script>


