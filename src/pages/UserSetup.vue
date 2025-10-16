<template>
  <div class="user-setup-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">User Setup</span>
          </h1>
          <p class="hero-subtitle">
            Create and manage user accounts for development and testing
          </p>
        </div>
      </div>
    </section>

    <!-- Setup Section -->
    <section class="setup-section">
      <div class="container">
        <div class="setup-container">
          
          <!-- Quick Setup -->
          <div class="setup-card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-rocket me-3"></i>
                Quick Setup
              </h2>
              <p class="card-subtitle">Create a default admin user for testing</p>
            </div>
            
            <div v-if="setupMessage" class="alert" :class="setupMessageClass" role="alert">
              {{ setupMessage }}
            </div>
            
            <div class="setup-content">
              <div class="setup-info">
                <h4>Default Admin User</h4>
                <div class="user-info">
                  <p><strong>Email:</strong> admin@menshealth.com</p>
                  <p><strong>Password:</strong> admin123</p>
                  <p><strong>Role:</strong> admin</p>
                </div>
              </div>
              
              <button 
                class="btn btn-primary setup-btn" 
                @click="performQuickSetup"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="fas fa-rocket me-2"></i>
                {{ isLoading ? 'Setting up...' : 'Create Admin User' }}
              </button>
            </div>
          </div>

          <!-- Custom User Creation -->
          <div class="setup-card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-user-plus me-3"></i>
                Create Custom User
              </h2>
              <p class="card-subtitle">Create a user with custom details</p>
            </div>
            
            <form @submit.prevent="createCustomUser" class="user-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="userEmail" class="form-label">
                    <i class="fas fa-envelope me-2"></i>
                    Email Address *
                  </label>
                  <input 
                    id="userEmail"
                    type="email" 
                    class="form-control" 
                    v-model="userForm.email" 
                    required 
                    placeholder="user@example.com"
                  />
                </div>
                
                <div class="form-group">
                  <label for="userPassword" class="form-label">
                    <i class="fas fa-lock me-2"></i>
                    Password *
                  </label>
                  <input 
                    id="userPassword"
                    type="password" 
                    class="form-control" 
                    v-model="userForm.password" 
                    required 
                    minlength="6"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="userName" class="form-label">
                    <i class="fas fa-user me-2"></i>
                    Full Name *
                  </label>
                  <input 
                    id="userName"
                    type="text" 
                    class="form-control" 
                    v-model="userForm.name" 
                    required 
                    placeholder="John Doe"
                  />
                </div>
                
                <div class="form-group">
                  <label for="userRole" class="form-label">
                    <i class="fas fa-user-tag me-2"></i>
                    Role *
                  </label>
                  <select 
                    id="userRole"
                    class="form-select" 
                    v-model="userForm.role" 
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </div>
              </div>
              
              <div class="form-actions">
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="isCreating"
                >
                  <span v-if="isCreating" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="fas fa-user-plus me-2"></i>
                  {{ isCreating ? 'Creating...' : 'Create User' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Current User Info -->
          <div class="setup-card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-info-circle me-3"></i>
                Current User Info
              </h2>
              <p class="card-subtitle">Information about the currently logged in user</p>
            </div>
            
            <div class="user-info-display">
              <div v-if="currentUser" class="user-details">
                <div class="detail-item">
                  <span class="label">Name:</span>
                  <span class="value">{{ currentUser.name }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Email:</span>
                  <span class="value">{{ currentUser.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Role:</span>
                  <span class="role-badge" :class="currentUser.role === 'admin' ? 'admin-role' : 'member-role'">
                    {{ currentUser.role }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">UID:</span>
                  <span class="value uid-text">{{ currentUser.uid }}</span>
                </div>
              </div>
              <div v-else class="no-user">
                <i class="fas fa-user-slash"></i>
                <p>No user currently logged in</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="setup-card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-tools me-3"></i>
                Actions
              </h2>
              <p class="card-subtitle">Additional tools and actions</p>
            </div>
            
            <div class="actions-grid">
              <button class="btn btn-outline-primary action-btn" @click="goToLogin">
                <i class="fas fa-sign-in-alt me-2"></i>
                Go to Login
              </button>
              
              <button class="btn btn-outline-success action-btn" @click="goToAdmin" :disabled="!canAccessAdmin">
                <i class="fas fa-shield-alt me-2"></i>
                Go to Admin
              </button>
              
              <button class="btn btn-outline-info action-btn" @click="clearMessages">
                <i class="fas fa-refresh me-2"></i>
                Clear Messages
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser } from '../utils/auth.js';
import { quickSetup, createTestUser } from '../utils/userDebug.js';

const router = useRouter();

// Reactive data
const isLoading = ref(false);
const isCreating = ref(false);
const setupMessage = ref('');
const setupMessageClass = ref('');
const currentUser = ref(null);

const userForm = ref({
  email: '',
  password: '',
  name: '',
  role: ''
});

// Computed properties
const canAccessAdmin = computed(() => {
  return currentUser.value && currentUser.value.role === 'admin';
});

// Methods
async function performQuickSetup() {
  isLoading.value = true;
  setupMessage.value = '';
  
  try {
    const result = await quickSetup();
    
    if (result.success) {
      setupMessage.value = `✅ Quick setup completed! You can now login with:\nEmail: ${result.adminEmail}\nPassword: ${result.adminPassword}`;
      setupMessageClass.value = 'alert-success';
    }
  } catch (error) {
    console.error('Quick setup error:', error);
    setupMessage.value = `❌ Setup failed: ${error.message}`;
    setupMessageClass.value = 'alert-danger';
  } finally {
    isLoading.value = false;
  }
}

async function createCustomUser() {
  isCreating.value = true;
  setupMessage.value = '';
  
  try {
    const user = await createTestUser(
      userForm.value.email,
      userForm.value.password,
      userForm.value.name,
      userForm.value.role
    );
    
    setupMessage.value = `✅ User created successfully!\nEmail: ${user.email}\nName: ${user.name}\nRole: ${user.role}`;
    setupMessageClass.value = 'alert-success';
    
    // Reset form
    userForm.value = {
      email: '',
      password: '',
      name: '',
      role: ''
    };
  } catch (error) {
    console.error('Create user error:', error);
    setupMessage.value = `❌ Failed to create user: ${error.message}`;
    setupMessageClass.value = 'alert-danger';
  } finally {
    isCreating.value = false;
  }
}

async function loadCurrentUser() {
  try {
    currentUser.value = await getCurrentUser();
  } catch (error) {
    console.error('Error loading current user:', error);
    currentUser.value = null;
  }
}

function goToLogin() {
  router.push('/login');
}

function goToAdmin() {
  if (canAccessAdmin.value) {
    router.push('/admin');
  }
}

function clearMessages() {
  setupMessage.value = '';
  setupMessageClass.value = '';
}

// Lifecycle
onMounted(() => {
  loadCurrentUser();
});
</script>

<style scoped>
.user-setup-page {
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

/* Setup Section */
.setup-section {
  padding: 4rem 0;
  background: var(--gray-50);
}

.setup-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setup-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-subtitle {
  color: var(--gray-600);
  font-size: 1rem;
}

.setup-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.setup-info {
  text-align: center;
}

.setup-info h4 {
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.user-info {
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
}

.user-info p {
  margin: 0.5rem 0;
  color: var(--gray-700);
}

.setup-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.form-control, .form-select {
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all var(--transition-fast);
}

.form-control:focus, .form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.user-info-display {
  margin-top: 1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
}

.label {
  font-weight: 600;
  color: var(--gray-700);
}

.value {
  color: var(--gray-900);
  font-weight: 500;
}

.uid-text {
  font-family: monospace;
  font-size: 0.85rem;
  background: var(--gray-100);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.admin-role {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
  border: 1px solid var(--warning-color);
}

.role-badge.member-role {
  background: rgba(23, 162, 184, 0.2);
  color: var(--info-color);
  border: 1px solid var(--info-color);
}

.no-user {
  text-align: center;
  padding: 2rem;
  color: var(--gray-500);
}

.no-user i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .setup-card {
    padding: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .setup-card {
    padding: 1.5rem;
  }
}
</style>
