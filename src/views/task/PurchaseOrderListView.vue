<template>
  <div class="purchase-order-list">
    <div class="page-header">
      <h2>進貨單列表</h2>
    </div>

    <div class="main-content">
      <el-card class="full-width">
        <template #header>
          <div class="card-header">
            <div class="filters">
              <el-select v-model="filterSupplier" placeholder="供應商" clearable>
                <el-option
                  v-for="supplier in suppliers"
                  :key="supplier.id"
                  :label="supplier.name"
                  :value="supplier.id"
                />
              </el-select>
              <el-select v-model="filterStatus" placeholder="狀態" clearable>
                <el-option label="待確認" value="pending" />
                <el-option label="已確認" value="confirmed" />
                <el-option label="已到貨" value="received" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                :shortcuts="dateShortcuts"
              />
            </div>
          </div>
        </template>

        <el-table :data="filteredPurchaseOrders" style="width: 100%">
          <el-table-column prop="id" label="進貨單號" width="120" />
          <el-table-column prop="createdAt" label="建立時間" width="160">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="supplier.name" label="供應商" width="120" />
          <el-table-column prop="status" label="狀態" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="商品">
            <template #default="{ row }">
              <el-tag 
                v-for="item in row.items" 
                :key="item.id"
                size="small"
                class="product-tag"
              >
                {{ item.name }} x {{ item.purchaseQty }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="總金額" width="120">
            <template #default="{ row }">
              NT$ {{ formatNumber(row.totalAmount) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                link
                @click="showPurchaseOrderDetail(row)"
              >
                詳情
              </el-button>
              <el-button 
                v-if="row.status === 'pending'"
                type="success" 
                link
                @click="confirmPurchaseOrder(row)"
              >
                確認
              </el-button>
              <el-button 
                v-if="row.status === 'confirmed'"
                type="warning" 
                link
                @click="receivePurchaseOrder(row)"
              >
                到貨
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
          />
        </div>
      </el-card>
    </div>

    <!-- 進貨單詳情對話框 -->
    <el-dialog
      v-model="detailVisible"
      title="進貨單詳情"
      width="800px"
    >
      <template v-if="selectedPurchaseOrder">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="進貨單號">
            {{ selectedPurchaseOrder.id }}
          </el-descriptions-item>
          <el-descriptions-item label="建立時間">
            {{ formatDate(selectedPurchaseOrder.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="供應商">
            {{ selectedPurchaseOrder.supplier.name }}
          </el-descriptions-item>
          <el-descriptions-item label="狀態">
            <el-tag :type="getStatusType(selectedPurchaseOrder.status)">
              {{ getStatusLabel(selectedPurchaseOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="預計到貨">
            {{ formatDate(selectedPurchaseOrder.expectedDeliveryDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="付款條件">
            {{ selectedPurchaseOrder.supplier.paymentTerm }}
          </el-descriptions-item>
        </el-descriptions>

        <el-table :data="selectedPurchaseOrder.items" style="width: 100%; margin-top: 16px">
          <el-table-column prop="name" label="商品名稱" />
          <el-table-column prop="purchaseQty" label="數量" width="120" />
          <el-table-column prop="price" label="單價" width="120">
            <template #default="{ row }">
              NT$ {{ formatNumber(row.price) }}
            </template>
          </el-table-column>
          <el-table-column label="小計" width="120">
            <template #default="{ row }">
              NT$ {{ formatNumber(row.price * row.purchaseQty) }}
            </template>
          </el-table-column>
        </el-table>

        <div class="summary">
          <div class="summary-item">
            <span>商品總數：</span>
            <span class="value">{{ getTotalQuantity(selectedPurchaseOrder) }} 瓶</span>
          </div>
          <div class="summary-item">
            <span>採購總額：</span>
            <span class="amount">NT$ {{ formatNumber(selectedPurchaseOrder.totalAmount) }}</span>
          </div>
        </div>

        <template v-if="selectedPurchaseOrder.relatedOrders?.length">
          <div class="related-orders">
            <h4>關聯訂單</h4>
            <el-table :data="selectedPurchaseOrder.relatedOrders" style="width: 100%">
              <el-table-column prop="id" label="訂單編號" width="120" />
              <el-table-column prop="customer.name" label="客戶名稱" width="120" />
              <el-table-column prop="createdAt" label="建立時間" width="160">
                <template #default="{ row }">
                  {{ formatDate(row.createdAt) }}
                </template>
              </el-table-column>
              <el-table-column prop="total" label="訂單金額" width="120">
                <template #default="{ row }">
                  NT$ {{ formatNumber(row.total) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { usePurchaseOrderStore } from '@/stores/modules/purchaseOrder'

// Store
const purchaseOrderStore = usePurchaseOrderStore()

// 篩選條件
const filterSupplier = ref('')
const filterStatus = ref('')
const dateRange = ref([])

// 分頁
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(100)

// 對話框
const detailVisible = ref(false)
const selectedPurchaseOrder = ref(null)

// 日期快捷選項
const dateShortcuts = [
  {
    text: '最近一週',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一個月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三個月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// Mock 數據：供應商
const suppliers = ref([
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
])

// 篩選後的進貨單
const filteredPurchaseOrders = computed(() => {
  let result = purchaseOrderStore.getPurchaseOrders

  // 供應商篩選
  if (filterSupplier.value) {
    result = result.filter(po => po.supplier.id === filterSupplier.value)
  }

  // 狀態篩選
  if (filterStatus.value) {
    result = result.filter(po => po.status === filterStatus.value)
  }

  // 日期範圍篩選
  if (dateRange.value?.length === 2) {
    const startDate = dateRange.value[0]
    const endDate = dateRange.value[1]
    result = result.filter(po => {
      const poDate = new Date(po.createdAt)
      return poDate >= startDate && poDate <= endDate
    })
  }

  return result
})

// 顯示進貨單詳情
const showPurchaseOrderDetail = (purchaseOrder) => {
  selectedPurchaseOrder.value = purchaseOrder
  detailVisible.value = true
}

// 確認進貨單
const confirmPurchaseOrder = (purchaseOrder) => {
  purchaseOrderStore.updatePurchaseOrderStatus(purchaseOrder.id, 'confirmed')
}

// 確認到貨
const receivePurchaseOrder = (purchaseOrder) => {
  purchaseOrderStore.updatePurchaseOrderStatus(purchaseOrder.id, 'received')
}

// 取得狀態標籤
const getStatusLabel = (status) => {
  const statusMap = {
    pending: '待確認',
    confirmed: '已確認',
    received: '已到貨',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 取得狀態類型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    confirmed: 'primary',
    received: 'success',
    cancelled: 'info'
  }
  return typeMap[status] || ''
}

// 計算總數量
const getTotalQuantity = (purchaseOrder) => {
  return purchaseOrder.items.reduce((sum, item) => {
    return sum + (item.purchaseQty || 0)
  }, 0)
}

// 計算總箱數
const getTotalBoxes = (purchaseOrder) => {
  return purchaseOrder.items.reduce((sum, item) => {
    return sum + item.boxQty
  }, 0)
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 格式化數字
const formatNumber = (num) => {
  return num.toLocaleString()
}
</script>

<style lang="scss" scoped>
.purchase-order-list {
  .page-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
    }
  }

  .main-content {
    height: calc(100vh - 140px);

    .full-width {
      height: 100%;
      display: flex;
      flex-direction: column;

      :deep(.el-card__body) {
        flex: 1;
        overflow: auto;
      }
    }
  }

  .card-header {
    .filters {
      display: flex;
      gap: 16px;
    }
  }

  .product-tag {
    margin-right: 8px;
    margin-bottom: 4px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .summary {
    margin-top: 16px;
    padding: 16px;
    background: var(--el-fill-color-light);
    border-radius: 4px;

    .summary-item {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .value {
        font-weight: bold;
        margin-left: 8px;
      }

      .amount {
        font-size: 18px;
        font-weight: bold;
        color: var(--el-color-primary);
        margin-left: 8px;
      }
    }
  }

  .related-orders {
    margin-top: 24px;

    h4 {
      margin: 0 0 16px;
    }
  }
}
</style> 