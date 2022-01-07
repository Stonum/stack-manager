import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Main from '@/views/MainPage.vue';
import Settings from '@/views/SettingsPage.vue';
import NewProject from '@/views/NewProjectPage.vue';
import Project from '@/views/ProjectPage.vue';

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
