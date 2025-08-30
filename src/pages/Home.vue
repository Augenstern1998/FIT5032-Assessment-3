<template>
  <section class="py-3" style="border:2px dashed #ccc">
    <div class="text-center mb-4">
      <h1 class="h3">Welcome to Men’s Health</h1>
      <p class="text-muted mb-0">Practical tools and trusted resources for every stage of life.</p>
      <p class="mt-2"><strong>Tips loaded:</strong> {{ tips.length }}</p>
    </div>

    <div class="row g-3">
      <div v-for="tip in tips" :key="tip.id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Daily Tip</h5>
            <p class="card-text">{{ tip.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import tips from '../data/tips.json';
console.log('Home tips:', tips);
</script>

