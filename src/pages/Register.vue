<!-- Registration page component with validation and security features -->
<template>
  <section class="container py-4" style="max-width: 640px">
    <h2 class="h4 mb-3">Create Account</h2>

    <!-- Status message display -->
    <div v-if="notice" class="alert" :class="noticeClass" role="alert">{{ notice }}</div>

    <!-- Registration form with validation -->
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
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { registerUser } from '../utils/auth.js';
import { validateEmail, validatePassword, validateName, sanitizeInput } from '../utils/security.js';

// Router and route instances
const router = useRouter();
const route = useRoute();

// Form data reactive references
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('member');
const notice = ref('');
const noticeClass = ref('alert-danger');

// Validation computed properties
const nameValidation = computed(() => validateName(name.value));
const emailValidation = computed(() => validateEmail(email.value));
const passwordValidation = computed(() => validatePassword(password.value));

// Overall form validation status
const isFormValid = computed(() => {
  return nameValidation.value.isValid && 
         emailValidation.value && 
         passwordValidation.value.isValid;
});

/**
 * Handle form submission with validation and security checks
 */
async function onSubmit() {
  notice.value = '';
  
  // Sanitize user inputs for security
  const sanitizedName = sanitizeInput(name.value, 'name');
  const sanitizedEmail = sanitizeInput(email.value, 'email');
  
  // Validate name format and length
  if (!nameValidation.value.isValid) {
    notice.value = 'Name must be 2-50 characters and contain only letters and spaces.';
    return;
  }
  
  // Validate email format
  if (!emailValidation.value) {
    notice.value = 'Please enter a valid email address.';
    return;
  }
  
  // Validate password strength
  if (!passwordValidation.value.isValid) {
    notice.value = 'Password must be at least 6 characters long.';
    return;
  }
  
  try {
    // Attempt registration with sanitized data
    await registerUser({ 
      name: sanitizedName, 
      email: sanitizedEmail, 
      password: password.value, 
      role: role.value 
    });
    noticeClass.value = 'alert-success';
    notice.value = 'Account created! Redirecting...';
    
    // Redirect to intended page or home
    const redirect = route.query.redirect || '/';
    setTimeout(() => router.push(String(redirect)), 300);
  } catch (e) {
    // Handle registration failure
    noticeClass.value = 'alert-danger';
    notice.value = e?.message || 'Registration failed.';
  }
}
</script>


