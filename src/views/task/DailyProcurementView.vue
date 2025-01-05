<template>
  <div class="daily-procurement">
    <div class="page-header">
      <h2>日採購作業</h2>
    </div>

    <div class="main-content">
      <!-- 步驟一：選擇訂單 -->
      <el-card v-if="currentStep === 1" class="full-width">
        <template #header>
          <div class="card-header">
            <h3>選擇待處理訂單</h3>
            <div class="actions">
              <el-button type="primary" @click="confirmOrderSelection" :disabled="!selectedOrders.length">
                下一步
              </el-button>
            </div>
          </div>
        </template>

        <el-table
          ref="orderTable"
          :data="pendingOrders"
          @selection-change="handleOrderSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="訂單編號" width="120" />
          <el-table-column prop="createdAt" label="建立時間" width="160">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="customer.name" label="客戶名稱" width="120" />
          <el-table-column label="商品">
            <template #default="{ row }">
              <el-tag 
                v-for="item in row.products" 
                :key="item.id"
                size="small"
                class="product-tag"
              >
                {{ item.name }} x {{ item.quantity }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="總金額" width="120">
            <template #default="{ row }">
              NT$ {{ formatNumber(row.total) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 步驟二：檢視採購建議 -->
      <template v-else-if="currentStep === 2">
        <!-- 採購建議列表 -->
        <el-card class="suggestion-list">
          <template #header>
            <div class="card-header">
              <h3>採購建議</h3>
              <div class="actions">
                <el-button @click="currentStep = 1">上一步</el-button>
                <el-button type="primary" @click="currentStep = 3">下一步</el-button>
              </div>
            </div>
          </template>

          <el-table :data="filteredProcurementSuggestions" style="width: 100%">
            <el-table-column prop="id" label="商品編號" width="120" />
            <el-table-column prop="name" label="商品名稱">
              <template #default="{ row }">
                {{ row.name }}
                <el-tag v-if="row.isJIT" size="small">JIT</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="currentStock" label="目前庫存" width="100" />
            <el-table-column prop="orderedQty" label="訂單需求" width="100" />
            <el-table-column prop="suggestedQty" label="建議數量" width="100" />
            <el-table-column prop="purchaseQty" label="採購數量" width="120">
              <template #default="{ row }">
                <el-input-number 
                  v-model="row.purchaseQty" 
                  :min="0" 
                  :max="999"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button 
                  type="primary" 
                  link
                  @click="showItemDetail(row)"
                >
                  詳情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 訂單明細 -->
        <el-card class="order-details">
          <template #header>
            <div class="card-header">
              <h3>訂單明細</h3>
              <el-tag type="success">{{ selectedOrders.length }} 筆訂單</el-tag>
            </div>
          </template>

          <el-collapse>
            <el-collapse-item
              v-for="order in selectedOrders"
              :key="order.id"
              :title="order.id"
            >
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="客戶名稱">
                  {{ order.customer.name }}
                </el-descriptions-item>
                <el-descriptions-item label="訂單金額">
                  NT$ {{ formatNumber(order.total) }}
                </el-descriptions-item>
                <el-descriptions-item label="建立時間">
                  {{ formatDate(order.createdAt) }}
                </el-descriptions-item>
                <el-descriptions-item label="付款方式">
                  {{ order.payment.method === 'online' ? '線上付款' : '貨到付款' }}
                </el-descriptions-item>
              </el-descriptions>

              <el-table :data="order.products" style="width: 100%; margin-top: 12px">
                <el-table-column prop="name" label="商品名稱" />
                <el-table-column prop="quantity" label="數量" width="100" />
                <el-table-column prop="price" label="單價" width="120">
                  <template #default="{ row }">
                    NT$ {{ formatNumber(row.price) }}
                  </template>
                </el-table-column>
                <el-table-column label="小計" width="120">
                  <template #default="{ row }">
                    NT$ {{ formatNumber(row.price * row.quantity) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </template>

      <!-- 步驟三：進貨單預覽 -->
      <template v-else-if="currentStep === 3">
        <el-card class="full-width">
          <template #header>
            <div class="card-header">
              <h3>進貨單預覽</h3>
              <div class="actions">
                <el-button @click="currentStep = 2">上一步</el-button>
                <el-button type="primary" @click="generatePurchaseOrders">確認送出</el-button>
              </div>
            </div>
          </template>

          <el-tabs v-model="activeSupplier">
            <el-tab-pane 
              v-for="supplier in suppliers" 
              :key="supplier.id"
              :label="supplier.name"
              :name="supplier.id"
            >
              <div class="supplier-info">
                <el-descriptions :column="2" border size="small">
                  <el-descriptions-item label="供應商編號">
                    {{ supplier.id }}
                  </el-descriptions-item>
                  <el-descriptions-item label="聯絡電話">
                    {{ supplier.phone }}
                  </el-descriptions-item>
                  <el-descriptions-item label="預計到貨">
                    {{ formatDate(getTomorrowDate()) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="付款條件">
                    {{ supplier.paymentTerm }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <el-table :data="getSupplierItems(supplier.id)" style="width: 100%; margin-top: 16px">
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

              <div class="supplier-summary">
                <div class="summary-item">
                  <span>採購總數：</span>
                  <span class="value">{{ getSupplierTotalQuantity(supplier.id) }} 瓶</span>
                </div>
                <div class="summary-item">
                  <span>採購總額：</span>
                  <span class="amount">NT$ {{ formatNumber(getSupplierTotal(supplier.id)) }}</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </template>
    </div>

    <!-- 商品詳情對話框 -->
    <el-dialog
      v-model="itemDetailVisible"
      title="商品詳情"
      width="800px"
    >
      <template v-if="selectedItem">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="商品名稱">
            {{ selectedItem.name }}
          </el-descriptions-item>
          <el-descriptions-item label="商品編號">
            {{ selectedItem.id }}
          </el-descriptions-item>
          <el-descriptions-item label="目前庫存">
            {{ selectedItem.currentStock }}
          </el-descriptions-item>
          <el-descriptions-item label="安全庫存">
            {{ selectedItem.safetyStock }}
          </el-descriptions-item>
          <el-descriptions-item label="近30日銷量">
            {{ selectedItem.last30DaysSales }}
          </el-descriptions-item>
          <el-descriptions-item label="預計到貨">
            {{ selectedItem.incomingStock }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="sales-trend">
          <h4>銷售趨勢</h4>
          <!-- 這裡可以放銷售趨勢圖表 -->
          <el-empty description="開發中" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { usePurchaseOrderStore } from '@/stores/modules/purchaseOrder'
import { useOrderStore } from '@/stores/modules/order'

// Store
const purchaseOrderStore = usePurchaseOrderStore()
const orderStore = useOrderStore()

// 當前步驟
const currentStep = ref(1)

// Mock 數據：待處理訂單
const pendingOrders = ref([
  {
    id: 'ORD-001',
    createdAt: '2024-01-20T10:30:00',
    customer: {
      name: '王小明',
      phone: '0912-345-678'
    },
    products: [
      {
        id: 'P001',
        name: '法國波爾多紅酒 2018',
        quantity: 2,
        price: 2580
      }
    ],
    total: 5160,
    payment: {
      method: 'online'
    }
  },
  {
    id: 'ORD-007',
    createdAt: '2024-01-20T11:30:00',
    customer: {
      name: '張美玲',
      phone: '0923-456-789'
    },
    products: [
      {
        id: 'P002',
        name: '意大利白葡萄酒 2021',
        quantity: 3,
        price: 1680
      }
    ],
    total: 5040,
    payment: {
      method: 'online'
    }
  },
  {
    id: 'ORD-008',
    createdAt: '2024-01-20T12:15:00',
    customer: {
      name: '李大維',
      phone: '0934-567-890'
    },
    products: [
      {
        id: 'P003',
        name: '獺祭 純米大吟釀 45',
        quantity: 2,
        price: 1580
      },
      {
        id: 'P004',
        name: '久保田 千寿',
        quantity: 1,
        price: 1280
      }
    ],
    total: 4440,
    payment: {
      method: 'cod'
    }
  }
])

// 選中的訂單
const selectedOrders = ref([])

// 採購建議
const procurementSuggestions = ref([
  {
    id: 'P001',
    name: '法國波爾多紅酒 2018',
    currentStock: 0,
    price: 2580,
    isJIT: true,
    supplierId: 'S001',
    safetyStock: 0,
    last30DaysSales: 24,
    incomingStock: 0
  },
  {
    id: 'P002',
    name: '意大利白葡萄酒 2021',
    currentStock: 0,
    price: 1680,
    isJIT: true,
    supplierId: 'S002',
    safetyStock: 0,
    last30DaysSales: 18,
    incomingStock: 0
  },
  {
    id: 'P003',
    name: '獺祭 純米大吟釀 45',
    currentStock: 2,
    price: 1580,
    isJIT: false,
    supplierId: 'S003',
    safetyStock: 6,
    last30DaysSales: 36,
    incomingStock: 0
  },
  {
    id: 'P004',
    name: '久保田 千寿',
    currentStock: 3,
    price: 1280,
    isJIT: false,
    supplierId: 'S003',
    safetyStock: 6,
    last30DaysSales: 24,
    incomingStock: 0
  }
])

// 供應商資料
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

const activeSupplier = ref('S001')
const itemDetailVisible = ref(false)
const selectedItem = ref(null)

// 是否有選中訂單
const hasSelectedOrders = computed(() => selectedOrders.value.length > 0)

// 處理訂單選擇變更
const handleOrderSelectionChange = (orders) => {
  selectedOrders.value = orders
}

// 確認訂單選擇
const confirmOrderSelection = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('請至少選擇一筆訂單')
    return
  }
  currentStep.value = 2
}

// 獲取供應商商品
const getSupplierItems = (supplierId) => {
  return procurementSuggestions.value.filter(item => item.supplierId === supplierId)
}

// 計算供應商總金額
const getSupplierTotal = (supplierId) => {
  return getSupplierItems(supplierId).reduce((sum, item) => {
    return sum + (item.price * item.purchaseQty)
  }, 0)
}

// 計算供應商總數量
const getSupplierTotalQuantity = (supplierId) => {
  return getSupplierItems(supplierId).reduce((sum, item) => {
    return sum + item.purchaseQty
  }, 0)
}

// 顯示商品詳情
const showItemDetail = (item) => {
  selectedItem.value = item
  itemDetailVisible.value = true
}

// 生成進貨單
const generatePurchaseOrders = () => {
  // 按供應商分組商品
  const supplierGroups = {}
  procurementSuggestions.value.forEach(item => {
    if (item.purchaseQty > 0) {
      if (!supplierGroups[item.supplierId]) {
        supplierGroups[item.supplierId] = []
      }
      supplierGroups[item.supplierId].push(item)
    }
  })

  // 為每個供應商創建進貨單
  Object.entries(supplierGroups).forEach(([supplierId, items]) => {
    const supplier = suppliers.value.find(s => s.id === supplierId)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    // 計算總金額
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.price * item.purchaseQty)
    }, 0)

    // 創建進貨單
    purchaseOrderStore.createPurchaseOrder({
      supplier,
      items,
      totalAmount,
      expectedDeliveryDate: tomorrow.toISOString(),
      relatedOrders: selectedOrders.value
    })
  })

  // 更新所有選中訂單的狀態為備貨中
  selectedOrders.value.forEach(order => {
    orderStore.updateOrderStatus(order.id, 'preparing')
  })

  currentStep.value = 1
  selectedOrders.value = []
  ElMessage.success('進貨單已生成，相關訂單已更新為備貨中')
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 獲取明天日期
const getTomorrowDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString()
}

// 格式化數字
const formatNumber = (num) => {
  return num.toLocaleString()
}

// 表格 ref
const orderTable = ref(null)

// 根據選中訂單過濾的採購建議
const filteredProcurementSuggestions = computed(() => {
  // 獲取所有選中訂單中的商品及其總數量
  const selectedProducts = new Map() // Map<商品ID, 訂單總數量>
  selectedOrders.value.forEach(order => {
    order.products.forEach(product => {
      const currentQty = selectedProducts.get(product.id) || 0
      selectedProducts.set(product.id, currentQty + product.quantity)
    })
  })

  // 計算建議採購量並過濾商品
  return procurementSuggestions.value
    .filter(suggestion => selectedProducts.has(suggestion.id))
    .map(suggestion => {
      const orderedQty = selectedProducts.get(suggestion.id) || 0
      const remainingStock = suggestion.currentStock - orderedQty
      
      return {
        ...suggestion,
        orderedQty,
        suggestedQty: remainingStock < 0 ? Math.abs(remainingStock) : 0,
        purchaseQty: remainingStock < 0 ? Math.abs(remainingStock) : 0
      }
    })
})

// 在組件掛載後預設選中所有訂單
onMounted(async () => {
  await nextTick()
  if (orderTable.value) {
    orderTable.value.toggleAllSelection()
  }
})
</script>

<style lang="scss" scoped>
.daily-procurement {
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    height: calc(100vh - 140px);

    .full-width {
      grid-column: 1 / -1;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 12px;
    }
  }

  .suggestion-list,
  .order-details,
  .full-width {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
      flex: 1;
      overflow: auto;
    }
  }

  .product-tag {
    margin-right: 8px;
    margin-bottom: 4px;
  }

  .supplier-info {
    margin-bottom: 24px;
  }

  .supplier-summary {
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

  .sales-trend {
    margin-top: 24px;

    h4 {
      margin: 0 0 16px;
    }
  }
}
</style> 