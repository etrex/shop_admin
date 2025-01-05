import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 角色定義
const roles = {
  admin: {
    label: '管理員',
    permissions: ['all'],
    defaultRoute: 'dashboard'
  },
  customer_service: {
    label: '客服人員',
    permissions: ['order_management', 'customer_service'],
    defaultRoute: 'order-list'
  },
  warehouse: {
    label: '倉庫人員',
    permissions: ['inventory_management', 'shipping'],
    defaultRoute: 'inventory-list'
  },
  procurement: {
    label: '採購人員',
    permissions: ['procurement_management', 'supplier_management'],
    defaultRoute: 'procurement-list'
  },
  customer: {
    label: '消費者',
    permissions: ['order_create', 'order_view'],
    defaultRoute: 'order-list'
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currentRole: 'customer',
    userInfo: {
      name: '訪客',
      avatar: '',
      // 消費者詳細資訊
      customerInfo: {
        name: '王小明',
        phone: '0912-345-678',
        address: '台北市信義區信義路五段7號'
      }
    },
    roles
  }),

  getters: {
    // 獲取當前角色資訊
    currentRoleInfo: (state) => roles[state.currentRole],
    
    // 檢查是否有特定權限
    hasPermission: (state) => (permission) => {
      const rolePermissions = roles[state.currentRole].permissions
      return rolePermissions.includes('all') || rolePermissions.includes(permission)
    }
  },

  actions: {
    // 設置角色
    async setRole(role) {
      if (!roles[role]) {
        ElMessage.error('無效的角色')
        return
      }

      this.currentRole = role
      
      // 更新用戶資訊
      if (role === 'customer') {
        this.userInfo = {
          name: '訪客',
          avatar: ''
        }
      } else {
        this.userInfo = {
          name: roles[role].label,
          avatar: ''
        }
      }

      // 導航到角色對應的預設頁面
      const defaultRoute = roles[role].defaultRoute
      const currentRoute = router.currentRoute.value.name
      
      // 只有當前路由不是預設路由時才進行導航
      if (currentRoute !== defaultRoute) {
        await router.push({ name: defaultRoute })
      }

      ElMessage.success(`已切換至${roles[role].label}角色`)
    },

    // 登出
    async logout() {
      await this.setRole('customer')
    }
  }
})