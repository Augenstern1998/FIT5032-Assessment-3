<!-- Resources page component with filtering, sorting, and favorites functionality -->
<template>
  <div class="resources-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Health Resources</span>
          </h1>
          <p class="hero-subtitle">
            Discover trusted health resources, expert articles, and practical tools for your wellness journey
          </p>
        </div>
      </div>
    </section>

    <!-- Filters and Controls Section -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-container">
          <div class="filters-header">
            <h2 class="section-title">
              <i class="fas fa-filter me-3"></i>
              Find Your Perfect Resource
            </h2>
            <p class="section-subtitle">Filter and sort through our curated collection</p>
          </div>

          <div class="filters-controls">
            <div class="filter-group">
              <label for="tagFilter" class="filter-label">
                <i class="fas fa-tags me-2"></i>
                Category
              </label>
              <select 
                id="tagFilter"
                class="form-select filter-select" 
                v-model="filterTag" 
                aria-label="Filter by tag"
              >
                <option value="">All Categories</option>
                <option v-for="t in tags" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="sortFilter" class="filter-label">
                <i class="fas fa-sort me-2"></i>
                Sort By
              </label>
              <select 
                id="sortFilter"
                class="form-select filter-select" 
                v-model="sortBy" 
                aria-label="Sort resources"
              >
                <option value="rating">Highest Rated</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>

            <div class="results-count">
              <span class="count-badge">
                {{ viewList.length }} {{ viewList.length === 1 ? 'resource' : 'resources' }} found
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Resources Grid Section -->
    <section class="resources-section">
      <div class="container">
        <div v-if="viewList.length > 0" class="resources-grid">
          <div 
            v-for="(r, index) in viewList" 
            :key="r.id" 
            class="resource-item"
            :class="`resource-item-${index + 1}`"
          >
            <ResourceCard :item="r" :isFav="favorites.includes(r.id)" @toggle="onToggleFav" />
          </div>
        </div>

        <!-- No results state -->
        <div v-else class="no-results">
          <div class="no-results-icon">
            <i class="fas fa-search"></i>
          </div>
          <h3>No resources found</h3>
          <p>Try adjusting your filters or browse all categories</p>
          <button class="btn btn-outline-primary" @click="clearFilters">
            <i class="fas fa-refresh me-2"></i>
            Clear Filters
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-book"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ list.length }}</span>
              <span class="stat-label">Total Resources</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-heart"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ favorites.length }}</span>
              <span class="stat-label">Your Favorites</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ avgRating.toFixed(1) }}</span>
              <span class="stat-label">Average Rating</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-layer-group"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ tags.length }}</span>
              <span class="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import data from '../data/resources.json';
import ResourceCard from '../components/ResourceCard.vue';
import { getFavorites, toggleFavorite } from '../utils/storage.js';

// Reactive data references
const list = ref([]);
const favorites = ref([]);
const filterTag = ref('');
const sortBy = ref('rating');

// Load data when component mounts
onMounted(() => {
  list.value = data;
  favorites.value = getFavorites();
});

// Computed property to get unique tags from resources
const tags = computed(() => [...new Set(list.value.map(i => i.tag))]);

// Computed property for filtered and sorted resource list
const viewList = computed(() => {
  let arr = [...list.value];
  
  // Apply tag filter if selected
  if (filterTag.value) arr = arr.filter(i => i.tag === filterTag.value);
  
  // Apply sorting
  if (sortBy.value === 'rating') {
    arr.sort((a,b)=> b.rating - a.rating); // Sort by rating (descending)
  } else {
    arr.sort((a,b)=> a.title.localeCompare(b.title)); // Sort by title (ascending)
  }
  
  return arr;
});

// Computed property for average rating
const avgRating = computed(() => {
  if (list.value.length === 0) return 0;
  const total = list.value.reduce((sum, item) => sum + item.rating, 0);
  return total / list.value.length;
});

/**
 * Handle favorite toggle for a resource
 * @param {number} id - Resource ID to toggle favorite status
 */
function onToggleFav(id) {
  favorites.value = toggleFavorite(id);
}

/**
 * Clear all filters and reset to default state
 */
function clearFilters() {
  filterTag.value = '';
  sortBy.value = 'rating';
}
</script>

<style scoped>
.resources-page {
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
  margin-bottom: 1.5rem;
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
  max-width: 600px;
  margin: 0 auto;
}

/* Filters Section */
.filters-section {
  padding: 3rem 0;
  background: var(--gray-50);
}

.filters-container {
  max-width: 1000px;
  margin: 0 auto;
}

.filters-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: var(--gray-600);
  font-size: 1.1rem;
}

.filters-controls {
  display: flex;
  gap: 2rem;
  align-items: end;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.filter-label {
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  min-width: 180px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.filter-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.results-count {
  display: flex;
  align-items: center;
}

.count-badge {
  background: var(--primary-gradient);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.9rem;
}

/* Resources Section */
.resources-section {
  padding: 4rem 0;
  background: white;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.resource-item {
  animation: fadeInUp 0.6s ease-out;
}

.resource-item:nth-child(1) { animation-delay: 0.1s; }
.resource-item:nth-child(2) { animation-delay: 0.2s; }
.resource-item:nth-child(3) { animation-delay: 0.3s; }
.resource-item:nth-child(4) { animation-delay: 0.4s; }
.resource-item:nth-child(5) { animation-delay: 0.5s; }
.resource-item:nth-child(6) { animation-delay: 0.6s; }

/* No Results State */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.no-results-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.no-results-icon i {
  font-size: 2rem;
  color: var(--gray-400);
}

.no-results h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 1rem;
}

.no-results p {
  color: var(--gray-500);
  margin-bottom: 2rem;
}

/* Stats Section */
.stats-section {
  padding: 3rem 0;
  background: var(--gray-50);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
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

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .filters-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .resources-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
