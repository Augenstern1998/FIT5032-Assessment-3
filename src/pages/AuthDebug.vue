<template>
  <div class="auth-debug-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Authentication Debug</span>
          </h1>
          <p class="hero-subtitle">
            Debug and fix authentication and permission issues
          </p>
        </div>
      </div>
    </section>

    <!-- Debug Section -->
    <section class="debug-section">
      <div class="container">
        <div class="debug-container">
          
          <!-- Current Status -->
          <div class="debug-card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-info-circle me-3"></i>
                Current Authentication Status
              </h2>
            </div>
            
            <div class="status-content">
              <div class="status-item" :class="authStatus.authenticated ? 'success' : 'error'">
                <i :class="authStatus.authenticated ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                <span>{{ authStatus.authenticated ? 'Authenticated' : 'Not Authenticated' }}</span>
              </div>
              
              <div class="status-item" :class="authStatus.user ? 'success' : 'error'">
                <i :class="authStatus.user ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                <span>{{ authStatus.user ? 'User Data Available' : 'No User Data' }}</span>
              </div>
              
              <div class="status-item" :class="authStatus.isAdmin ? 'success' : 'warning'">
                <i :class="authStatus.isAdmin ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'"></i>
                <span>{{ authStatus.isAdmin ? 'Admin Role' : 'Not Admin' }}</span>
              </div>
            </div>
          </div>

          <!-- User Information -->
          <div class="debug-card" v-if="authStatus.user">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-user me-3"></i>
                User Information
              </h2>
            </div>
            
            <div class="user-info">
              <div class="info-item">
                <span class="label">Name:</span>
                <span class="value">{{ authStatus.user.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">{{ authStatus.user.email }}</span>
              </div>
              <div class="info-item">
                <span class="label">Role:</span>
                <span class="role-badge" :class="authStatus.user.role === 'admin' ? 'admin-role' : 'member-role'">
                  {{ authStatus.user.role }}
                </span>
              </div>
              <div class="info-item">
                <span class="label">UID:</span>
                <span class="value uid-text">{{ authStatus.user.uid }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="debug-card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-tools me-3"></i>
                Debug Actions
              </h2>
            </div>
            
            <div class="actions-grid">
              <button class="btn btn-primary action-btn" @click="runFullCheck" :disabled="isLoading">
                <i class="fas fa-search me-2"></i>
                Run Full Check
              </button>
              
              <button class="btn btn-warning action-btn" @click="updateToAdmin" :disabled="isLoading">
                <i class="fas fa-user-shield me-2"></i>
                Make Current User Admin
              </button>
              
              <button class="btn btn-success action-btn" @click="handleEnsureAdminUser" :disabled="isLoading">
                <i class="fas fa-user-plus me-2"></i>
                Create Admin User
              </button>
              
              <button class="btn btn-info action-btn" @click="clearAuthData" :disabled="isLoading">
                <i class="fas fa-trash me-2"></i>
                Clear Auth Data
              </button>
            </div>
          </div>

          <!-- Console Output -->
          <div class="debug-card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-terminal me-3"></i>
                Console Output
              </h2>
              <button class="btn btn-sm btn-outline-secondary" @click="clearConsole">
                <i class="fas fa-eraser me-1"></i>
                Clear
              </button>
            </div>
            
            <div class="console-output">
              <div v-for="(log, index) in consoleLogs" :key="index" class="log-item" :class="log.type">
                <span class="log-time">{{ log.time }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
              <div v-if="consoleLogs.length === 0" class="no-logs">
                No console output yet. Click "Run Full Check" to start debugging.
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="debug-card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-rocket me-3"></i>
                Quick Actions
              </h2>
            </div>
            
            <div class="quick-actions">
              <router-link to="/login" class="btn btn-outline-primary">
                <i class="fas fa-sign-in-alt me-2"></i>
                Go to Login
              </router-link>
              
              <router-link to="/user-setup" class="btn btn-outline-success">
                <i class="fas fa-user-cog me-2"></i>
                User Setup
              </router-link>
              
              <router-link to="/admin" class="btn btn-outline-warning" :class="{ disabled: !authStatus.canAccessAdmin }">
                <i class="fas fa-shield-alt me-2"></i>
                Test Admin Access
              </router-link>
              
              <button class="btn btn-outline-info" @click="refreshPage">
                <i class="fas fa-refresh me-2"></i>
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  getDebugUserInfo, 
  checkAdminPermission, 
  updateUserRoleToAdmin, 
  ensureAdminUser, 
  fullAuthCheck 
} from '../utils/authDebug.js';

// Reactive data
const isLoading = ref(false);
const authStatus = ref({
  authenticated: false,
  user: null,
  isAdmin: false,
  canAccessAdmin: false
});
const consoleLogs = ref([]);

// Methods
function addLog(message, type = 'info') {
  consoleLogs.value.push({
    time: new Date().toLocaleTimeString(),
    message,
    type
  });
}

async function runFullCheck() {
  isLoading.value = true;
  addLog('🔍 Running full authentication check...', 'info');
  
  try {
    const result = await fullAuthCheck();
    authStatus.value = result;
    
    addLog(`✅ Check completed - Authenticated: ${result.authenticated}, Is Admin: ${result.isAdmin}`, 'success');
  } catch (error) {
    addLog(`❌ Check failed: ${error.message}`, 'error');
  } finally {
    isLoading.value = false;
  }
}

async function updateToAdmin() {
  isLoading.value = true;
  addLog('🔄 Updating current user to admin role...', 'info');
  
  try {
    const success = await updateUserRoleToAdmin();
    if (success) {
      addLog('✅ User role updated to admin successfully!', 'success');
      // Refresh the check
      await runFullCheck();
    } else {
      addLog('❌ Failed to update user role', 'error');
    }
  } catch (error) {
    addLog(`❌ Error updating role: ${error.message}`, 'error');
  } finally {
    isLoading.value = false;
  }
}

async function handleEnsureAdminUser() {
  isLoading.value = true;
  addLog('🚀 Ensuring admin user exists...', 'info');
  
  try {
    const result = await ensureAdminUser();
    addLog('✅ Admin user ensured successfully!', 'success');
    addLog(`📧 Email: admin@menshealth.com`, 'info');
    addLog(`🔑 Password: admin123`, 'info');
  } catch (error) {
    addLog(`❌ Error ensuring admin user: ${error.message}`, 'error');
  } finally {
    isLoading.value = false;
  }
}

function clearAuthData() {
  isLoading.value = true;
  addLog('🗑️ Clearing authentication data...', 'warning');
  
  try {
    // Clear localStorage
    localStorage.clear();
    addLog('✅ Local storage cleared', 'success');
    
    // Clear sessionStorage
    sessionStorage.clear();
    addLog('✅ Session storage cleared', 'success');
    
    addLog('🔄 Please refresh the page to see changes', 'info');
  } catch (error) {
    addLog(`❌ Error clearing data: ${error.message}`, 'error');
  } finally {
    isLoading.value = false;
  }
}

function clearConsole() {
  consoleLogs.value = [];
}

function refreshPage() {
  window.location.reload();
}

// Lifecycle
onMounted(async () => {
  addLog('🚀 Auth Debug page loaded', 'info');
  await runFullCheck();
});
</script>

<style scoped>
.auth-debug-page {
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

/* Debug Section */
.debug-section {
  padding: 4rem 0;
  background: var(--gray-50);
}

.debug-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.debug-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  display: flex;
  align-items: center;
}

/* Status Content */
.status-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
}

.status-item.success {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success-color);
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.status-item.warning {
  background: rgba(255, 193, 7, 0.1);
  color: #856404;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status-item.error {
  background: rgba(220, 53, 69, 0.1);
  color: var(--danger-color);
  border: 1px solid rgba(220, 53, 69, 0.3);
}

/* User Info */
.user-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
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

/* Actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  padding: 1rem 1.5rem;
  font-weight: 600;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-2px);
}

/* Console Output */
.console-output {
  background: #1e1e1e;
  color: #ffffff;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.log-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
}

.log-time {
  color: #888;
  min-width: 80px;
}

.log-item.success .log-message {
  color: #4ade80;
}

.log-item.error .log-message {
  color: #f87171;
}

.log-item.warning .log-message {
  color: #fbbf24;
}

.log-item.info .log-message {
  color: #60a5fa;
}

.no-logs {
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .debug-card {
    padding: 2rem;
  }
  
  .actions-grid,
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
