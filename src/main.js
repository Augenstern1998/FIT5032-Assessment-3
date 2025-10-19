// Main application entry point - Vue 3 app initialization

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import { handleRedirectResult } from './utils/firebaseAuth.js';

// Import Bootstrap CSS for styling
import 'bootstrap/dist/css/bootstrap.min.css';
// Import custom CSS styles
import './assets/main.css';
// Import accessibility styles
import './assets/accessibility.css';

// Import Bootstrap JavaScript for interactive components (modals, dropdowns, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Handle Firebase redirect result before mounting the app
async function initializeApp() {
  try {
    // Check if we're returning from a Google redirect
    const redirectResult = await handleRedirectResult();
    if (redirectResult) {
      console.log('Redirect login successful:', redirectResult);
      // Redirect to home page after successful login
      window.location.href = '/';
      return;
    }
  } catch (error) {
    console.error('Error handling redirect result:', error);
  }

  // Create and mount the Vue application
  createApp(App).use(router).mount('#app');
}

// Initialize the app
initializeApp();
