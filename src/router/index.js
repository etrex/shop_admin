import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue')
        }
      ]
    },
    {
      path: '/order',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'order-list',
          component: () => import('@/views/order/OrderListView.vue')
        },
        {
          path: 'create',
          name: 'order-create',
          component: () => import('@/views/order/OrderCreateView.vue')
        }
      ]
    },
    {
      path: '/inventory',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'inventory-list',
          component: () => import('@/views/inventory/InventoryListView.vue')
        },
        {
          path: 'movement',
          name: 'inventory-movement',
          component: () => import('@/views/inventory/InventoryMovementView.vue')
        }
      ]
    },
    {
      path: '/procurement',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'procurement-list',
          component: () => import('@/views/procurement/ProcurementListView.vue')
        },
        {
          path: 'create',
          name: 'procurement-create',
          component: () => import('@/views/procurement/ProcurementCreateView.vue')
        }
      ]
    }
  ]
})

export default router 