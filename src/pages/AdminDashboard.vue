<template>
  <section class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0">Admin Dashboard</h2>
      <span class="badge bg-primary">Admin Panel</span>
    </div>

    <!-- Error message for unauthorized access -->
    <div v-if="showUnauthorizedError" class="alert alert-warning" role="alert">
      <strong>Access Denied:</strong> You don't have permission to view this page.
    </div>

    <!-- Dashboard content -->
    <div v-else>
      <div class="row g-4 mb-4">
        <!-- User Statistics -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">User Statistics</h5>
              <div class="row text-center">
                <div class="col-6">
                  <div class="h3 text-primary">{{ userStats.total }}</div>
                  <small class="text-muted">Total Users</small>
                </div>
                <div class="col-6">
                  <div class="h3 text-success">{{ userStats.admins }}</div>
                  <small class="text-muted">Admins</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Role Distribution -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Role Distribution</h5>
              <div class="mb-2">
                <div class="d-flex justify-content-between">
                  <span>Members</span>
                  <span class="fw-bold">{{ userStats.members }}</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-info" :style="{ width: memberPercentage + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="d-flex justify-content-between">
                  <span>Admins</span>
                  <span class="fw-bold">{{ userStats.admins }}</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-warning" :style="{ width: adminPercentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User List -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">All Users</h5>
        </div>
        <div class="card-body">
          <div v-if="users.length === 0" class="text-muted text-center py-3">
            No users found.
          </div>
          <div v-else class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" :class="user.role === 'admin' ? 'bg-warning' : 'bg-info'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.id) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCurrentUser, getAllUsersSafe } from '../utils/auth.js';

const route = useRoute();
const users = ref([]);
const showUnauthorizedError = ref(false);

const userStats = computed(() => {
  const total = users.value.length;
  const admins = users.value.filter(u => u.role === 'admin').length;
  const members = total - admins;
  return { total, admins, members };
});

const memberPercentage = computed(() => {
  if (userStats.value.total === 0) return 0;
  return Math.round((userStats.value.members / userStats.value.total) * 100);
});

const adminPercentage = computed(() => {
  if (userStats.value.total === 0) return 0;
  return Math.round((userStats.value.admins / userStats.value.total) * 100);
});

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString();
}

onMounted(() => {
  const currentUser = getCurrentUser();
  
  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    showUnauthorizedError.value = true;
    return;
  }
  
  // Load all users
  users.value = getAllUsersSafe();
});
</script>

