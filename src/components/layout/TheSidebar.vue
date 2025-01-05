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

          <el-menu-item index="box-completion">
            <el-icon><Box /></el-icon>
            <template #title>
              <div class="task-item">
                <span>湊箱建議</span>
                <el-badge
                  v-if="boxCompletionCount > 0"
                  :value="boxCompletionCount"
                  class="order-badge"
                  type="success"
                />
              </div>
            </template>
          </el-menu-item>

          <el-menu-item index="purchase-orders">
            <el-icon><Document /></el-icon>
            <template #title>進貨單列表</template>
          </el-menu-item>
        </template>

        <div class="menu-header">
          <h3>待處理任務</h3>
        </div>

        <!-- 採購人員功能 -->
        <template v-if="isProcurement">
          <el-menu-item index="stock-monitor">
            <el-icon><Monitor /></el-icon>
            <template #title>庫存監控</template>
          </el-menu-item>

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
  DataLine
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const orderStore = useOrderStore()
const isCollapse = ref(false)

// 判斷是否為消費者
const isCustomer = computed(() => userStore.currentRole === 'customer')
const isCustomerService = computed(() => userStore.currentRole === 'customer-service')
const isProcurement = computed(() => userStore.currentRole === 'procurement')

// 計算待處理訂單數量
const pendingOrdersCount = computed(() => {
  return orderStore.getPendingOrders.length
})

// Mock 數據：待處理採購數量
const pendingProcurementCount = computed(() => 2)

// Mock 數據：湊箱建議數量
const boxCompletionCount = computed(() => 3)

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