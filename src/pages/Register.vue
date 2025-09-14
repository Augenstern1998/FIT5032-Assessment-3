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
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </section>
</template>

<script setup>
<<<<<<< HEAD
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { registerUser } from '../utils/auth.js';
import { validateEmail, validatePassword, validateName, sanitizeInput } from '../utils/security.js';
=======
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { registerUser } from '../utils/auth.js';
>>>>>>> 971db2f520855767059a6f2b614d884da8de2979

const router = useRouter();
const route = useRoute();
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('member');
const notice = ref('');
const noticeClass = ref('alert-danger');

<<<<<<< HEAD
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
  
  // Sanitize inputs
  const sanitizedName = sanitizeInput(name.value, 'name');
  const sanitizedEmail = sanitizeInput(email.value, 'email');
  
  // Enhanced validation
  if (!nameValidation.value.isValid) {
    notice.value = 'Name must be 2-50 characters and contain only letters and spaces.';
    return;
  }
  
  if (!emailValidation.value) {
    notice.value = 'Please enter a valid email address.';
    return;
  }
  
  if (!passwordValidation.value.isValid) {
    notice.value = 'Password must be at least 6 characters long.';
    return;
  }
  
  try {
    await registerUser({ 
      name: sanitizedName, 
      email: sanitizedEmail, 
      password: password.value, 
      role: role.value 
    });
=======
async function onSubmit() {
  notice.value = '';
  if (!name.value || !email.value || !password.value) {
    notice.value = 'Please fill all required fields.';
    return;
  }
  try {
    await registerUser({ name: name.value, email: email.value, password: password.value, role: role.value });
>>>>>>> 971db2f520855767059a6f2b614d884da8de2979
    noticeClass.value = 'alert-success';
    notice.value = 'Account created! Redirecting...';
    const redirect = route.query.redirect || '/';
    setTimeout(() => router.push(String(redirect)), 300);
  } catch (e) {
    noticeClass.value = 'alert-danger';
    notice.value = e?.message || 'Registration failed.';
  }
}
</script>


