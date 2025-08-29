<template>
  <div>
    <NavBar />
    <main class="container py-4">
      <router-view />
    </main>
    <footer class="text-center py-4 border-top">
      <small>© 2025 Men’s Health NFP</small>
    </footer>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
</script>
