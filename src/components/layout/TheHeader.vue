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
        />
      </el-select>
      
      <!-- Notifications -->
      <el-badge :value="notificationCount" class="mr-4">
        <el-button :icon="Bell" circle @click="showNotifications" />
      </el-badge>
      
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
            <el-dropdown-item command="profile">個人資料</el-dropdown-item>
            <el-dropdown-item command="settings">設定</el-dropdown-item>
            <el-dropdown-item divided command="logout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Bell, ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const currentRole = ref(userStore.currentRole)
const notificationCount = ref(5)

const roles = [
  { label: '管理員', value: 'admin' },
  { label: '客服人員', value: 'customer_service' },
  { label: '倉庫人員', value: 'warehouse' },
  { label: '採購人員', value: 'procurement' }
]

const userInfo = ref({
  name: 'Admin',
  avatar: ''
})

const handleRoleChange = (role) => {
  userStore.setRole(role)
}

const showNotifications = () => {
  // TODO: Show notifications panel
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
      // TODO: Handle logout
      break
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  background-color: $background-white;
  border-bottom: 1px solid $border-light;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: $primary-color;

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
  width: 120px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  
  span {
    color: $text-regular;
  }
}
</style>