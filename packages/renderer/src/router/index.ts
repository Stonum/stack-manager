import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Main from '@/views/main/index.vue';
import Settings from '@/views/settings/index.vue';
import Project from '@/views/project/index.vue';
import ChangeLog from '@/views/changelog/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Main,
  },
  {
    path: '/project/:projectid',
    component: Project,
    props: true,
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/changelog',
    component: ChangeLog,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
