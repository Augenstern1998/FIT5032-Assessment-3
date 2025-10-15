<template>
  <section class="container py-4" style="max-width: 560px">
    <h2 class="h4 mb-3">Reset Password</h2>

    <div v-if="notice" class="alert" :class="noticeClass" role="alert">{{ notice }}</div>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="mb-3">
        <label for="email" class="form-label">Email Address *</label>
        <input 
          id="email" 
          type="email" 
          class="form-control" 
          v-model.trim="email" 
          required 
          :disabled="isLoading"
        />
        <div class="form-text">Enter the email address associated with your account.</div>
      </div>
      
      <button type="submit" class="btn btn-primary" :disabled="isLoading || !email">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {{ isLoading ? 'Sending Reset Email...' : 'Send Reset Email' }}
      </button>
    </form>

    <div class="text-center mt-3">
      <RouterLink to="/login" class="text-decoration-none">
        <i class="fas fa-arrow-left me-1"></i>
        Back to Login
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { validateEmail, sanitizeInput } from '../utils/security.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';

const email = ref('');
const notice = ref('');
const noticeClass = ref('alert-danger');
const isLoading = ref(false);

const emailValidation = computed(() => validateEmail(email.value));

async function onSubmit() {
  notice.value = '';
  isLoading.value = true;
  
  try {
    // 验证邮箱
    if (!emailValidation.value) {
      noticeClass.value = 'alert-danger';
      notice.value = 'Please enter a valid email address.';
      return;
    }

    // 清理输入
    const cleanEmail = sanitizeInput(email.value, 'email');

    // 生成重置链接（在实际应用中，这应该是一个安全的token）
    const resetLink = `${window.location.origin}/reset-password?token=temp_token&email=${encodeURIComponent(cleanEmail)}`;

    // 发送密码重置邮件
    const emailSent = await sendPasswordResetEmail({
      name: 'User', // 在实际应用中，应该从数据库获取用户姓名
      email: cleanEmail
    }, resetLink);

    if (emailSent) {
      noticeClass.value = 'alert-success';
      notice.value = 'Password reset email sent! Please check your inbox and follow the instructions.';
      email.value = ''; // 清空邮箱输入
    } else {
      noticeClass.value = 'alert-warning';
      notice.value = 'Failed to send reset email. Please try again or contact support.';
    }
    
  } catch (error) {
    console.error('Password reset error:', error);
    noticeClass.value = 'alert-danger';
    notice.value = 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.form-text {
  font-size: 0.875rem;
  color: #6c757d;
}
</style>
