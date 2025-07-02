import { createRouter, createWebHistory } from 'vue-router'
import SearchPage from '../pages/SearchPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import SyncedPage from '../pages/SyncedPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/search'
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage
  },
  {
    path: '/synced',
    name: 'Synced',
    component: SyncedPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 