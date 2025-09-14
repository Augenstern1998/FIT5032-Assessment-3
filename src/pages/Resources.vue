<!-- Resources page component with filtering, sorting, and favorites functionality -->
<template>
  <section>
    <!-- Page header with filters and sorting controls -->
    <div class="d-flex flex-column flex-md-row align-items-md-center gap-2 mb-3">
      <h2 class="h4 mb-0">Health Resources</h2>

      <!-- Filter and sort controls -->
      <div class="ms-md-auto d-flex gap-2">
        <select class="form-select" v-model="filterTag" style="max-width:180px" aria-label="Filter by tag">
          <option value="">All Tags</option>
          <option v-for="t in tags" :key="t" :value="t">{{ t }}</option>
        </select>

        <select class="form-select" v-model="sortBy" style="max-width:180px" aria-label="Sort resources">
          <option value="rating">Sort by Rating</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
    </div>

    <!-- Resources grid layout -->
    <div class="row g-3">
      <div v-for="r in viewList" :key="r.id" class="col-12 col-sm-6 col-lg-4">
        <ResourceCard :item="r" :isFav="favorites.includes(r.id)" @toggle="onToggleFav" />
      </div>
    </div>

    <!-- No results message -->
    <p v-if="viewList.length === 0" class="text-muted mt-3">No resources match your filters.</p>
  </section>
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

/**
 * Handle favorite toggle for a resource
 * @param {number} id - Resource ID to toggle favorite status
 */
function onToggleFav(id) {
  favorites.value = toggleFavorite(id);
}
</script>
