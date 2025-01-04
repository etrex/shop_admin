<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/vue.svg" alt="Logo" class="logo-image">
      <span class="logo-text">Shop Admin</span>
    </div>
    
    <div class="header-right">
      <!-- Role Switcher -->
      <el-select
        v-model="currentRole"
        class="role-select mr-4"
        placeholder="選擇角色"
        @change="handleRoleChange"
      >
        <el-option
          v-for="role in roles"
          :key="role.value"
          :label="role.label"
          :value="role.value"
        >
          <span>{{ role.label }}</span>
          <el-tag size="small" class="ml-2">
            {{ role.permissions.length }} 權限
          </el-tag>
        </el-option>
      </el-select>
      
      <!-- Notifications -->
      <el-popover
        placement="bottom-end"
        :width="300"
        trigger="click"
      >
        <template #reference>
          <div class="notification-trigger mr-4">
            <el-badge :value="notificationCount" :max="99">
              <el-button :icon="Bell" circle />
            </el-badge>
          </div>
        </template>
        
        <div class="notifications-panel">
          <div class="notifications-header">
            <span>通知</span>
            <el-button link type="primary" @click="markAllRead">全部標為已讀</el-button>
          </div>
          <el-scrollbar max-height="300px">
            <div v-for="notification in notifications" :key="notification.id" class="notification-item">
              <el-icon><component :is="notification.icon" /></el-icon>
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-time">{{ notification.time }}</div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-popover>
      
      <!-- User Dropdown -->
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="user-info">
          <el-avatar :size="32" :src="userInfo.avatar">
            {{ userInfo.name.charAt(0) }}
          </el-avatar>
          <span class="ml-2">{{ userInfo.name }}</span>
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><user /></el-icon>
              <span>個人資料</span>
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><setting /></el-icon>
              <span>設定</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><switch-button /></el-icon>
              <span>登出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Bell, ArrowDown, User, Setting, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'
import { colors, textColors, borderColors, backgroundColors } from '@/assets/styles/variables'

const userStore = useUserStore()
const currentRole = ref(userStore.currentRole)
const notificationCount = ref(5)

const roles = [
  { 
    label: '管理員', 
    value: 'admin',
    permissions: ['all']
  },
  { 
    label: '客服人員', 
    value: 'customer_service',
    permissions: ['order_management', 'customer_service']
  },
  { 
    label: '倉庫人員', 
    value: 'warehouse',
    permissions: ['inventory_management', 'shipping']
  },
  { 
    label: '採購人員', 
    value: 'procurement',
    permissions: ['procurement_management', 'supplier_management']
  }
]

const notifications = ref([
  {
    id: 1,
    title: '新訂單待處理',
    time: '10 分鐘前',
    icon: 'document'
  },
  {
    id: 2,
    title: '庫存警告',
    time: '30 分鐘前',
    icon: 'warning'
  }
])

const userInfo = ref({
  name: 'Admin',
  avatar: ''
})

const handleRoleChange = (role) => {
  userStore.setRole(role)
}

const markAllRead = () => {
  notificationCount.value = 0
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      // TODO: Navigate to profile page
      break
    case 'settings':
      // TODO: Navigate to settings page
      break
    case 'logout':
      userStore.logout()
      break
  }
}
</script>

<style>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  background-color: var(--background-white);
  border-bottom: 1px solid var(--border-light);
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: var(--primary-color);

  .logo-image {
    height: 32px;
    margin-right: 8px;
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.role-select {
  width: 140px;
}

.notifications-panel {
  .notifications-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border-light);
  }
  
  .notification-item {
    display: flex;
    align-items: flex-start;
    padding: 12px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: var(--background-base);
    }
    
    .el-icon {
      margin-right: 12px;
      margin-top: 2px;
    }
    
    .notification-content {
      flex: 1;
      
      .notification-title {
        font-size: 14px;
        margin-bottom: 4px;
      }
      
      .notification-time {
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
  }
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  
  span {
    color: var(--text-regular);
  }
}

.el-dropdown-menu {
  .el-dropdown-item {
    display: flex;
    align-items: center;
    
    .el-icon {
      margin-right: 8px;
    }
  }
}
</style>