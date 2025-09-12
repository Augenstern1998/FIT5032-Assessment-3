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
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { loginUser } from '../utils/auth.js';

const router = useRouter();
const route = useRoute();
const email = ref('');
const password = ref('');
const notice = ref('');
const noticeClass = ref('alert-danger');

async function onSubmit() {
  notice.value = '';
  try {
    await loginUser({ email: email.value, password: password.value });
    noticeClass.value = 'alert-success';
    notice.value = 'Login successful! Redirecting...';
    const redirect = route.query.redirect || '/';
    setTimeout(() => router.push(String(redirect)), 300);
  } catch (e) {
    noticeClass.value = 'alert-danger';
    notice.value = e?.message || 'Login failed.';
  }
}
</script>


