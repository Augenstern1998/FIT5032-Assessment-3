<template>
  <section class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0">Resource Management</h2>
      <span class="badge bg-primary">Admin Panel</span>
    </div>

    <!-- Error message for unauthorized access -->
    <div v-if="showUnauthorizedError" class="alert alert-warning" role="alert">
      <strong>Access Denied:</strong> You don't have permission to view this page.
    </div>

    <!-- Resource Management content -->
    <div v-else>
      <div class="row g-4 mb-4">
        <!-- Resource Statistics -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Resource Statistics</h5>
              <div class="row text-center">
                <div class="col-6">
                  <div class="h3 text-primary">{{ resourceStats.total }}</div>
                  <small class="text-muted">Total Resources</small>
                </div>
                <div class="col-6">
                  <div class="h3 text-success">{{ resourceStats.categories }}</div>
                  <small class="text-muted">Categories</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Category Distribution</h5>
              <div v-for="category in categoryStats" :key="category.name" class="mb-2">
                <div class="d-flex justify-content-between">
                  <span>{{ category.name }}</span>
                  <span class="fw-bold">{{ category.count }}</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div 
                    class="progress-bar" 
                    :class="getCategoryColor(category.name)"
                    :style="{ width: category.percentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resource List -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">All Resources</h5>
        </div>
        <div class="card-body p-0">
          <InteractiveTable
            :data="resources"
            :columns="resourceColumns"
            :sortable-columns="resourceSortableColumns"
            searchable-column="all"
            key-field="id"
            :items-per-page="10"
          >
            <template #cell-tag="{ value }">
              <span class="badge bg-secondary">{{ value }}</span>
            </template>
            
            <template #cell-rating="{ value }">
              <div class="d-flex align-items-center">
                <span class="me-1">★</span>
                <span>{{ value.toFixed(1) }}</span>
              </div>
            </template>
            
            <template #cell-actions="{ item }">
              <div class="btn-group btn-group-sm" role="group">
                <button class="btn btn-outline-primary" @click="editResource(item)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-outline-danger" @click="deleteResource(item)" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
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

onMounted(() => {
  const currentUser = getCurrentUser();
  
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
.progress {
  background-color: #e9ecef;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
