<!-- Main application layout component -->
<template>
  <div>
    <!-- Accessibility Tools -->
    <AccessibilityTools />
    
    <!-- Navigation bar component -->
    <NavBar />
    
    <!-- Main content area with router view -->
    <main id="main-content" class="container py-4" tabindex="-1">
      <router-view />
    </main>
    
    <!-- Footer with copyright information -->
    <footer class="text-center py-4 border-top">
      <small>© 2025 Men's Health NFP</small>
    </footer>
  </div>
</template>

<script setup>
// Import components
import NavBar from './components/NavBar.vue';
import AccessibilityTools from './components/AccessibilityTools.vue';
</script>
