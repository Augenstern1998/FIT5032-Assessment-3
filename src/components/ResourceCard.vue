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
      <span class="badge bg-secondary me-2">{{ item.tag }}</span>
      <span class="badge bg-warning text-dark">★ {{ item.rating.toFixed(1) }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true },
  isFav: { type: Boolean, default: false }
});
defineEmits(['toggle']);
</script>
