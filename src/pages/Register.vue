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
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { registerUser } from '../utils/auth.js';

const router = useRouter();
const route = useRoute();
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('member');
const notice = ref('');
const noticeClass = ref('alert-danger');

async function onSubmit() {
  notice.value = '';
  if (!name.value || !email.value || !password.value) {
    notice.value = 'Please fill all required fields.';
    return;
  }
  try {
    await registerUser({ name: name.value, email: email.value, password: password.value, role: role.value });
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


