<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body">
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
      <p class="card-text text-muted mb-2">{{ item.summary }}</p>
      
      <!-- Rating Section -->
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
        
        <!-- Rating Stats -->
        <div class="small text-muted">
          <span v-if="stats.count > 0">
            Average: {{ stats.average.toFixed(1) }} ({{ stats.count }} vote{{ stats.count > 1 ? 's' : '' }})
          </span>
          <span v-else>No ratings yet</span>
        </div>
      </div>
      
      <div class="d-flex flex-wrap gap-1 mb-3">
        <span class="badge bg-secondary">{{ item.tag }}</span>
        <span class="badge bg-warning text-dark">★ {{ item.rating.toFixed(1) }}</span>
      </div>

      <!-- View Details Button -->
      <button 
        class="btn btn-primary btn-sm w-100"
        @click="showDetails = true"
        :aria-label="`View detailed information for ${item.title}`"
      >
        <i class="fas fa-info-circle me-2"></i>
        View Details
      </button>
    </div>
  </div>

  <!-- Details Modal - Using Teleport to avoid hover conflicts -->
  <Teleport to="body">
    <div v-if="showDetails" class="modal show d-block" tabindex="-1" role="dialog" @click.self="showDetails = false">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h4 class="modal-title fw-bold">{{ item.title }}</h4>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              @click="showDetails = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="item.content">
              <!-- Overview -->
              <div class="strategy-card">
                <h6 class="text-primary">📋 Overview</h6>
                <p>{{ item.content.overview }}</p>
              </div>

              <!-- Key Strategies/Metrics -->
              <div v-if="item.content.keyStrategies" class="strategy-card">
                <h6 class="text-primary">🎯 Key Strategies</h6>
                <div v-for="strategy in item.content.keyStrategies" :key="strategy.title" class="mb-3">
                  <h6 class="text-dark">{{ strategy.title }}</h6>
                  <p class="text-muted">{{ strategy.description }}</p>
                  <ul class="list-unstyled">
                    <li v-for="step in strategy.actionSteps" :key="step" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ step }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Key Metrics (for Heart Health) -->
              <div v-if="item.content.keyMetrics" class="strategy-card">
                <h6 class="text-primary">💓 Key Health Metrics</h6>
                <div v-for="metric in item.content.keyMetrics" :key="metric.title" class="mb-3">
                  <h6 class="text-dark">{{ metric.title }}</h6>
                  <p class="text-muted">{{ metric.description }}</p>
                  <ul class="list-unstyled">
                    <li v-for="step in metric.actionSteps" :key="step" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ step }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Workout Routine (for Fitness) -->
              <div v-if="item.content.warmUp" class="strategy-card">
                <h6 class="text-primary">💪 Workout Routine</h6>
                
                <!-- Warm-up -->
                <div class="mb-3">
                  <h6 class="text-dark">{{ item.content.warmUp.title }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="exercise in item.content.warmUp.exercises" :key="exercise" class="mb-1">
                      <i class="fas fa-play-circle text-info me-2"></i>
                      {{ exercise }}
                    </li>
                  </ul>
                </div>

                <!-- Main Workout -->
                <div class="mb-3">
                  <h6 class="text-dark">{{ item.content.mainWorkout.title }}</h6>
                  <div v-for="exercise in item.content.mainWorkout.exercises" :key="exercise.name" class="mb-3 p-3 border rounded">
                    <h6 class="text-dark mb-1">{{ exercise.name }}</h6>
                    <p class="text-muted mb-1"><strong>Sets:</strong> {{ exercise.sets }}</p>
                    <p class="text-muted mb-1"><strong>Form:</strong> {{ exercise.form }}</p>
                    <p class="text-muted"><strong>Progression:</strong> {{ exercise.progression }}</p>
                  </div>
                </div>

                <!-- Cool-down -->
                <div class="mb-3">
                  <h6 class="text-dark">{{ item.content.coolDown.title }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="exercise in item.content.coolDown.exercises" :key="exercise" class="mb-1">
                      <i class="fas fa-play-circle text-info me-2"></i>
                      {{ exercise }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Sleep Environment (for Sleep) -->
              <div v-if="item.content.sleepEnvironment" class="mb-4">
                <h6 class="text-primary mb-3">Sleep Environment</h6>
                <div v-for="element in item.content.sleepEnvironment.elements" :key="element.factor" class="mb-3">
                  <h6 class="text-dark">{{ element.factor }}</h6>
                  <p class="text-muted">{{ element.description }}</p>
                </div>
              </div>

              <!-- Food Categories (for Nutrition) -->
              <div v-if="item.content.lowGIFoods" class="mb-4">
                <h6 class="text-primary mb-3">Low Glycemic Index Foods</h6>
                <div v-for="category in item.content.lowGIFoods.categories" :key="category.category" class="mb-3">
                  <h6 class="text-dark">{{ category.category }}</h6>
                  <p class="text-muted"><strong>Serving Size:</strong> {{ category.servingSize }}</p>
                  <ul class="list-unstyled">
                    <li v-for="food in category.foods" :key="food" class="mb-1">
                      <i class="fas fa-leaf text-success me-2"></i>
                      {{ food }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Food Swaps (for Nutrition) -->
              <div v-if="item.content.foodSwaps" class="mb-4">
                <h6 class="text-primary mb-3">Smart Food Swaps</h6>
                <div v-for="swap in item.content.foodSwaps.swaps" :key="swap.insteadOf" class="mb-2 p-2 border rounded">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ swap.insteadOf }}</strong> → <strong>{{ swap.choose }}</strong>
                    </div>
                  </div>
                  <small class="text-muted">{{ swap.benefit }}</small>
                </div>
              </div>

              <!-- Boundary Setting (for Work-Life Balance) -->
              <div v-if="item.content.boundarySetting" class="mb-4">
                <h6 class="text-primary mb-3">Setting Healthy Boundaries</h6>
                <div v-for="strategy in item.content.boundarySetting.strategies" :key="strategy.boundary" class="mb-3">
                  <h6 class="text-dark">{{ strategy.boundary }}</h6>
                  <p class="text-muted">{{ strategy.description }}</p>
                  <ul class="list-unstyled">
                    <li v-for="action in strategy.actions" :key="action" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ action }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Warning Signs -->
              <div v-if="item.content.warningSigns" class="warning-signs">
                <h6 class="text-warning">⚠️ Warning Signs</h6>
                <ul class="list-unstyled">
                  <li v-for="sign in item.content.warningSigns" :key="sign" class="mb-1">
                    <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                    {{ sign }}
                  </li>
                </ul>
              </div>

              <!-- Emergency Signs -->
              <div v-if="item.content.emergencySigns" class="emergency-signs">
                <h6 class="text-danger">🚨 Emergency Signs</h6>
                <ul class="list-unstyled">
                  <li v-for="sign in item.content.emergencySigns" :key="sign" class="mb-1">
                    <i class="fas fa-exclamation-triangle text-danger me-2"></i>
                    {{ sign }}
                  </li>
                </ul>
              </div>

              <!-- When to Seek Help -->
              <div v-if="item.content.whenToSeekHelp" class="seek-help">
                <h6 class="text-info">🆘 When to Seek Help</h6>
                <p class="mb-0">{{ item.content.whenToSeekHelp }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDetails = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { getCurrentUser } from '../utils/auth.js';
import { getUserRating, setUserRating, getResourceStats } from '../utils/ratings.js';

const props = defineProps({
  item: { type: Object, required: true },
  isFav: { type: Boolean, default: false }
});
defineEmits(['toggle']);

const currentUser = ref(null);
const userRating = ref(null);
const stats = ref({ average: 0, count: 0 });
const showDetails = ref(false);

onMounted(() => {
  currentUser.value = getCurrentUser();
  if (currentUser.value) {
    userRating.value = getUserRating(props.item.id, currentUser.value.id);
  }
  stats.value = getResourceStats(props.item.id);
  
  // Add keyboard event listener for ESC key
  document.addEventListener('keydown', handleKeydown);
});

function handleKeydown(event) {
  if (event.key === 'Escape' && showDetails.value) {
    showDetails.value = false;
  }
}

onBeforeUnmount(() => {
  // Remove keyboard event listener
  document.removeEventListener('keydown', handleKeydown);
});

function rateResource(rating) {
  if (!currentUser.value) {
    alert('Please login to rate resources.');
    return;
  }
  
  userRating.value = rating;
  setUserRating(props.item.id, currentUser.value.id, rating);
  stats.value = getResourceStats(props.item.id);
}
</script>

<style scoped>
.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-star {
  font-size: 1.2rem;
  line-height: 1;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.2s;
}

.rating-star:hover {
  color: #ffc107 !important;
}

.rating-star:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

/* Modal styles */
.modal {
  z-index: 1055;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop {
  z-index: 1050;
}

.modal-dialog {
  max-width: 95vw;
  width: 95vw;
  height: 90vh;
  margin: 5vh auto;
}

.modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.modal-header {
  flex-shrink: 0;
  padding: 1.5rem 2rem;
}

/* Content styling for better readability */
.modal-body h6 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.modal-body p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-body ul, .modal-body ol {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-body li {
  margin-bottom: 0.5rem;
}

/* Strategy cards styling */
.strategy-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.strategy-card h6 {
  color: #0d6efd;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 2px solid #0d6efd;
  padding-bottom: 0.5rem;
}

/* Action steps styling */
.action-steps {
  background: #e7f3ff;
  border-left: 4px solid #0d6efd;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 8px 8px 0;
}

.action-steps h6 {
  color: #0d6efd;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.action-steps ul {
  margin-bottom: 0;
}

.action-steps li {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

/* Warning signs styling */
.warning-signs {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.warning-signs h6 {
  color: #856404;
  font-weight: 600;
  margin-bottom: 1rem;
}

.warning-signs ul {
  margin-bottom: 0;
}

.warning-signs li {
  margin-bottom: 0.5rem;
  color: #856404;
}

/* Emergency signs styling */
.emergency-signs {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.emergency-signs h6 {
  color: #721c24;
  font-weight: 600;
  margin-bottom: 1rem;
}

.emergency-signs ul {
  margin-bottom: 0;
}

.emergency-signs li {
  margin-bottom: 0.5rem;
  color: #721c24;
}

/* When to seek help styling */
.seek-help {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.seek-help h6 {
  color: #0c5460;
  font-weight: 600;
  margin-bottom: 1rem;
}

.seek-help p {
  margin-bottom: 0;
  color: #0c5460;
}

/* Prevent hover conflicts */
.card {
  position: relative;
}

.modal {
  pointer-events: auto;
}

.modal-dialog {
  pointer-events: auto;
}

/* Ensure modal content doesn't interfere with card hover */
.modal-content {
  pointer-events: auto;
}
</style>
