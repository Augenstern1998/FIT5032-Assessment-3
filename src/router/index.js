import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Resources from '../pages/Resources.vue';
import JoinCommunity from '../pages/JoinCommunity.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import { getCurrentUser } from '../utils/auth.js';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/resources', name: 'resources', component: Resources },
  { path: '/join', name: 'join', component: JoinCommunity, meta: { requiresAuth: true } },
<<<<<<< HEAD
  { path: '/admin', name: 'admin', component: () => import('../pages/AdminDashboard.vue'), meta: { requiresAuth: true, roles: ['admin'] } },
=======
>>>>>>> 971db2f520855767059a6f2b614d884da8de2979
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to) => {
<<<<<<< HEAD
  const user = getCurrentUser();
  
  // Check authentication
  if (to.meta?.requiresAuth && !user) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  
  // Check role-based authorization
  if (to.meta?.roles && user) {
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const requiredRoles = to.meta.roles;
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      // Redirect to home with error message for unauthorized access
      return { name: 'home', query: { error: 'unauthorized' } };
    }
  }
  
=======
  if (to.meta?.requiresAuth) {
    const user = getCurrentUser();
    if (!user) return { name: 'login', query: { redirect: to.fullPath } };
  }
>>>>>>> 971db2f520855767059a6f2b614d884da8de2979
  return true;
});

export default router;
