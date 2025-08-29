<template>
  <nav class="navbar navbar-expand-lg bg-light border-bottom">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold" to="/">Men's Health</RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"
              aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon">☰</span>
      </button>

      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/resources">Resources</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/join">Join Community</RouterLink></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.navbar-toggler { border: 1px solid #ddd; border-radius: 6px; padding: .25rem .5rem; }
</style>
