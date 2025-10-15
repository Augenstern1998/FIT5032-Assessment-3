<template>
  <div class="interactive-table-container">
    <!-- Table Controls -->
    <div class="table-controls mb-3">
      <div class="row align-items-center">
        <!-- Search -->
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              :placeholder="`Search ${searchableColumn}...`"
              v-model="searchTerm"
              @input="onSearch"
            />
          </div>
        </div>
        
        <!-- Sort and Items per page -->
        <div class="col-md-6">
          <div class="d-flex gap-2 justify-content-md-end">
            <!-- Sort dropdown -->
            <select class="form-select" v-model="sortColumn" @change="onSort" style="min-width: 150px;">
              <option value="">Sort by...</option>
              <option v-for="column in sortableColumns" :key="column.key" :value="column.key">
                {{ column.label }}
              </option>
            </select>
            
            <!-- Sort direction -->
            <button 
              class="btn btn-outline-secondary" 
              @click="toggleSortDirection"
              :title="`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`"
            >
              <i :class="sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-responsive">
      <table class="table table-hover table-striped">
        <thead class="table-dark">
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              :class="{ 'sortable': column.sortable, 'active': sortColumn === column.key }"
              @click="column.sortable ? sortBy(column.key) : null"
              :style="{ cursor: column.sortable ? 'pointer' : 'default' }"
            >
              <div class="d-flex align-items-center justify-content-between">
                <span>{{ column.label }}</span>
                <i 
                  v-if="column.sortable" 
                  :class="getSortIcon(column.key)"
                  class="ms-2"
                ></i>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="getItemKey(item)">
            <td v-for="column in columns" :key="column.key">
              <slot 
                :name="`cell-${column.key}`" 
                :item="item" 
                :value="getNestedValue(item, column.key)"
                :column="column"
              >
                {{ formatCellValue(getNestedValue(item, column.key), column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No data message -->
    <div v-if="filteredData.length === 0" class="text-center py-4">
      <div class="text-muted">
        <i class="fas fa-inbox fa-2x mb-2"></i>
        <p class="mb-0">No data found</p>
        <small v-if="searchTerm">Try adjusting your search criteria</small>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-container mt-3">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">
              Showing {{ startItem }}-{{ endItem }} of {{ filteredData.length }} items
            </span>
          </div>
        </div>
        
        <div class="col-md-6">
          <nav aria-label="Table pagination">
            <ul class="pagination pagination-sm justify-content-md-end mb-0">
              <!-- Previous button -->
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button 
                  class="page-link" 
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
              </li>
              
              <!-- Page numbers -->
              <li 
                v-for="page in visiblePages" 
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <button 
                  class="page-link" 
                  @click="goToPage(page)"
                  :disabled="page === '...'"
                >
                  {{ page }}
                </button>
              </li>
              
              <!-- Next button -->
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button 
                  class="page-link" 
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  searchableColumn: {
    type: String,
    default: 'all'
  },
  sortableColumns: {
    type: Array,
    default: () => []
  },
  keyField: {
    type: String,
    default: 'id'
  }
});

// Reactive data
const searchTerm = ref('');
const sortColumn = ref('');
const sortDirection = ref('asc');
const currentPage = ref(1);

// Computed properties
const filteredData = computed(() => {
  let filtered = [...props.data];
  
  // Apply search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    filtered = filtered.filter(item => {
      if (props.searchableColumn === 'all') {
        return props.columns.some(column => {
          const value = getNestedValue(item, column.key);
          return String(value).toLowerCase().includes(search);
        });
      } else {
        const value = getNestedValue(item, props.searchableColumn);
        return String(value).toLowerCase().includes(search);
      }
    });
  }
  
  // Apply sorting
  if (sortColumn.value) {
    filtered.sort((a, b) => {
      const aVal = getNestedValue(a, sortColumn.value);
      const bVal = getNestedValue(b, sortColumn.value);
      
      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;
      
      return sortDirection.value === 'desc' ? -comparison : comparison;
    });
  }
  
  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.itemsPerPage);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return filteredData.value.slice(start, end);
});

const startItem = computed(() => {
  return filteredData.value.length === 0 ? 0 : (currentPage.value - 1) * props.itemsPerPage + 1;
});

const endItem = computed(() => {
  return Math.min(currentPage.value * props.itemsPerPage, filteredData.value.length);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    if (current > 4) {
      pages.push('...');
    }
    
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (current < total - 3) {
      pages.push('...');
    }
    
    if (total > 1) {
      pages.push(total);
    }
  }
  
  return pages;
});

// Methods
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function getItemKey(item) {
  return getNestedValue(item, props.keyField) || Math.random();
}

function formatCellValue(value, column) {
  if (value === null || value === undefined) return '-';
  
  if (column.type === 'date') {
    return new Date(value).toLocaleDateString();
  }
  
  if (column.type === 'datetime') {
    return new Date(value).toLocaleString();
  }
  
  if (column.type === 'number') {
    return Number(value).toLocaleString();
  }
  
  if (column.type === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
  
  return String(value);
}

function getSortIcon(columnKey) {
  if (sortColumn.value !== columnKey) {
    return 'fas fa-sort text-muted';
  }
  return sortDirection.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
}

function sortBy(columnKey) {
  if (sortColumn.value === columnKey) {
    toggleSortDirection();
  } else {
    sortColumn.value = columnKey;
    sortDirection.value = 'asc';
  }
  currentPage.value = 1;
}

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  currentPage.value = 1;
}

function onSort() {
  currentPage.value = 1;
}

function onSearch() {
  currentPage.value = 1;
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value && page !== '...') {
    currentPage.value = page;
  }
}

// Watch for data changes
watch(() => props.data, () => {
  currentPage.value = 1;
}, { deep: true });

// Initialize sortable columns from columns prop if not provided
onMounted(() => {
  if (props.sortableColumns.length === 0) {
    props.sortableColumns.push(...props.columns.filter(col => col.sortable !== false));
  }
});
</script>

<style scoped>
.interactive-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table-controls {
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.table th.sortable {
  user-select: none;
  transition: background-color 0.2s;
}

.table th.sortable:hover {
  background-color: rgba(255,255,255,0.1);
}

.table th.active {
  background-color: rgba(255,255,255,0.2);
}

.pagination-container {
  background: #f8f9fa;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}

.page-link {
  border: none;
  color: #6c757d;
  transition: all 0.2s;
}

.page-link:hover {
  background-color: #e9ecef;
  color: #495057;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.page-item.disabled .page-link {
  color: #adb5bd;
  background-color: transparent;
}

.input-group-text {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.form-control:focus,
.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

@media (max-width: 768px) {
  .table-controls .row > div {
    margin-bottom: 0.5rem;
  }
  
  .pagination-container .row > div {
    margin-bottom: 0.5rem;
  }
  
  .pagination {
    justify-content: center !important;
  }
}
</style>
