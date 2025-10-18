// Main application entry point - Vue 3 app initialization

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';

// Import Bootstrap CSS for styling
import 'bootstrap/dist/css/bootstrap.min.css';
// Import custom CSS styles
import './assets/main.css';
// Import accessibility styles
import './assets/accessibility.css';

// Import Bootstrap JavaScript for interactive components (modals, dropdowns, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Create and mount the Vue application
createApp(App).use(router).mount('#app');
