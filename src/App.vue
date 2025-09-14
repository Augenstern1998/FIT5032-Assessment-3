<!-- Main application layout component -->
<template>
  <div>
    <!-- Navigation bar component -->
    <NavBar />
    
    <!-- Main content area with router view -->
    <main class="container py-4">
      <router-view />
    </main>
    
    <!-- Footer with copyright information -->
    <footer class="text-center py-4 border-top">
      <small>© 2025 Men's Health NFP</small>
    </footer>
  </div>
</template>

<script setup>
// Import navigation bar component
import NavBar from './components/NavBar.vue';
</script>
