import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useUserStore } from '@/stores/modules/user'

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
        },
        {
          path: ':id',
          name: 'order-detail',
          component: () => import('@/views/order/OrderDetailView.vue')
        }
      ]
    },
    {
      path: '/task',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'task-list',
          component: () => import('@/views/task/TaskListView.vue')
        }
      ]
    },
    {
      path: '/product',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'product-list',
          component: () => import('@/views/product/ProductListView.vue')
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
        },
        {
          path: 'transfer',
          name: 'inventory-transfer',
          component: () => import('@/views/inventory/InventoryTransferView.vue')
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
        },
        {
          path: 'supplier',
          name: 'supplier',
          component: () => import('@/views/procurement/SupplierView.vue')
        }
      ]
    }
  ]
})

// 導航守衛
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 如果是消費者且訪問首頁，重定向到訂單列表
  if (to.path === '/' && userStore.currentRole === 'customer') {
    next({ name: 'order-list' })
  } else {
    next()
  }
})

export default router 