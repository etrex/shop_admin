import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useWarehouseStore = defineStore('warehouse', {
  state: () => ({
    // 倉庫出入庫紀錄
    warehouseRecords: [],
    // 庫存
    inventory: {}
  }),

  getters: {
    // 獲取所有出入庫紀錄
    getAllRecords: (state) => state.warehouseRecords,

    // 獲取入庫紀錄
    getInboundRecords: (state) => {
      return state.warehouseRecords.filter(record => record.type === 'in')
    },

    // 獲取出庫紀錄
    getOutboundRecords: (state) => {
      return state.warehouseRecords.filter(record => record.type === 'out')
    },

    // 獲取特定商品的庫存
    getInventory: (state) => (productId) => {
      return state.inventory[productId] || 0
    }
  },

  actions: {
    // 創建入庫紀錄
    createInboundRecord(purchaseOrder, receivingData) {
      const recordId = 'WH-IN-' + String(this.warehouseRecords.length + 1).padStart(3, '0')
      
      const record = {
        id: recordId,
        type: 'in',
        createdAt: new Date().toISOString(),
        sourceType: 'purchase_order',
        sourceId: purchaseOrder.id,
        supplier: purchaseOrder.supplier,
        items: receivingData.items.map(item => {
          // 更新庫存
          const currentStock = this.inventory[item.id] || 0
          this.inventory[item.id] = currentStock + item.receivedQty

          return {
            id: item.id,
            name: purchaseOrder.items.find(i => i.id === item.id).name,
            quantity: item.receivedQty,
            note: item.note
          }
        })
      }
      
      this.warehouseRecords.push(record)
      return recordId
    },

    // 創建出庫紀錄
    createOutboundRecord(order, pickingData) {
      const recordId = 'WH-OUT-' + String(this.warehouseRecords.length + 1).padStart(3, '0')
      
      const record = {
        id: recordId,
        type: 'out',
        createdAt: new Date().toISOString(),
        sourceType: 'order',
        sourceId: order.id,
        customer: order.customer,
        items: pickingData.items.map(item => {
          // 更新庫存
          const currentStock = this.inventory[item.id] || 0
          this.inventory[item.id] = currentStock - item.pickedQty

          return {
            id: item.id,
            name: order.products.find(p => p.id === item.id).name,
            quantity: item.pickedQty,
            note: item.note
          }
        })
      }
      
      this.warehouseRecords.push(record)
      return recordId
    },

    // 初始化 mock 數據
    initializeMockData() {
      // 初始化庫存
      this.inventory = {
        'P001': 20,  // 法國波爾多紅酒 2018
        'P002': 15,  // 意大利白葡萄酒 2021
        'P003': 25,  // 獺祭 純米大吟釀 45
        'P004': 30   // 久保田 千寿
      }

      // 初始化出入庫紀錄
      this.warehouseRecords = [
        {
          id: 'WH-IN-001',
          type: 'in',
          createdAt: '2024-01-15T10:00:00',
          sourceType: 'purchase_order',
          sourceId: 'PO-001',
          supplier: {
            id: 'S001',
            name: '法國酒商'
          },
          items: [
            {
              id: 'P001',
              name: '法國波爾多紅酒 2018',
              quantity: 20,
              note: '正常入庫'
            }
          ]
        },
        {
          id: 'WH-OUT-001',
          type: 'out',
          createdAt: '2024-01-16T14:00:00',
          sourceType: 'order',
          sourceId: 'ORD-001',
          customer: {
            name: '王小明'
          },
          items: [
            {
              id: 'P001',
              name: '法國波爾多紅酒 2018',
              quantity: 2,
              note: '正常出貨'
            }
          ]
        }
      ]
    }
  }
}) 