// Vue Router configuration with authentication and role-based access control

import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Resources from '../pages/Resources.vue';
import JoinCommunity from '../pages/JoinCommunity.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import { getCurrentUser } from '../utils/auth.js';

// Route definitions with metadata for authentication and authorization
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/resources', name: 'resources', component: Resources },
  { path: '/join', name: 'join', component: JoinCommunity, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: () => import('../pages/AdminDashboard.vue'), meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
];

// Create router instance with web history mode
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }), // Always scroll to top on route change
});

// Global navigation guard for authentication and authorization
router.beforeEach((to) => {
  const user = getCurrentUser();
  
  // Check if route requires authentication
  if (to.meta?.requiresAuth && !user) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  
  // Check role-based authorization for admin routes
  if (to.meta?.roles && user) {
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const requiredRoles = to.meta.roles;
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      // Redirect to home with error message for unauthorized access
      return { name: 'home', query: { error: 'unauthorized' } };
    }
  }
  
  return true; // Allow navigation
});

export default router;
