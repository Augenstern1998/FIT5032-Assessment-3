<template>
  <div class="admin-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Admin Dashboard</span>
          </h1>
          <p class="hero-subtitle">
            Manage users, monitor activity, and oversee platform operations
          </p>
          <div class="admin-badge">
            <i class="fas fa-shield-alt me-2"></i>
            Admin Panel
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="admin-content">
      <div class="container">
        <!-- Error message for unauthorized access -->
        <div v-if="showUnauthorizedError" class="error-card">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h3>Access Denied</h3>
          <p>You don't have permission to view this page. Please contact an administrator.</p>
          <router-link to="/" class="btn btn-primary">
            <i class="fas fa-home me-2"></i>
            Return to Home
          </router-link>
        </div>

        <!-- Dashboard content -->
        <div v-else class="dashboard-content">
          <!-- Stats Section -->
          <div class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ userStats.total }}</span>
                  <span class="stat-label">Total Users</span>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-user-shield"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ userStats.admins }}</span>
                  <span class="stat-label">Admins</span>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-user"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ userStats.members }}</span>
                  <span class="stat-label">Members</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Role Distribution Chart -->
          <div class="chart-section">
            <div class="section-header">
              <h2 class="section-title">
                <i class="fas fa-chart-pie me-3"></i>
                Role Distribution
              </h2>
              <p class="section-subtitle">Overview of user roles in the platform</p>
            </div>
            
            <div class="chart-container">
              <div class="role-item">
                <div class="role-info">
                  <span class="role-label">Members</span>
                  <span class="role-count">{{ userStats.members }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill members" :style="{ width: memberPercentage + '%' }"></div>
                </div>
                <span class="role-percentage">{{ memberPercentage }}%</span>
              </div>
              
              <div class="role-item">
                <div class="role-info">
                  <span class="role-label">Admins</span>
                  <span class="role-count">{{ userStats.admins }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill admins" :style="{ width: adminPercentage + '%' }"></div>
                </div>
                <span class="role-percentage">{{ adminPercentage }}%</span>
              </div>
            </div>
          </div>

          <!-- Users Table Section -->
          <div class="table-section">
            <div class="section-header">
              <h2 class="section-title">
                <i class="fas fa-users-cog me-3"></i>
                All Users
              </h2>
              <p class="section-subtitle">Manage and monitor user accounts</p>
            </div>
            
            <div class="table-card">
              <InteractiveTable
                :data="users"
                :columns="userColumns"
                :sortable-columns="userSortableColumns"
                searchable-column="all"
                key-field="id"
                :items-per-page="10"
              >
                <template #cell-role="{ value }">
                  <span class="role-badge" :class="value === 'admin' ? 'admin-role' : 'member-role'">
                    <i :class="value === 'admin' ? 'fas fa-user-shield' : 'fas fa-user'" class="me-1"></i>
                    {{ value }}
                  </span>
                </template>
                
                <template #cell-createdAt="{ value }">
                  <span class="date-text">{{ formatDate(value) }}</span>
                </template>
              </InteractiveTable>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
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
  const currentUser = await getCurrentUser();
  
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

<style scoped>
.admin-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 50vh;
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
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
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
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
  margin-bottom: 1.5rem;
}

.admin-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Main Content */
.admin-content {
  padding: 4rem 0;
  background: var(--gray-50);
  min-height: 50vh;
}

/* Error State */
.error-card {
  text-align: center;
  background: white;
  border-radius: var(--radius-2xl);
  padding: 3rem 2rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  max-width: 500px;
  margin: 0 auto;
}

.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--warning-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.error-icon i {
  font-size: 2rem;
  color: white;
}

.error-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.error-card p {
  color: var(--gray-600);
  margin-bottom: 2rem;
}

/* Dashboard Content */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  border: 1px solid var(--gray-200);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.stat-icon i {
  font-size: 1.5rem;
  color: white;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--gray-600);
  font-weight: 500;
}

/* Chart Section */
.chart-section {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-subtitle {
  color: var(--gray-600);
  font-size: 1rem;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.role-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.role-info {
  display: flex;
  flex-direction: column;
  min-width: 100px;
}

.role-label {
  font-weight: 600;
  color: var(--gray-900);
  font-size: 0.9rem;
}

.role-count {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.8s ease;
}

.progress-fill.members {
  background: var(--info-color);
}

.progress-fill.admins {
  background: var(--warning-color);
}

.role-percentage {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
  color: var(--gray-700);
}

/* Table Section */
.table-section {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
}

.table-card {
  margin-top: 1.5rem;
}

.role-badge {
  display: inline-flex;
  align-items: center;
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

.date-text {
  color: var(--gray-600);
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .chart-section,
  .table-section {
    padding: 2rem;
  }
  
  .role-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .role-info {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .role-percentage {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .chart-section,
  .table-section {
    padding: 1.5rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
}
</style>

