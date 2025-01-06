<template>
  <div class="warehouse-out">
    <div class="page-header">
      <h2>出倉作業</h2>
    </div>

    <div class="main-content">
      <!-- 待出倉訂單列表 -->
      <el-card class="orders">
        <template #header>
          <div class="card-header">
            <h3>待出倉訂單</h3>
          </div>
        </template>

        <el-table :data="pendingOrders" style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="訂單編號" width="120" />
          <el-table-column prop="customer.name" label="客戶名稱" width="120" />
          <el-table-column prop="createdAt" label="建立時間" width="160">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
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
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" link @click="handlePicking(row)">
                揀貨
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 揀貨表單 -->
      <el-card class="picking-form" v-if="selectedOrder">
        <template #header>
          <div class="card-header">
            <h3>揀貨確認</h3>
            <div class="actions">
              <el-button @click="cancelPicking">取消</el-button>
              <el-button type="primary" @click="confirmPicking">確認出倉</el-button>
            </div>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="訂單編號">
            {{ selectedOrder.id }}
          </el-descriptions-item>
          <el-descriptions-item label="客戶名稱">
            {{ selectedOrder.customer.name }}
          </el-descriptions-item>
          <el-descriptions-item label="建立時間">
            {{ formatDate(selectedOrder.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="付款方式">
            {{ selectedOrder.payment.method === 'online' ? '線上付款' : '貨到付款' }}
          </el-descriptions-item>
        </el-descriptions>

        <el-table :data="selectedOrder.products" style="width: 100%; margin-top: 16px">
          <el-table-column prop="name" label="商品名稱" />
          <el-table-column prop="quantity" label="訂購數量" width="120" />
          <el-table-column label="實際出貨" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.pickedQty"
                :min="0"
                :max="row.quantity"
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useOrderStore } from '@/stores/modules/order'

const orderStore = useOrderStore()
const selectedOrder = ref(null)

// 獲取待出倉訂單
const pendingOrders = ref([
  {
    id: 'ORD-001',
    customer: {
      name: '王小明'
    },
    createdAt: '2024-01-20T10:30:00',
    payment: {
      method: 'online'
    },
    products: [
      {
        id: 'P001',
        name: '法國波爾多紅酒 2018',
        quantity: 2,
        pickedQty: 2,
        note: ''
      }
    ]
  }
])

// 處理揀貨
const handlePicking = (order) => {
  selectedOrder.value = {
    ...order,
    products: order.products.map(product => ({
      ...product,
      pickedQty: product.quantity,
      note: ''
    }))
  }
}

// 取消揀貨
const cancelPicking = () => {
  selectedOrder.value = null
}

// 確認出倉
const confirmPicking = () => {
  // TODO: 實作確認出倉邏輯
  ElMessage.success('出倉完成')
  selectedOrder.value = null
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.warehouse-out {
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

  .product-tag {
    margin-right: 4px;
    margin-bottom: 2px;
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