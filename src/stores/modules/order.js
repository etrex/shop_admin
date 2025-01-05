import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    loading: false
  }),

  getters: {
    getAllOrders: (state) => state.orders,
    
    getOrderById: (state) => (orderId) => {
      return state.orders.find(order => order.id === orderId)
    }
  },

  actions: {
    createOrder(orderData) {
      // 生成訂單 ID
      const orderId = 'ORD-' + String(this.orders.length + 1).padStart(3, '0')
      
      // 創建新訂單
      const newOrder = {
        id: orderId,
        createdAt: new Date().toISOString(),
        status: 'pending',
        ...orderData
      }
      
      // 添加到訂單列表
      this.orders.push(newOrder)
      
      // 顯示成功消息
      ElMessage.success('訂單建立成功')
      
      return orderId
    },

    updateOrderStatus(orderId, status) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
        return true
      }
      return false
    },

    updateOrder(orderId, orderData) {
      const index = this.orders.findIndex(o => o.id === orderId)
      if (index !== -1) {
        this.orders[index] = { ...this.orders[index], ...orderData }
        return true
      }
      return false
    }
  }
}) 