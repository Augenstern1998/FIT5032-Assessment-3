<!-- Home page component displaying welcome message and daily health tips -->
<template>
  <section class="container py-4">
    <!-- Page header with welcome message -->
    <div class="text-center mb-4">
      <h1 class="display-5">Welcome to Men's Health</h1>
      <p class="text-muted">Practical tools and trusted resources for every stage of life.</p>
      <p class="fw-semibold">Tips loaded: {{ tips.length }}</p>
      
      <!-- Show error message if redirected from unauthorized access -->
      <div v-if="$route.query.error === 'unauthorized'" class="alert alert-warning mt-3" role="alert">
        <strong>Access Denied:</strong> You don't have permission to access that page.
      </div>
    </div>

    <!-- Grid layout for daily health tips -->
    <div class="row g-3">
      <div v-for="t in tips" :key="t.id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Daily Tip</h5>
            <p class="card-text mb-0">{{ t.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import tipsData from '../data/tips.json'

// Reactive reference for tips data
const tips = ref([])

// Load tips data when component is mounted
onMounted(() => {
  tips.value = tipsData
})
</script>

