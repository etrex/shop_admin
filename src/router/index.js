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
        },
        {
          path: 'confirm-new-order',
          name: 'confirm-new-order',
          component: () => import('@/views/task/ConfirmNewOrderView.vue')
        },
        {
          path: 'return-request',
          name: 'return-request',
          component: () => import('@/views/task/ReturnRequestView.vue')
        },
        {
          path: 'stock-check',
          name: 'stock-check',
          component: () => import('@/views/task/StockCheckView.vue')
        },
        {
          path: 'supplier-evaluation',
          name: 'supplier-evaluation',
          component: () => import('@/views/task/SupplierEvaluationView.vue')
        },
        {
          path: 'daily-procurement',
          name: 'daily-procurement',
          component: () => import('@/views/task/DailyProcurementView.vue')
        },
        {
          path: 'box-completion',
          name: 'box-completion',
          component: () => import('@/views/task/BoxCompletionView.vue')
        },
        {
          path: 'stock-monitor',
          name: 'stock-monitor',
          component: () => import('@/views/task/StockMonitorView.vue')
        },
        {
          path: 'supplier-management',
          name: 'supplier-management',
          component: () => import('@/views/task/SupplierManagementView.vue')
        },
        {
          path: 'procurement-analysis',
          name: 'procurement-analysis',
          component: () => import('@/views/task/ProcurementAnalysisView.vue')
        },
        {
          path: 'purchase-orders',
          name: 'purchase-orders',
          component: () => import('@/views/task/PurchaseOrderListView.vue')
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
    },
    {
      path: '/warehouse',
      component: DefaultLayout,
      children: [
        {
          path: 'in',
          name: 'warehouse-in',
          component: () => import('@/views/warehouse/WarehouseInView.vue')
        },
        {
          path: 'out',
          name: 'warehouse-out',
          component: () => import('@/views/warehouse/WarehouseOutView.vue')
        },
        {
          path: 'record',
          name: 'warehouse-record',
          component: () => import('@/views/warehouse/WarehouseRecordView.vue')
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