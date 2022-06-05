import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/map',
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/map/Index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
