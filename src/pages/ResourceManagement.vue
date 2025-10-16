<template>
  <div class="admin-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Resource Management</span>
          </h1>
          <p class="hero-subtitle">
            Manage health resources, categories, and content for the platform
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

        <!-- Resource Management content -->
        <div v-else class="dashboard-content">
          <!-- Stats Section -->
          <div class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-book"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ resourceStats.total }}</span>
                  <span class="stat-label">Total Resources</span>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-layer-group"></i>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ resourceStats.categories }}</span>
                  <span class="stat-label">Categories</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Category Distribution Chart -->
          <div class="chart-section">
            <div class="section-header">
              <h2 class="section-title">
                <i class="fas fa-chart-bar me-3"></i>
                Category Distribution
              </h2>
              <p class="section-subtitle">Overview of resource categories</p>
            </div>
            
            <div class="chart-container">
              <div v-for="category in categoryStats" :key="category.name" class="category-item">
                <div class="category-info">
                  <span class="category-label">{{ category.name }}</span>
                  <span class="category-count">{{ category.count }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :class="getCategoryColor(category.name)"
                    :style="{ width: category.percentage + '%' }"
                  ></div>
                </div>
                <span class="category-percentage">{{ category.percentage }}%</span>
              </div>
            </div>
          </div>

          <!-- Resources Table Section -->
          <div class="table-section">
            <div class="section-header">
              <h2 class="section-title">
                <i class="fas fa-list me-3"></i>
                All Resources
              </h2>
              <p class="section-subtitle">Manage and edit health resources</p>
            </div>
            
            <div class="table-card">
              <InteractiveTable
                :data="resources"
                :columns="resourceColumns"
                :sortable-columns="resourceSortableColumns"
                searchable-column="all"
                key-field="id"
                :items-per-page="10"
              >
                <template #cell-tag="{ value }">
                  <span class="category-badge">{{ value }}</span>
                </template>
                
                <template #cell-rating="{ value }">
                  <div class="rating-display">
                    <span class="star">★</span>
                    <span class="rating-value">{{ value.toFixed(1) }}</span>
                  </div>
                </template>
                
                <template #cell-actions="{ item }">
                  <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" @click="editResource(item)" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteResource(item)" title="Delete">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
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
import { getCurrentUser } from '../utils/auth.js';
import InteractiveTable from '../components/InteractiveTable.vue';
import resourcesData from '../data/resources.json';

const route = useRoute();
const resources = ref([]);
const showUnauthorizedError = ref(false);

// Table configuration
const resourceColumns = [
  { key: 'id', label: 'ID', sortable: true, type: 'number' },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'summary', label: 'Summary', sortable: true },
  { key: 'tag', label: 'Category', sortable: true },
  { key: 'rating', label: 'Rating', sortable: true, type: 'number' },
  { key: 'actions', label: 'Actions', sortable: false }
];

const resourceSortableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'summary', label: 'Summary' },
  { key: 'tag', label: 'Category' },
  { key: 'rating', label: 'Rating' }
];

const resourceStats = computed(() => {
  const total = resources.value.length;
  const categories = [...new Set(resources.value.map(r => r.tag))].length;
  return { total, categories };
});

const categoryStats = computed(() => {
  const categoryCount = {};
  resources.value.forEach(resource => {
    categoryCount[resource.tag] = (categoryCount[resource.tag] || 0) + 1;
  });
  
  const total = resources.value.length;
  return Object.entries(categoryCount).map(([name, count]) => ({
    name,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);
});

function getCategoryColor(category) {
  const colors = {
    'mental': 'bg-info',
    'cardio': 'bg-danger',
    'fitness': 'bg-success',
    'sleep': 'bg-primary',
    'nutrition': 'bg-warning'
  };
  return colors[category] || 'bg-secondary';
}

function editResource(resource) {
  // TODO: Implement edit functionality
  console.log('Edit resource:', resource);
  alert(`Edit functionality for "${resource.title}" will be implemented in the next iteration.`);
}

function deleteResource(resource) {
  // TODO: Implement delete functionality
  console.log('Delete resource:', resource);
  if (confirm(`Are you sure you want to delete "${resource.title}"?`)) {
    alert(`Delete functionality for "${resource.title}" will be implemented in the next iteration.`);
  }
}

onMounted(async () => {
  const currentUser = await getCurrentUser();
  
  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    showUnauthorizedError.value = true;
    return;
  }
  
  // Load resources data
  resources.value = resourcesData;
});
</script>

<style scoped>
/* Reuse AdminDashboard styles */
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

.category-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-info {
  display: flex;
  flex-direction: column;
  min-width: 100px;
}

.category-label {
  font-weight: 600;
  color: var(--gray-900);
  font-size: 0.9rem;
  text-transform: capitalize;
}

.category-count {
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

.category-percentage {
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

.category-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star {
  color: #ffc107;
  font-size: 1rem;
}

.rating-value {
  font-weight: 600;
  color: var(--gray-700);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.btn-outline-primary {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background: transparent;
}

.btn-outline-primary:hover {
  background: var(--primary-color);
  color: white;
}

.btn-outline-danger {
  border: 1px solid var(--danger-color);
  color: var(--danger-color);
  background: transparent;
}

.btn-outline-danger:hover {
  background: var(--danger-color);
  color: white;
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
  
  .category-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .category-info {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .category-percentage {
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
