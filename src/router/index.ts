import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import HomeView from '@/views/home-view/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/new',
    name: 'NewGame',
    component: () => import('@/views/new-game/NewGame.vue'),
  },
  {
    path: '/turn',
    name: 'CurrentTurn',
    component: () => import('@/views/turn/TurnView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
