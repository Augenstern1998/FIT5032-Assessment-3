import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Resources from '../pages/Resources.vue';
import JoinCommunity from '../pages/JoinCommunity.vue';
import Contact from '../pages/Contact.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import AuthTest from '../pages/AuthTest.vue';
import { getCurrentUser } from '../utils/auth.js';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/resources', name: 'resources', component: Resources },
  { path: '/contact', name: 'contact', component: Contact },
  { path: '/join', name: 'join', component: JoinCommunity, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: () => import('../pages/AdminDashboard.vue'), meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/admin/resources', name: 'admin-resources', component: () => import('../pages/ResourceManagement.vue'), meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
  { path: '/auth-test', name: 'auth-test', component: AuthTest },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to) => {
  try {
    console.log(`🔍 Route guard: Checking access to ${to.path}`);
    
    // For production environment, be more lenient with auth checks
    const isProduction = window.location.hostname !== 'localhost';
    
    if (isProduction) {
      // In production, add longer delay and retry mechanism
      await new Promise(resolve => setTimeout(resolve, 300));
    } else {
      // In development, shorter delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    let user = null;
    let attempts = 0;
    const maxAttempts = isProduction ? 3 : 1;
    
    // Try to get user with retries
    while (attempts < maxAttempts && !user) {
      try {
        user = await getCurrentUser();
        console.log(`👤 Route guard attempt ${attempts + 1}: Current user:`, user ? 'exists' : 'null');
        if (user) break;
      } catch (error) {
        console.warn(`⚠️ Route guard attempt ${attempts + 1} failed:`, error.message);
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // Check authentication
    if (to.meta?.requiresAuth && !user) {
      console.log(`❌ Route guard: No user found after ${attempts} attempts, redirecting to login`);
      return { name: 'login', query: { redirect: to.fullPath } };
    }
    
    // Check role-based authorization
    if (to.meta?.roles && user) {
      const userRoles = Array.isArray(user.role) ? user.role : [user.role];
      const requiredRoles = to.meta.roles;
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      console.log(`🔐 Route guard: User roles: ${userRoles}, Required: ${requiredRoles}, Has access: ${hasRequiredRole}`);
      
      if (!hasRequiredRole) {
        console.log(`❌ Route guard: Insufficient permissions, redirecting to home`);
        // Redirect to home with error message for unauthorized access
        return { name: 'home', query: { error: 'unauthorized' } };
      }
    }
    
    console.log(`✅ Route guard: Access granted to ${to.path}`);
    return true;
  } catch (error) {
    console.error('❌ Route guard error:', error);
    
    // If there's an error and the route requires auth, redirect to login
    if (to.meta?.requiresAuth) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }
    
    return true;
  }
});

export default router;
