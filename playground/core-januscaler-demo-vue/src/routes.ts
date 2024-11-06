import { createWebHistory,createWebHashHistory, createRouter } from 'vue-router'

import HomeView from './pages/index.vue'
import VideoCall from './pages/videocall.vue'
import Glass from './pages/glass.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/videocall', component: VideoCall },
  { path: '/glass', component: Glass },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})