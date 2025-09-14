<!-- Resource card component with rating system and favorites functionality -->
<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body">
      <!-- Card title with favorite toggle button -->
      <h5 class="card-title d-flex justify-content-between">
        {{ item.title }}
        <button
          class="btn btn-sm"
          @click="$emit('toggle', item.id)"
          :aria-label="isFav ? 'Unfavourite' : 'Favourite'"
        >
          <span v-if="isFav">★</span>
          <span v-else>☆</span>
        </button>
      </h5>
      
      <!-- Resource summary -->
      <p class="card-text text-muted mb-2">{{ item.summary }}</p>
      
      <!-- Interactive rating section -->
      <div class="mb-2">
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="small text-muted">Rating:</span>
          <div class="rating-stars" role="radiogroup" :aria-label="`Rate ${item.title}`">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="btn btn-sm p-0 rating-star"
              :class="{ 'text-warning': star <= userRating, 'text-muted': star > userRating }"
              @click="rateResource(star)"
              @keydown.enter="rateResource(star)"
              @keydown.space.prevent="rateResource(star)"
              :aria-label="`Rate ${star} star${star > 1 ? 's' : ''}`"
              :aria-pressed="star === userRating"
              role="radio"
              :tabindex="0"
            >
              ★
            </button>
          </div>
          <span class="small text-muted">({{ userRating || 0 }}/5)</span>
        </div>
        
        <!-- Rating statistics display -->
        <div class="small text-muted">
          <span v-if="stats.count > 0">
            Average: {{ stats.average.toFixed(1) }} ({{ stats.count }} vote{{ stats.count > 1 ? 's' : '' }})
          </span>
          <span v-else>No ratings yet</span>
        </div>
      </div>
      
      <!-- Resource tags and rating badges -->
      <div class="d-flex flex-wrap gap-1">
        <span class="badge bg-secondary">{{ item.tag }}</span>
        <span class="badge bg-warning text-dark">★ {{ item.rating.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getCurrentUser } from '../utils/auth.js';
import { getUserRating, setUserRating, getResourceStats } from '../utils/ratings.js';

// Component props definition
const props = defineProps({
  item: { type: Object, required: true },  // Resource data object
  isFav: { type: Boolean, default: false } // Favorite status
});

// Component events
defineEmits(['toggle']);

// Component state
const currentUser = ref(null);
const userRating = ref(null);
const stats = ref({ average: 0, count: 0 });

// Initialize component data when mounted
onMounted(() => {
  currentUser.value = getCurrentUser();
  
  // Load user's rating for this resource if logged in
  if (currentUser.value) {
    userRating.value = getUserRating(props.item.id, currentUser.value.id);
  }
  
  // Load overall rating statistics for this resource
  stats.value = getResourceStats(props.item.id);
});

/**
 * Handle resource rating by user
 * @param {number} rating - Rating value (1-5 stars)
 */
function rateResource(rating) {
  // Check if user is logged in
  if (!currentUser.value) {
    alert('Please login to rate resources.');
    return;
  }
  
  // Update user rating and statistics
  userRating.value = rating;
  setUserRating(props.item.id, currentUser.value.id, rating);
  stats.value = getResourceStats(props.item.id);
}
</script>

<style scoped>
/* Rating stars container styling */
.rating-stars {
  display: flex;
  gap: 2px;
}

/* Individual star button styling */
.rating-star {
  font-size: 1.2rem;
  line-height: 1;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.2s;
}

/* Star hover effect */
.rating-star:hover {
  color: #ffc107 !important;
}

/* Star focus styling for accessibility */
.rating-star:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}
</style>
