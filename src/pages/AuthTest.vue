<template>
  <div class="auth-test-page">
    <div class="container py-4">
      <h2>Authentication Status Test</h2>
      
      <div class="status-card">
        <h3>Current Status</h3>
        <p><strong>User:</strong> {{ user ? user.name : 'Not logged in' }}</p>
        <p><strong>Email:</strong> {{ user ? user.email : 'N/A' }}</p>
        <p><strong>Role:</strong> {{ user ? user.role : 'N/A' }}</p>
        <p><strong>Authenticated:</strong> {{ isAuthenticated ? 'Yes' : 'No' }}</p>
      </div>
      
      <div class="actions">
        <button @click="refreshStatus" class="btn btn-primary">Refresh Status</button>
        <button @click="testAuthEvents" class="btn btn-secondary">Test Auth Events</button>
      </div>
      
      <div class="logs">
        <h4>Console Logs:</h4>
        <div class="log-output">
          <div v-for="(log, index) in logs" :key="index" class="log-item">
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getCurrentUser, AUTH_CHANGED_EVENT } from '../utils/auth.js'

const user = ref(null)
const logs = ref([])

const isAuthenticated = computed(() => !!user.value)

function addLog(message) {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.push(`[${timestamp}] ${message}`)
  console.log(message)
}

async function loadUser() {
  try {
    user.value = await getCurrentUser()
    addLog(`User loaded: ${user.value ? user.value.name : 'null'}`)
  } catch (error) {
    addLog(`Error loading user: ${error.message}`)
    user.value = null
  }
}

async function refreshStatus() {
  addLog('Refreshing authentication status...')
  await loadUser()
}

function testAuthEvents() {
  addLog('Testing auth events...')
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT))
  window.dispatchEvent(new CustomEvent('firebase_auth_changed'))
}

onMounted(() => {
  addLog('Auth test page mounted')
  loadUser()
  
  // Listen to auth changes
  window.addEventListener(AUTH_CHANGED_EVENT, loadUser)
  window.addEventListener('firebase_auth_changed', loadUser)
})

onBeforeUnmount(() => {
  window.removeEventListener(AUTH_CHANGED_EVENT, loadUser)
  window.removeEventListener('firebase_auth_changed', loadUser)
})
</script>

<style scoped>
.auth-test-page {
  padding: 2rem 0;
}

.status-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1rem 0;
}

.actions {
  margin: 1rem 0;
}

.actions .btn {
  margin-right: 1rem;
}

.logs {
  margin-top: 2rem;
}

.log-output {
  background: #000;
  color: #0f0;
  padding: 1rem;
  border-radius: 0.25rem;
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.875rem;
}

.log-item {
  margin-bottom: 0.25rem;
}
</style>
