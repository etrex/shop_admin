import { defineStore } from 'pinia'

export const useProcurementStore = defineStore('procurement', {
  state: () => ({
    procurementSuggestions: [
      {
        id: 'P001',
        name: '法國波爾多紅酒 2018',
        currentStock: 0,
        price: 2580,
        isJIT: true,
        suppliers: ['S001', 'S002'],
        selectedSupplierId: 'S001',
        safetyStock: 0,
        last30DaysSales: 24,
        incomingStock: 0,
        purchaseQty: 0
      },
      {
        id: 'P002',
        name: '意大利基安蒂紅酒 2019',
        currentStock: 0,
        price: 1980,
        isJIT: true,
        suppliers: ['S002'],
        selectedSupplierId: 'S002',
        safetyStock: 0,
        last30DaysSales: 18,
        incomingStock: 0,
        purchaseQty: 0
      },
      {
        id: 'P003',
        name: '西班牙里奧哈紅酒 2017',
        currentStock: 0,
        price: 2180,
        isJIT: true,
        suppliers: ['S002'],
        selectedSupplierId: 'S002',
        safetyStock: 0,
        last30DaysSales: 15,
        incomingStock: 0,
        purchaseQty: 0
      },
      {
        id: 'P004',
        name: '法國勃艮第白酒 2020',
        currentStock: 5,
        price: 2380,
        isJIT: false,
        suppliers: ['S001'],
        selectedSupplierId: 'S001',
        safetyStock: 6,
        last30DaysSales: 20,
        incomingStock: 0,
        purchaseQty: 0
      },
      {
        id: 'P005',
        name: '意大利白葡萄酒 2021',
        currentStock: 0,
        price: 1680,
        isJIT: true,
        suppliers: ['S002'],
        selectedSupplierId: 'S002',
        safetyStock: 0,
        last30DaysSales: 22,
        incomingStock: 0,
        purchaseQty: 0
      },
      {
        id: 'P006',
        name: '德國雷司令白酒 2020',
        currentStock: 0,
        price: 1880,
        isJIT: true,
        suppliers: ['S002'],
        selectedSupplierId: 'S002',
        safetyStock: 0,
        last30DaysSales: 16,
        incomingStock: 0,
        purchaseQty: 0
      },
      {
        id: 'P007',
        name: '獺祭 純米大吟釀 45',
        currentStock: 3,
        price: 1580,
        isJIT: false,
        suppliers: ['S003'],
        selectedSupplierId: 'S003',
        safetyStock: 6,
        last30DaysSales: 36,
        incomingStock: 0,
        purchaseQty: 0
      },
      {
        id: 'P008',
        name: '久保田 千寿',
        currentStock: 0,
        price: 1280,
        isJIT: true,
        suppliers: ['S003'],
        selectedSupplierId: 'S003',
        safetyStock: 0,
        last30DaysSales: 24,
        incomingStock: 0,
        purchaseQty: 0
      },
      {
        id: 'P009',
        name: '出羽桜 純米大吟釀',
        currentStock: 0,
        price: 1480,
        isJIT: true,
        suppliers: ['S003'],
        selectedSupplierId: 'S003',
        safetyStock: 0,
        last30DaysSales: 20,
        incomingStock: 0,
        purchaseQty: 0
      },
      {
        id: 'P010',
        name: '八海山 特別本醸造',
        currentStock: 0,
        price: 980,
        isJIT: true,
        suppliers: ['S003'],
        selectedSupplierId: 'S003',
        safetyStock: 0,
        last30DaysSales: 30,
        incomingStock: 0,
        purchaseQty: 0
      }
    ],
    // 湊箱商品列表
    boxCompletionItems: [
      {
        id: 'P005',
        name: '法國波爾多紅酒 2019',
        currentStock: 5,
        price: 2680,
        suppliers: ['S001'],
        selectedSupplierId: 'S001',
        boxSize: 12,
        purchaseQty: 0
      },
      {
        id: 'P006',
        name: '義大利紅酒 2020',
        currentStock: 3,
        price: 1980,
        suppliers: ['S002'],
        selectedSupplierId: 'S002',
        boxSize: 6,
        purchaseQty: 0
      }
    ],
    suppliers: [
      { 
        id: 'S001', 
        name: '法國酒商',
        phone: '02-2345-6789',
        paymentTerm: '月結30天'
      },
      { 
        id: 'S002', 
        name: '義大利酒商',
        phone: '02-3456-7890',
        paymentTerm: '月結45天'
      },
      { 
        id: 'S003', 
        name: '日本酒商',
        phone: '02-4567-8901',
        paymentTerm: '月結60天'
      }
    ],
    selectedOrders: [],
    currentStep: 1
  }),

  getters: {
    // 根據選中訂單過濾的採購建議
    filteredSuggestions: (state) => {
      // 獲取所有選中訂單中的商品及其總數量
      const selectedProducts = new Map()
      state.selectedOrders.forEach(order => {
        order.products.forEach(product => {
          const currentQty = selectedProducts.get(product.id) || 0
          selectedProducts.set(product.id, currentQty + product.quantity)
        })
      })

      // 過濾商品
      return state.procurementSuggestions
        .filter(suggestion => selectedProducts.has(suggestion.id))
        .map(suggestion => {
          const orderedQty = selectedProducts.get(suggestion.id) || 0
          const remainingStock = suggestion.currentStock - orderedQty
          const suggestedQty = remainingStock < 0 ? Math.abs(remainingStock) : 0
          
          // 如果商品還沒有設定採購數量，就使用建議數量
          if (suggestion.purchaseQty === 0) {
            suggestion.purchaseQty = suggestedQty
          }
          
          return {
            ...suggestion,
            orderedQty,
            suggestedQty
          }
        })
    },

    // 獲取活躍供應商列表
    activeSuppliers: (state) => {
      const supplierSet = new Set()
      
      // 檢查一般採購商品
      state.procurementSuggestions.forEach(item => {
        if (item.selectedSupplierId && item.purchaseQty > 0) {
          supplierSet.add(item.selectedSupplierId)
        }
      })
      
      // 檢查湊箱商品
      state.boxCompletionItems.forEach(item => {
        if (item.selectedSupplierId && item.purchaseQty > 0) {
          supplierSet.add(item.selectedSupplierId)
        }
      })
      
      return state.suppliers.filter(supplier => 
        supplierSet.has(supplier.id)
      )
    },

    // 獲取商品的供應商列表
    itemSuppliers: (state) => (item) => {
      return state.suppliers.filter(supplier => item.suppliers.includes(supplier.id))
    },

    // 計算訂單商品數量
    orderedQuantity: (state) => (productId) => {
      let total = 0
      state.selectedOrders.forEach(order => {
        order.products.forEach(product => {
          if (product.id === productId) {
            total += product.quantity
          }
        })
      })
      return total
    },

    // 計算建議採購數量
    suggestedQuantity: (state) => (productId) => {
      const item = state.procurementSuggestions.find(item => item.id === productId)
      if (!item) return 0
      
      const orderedQty = state.selectedOrders.reduce((total, order) => {
        const product = order.products.find(p => p.id === productId)
        return total + (product ? product.quantity : 0)
      }, 0)
      
      const remainingStock = item.currentStock - orderedQty
      return remainingStock < 0 ? Math.abs(remainingStock) : 0
    },

    // 獲取供應商的湊箱商品
    supplierBoxItems: (state) => (supplierId) => {
      return state.boxCompletionItems.filter(item => 
        item.selectedSupplierId === supplierId
      )
    }
  },

  actions: {
    // 更新選中的訂單
    setSelectedOrders(orders) {
      this.selectedOrders = orders
      
      // 重置所有商品的採購數量
      this.procurementSuggestions.forEach(suggestion => {
        suggestion.purchaseQty = 0
      })
      
      // 根據新選擇的訂單計算並設定採購數量
      const selectedProducts = new Map()
      orders.forEach(order => {
        order.products.forEach(product => {
          const currentQty = selectedProducts.get(product.id) || 0
          selectedProducts.set(product.id, currentQty + product.quantity)
        })
      })
      
      this.procurementSuggestions
        .filter(suggestion => selectedProducts.has(suggestion.id))
        .forEach(suggestion => {
          const orderedQty = selectedProducts.get(suggestion.id) || 0
          const remainingStock = suggestion.currentStock - orderedQty
          const suggestedQty = remainingStock < 0 ? Math.abs(remainingStock) : 0
          suggestion.purchaseQty = suggestedQty
        })
    },

    // 更新當前步驟
    setCurrentStep(step) {
      this.currentStep = step
    },

    // 更新商品的採購數量
    updatePurchaseQuantity(productId, quantity) {
      const item = this.procurementSuggestions.find(item => item.id === productId)
      if (item) {
        item.purchaseQty = quantity
      }
    },

    // 更新商品的供應商
    updateSelectedSupplier(productId, supplierId) {
      const item = this.procurementSuggestions.find(item => item.id === productId)
      if (item) {
        item.selectedSupplierId = supplierId
      }
    },

    // 重置採購數據
    reset() {
      this.selectedOrders = []
      this.currentStep = 1
      this.procurementSuggestions.forEach(item => {
        item.purchaseQty = 0
      })
      this.boxCompletionItems.forEach(item => {
        item.purchaseQty = 0
      })
    },

    // 更新湊箱商品的採購數量
    updateBoxItemQuantity(itemId, quantity) {
      const item = this.boxCompletionItems.find(item => item.id === itemId)
      if (item) {
        item.purchaseQty = quantity
      }
    }
  }
}) 