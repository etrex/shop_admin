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
        },
        {
          id: 'ORD-004',
          createdAt: '2024-01-17T16:40:00',
          customer: {
            name: '陳小玲',
            phone: '0945-678-901',
            address: '台北市松山區民生東路四段120號'
          },
          products: [
            {
              id: 2,
              name: '意大利基安蒂紅酒 2019',
              price: 1980,
              quantity: 4,
              subtotal: 7920,
              preorder: true
            }
          ],
          payment: {
            method: 'online'
          },
          status: 'shipped',
          total: 7920,
          note: '週末配送'
        },
        {
          id: 'ORD-005',
          createdAt: '2024-01-16T11:25:00',
          customer: {
            name: '林小美',
            phone: '0956-789-012',
            address: '台北市內湖區成功路四段80號'
          },
          products: [
            {
              id: 9,
              name: '出羽桜 純米大吟釀',
              price: 1480,
              quantity: 2,
              subtotal: 2960,
              preorder: true
            }
          ],
          payment: {
            method: 'cod'
          },
          status: 'completed',
          total: 2960,
          note: ''
        },
        {
          id: 'ORD-006',
          createdAt: '2024-01-15T13:50:00',
          customer: {
            name: '黃小琳',
            phone: '0967-890-123',
            address: '台北市士林區中正路100號'
          },
          products: [
            {
              id: 3,
              name: '西班牙里奧哈紅酒 2017',
              price: 2180,
              quantity: 1,
              subtotal: 2180,
              preorder: true
            }
          ],
          payment: {
            method: 'online'
          },
          status: 'cancelled',
          total: 2180,
          note: '客戶取消訂單'
        }
      ]

      // 清空現有訂單並添加 mock 訂單
      this.orders = mockOrders
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