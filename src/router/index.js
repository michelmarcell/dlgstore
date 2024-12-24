/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory('#'),
  routes: [
    {
    path: '/home',
    name:'home',
    component: () => import('../components/Home.vue')
    }
  ]
})


export default router
