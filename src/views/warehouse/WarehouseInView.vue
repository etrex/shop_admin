<template>
  <div class="warehouse-in">
    <div class="page-header">
      <h2>入倉作業</h2>
    </div>

    <div class="main-content">
      <!-- 待入倉進貨單列表 -->
      <el-card class="purchase-orders">
        <template #header>
          <div class="card-header">
            <h3>待入倉進貨單</h3>
          </div>
        </template>

        <el-table :data="pendingPurchaseOrders" style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="進貨單號" width="120" />
          <el-table-column prop="supplier.name" label="供應商" width="120" />
          <el-table-column prop="expectedDeliveryDate" label="預計到貨" width="160">
            <template #default="{ row }">
              {{ formatDate(row.expectedDeliveryDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="總金額" width="120">
            <template #default="{ row }">
              NT$ {{ formatNumber(row.totalAmount) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleReceive(row)">
                收貨
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 入倉表單 -->
      <el-card class="receiving-form" v-if="selectedOrder">
        <template #header>
          <div class="card-header">
            <h3>收貨確認</h3>
            <div class="actions">
              <el-button @click="cancelReceiving">取消</el-button>
              <el-button type="primary" @click="confirmReceiving">確認入倉</el-button>
            </div>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="進貨單號">
            {{ selectedOrder.id }}
          </el-descriptions-item>
          <el-descriptions-item label="供應商">
            {{ selectedOrder.supplier.name }}
          </el-descriptions-item>
          <el-descriptions-item label="預計到貨">
            {{ formatDate(selectedOrder.expectedDeliveryDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="總金額">
            NT$ {{ formatNumber(selectedOrder.totalAmount) }}
          </el-descriptions-item>
        </el-descriptions>

        <el-table :data="selectedOrder.items" style="width: 100%; margin-top: 16px">
          <el-table-column prop="name" label="商品名稱" />
          <el-table-column prop="purchaseQty" label="採購數量" width="120" />
          <el-table-column label="實收數量" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.receivedQty"
                :min="0"
                :max="row.purchaseQty"
                size="small"
              />
            </template>
          </el-table-column>
          <el-table-column label="備註" width="200">
            <template #default="{ row }">
              <el-input
                v-model="row.note"
                placeholder="輸入備註"
                size="small"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { usePurchaseOrderStore } from '@/stores/modules/purchaseOrder'

const purchaseOrderStore = usePurchaseOrderStore()
const selectedOrder = ref(null)

// 獲取待入倉進貨單
const pendingPurchaseOrders = computed(() => {
  return purchaseOrderStore.getPendingWarehouseInOrders
})

// 處理收貨
const handleReceive = (order) => {
  selectedOrder.value = {
    ...order,
    items: order.items.map(item => ({
      ...item,
      receivedQty: item.purchaseQty,
      note: ''
    }))
  }
}

// 取消收貨
const cancelReceiving = () => {
  selectedOrder.value = null
}

// 確認入倉
const confirmReceiving = () => {
  if (!selectedOrder.value) return

  // 準備入倉數據
  const receivingData = {
    receivedAt: new Date().toISOString(),
    items: selectedOrder.value.items.map(item => ({
      id: item.id,
      receivedQty: item.receivedQty,
      note: item.note
    }))
  }

  // 確認入倉
  if (purchaseOrderStore.confirmWarehouseIn(selectedOrder.value.id, receivingData)) {
    ElMessage.success('入倉完成')
    selectedOrder.value = null
  } else {
    ElMessage.error('入倉失敗')
  }
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

// 在組件掛載時初始化 mock 數據
onMounted(() => {
  if (pendingPurchaseOrders.value.length === 0) {
    purchaseOrderStore.initializeMockPurchaseOrders()
  }
})
</script>

<style lang="scss" scoped>
.warehouse-in {
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
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 8px;
    height: calc(100% - 40px);
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

  :deep(.el-card__body) {
    padding: 8px;
  }

  :deep(.el-card__header) {
    padding: 8px;
  }

  :deep(.el-descriptions__cell) {
    padding: 4px 8px;
  }
}
</style> 