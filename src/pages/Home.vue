<template>
  <section class="container py-4">
    <!-- Title：-->
    <div class="text-center mb-4">
      <h1 class="display-5">Welcome to Men’s Health</h1>
      <p class="text-muted">Practical tools and trusted resources for every stage of life.</p>
      <p class="fw-semibold">Tips loaded: {{ tips.length }}</p>
    </div>

    <!-- Tips list -->
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

const tips = ref([])

onMounted(() => {
  tips.value = tipsData
})
</script>

