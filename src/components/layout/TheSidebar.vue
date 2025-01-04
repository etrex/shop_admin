<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :router="true"
      :collapse="isCollapse"
    >
      <el-menu-item index="/">
        <el-icon><Monitor /></el-icon>
        <template #title>儀表板</template>
      </el-menu-item>
      
      <el-sub-menu index="/order">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>訂單管理</span>
        </template>
        <el-menu-item index="/order">訂單列表</el-menu-item>
        <el-menu-item index="/order/create">建立訂單</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="/inventory">
        <template #title>
          <el-icon><Box /></el-icon>
          <span>庫存管理</span>
        </template>
        <el-menu-item index="/inventory">庫存總覽</el-menu-item>
        <el-menu-item index="/inventory/movement">庫存異動</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="/procurement">
        <template #title>
          <el-icon><ShoppingCart /></el-icon>
          <span>採購管理</span>
        </template>
        <el-menu-item index="/procurement">採購單列表</el-menu-item>
        <el-menu-item index="/procurement/create">建立採購單</el-menu-item>
      </el-sub-menu>
    </el-menu>
    
    <!-- Task List -->
    <div class="task-list" v-if="!isCollapse">
      <div class="task-list-header">
        <h3>待辦事項</h3>
        <el-button type="primary" size="small" :icon="Plus" circle @click="createTask" />
      </div>
      
      <el-scrollbar height="300px">
        <el-checkbox-group v-model="checkedTasks">
          <div v-for="task in tasks" :key="task.id" class="task-item">
            <el-checkbox :label="task.id">{{ task.title }}</el-checkbox>
            <span class="task-date">{{ task.date }}</span>
          </div>
        </el-checkbox-group>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Monitor,
  Document,
  Box,
  ShoppingCart,
  Plus
} from '@element-plus/icons-vue'

const route = useRoute()
const isCollapse = ref(false)
const checkedTasks = ref([])

// Mock tasks data
const tasks = ref([
  { id: 1, title: '確認新訂單', date: '今天' },
  { id: 2, title: '處理退貨申請', date: '今天' },
  { id: 3, title: '庫存盤點', date: '明天' },
  { id: 4, title: '聯繫供應商', date: '明天' },
  { id: 5, title: '更新商品資訊', date: '後天' }
])

const activeMenu = computed(() => {
  return route.path
})

const createTask = () => {
  // TODO: Implement task creation
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  border-right: 1px solid $border-light;
  background-color: $background-white;
  display: flex;
  flex-direction: column;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}

.task-list {
  padding: 20px;
  border-top: 1px solid $border-light;
}

.task-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    margin: 0;
    color: $text-primary;
    font-size: 16px;
  }
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  
  .task-date {
    font-size: 12px;
    color: $text-secondary;
  }
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item.is-active) {
  background-color: mix($primary-color, $background-white, 10%);
}
</style> 