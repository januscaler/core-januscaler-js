import { createWebHistory,createWebHashHistory, createRouter } from 'vue-router'

import HomeView from './pages/index.vue'
import VideoCall from './pages/videocall.vue'


const routes = [
  { path: '/', component: HomeView },
  { path: '/videocall', component: VideoCall }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})