import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Main from '@/views/main/index.vue';
import Settings from '@/views/settings/index.vue';
import Project from '@/views/project/index.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Главная',
    component: Main,
  },
  {
    path: '/project/:projectid',
    name: 'Редактирвоание проекта',
    component: Project,
    props: true,
  },
  {
    path: '/settings',
    name: 'Настройки',
    component: Settings,
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
