import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const usePurchaseOrderStore = defineStore('purchaseOrder', {
  state: () => ({
    purchaseOrders: []
  }),

  getters: {
    // 獲取所有進貨單
    getAllPurchaseOrders: (state) => state.purchaseOrders,

    // 獲取待入倉進貨單
    getPendingWarehouseInOrders: (state) => {
      return state.purchaseOrders.filter(order => order.status === 'pending_in')
    },

    // 獲取已入倉進貨單
    getCompletedWarehouseInOrders: (state) => {
      return state.purchaseOrders.filter(order => order.status === 'completed')
    }
  },

  actions: {
    // 創建進貨單
    createPurchaseOrder(orderData) {
      const orderId = 'PO-' + String(this.purchaseOrders.length + 1).padStart(3, '0')
      
      const newOrder = {
        id: orderId,
        createdAt: new Date().toISOString(),
        status: 'pending_in', // 初始狀態為待入倉
        ...orderData
      }
      
      this.purchaseOrders.push(newOrder)
      ElMessage.success('進貨單建立成功')
      
      return orderId
    },

    // 更新進貨單狀態
    updatePurchaseOrderStatus(orderId, status) {
      const order = this.purchaseOrders.find(o => o.id === orderId)
      if (order) {
        order.status = status
        return true
      }
      return false
    },

    // 確認入倉
    confirmWarehouseIn(orderId, receivingData) {
      const order = this.purchaseOrders.find(o => o.id === orderId)
      if (!order) return false

      // 更新進貨單狀態和實收數據
      order.status = 'completed'
      order.receivedAt = new Date().toISOString()
      order.receivingData = receivingData
      
      // 更新相關訂單的品項狀態
      if (order.relatedOrders) {
        order.relatedOrders.forEach(relatedOrder => {
          relatedOrder.products.forEach(product => {
            const receivedItem = receivingData.find(item => item.id === product.id)
            if (receivedItem && receivedItem.receivedQty > 0) {
              product.stockStatus = 'stocked'
            }
          })
        })
      }

      return true
    },

    // 初始化 mock 數據
    initializeMockPurchaseOrders() {
      this.purchaseOrders = [
        {
          id: 'PO-001',
          createdAt: '2024-01-20T10:00:00',
          status: 'pending_in',
          supplier: {
            id: 'S001',
            name: '法國酒商'
          },
          expectedDeliveryDate: '2024-01-22T10:00:00',
          totalAmount: 25800,
          items: [
            {
              id: 'P001',
              name: '法國波爾多紅酒 2018',
              purchaseQty: 10,
              price: 2580
            }
          ]
        },
        {
          id: 'PO-002',
          createdAt: '2024-01-20T11:00:00',
          status: 'pending_in',
          supplier: {
            id: 'S002',
            name: '義大利酒商'
          },
          expectedDeliveryDate: '2024-01-22T14:00:00',
          totalAmount: 50400,
          items: [
            {
              id: 'P002',
              name: '意大利白葡萄酒 2021',
              purchaseQty: 30,
              price: 1680
            }
          ]
        }
      ]
    }
  }
}) 