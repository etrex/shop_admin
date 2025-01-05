import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    loading: false,
    // 溝通紀錄映射表，key 為訂單 ID
    communications: {}
  }),

  getters: {
    getAllOrders: (state) => state.orders,
    
    getOrderById: (state) => (orderId) => {
      return state.orders.find(order => order.id === orderId)
    },

    // 獲取訂單的溝通紀錄
    getCommunications: (state) => (orderId) => {
      return state.communications[orderId] || []
    },

    // 獲取待處理的訂單
    getPendingOrders: (state) => {
      return state.orders.filter(order => order.status === 'pending')
    }
  },

  actions: {
    // 添加溝通紀錄
    addCommunication(orderId, content, type = 'note') {
      if (!this.communications[orderId]) {
        this.communications[orderId] = []
      }

      const communication = {
        id: Date.now(),
        type,
        content,
        createdAt: new Date().toISOString(),
        createdBy: 'staff' // 之後可以從 user store 獲取
      }

      this.communications[orderId].unshift(communication)
      return communication
    },

    // 更新訂單商品
    updateOrderProducts(orderId, products) {
      const order = this.orders.find(o => o.id === orderId)
      if (!order) return false

      // 計算新的總金額
      const total = products.reduce((sum, product) => {
        return sum + (product.price * product.quantity)
      }, 0)

      // 更新訂單
      order.products = products
      order.total = total

      // 添加修改記錄
      this.addCommunication(
        orderId,
        '訂單商品已更新',
        'system'
      )

      return true
    },

    // 確認訂單
    confirmOrder(orderId, note) {
      const order = this.orders.find(o => o.id === orderId)
      if (!order) return false

      order.status = 'confirmed'
      
      // 添加確認記錄
      this.addCommunication(
        orderId,
        note || '訂單已確認',
        'system'
      )

      ElMessage.success('訂單已確認')
      return true
    },

    // 拒絕訂單
    rejectOrder(orderId, reason) {
      const order = this.orders.find(o => o.id === orderId)
      if (!order) return false

      order.status = 'cancelled'
      
      // 添加拒絕記錄
      this.addCommunication(
        orderId,
        '訂單已拒絕，原因：' + reason,
        'system'
      )

      ElMessage.success('訂單已拒絕')
      return true
    },

    initializeMockOrders() {
      const mockOrders = [
        {
          id: 'ORD-001',
          createdAt: '2024-01-20T10:30:00',
          customer: {
            name: '王小明',
            phone: '0912-345-678',
            address: '台北市信義區信義路五段100號'
          },
          products: [
            {
              id: 1,
              name: '法國波爾多紅酒 2018',
              price: 2580,
              quantity: 2,
              subtotal: 5160,
              preorder: true
            }
          ],
          payment: {
            method: 'online'
          },
          status: 'pending',
          total: 5160,
          note: '請在下午時段配送'
        },
        {
          id: 'ORD-007',
          createdAt: '2024-01-20T11:30:00',
          customer: {
            name: '張美玲',
            phone: '0923-456-789',
            address: '台北市大安區復興南路二段50號'
          },
          products: [
            {
              id: 5,
              name: '意大利白葡萄酒 2021',
              price: 1680,
              quantity: 3,
              subtotal: 5040,
              preorder: true
            }
          ],
          payment: {
            method: 'online'
          },
          status: 'pending',
          total: 5040,
          note: '需要禮盒包裝'
        },
        {
          id: 'ORD-008',
          createdAt: '2024-01-20T12:15:00',
          customer: {
            name: '李大維',
            phone: '0934-567-890',
            address: '台北市中山區林森北路100號'
          },
          products: [
            {
              id: 7,
              name: '獺祭 純米大吟釀 45',
              price: 1580,
              quantity: 2,
              subtotal: 3160,
              preorder: false
            },
            {
              id: 8,
              name: '久保田 千寿',
              price: 1280,
              quantity: 1,
              subtotal: 1280,
              preorder: true
            }
          ],
          payment: {
            method: 'cod'
          },
          status: 'pending',
          total: 4440,
          note: ''
        },
        {
          id: 'ORD-002',
          createdAt: '2024-01-19T14:20:00',
          customer: {
            name: '李小華',
            phone: '0923-456-789',
            address: '台北市大安區復興南路一段200號'
          },
          products: [
            {
              id: 7,
              name: '獺祭 純米大吟釀 45',
              price: 1580,
              quantity: 3,
              subtotal: 4740,
              preorder: false
            }
          ],
          payment: {
            method: 'cod'
          },
          status: 'confirmed',
          total: 4740,
          note: ''
        },
        {
          id: 'ORD-003',
          createdAt: '2024-01-18T09:15:00',
          customer: {
            name: '張大文',
            phone: '0934-567-890',
            address: '台北市中山區南京東路三段50號'
          },
          products: [
            {
              id: 4,
              name: '法國勃艮第白酒 2020',
              price: 2380,
              quantity: 1,
              subtotal: 2380,
              preorder: false
            },
            {
              id: 8,
              name: '久保田 千寿',
              price: 1280,
              quantity: 2,
              subtotal: 2560,
              preorder: true
            }
          ],
          payment: {
            method: 'online'
          },
          status: 'processing',
          total: 4940,
          note: '需要禮盒包裝'
        }
      ]

      // 清空現有訂單並添加 mock 訂單
      this.orders = mockOrders

      // 初始化一些 mock 溝通紀錄
      this.communications = {
        'ORD-001': [
          {
            id: 1,
            type: 'note',
            content: '已聯繫客戶確認配送時間',
            createdAt: '2024-01-20T10:35:00',
            createdBy: 'staff'
          }
        ],
        'ORD-007': [
          {
            id: 2,
            type: 'note',
            content: '客戶要求加急處理',
            createdAt: '2024-01-20T11:40:00',
            createdBy: 'staff'
          }
        ],
        'ORD-008': [
          {
            id: 3,
            type: 'system',
            content: '系統自動通知：訂單包含預購商品',
            createdAt: '2024-01-20T12:15:00',
            createdBy: 'system'
          }
        ]
      }
    },

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
      
      // 初始化溝通紀錄
      this.communications[orderId] = []
      
      // 添加創建記錄
      this.addCommunication(
        orderId,
        '訂單已建立',
        'system'
      )
      
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