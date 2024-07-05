import { createRouter, createWebHistory } from 'vue-router'
import ReferencesSection from '@/views/ReferencesSection.vue'
import PadawanView from '@/views/PadawanView.vue'
import HomeView from '@/views/HomeView.vue'
import RoleView from '@/views/RoleView.vue'
import LevelView from '@/views/LevelView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: HomeView
    },
    {
      path: '/role/:roleId',
      name: 'RoleView',
      component: RoleView
    },
    {
      path: '/level-view/:levelId?',
      name: 'LevelView',
      component: LevelView
    },
    {
      path: '/padawan',
      component: PadawanView,
      children: [
        {
          path: '',
          redirect: 'references'
        },
        {
          path: 'references',
          component: ReferencesSection
        },
        {
          path: 'demo',
          component: () => import('../views/DemoSection.vue')
        }
      ]
    }
  ]
})

export default router
