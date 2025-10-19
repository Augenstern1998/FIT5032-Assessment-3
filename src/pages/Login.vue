<template>
  <div class="login-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Welcome Back</span>
          </h1>
          <p class="hero-subtitle">
            Sign in to access your health resources and continue your wellness journey
          </p>
        </div>
      </div>
    </section>

    <!-- Login Form Section -->
    <section class="login-section">
      <div class="container">
        <div class="login-container">
          <div class="login-card">
            <div class="login-header">
              <h2 class="login-title">
                <i class="fas fa-sign-in-alt me-3"></i>
                Sign In
              </h2>
              <p class="login-subtitle">Enter your credentials to access your account</p>
            </div>

            <div v-if="notice" class="alert" :class="noticeClass" role="alert">{{ notice }}</div>

            <form @submit.prevent="onSubmit" novalidate class="login-form">
              <div class="form-group">
                <label for="email" class="form-label">
                  <i class="fas fa-envelope me-2"></i>
                  Email Address *
                </label>
                <input 
                  id="email" 
                  type="email" 
                  class="form-control" 
                  v-model.trim="email" 
                  required 
                  placeholder="Enter your email address"
                />
              </div>
              
              <div class="form-group">
                <label for="pwd" class="form-label">
                  <i class="fas fa-lock me-2"></i>
                  Password *
                </label>
                <input 
                  id="pwd" 
                  type="password" 
                  class="form-control" 
                  v-model="password" 
                  minlength="6" 
                  required 
                  placeholder="Enter your password"
                />
                <div class="form-footer">
                  <RouterLink to="/forgot-password" class="forgot-link">
                    <i class="fas fa-question-circle me-1"></i>
                    Forgot your password?
                  </RouterLink>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary login-btn" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <i v-else class="fas fa-sign-in-alt me-2"></i>
                {{ isLoading ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

            <!-- Divider -->
            <div class="divider">
              <span class="divider-text">or</span>
            </div>

            <!-- Google Login Button -->
            <button type="button" class="btn btn-google" @click="onGoogleLogin" :disabled="isLoading">
              <svg width="20" height="20" viewBox="0 0 24 24" class="me-2">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {{ isLoading ? 'Signing in...' : 'Continue with Google' }}
            </button>

            <!-- Register Link -->
            <div class="register-link">
              <p class="register-text">
                Don't have an account? 
                <RouterLink to="/register" class="register-btn">
                  <i class="fas fa-user-plus me-1"></i>
                  Sign up here
                </RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';
import { loginUser, loginWithGoogle, AUTH_CHANGED_EVENT, getCurrentUser } from '../utils/auth.js';
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
    console.log('Login: Starting login process...');
    console.log('Login: Email:', sanitizedEmail);
    console.log('Login: Password length:', password.value.length);
    
    const user = await loginUser({ email: sanitizedEmail, password: password.value });
    console.log('Login: Login successful, user:', user);
    
    noticeClass.value = 'alert-success';
    notice.value = 'Login successful! Redirecting...';
    loginAttempts.value = 0; // Reset attempts on success
    
    // Force auth state update
    console.log('Login: Emitting auth changed events...');
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
    window.dispatchEvent(new CustomEvent('firebase_auth_changed'));
    
    const redirect = route.query.redirect || '/';
    console.log('Login: Redirecting to:', redirect);
    setTimeout(() => {
      console.log('Login: Executing redirect...');
      router.push(String(redirect));
    }, 300);
  } catch (e) {
    console.error('Login: Login failed:', e);
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
    console.log('Login: Setting isLoading to false');
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

// Check if user is already logged in on page load
onMounted(async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      console.log('User already logged in, redirecting...');
      const redirect = route.query.redirect || '/';
      router.push(String(redirect));
    }
  } catch (error) {
    console.log('No user logged in');
  }
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 40vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(45deg, #ffffff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 300;
}

/* Login Section */
.login-section {
  padding: 3rem 0;
  background: var(--gray-50);
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.login-container {
  max-width: 450px;
  margin: 0 auto;
}

.login-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--gray-200);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-subtitle {
  color: var(--gray-600);
  font-size: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.form-control {
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all var(--transition-fast);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.forgot-link:hover {
  color: var(--primary-dark);
  text-decoration: none;
}

.login-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--radius-lg);
  margin-top: 0.5rem;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--gray-200);
}

.divider-text {
  padding: 0 1rem;
  color: var(--gray-500);
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-google {
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--radius-lg);
  background: white;
  border: 2px solid var(--gray-200);
  color: var(--gray-700);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.btn-google:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
}

.register-text {
  color: var(--gray-600);
  margin: 0;
  font-size: 0.95rem;
}

.register-btn {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color var(--transition-fast);
}

.register-btn:hover {
  color: var(--primary-dark);
  text-decoration: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .login-card {
    padding: 2rem;
    margin: 1rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .login-card {
    padding: 1.5rem;
  }
  
  .login-title {
    font-size: 1.3rem;
  }
}
</style>


