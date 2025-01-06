<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="isCollapse"
      @select="handleSelect"
    >
      <!-- 管理員選單 -->
      <template v-if="!isCustomer">
        <!-- 今日任務 -->
        <div class="menu-header">
          <h3>今日任務</h3>
        </div>

        <!-- 客服任務 -->
        <template v-if="isCustomerService">
          <el-menu-item index="confirm-new-order">
            <el-icon><Document /></el-icon>
            <template #title>
              <div class="task-item">
                <span>確認新訂單</span>
                <el-badge
                  v-if="pendingOrdersCount > 0"
                  :value="pendingOrdersCount"
                  class="order-badge"
                  type="warning"
                />
              </div>
            </template>
          </el-menu-item>

          <el-menu-item index="return-request">
            <el-icon><RefreshRight /></el-icon>
            <template #title>
              <span>處理退貨申請</span>
            </template>
          </el-menu-item>
        </template>

        <!-- 採購任務 -->
        <template v-if="isProcurement">
          <el-menu-item index="daily-procurement">
            <el-icon><ShoppingCart /></el-icon>
            <template #title>
              <div class="task-item">
                <span>日採購作業</span>
                <el-badge
                  v-if="pendingProcurementCount > 0"
                  :value="pendingProcurementCount"
                  class="order-badge"
                  type="warning"
                />
              </div>
            </template>
          </el-menu-item>

          <el-menu-item index="purchase-orders">
            <el-icon><Document /></el-icon>
            <template #title>進貨單列表</template>
          </el-menu-item>
        </template>

        <!-- 倉庫人員任務 -->
        <template v-if="isWarehouse">
          <el-menu-item index="warehouse-in">
            <el-icon><TopRight /></el-icon>
            <template #title>
              <div class="task-item">
                <span>入倉作業</span>
                <el-badge
                  v-if="pendingWarehouseInCount > 0"
                  :value="pendingWarehouseInCount"
                  class="order-badge"
                  type="warning"
                />
              </div>
            </template>
          </el-menu-item>

          <el-menu-item index="warehouse-out">
            <el-icon><BottomLeft /></el-icon>
            <template #title>
              <div class="task-item">
                <span>出倉作業</span>
                <el-badge
                  v-if="pendingWarehouseOutCount > 0"
                  :value="pendingWarehouseOutCount"
                  class="order-badge"
                  type="warning"
                />
              </div>
            </template>
          </el-menu-item>

          <el-menu-item index="warehouse-record">
            <el-icon><List /></el-icon>
            <template #title>倉庫紀錄</template>
          </el-menu-item>
        </template>

        <div class="menu-header">
          <h3>待處理任務</h3>
        </div>

        <!-- 採購人員功能 -->
        <template v-if="isProcurement">
          <el-menu-item index="supplier-management">
            <el-icon><Connection /></el-icon>
            <template #title>供應商管理</template>
          </el-menu-item>

          <el-menu-item index="procurement-analysis">
            <el-icon><DataLine /></el-icon>
            <template #title>採購分析</template>
          </el-menu-item>
        </template>

        <!-- 客服人員功能 -->
        <template v-if="isCustomerService">
          <el-menu-item index="stock-check">
            <el-icon><Box /></el-icon>
            <template #title>庫存盤點</template>
          </el-menu-item>

          <el-menu-item index="supplier-evaluation">
            <el-icon><ShoppingCart /></el-icon>
            <template #title>供應商評估</template>
          </el-menu-item>
        </template>
      </template>

      <!-- 消費者選單 -->
      <template v-else>
        <el-menu-item index="order-list">
          <el-icon><Document /></el-icon>
          <template #title>我的訂單</template>
        </el-menu-item>

        <el-menu-item index="product-list">
          <el-icon><Goods /></el-icon>
          <template #title>商品列表</template>
        </el-menu-item>
        
        <el-menu-item index="order-create">
          <el-icon><Plus /></el-icon>
          <template #title>建立訂單</template>
        </el-menu-item>
      </template>
    </el-menu>

    <!-- Collapse Toggle -->
    <div class="sidebar-footer">
      <el-button
        :icon="isCollapse ? Expand : Fold"
        circle
        @click="toggleCollapse"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { useOrderStore } from '@/stores/modules/order'
import {
  Document,
  RefreshRight,
  Box,
  ShoppingCart,
  Goods,
  Plus,
  Expand,
  Fold,
  Monitor,
  Connection,
  DataLine,
  TopRight,
  BottomLeft,
  List
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const orderStore = useOrderStore()
const isCollapse = ref(false)

// 判斷是否為消費者
const isCustomer = computed(() => userStore.currentRole === 'customer')
const isCustomerService = computed(() => userStore.currentRole === 'customer_service')
const isProcurement = computed(() => userStore.currentRole === 'procurement')
const isWarehouse = computed(() => userStore.currentRole === 'warehouse')

// 計算待處理訂單數量
const pendingOrdersCount = computed(() => {
  return orderStore.getPendingOrders.length
})

// 計算待處理採購訂單數量
const pendingProcurementCount = computed(() => {
  return orderStore.getPendingOrders.filter(order => order.status === '已確認').length
})

// 計算待處理入倉數量
const pendingWarehouseInCount = computed(() => {
  // TODO: 從 store 獲取待處理入倉數量
  return 0
})

// 計算待處理出倉數量
const pendingWarehouseOutCount = computed(() => {
  // TODO: 從 store 獲取待處理出倉數量
  return 0
})

const activeMenu = computed(() => {
  const path = route.path.split('/')
  return path[path.length - 1] || 'dashboard'
})

const handleSelect = (index) => {
  switch (index) {
    case 'confirm-new-order':
      router.push('/task/confirm-new-order')
      break
    case 'return-request':
      router.push('/task/return-request')
      break
    case 'daily-procurement':
      router.push('/task/daily-procurement')
      break
    case 'box-completion':
      router.push('/task/box-completion')
      break
    case 'stock-monitor':
      router.push('/task/stock-monitor')
      break
    case 'supplier-management':
      router.push('/task/supplier-management')
      break
    case 'procurement-analysis':
      router.push('/task/procurement-analysis')
      break
    case 'stock-check':
      router.push('/task/stock-check')
      break
    case 'supplier-evaluation':
      router.push('/task/supplier-evaluation')
      break
    case 'purchase-orders':
      router.push('/task/purchase-orders')
      break
    case 'warehouse-in':
      router.push('/warehouse/in')
      break
    case 'warehouse-out':
      router.push('/warehouse/out')
      break
    case 'warehouse-record':
      router.push('/warehouse/record')
      break
    case 'order-list':
      router.push('/order')
      break
    case 'product-list':
      router.push('/product')
      break
    case 'order-create':
      router.push('/order/create')
      break
    default:
      router.push(`/${index}`)
  }
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color-light);
}

.sidebar-menu {
  flex: 1;
  border-right: none;

  :deep(.el-menu-item) {
    * {
      vertical-align: middle;
    }
  }
}

.menu-header {
  padding: 16px;
  h3 {
    margin: 0;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.task-item {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.order-badge {
  :deep(.el-badge__content) {
    height: 16px !important;
    line-height: 16px !important;
    padding: 0 4px !important;
    border: none !important;
    right: -24px !important;
  }
}

.sidebar-footer {
  padding: 12px;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--el-border-color-light);
}

:deep(.el-badge__content) {
  z-index: 1;
}
</style> 