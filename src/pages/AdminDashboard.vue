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
        <div class="card-body p-0">
          <InteractiveTable
            :data="users"
            :columns="userColumns"
            :sortable-columns="userSortableColumns"
            searchable-column="all"
            key-field="id"
            :items-per-page="10"
          >
            <template #cell-role="{ value }">
              <span class="badge" :class="value === 'admin' ? 'bg-warning' : 'bg-info'">
                {{ value }}
              </span>
            </template>
            
            <template #cell-createdAt="{ value }">
              {{ formatDate(value) }}
            </template>
          </InteractiveTable>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCurrentUser, getAllUsersSafe } from '../utils/auth.js';
import InteractiveTable from '../components/InteractiveTable.vue';

const route = useRoute();
const users = ref([]);
const showUnauthorizedError = ref(false);

// Table configuration
const userColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'createdAt', label: 'Joined', sortable: true, type: 'date' }
];

const userSortableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'createdAt', label: 'Joined Date' }
];

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

onMounted(async () => {
  const currentUser = getCurrentUser();
  
  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    showUnauthorizedError.value = true;
    return;
  }
  
  try {
    // Load all users from Firebase
    users.value = await getAllUsersSafe();
    
    // If no users found, add some test data for demonstration
    if (users.value.length === 0) {
      console.log('No users found, adding test data for demonstration...');
      users.value = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'member',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'member',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Alice Brown',
          email: 'alice@example.com',
          role: 'member',
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Charlie Wilson',
          email: 'charlie@example.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ];
    }
  } catch (error) {
    console.error('Error loading users:', error);
    // Fallback to test data if Firebase fails
    users.value = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'member',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];
  }
});
</script>

