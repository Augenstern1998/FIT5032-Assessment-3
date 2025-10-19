import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Resources from '../pages/Resources.vue';
import HealthServices from '../pages/HealthServices.vue';
import JoinCommunity from '../pages/JoinCommunity.vue';
import Contact from '../pages/Contact.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import AuthTest from '../pages/AuthTest.vue';
import { getCurrentUser } from '../utils/auth.js';
import { auth } from '../config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { isSessionValid } from '../utils/session.js';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/resources', name: 'resources', component: Resources },
  { path: '/health-services', name: 'health-services', component: HealthServices },
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

// ✅ 等待 Firebase 初始化完成
let authReady = null;
function waitAuthReady() {
  if (!authReady) {
    authReady = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        unsubscribe();
        resolve();
      });
    });
  }
  return authReady;
}

router.beforeEach(async (to) => {
  console.log('Route guard: Navigating to', to.path);
  
  // ✅ 如果不需要认证，直接放行
  if (!to.meta?.requiresAuth) {
    console.log('Route guard: No auth required, access granted');
    return true;
  }
  
  try {
    // ✅ 等待 Firebase 完成初始化
    await waitAuthReady();
    console.log('Route guard: Firebase auth ready');
    
    const user = await getCurrentUser();
    console.log('Route guard: Current user', user ? 'authenticated' : 'not authenticated');
    
    // ✅ 检查 Firebase 用户和本地会话
    if (!user) {
      console.log('Route guard: No Firebase user, redirecting to login');
      return { name: 'login', query: { redirect: to.fullPath } };
    }
    
    // ✅ 检查本地会话有效性
    const sessionValid = isSessionValid();
    console.log('Route guard: Session valid', sessionValid);
    
    if (!sessionValid) {
      console.log('Route guard: Session invalid, redirecting to login');
      return { name: 'login', query: { redirect: to.fullPath } };
    }
    
    // Check role-based authorization
    if (to.meta?.roles) {
      const userRoles = Array.isArray(user.role) ? user.role : [user.role];
      const requiredRoles = to.meta.roles;
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        console.log('Route guard: Redirecting to home (insufficient role)');
        return { name: 'home', query: { error: 'unauthorized' } };
      }
    }
    
    console.log('Route guard: Access granted');
    return true;
  } catch (error) {
    console.error('Route guard error:', error);
    console.log('Route guard: Redirecting to login (error occurred)');
    return { name: 'login', query: { redirect: to.fullPath } };
  }
});

export default router;
