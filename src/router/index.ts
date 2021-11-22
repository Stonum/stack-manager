import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Main from '@/views/MainPage.vue';
import Settings from '@/views/SettingsPage.vue';
import NewProject from '@/views/NewProjectPage.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Главная',
    component: Main,
  },
  {
    path: '/new',
    name: 'Новый проект',
    component: NewProject,
  },
  {
    path: '/settings',
    name: 'Настройки',
    component: Settings,
  },
  {
    path: '/about',
    name: 'О программе',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
