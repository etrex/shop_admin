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
            <h3>選擇已確認訂單</h3>
            <div class="actions">
              <el-button type="primary" @click="confirmOrderSelection" :disabled="!hasSelectedOrders()">
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
                <el-button @click="handlePreviousStep">上一步</el-button>
                <el-button type="primary" @click="confirmProcurementSuggestions">下一步</el-button>
              </div>
            </div>
          </template>

          <el-table :data="procurementStore.filteredSuggestions" style="width: 100%">
            <el-table-column prop="id" label="商品編號" width="120" />
            <el-table-column prop="name" label="商品名稱">
              <template #default="{ row }">
                {{ row.name }}
                <el-tag v-if="row.isJIT" size="small">JIT</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="currentStock" label="目前庫存" width="100" />
            <el-table-column label="訂單需求" width="100">
              <template #default="{ row }">
                {{ procurementStore.orderedQuantity(row.id) }}
              </template>
            </el-table-column>
            <el-table-column label="建議數量" width="100">
              <template #default="{ row }">
                {{ procurementStore.suggestedQuantity(row.id) }}
              </template>
            </el-table-column>
            <el-table-column label="供應商" width="150">
              <template #default="{ row }">
                <el-select 
                  v-model="row.selectedSupplierId" 
                  size="small"
                  @change="handleSupplierChange(row, $event)"
                >
                  <el-option
                    v-for="supplier in procurementStore.itemSuppliers(row)"
                    :key="supplier.id"
                    :label="supplier.name"
                    :value="supplier.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="purchaseQty" label="採購數量" width="120">
              <template #default="{ row }">
                <el-input-number 
                  v-model="row.purchaseQty" 
                  :min="0" 
                  :max="999"
                  size="small"
                  @change="handlePurchaseQtyChange(row, $event)"
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
              <el-tag type="success">{{ procurementStore.selectedOrders.length }} 筆訂單</el-tag>
            </div>
          </template>

          <el-collapse>
            <el-collapse-item
              v-for="order in procurementStore.selectedOrders"
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
                <el-button @click="handlePreviousStep">上一步</el-button>
                <el-button type="primary" @click="generatePurchaseOrders">確認送出</el-button>
              </div>
            </div>
          </template>

          <el-tabs 
            v-model="activeSupplier"
            v-if="procurementStore.activeSuppliers.length > 0"
          >
            <el-tab-pane 
              v-for="supplier in procurementStore.activeSuppliers" 
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

              <el-table 
                :data="procurementStore.filteredSuggestions.filter(item => 
                  item.selectedSupplierId === supplier.id && item.purchaseQty > 0
                )" 
                style="width: 100%; margin-top: 16px"
              >
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
                  <span class="value">{{ 
                    procurementStore.filteredSuggestions
                      .filter(item => item.selectedSupplierId === supplier.id)
                      .reduce((sum, item) => sum + (item.purchaseQty || 0), 0)
                  }} 瓶</span>
                </div>
                <div class="summary-item">
                  <span>採購總額：</span>
                  <span class="amount">NT$ {{ formatNumber(
                    procurementStore.filteredSuggestions
                      .filter(item => item.selectedSupplierId === supplier.id)
                      .reduce((sum, item) => sum + (item.price * (item.purchaseQty || 0)), 0)
                  ) }}</span>
                </div>
              </div>

              <!-- 湊箱商品選擇 -->
              <div class="box-completion" v-if="procurementStore.supplierBoxItems(supplier.id).length > 0">
                <h4>湊箱商品</h4>
                <el-table 
                  :data="procurementStore.supplierBoxItems(supplier.id)"
                  style="width: 100%; margin-top: 16px"
                >
                  <el-table-column prop="name" label="商品名稱" />
                  <el-table-column prop="currentStock" label="目前庫存" width="100" />
                  <el-table-column prop="price" label="單價" width="120">
                    <template #default="{ row }">
                      NT$ {{ formatNumber(row.price) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="採購數量" width="120">
                    <template #default="{ row }">
                      <el-input-number 
                        v-model="row.purchaseQty" 
                        :min="0" 
                        :max="999"
                        size="small"
                        @change="handleBoxItemQtyChange(row, $event)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="小計" width="120">
                    <template #default="{ row }">
                      NT$ {{ formatNumber(row.price * row.purchaseQty) }}
                    </template>
                  </el-table-column>
                </el-table>

                <!-- 湊箱商品小計 -->
                <div class="box-items-summary">
                  <div class="summary-item">
                    <span>湊箱總數：</span>
                    <span class="value">{{ 
                      procurementStore.supplierBoxItems(supplier.id)
                        .reduce((sum, item) => sum + (item.purchaseQty || 0), 0)
                    }} 瓶</span>
                  </div>
                  <div class="summary-item">
                    <span>湊箱總額：</span>
                    <span class="amount">NT$ {{ formatNumber(
                      procurementStore.supplierBoxItems(supplier.id)
                        .reduce((sum, item) => sum + (item.price * (item.purchaseQty || 0)), 0)
                    ) }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-empty v-else description="沒有需要採購的商品" />
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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { usePurchaseOrderStore } from '@/stores/modules/purchaseOrder'
import { useOrderStore } from '@/stores/modules/order'
import { useProcurementStore } from '@/stores/modules/procurement'

// Store
const purchaseOrderStore = usePurchaseOrderStore()
const orderStore = useOrderStore()
const procurementStore = useProcurementStore()

// 當前步驟
const currentStep = computed(() => procurementStore.currentStep)

// 當前選中的供應商
const activeSupplier = ref('')

// 監聽步驟變化，當進入第三步時自動選擇第一個供應商
watch(currentStep, (newStep) => {
  if (newStep === 3 && procurementStore.activeSuppliers.length > 0) {
    activeSupplier.value = procurementStore.activeSuppliers[0].id
  }
})

// 取得已確認訂單列表
const pendingOrders = computed(() => {
  // 取得已確認狀態的訂單，這些訂單已通過客服確認且付款完成，等待進行採購處理
  return orderStore.getAllOrders.filter(order => order.status === 'confirmed')
})

// 商品詳情相關
const itemDetailVisible = ref(false)
const selectedItem = ref(null)

// 處理訂單選擇變更
const handleOrderSelectionChange = (orders) => {
  procurementStore.setSelectedOrders(orders)
}

// 確認訂單選擇
const confirmOrderSelection = () => {
  if (!hasSelectedOrders()) {
    ElMessage.warning('請至少選擇一筆訂單')
    return
  }
  procurementStore.setCurrentStep(2)
}

// 是否有選中訂單
const hasSelectedOrders = () => procurementStore.selectedOrders.length > 0

// 處理採購數量變更
const handlePurchaseQtyChange = (item, value) => {
  procurementStore.updatePurchaseQuantity(item.id, value)
}

// 處理供應商變更
const handleSupplierChange = (item, supplierId) => {
  procurementStore.updateSelectedSupplier(item.id, supplierId)
}

// 顯示商品詳情
const showItemDetail = (item) => {
  selectedItem.value = item
  itemDetailVisible.value = true
}

// 處理湊箱商品數量變更
const handleBoxItemQtyChange = (item, value) => {
  procurementStore.updateBoxItemQuantity(item.id, value)
}

// 生成進貨單
const generatePurchaseOrders = () => {
  const activeSuppliers = procurementStore.activeSuppliers
  
  // 檢查是否有需要採購的商品
  if (activeSuppliers.length === 0) {
    ElMessage.warning('沒有需要採購的商品')
    return
  }

  // 為每個供應商創建進貨單
  activeSuppliers.forEach(supplier => {
    // 一般採購商品
    const regularItems = procurementStore.filteredSuggestions.filter(item => 
      item.selectedSupplierId === supplier.id && item.purchaseQty > 0
    )

    // 湊箱商品
    const boxItems = procurementStore.supplierBoxItems(supplier.id)
      .filter(item => item.purchaseQty > 0)

    // 合併所有採購項目
    const allItems = [...regularItems, ...boxItems]

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    // 計算總金額
    const totalAmount = allItems.reduce((sum, item) => {
      return sum + (item.price * item.purchaseQty)
    }, 0)

    // 創建進貨單
    purchaseOrderStore.createPurchaseOrder({
      supplier,
      items: allItems,
      totalAmount,
      expectedDeliveryDate: tomorrow.toISOString(),
      relatedOrders: procurementStore.selectedOrders
    })
  })

  // 更新所有選中訂單的狀態為備貨中
  procurementStore.selectedOrders.forEach(order => {
    orderStore.updateOrderStatus(order.id, 'preparing')
    // 檢查每個品項是否需要進貨
    order.products.forEach(product => {
      // 檢查此品項是否在採購清單中且有採購數量
      const purchaseItem = procurementStore.filteredSuggestions.find(item => 
        item.id === product.id && item.purchaseQty > 0
      )
      // 只有需要進貨的品項才設定為等待進貨
      if (purchaseItem) {
        product.stockStatus = 'pending'
      } else {
        // 不需要進貨的品項直接設定為已入倉
        product.stockStatus = 'stocked'
      }
    })
  })

  procurementStore.reset()
  activeSupplier.value = '' // 清除當前選中的供應商
  ElMessage.success('進貨單已生成，相關訂單已更新為備貨中')
}

// 修改確認採購建議的函數
const confirmProcurementSuggestions = () => {
  const hasItems = procurementStore.filteredSuggestions.some(item => {
    const suggestedQty = procurementStore.suggestedQuantity(item.id)
    return suggestedQty > 0 && item.purchaseQty > 0
  })
  
  if (!hasItems) {
    ElMessage.warning('請至少設定一項商品的採購數量')
    return
  }

  procurementStore.setCurrentStep(3)
}

// 修改返回上一步的處理
const handlePreviousStep = () => {
  if (currentStep.value === 3) {
    activeSupplier.value = '' // 清除當前選中的供應商
    procurementStore.setCurrentStep(2)
  } else if (currentStep.value === 2) {
    procurementStore.setCurrentStep(1)
  }
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
  height: 100%;
  display: flex;
  flex-direction: column;

  .page-header {
    padding: 8px;
    border-bottom: 1px solid var(--el-border-color-light);
    margin-bottom: 0;

    h2 {
      margin: 0;
      font-size: 18px;
    }
  }

  .main-content {
    display: grid;
    grid-template-columns: auto 350px;
    gap: 4px;
    padding: 4px;
    height: calc(100% - 40px);
  }

  .full-width {
    grid-column: 1 / -1;
  }

  .suggestion-list {
    grid-column: 1;
    :deep(.el-card__body) {
      padding: 8px;
    }
  }

  .order-details {
    grid-column: 2;
    width: 350px;
    :deep(.el-card__body) {
      padding: 8px;
    }
  }

  :deep(.el-card__header) {
    padding: 8px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;

    h3 {
      margin: 0;
      font-size: 16px;
    }
  }

  .product-tag {
    margin-right: 4px;
    margin-bottom: 2px;
  }

  .supplier-info {
    margin-bottom: 8px;
  }

  .supplier-summary {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
  }

  :deep(.el-table .cell) {
    padding: 4px 8px;
  }

  :deep(.el-descriptions__cell) {
    padding: 4px 8px;
  }

  :deep(.el-collapse-item__header) {
    padding: 4px 8px;
    font-size: 14px;
  }

  :deep(.el-collapse-item__content) {
    padding: 4px 8px;
  }
}
</style> 