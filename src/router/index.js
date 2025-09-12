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
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to) => {
  if (to.meta?.requiresAuth) {
    const user = getCurrentUser();
    if (!user) return { name: 'login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
