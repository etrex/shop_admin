import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    loading: false
  }),

  getters: {
    // 獲取所有訂單
    getAllOrders: (state) => state.orders,
    
    // 根據 ID 獲取訂單
    getOrderById: (state) => (id) => {
      return state.orders.find(order => order.id === id)
    }
  },

  actions: {
    // 建立訂單
    createOrder(orderData) {
      // 生成訂單 ID (格式: ORDyyyyMMddxxx)
      const now = new Date()
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const orderId = `ORD${dateStr}${randomNum}`

      const newOrder = {
        id: orderId,
        created_at: now.toISOString(),
        status: 'pending',
        ...orderData
      }

      this.orders.unshift(newOrder)
      ElMessage.success('訂單建立成功')
      return orderId
    },

    // 更新訂單狀態
    updateOrderStatus(orderId, status) {
      const order = this.getOrderById(orderId)
      if (order) {
        order.status = status
        ElMessage.success('訂單狀態更新成功')
      }
    },

    // 更新訂單資料
    updateOrder(orderId, orderData) {
      const index = this.orders.findIndex(order => order.id === orderId)
      if (index !== -1) {
        this.orders[index] = {
          ...this.orders[index],
          ...orderData
        }
        ElMessage.success('訂單更新成功')
      }
    }
  }
}) 