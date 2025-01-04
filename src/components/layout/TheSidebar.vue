<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="isCollapse"
      @select="handleSelect"
    >
      <!-- 消費者選單 -->
      <template v-if="isCustomer">
        <el-menu-item index="order-list">
          <el-icon><document /></el-icon>
          <template #title>我的訂單</template>
        </el-menu-item>

        <el-menu-item index="product-list">
          <el-icon><goods /></el-icon>
          <template #title>商品列表</template>
        </el-menu-item>
        
        <el-menu-item index="order-create">
          <el-icon><plus /></el-icon>
          <template #title>建立訂單</template>
        </el-menu-item>
      </template>

      <!-- 管理員選單 -->
      <template v-else>
        <!-- Task List Section -->
        <el-sub-menu index="tasks">
          <template #title>
            <el-icon><list /></el-icon>
            <span>任務列表</span>
            <el-badge :value="pendingTasksCount" class="task-badge" />
          </template>
          
          <el-menu-item-group title="今日任務">
            <el-menu-item v-for="task in todayTasks" :key="task.id" :index="`task-${task.id}`">
              <el-icon>
                <component :is="icons[task.icon]" />
              </el-icon>
              <template #title>
                <div class="task-item">
                  <span>{{ task.title }}</span>
                  <el-tag size="small" :type="task.priority">{{ task.priority }}</el-tag>
                </div>
              </template>
            </el-menu-item>
          </el-menu-item-group>
          
          <el-menu-item-group title="待處理任務">
            <el-menu-item v-for="task in pendingTasks" :key="task.id" :index="`task-${task.id}`">
              <el-icon>
                <component :is="icons[task.icon]" />
              </el-icon>
              <template #title>
                <div class="task-item">
                  <span>{{ task.title }}</span>
                  <el-tag size="small" :type="task.priority">{{ task.priority }}</el-tag>
                </div>
              </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- Quick Links Section -->
        <el-sub-menu index="quick-links">
          <template #title>
            <el-icon><link /></el-icon>
            <span>快速連結</span>
          </template>
          
          <el-menu-item index="new-order">
            <el-icon><plus /></el-icon>
            <template #title>新增訂單</template>
          </el-menu-item>
          
          <el-menu-item index="stock-check">
            <el-icon><box /></el-icon>
            <template #title>庫存查詢</template>
          </el-menu-item>
          
          <el-menu-item index="procurement">
            <el-icon><shopping-cart /></el-icon>
            <template #title>採購作業</template>
          </el-menu-item>
        </el-sub-menu>

        <!-- Main Navigation -->
        <el-menu-item index="dashboard">
          <el-icon><odometer /></el-icon>
          <template #title>儀表板</template>
        </el-menu-item>
        
        <el-sub-menu index="order">
          <template #title>
            <el-icon><document /></el-icon>
            <span>訂單管理</span>
          </template>
          <el-menu-item index="order-list">訂單列表</el-menu-item>
          <el-menu-item index="order-create">建立訂單</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="inventory">
          <template #title>
            <el-icon><box /></el-icon>
            <span>庫存管理</span>
          </template>
          <el-menu-item index="inventory-list">庫存列表</el-menu-item>
          <el-menu-item index="inventory-movement">庫存異動</el-menu-item>
          <el-menu-item index="inventory-transfer">庫存調撥</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="procurement">
          <template #title>
            <el-icon><shopping-cart /></el-icon>
            <span>採購管理</span>
          </template>
          <el-menu-item index="procurement-create">建立採購單</el-menu-item>
          <el-menu-item index="procurement-list">採購單列表</el-menu-item>
          <el-menu-item index="supplier">供應商管理</el-menu-item>
        </el-sub-menu>
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
import {
  List,
  Link,
  Plus,
  Box,
  ShoppingCart,
  Odometer,
  Document,
  Expand,
  Fold,
  Warning,
  Goods
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)

// 判斷是否為消費者
const isCustomer = computed(() => userStore.currentRole === 'customer')

const activeMenu = computed(() => {
  // 如果是消費者且在首頁，預設選中「我的訂單」
  if (isCustomer.value && route.path === '/') {
    return 'order-list'
  }
  // 從路由路徑獲取當前選中項
  const path = route.path.split('/')
  return path[1] || (isCustomer.value ? 'order-list' : 'dashboard')
})

// Mock tasks data
const todayTasks = ref([
  {
    id: 1,
    title: '確認新訂單',
    priority: 'warning',
    icon: 'document'
  },
  {
    id: 2,
    title: '處理退貨申請',
    priority: 'danger',
    icon: 'warning'
  }
])

const pendingTasks = ref([
  {
    id: 3,
    title: '庫存盤點',
    priority: 'info',
    icon: 'box'
  },
  {
    id: 4,
    title: '供應商評估',
    priority: 'success',
    icon: 'shopping-cart'
  }
])

const pendingTasksCount = computed(() => {
  return todayTasks.value.length + pendingTasks.value.length
})

const handleSelect = (index) => {
  if (index.startsWith('task-')) {
    // Handle task selection
    const taskId = index.split('-')[1]
    console.log('Selected task:', taskId)
  } else {
    // Handle navigation
    router.push({ name: index })
  }
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const icons = {
  document: Document,
  warning: Warning,
  box: Box,
  'shopping-cart': ShoppingCart
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-light);
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.task-badge {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.sidebar-footer {
  padding: 12px;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--border-light);
}

/* Override element-plus styles */
.el-menu {
  --el-menu-hover-bg-color: var(--background-base);
}

.el-menu-item-group__title {
  padding: 8px 20px;
  font-size: 12px;
  color: var(--text-secondary);
}
</style> 