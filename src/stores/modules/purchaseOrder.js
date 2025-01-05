import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {
  // State
  const purchaseOrders = ref([])
  const loading = ref(false)

  // Getters
  const getPurchaseOrders = computed(() => purchaseOrders.value)
  const getPurchaseOrderById = computed(() => (id) => {
    return purchaseOrders.value.find(po => po.id === id)
  })

  // Actions
  const createPurchaseOrder = (orderData) => {
    // 生成進貨單號 (PO-YYYYMMDD-XXX)
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    const sequence = (purchaseOrders.value.length + 1).toString().padStart(3, '0')
    const purchaseOrderId = `PO-${dateStr}-${sequence}`

    const purchaseOrder = {
      id: purchaseOrderId,
      createdAt: new Date().toISOString(),
      ...orderData,
      status: 'pending'
    }

    purchaseOrders.value.push(purchaseOrder)
    ElMessage.success('進貨單已建立')
    return purchaseOrder
  }

  const updatePurchaseOrderStatus = (id, status) => {
    const purchaseOrder = purchaseOrders.value.find(po => po.id === id)
    if (purchaseOrder) {
      purchaseOrder.status = status
      ElMessage.success('進貨單狀態已更新')
    }
  }

  const updatePurchaseOrder = (id, data) => {
    const index = purchaseOrders.value.findIndex(po => po.id === id)
    if (index !== -1) {
      purchaseOrders.value[index] = {
        ...purchaseOrders.value[index],
        ...data
      }
      ElMessage.success('進貨單已更新')
    }
  }

  return {
    // State
    purchaseOrders,
    loading,

    // Getters
    getPurchaseOrders,
    getPurchaseOrderById,

    // Actions
    createPurchaseOrder,
    updatePurchaseOrderStatus,
    updatePurchaseOrder
  }
}) 