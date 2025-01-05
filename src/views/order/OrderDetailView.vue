<template>
  <div class="order-detail">
    <div class="page-header">
      <h2>訂單詳情</h2>
      <el-button @click="router.back()">返回</el-button>
    </div>

    <div v-loading="loading">
      <!-- 訂單基本資訊 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>訂單資訊</span>
            <el-tag :type="getStatusType(order?.status)">
              {{ getStatusLabel(order?.status) }}
            </el-tag>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="訂單編號">{{ order?.id }}</el-descriptions-item>
          <el-descriptions-item label="建立時間">{{ formatDate(order?.created_at) }}</el-descriptions-item>
          <el-descriptions-item label="付款方式">{{ getPaymentMethodLabel(order?.payment?.method) }}</el-descriptions-item>
          <el-descriptions-item label="訂單金額">NT$ {{ formatNumber(order?.total) }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 客戶資訊 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>客戶資訊</span>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ order?.customer?.name }}</el-descriptions-item>
          <el-descriptions-item label="電話">{{ order?.customer?.phone }}</el-descriptions-item>
          <el-descriptions-item label="地址" :span="2">{{ order?.customer?.address }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 商品清單 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>商品清單</span>
          </div>
        </template>

        <el-table :data="order?.products || []" style="width: 100%">
          <el-table-column prop="id" label="商品編號" width="120" />
          <el-table-column label="商品名稱">
            <template #default="{ row }">
              {{ getProductName(row.id) }}
              <el-tag v-if="row.preorder" size="small" type="warning" class="ml-2">預購</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="單價" width="120">
            <template #default="{ row }">
              NT$ {{ formatNumber(row.price) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="數量" width="120" />
          <el-table-column prop="subtotal" label="小計" width="120">
            <template #default="{ row }">
              NT$ {{ formatNumber(row.subtotal) }}
            </template>
          </el-table-column>
        </el-table>

        <div class="order-total">
          <span class="label">訂單總計：</span>
          <span class="amount">NT$ {{ formatNumber(order?.total) }}</span>
        </div>
      </el-card>

      <!-- 備註 -->
      <el-card v-if="order?.note">
        <template #header>
          <div class="card-header">
            <span>備註</span>
          </div>
        </template>

        <p class="note">{{ order.note }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useOrderStore } from '@/stores/modules/order'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const loading = ref(false)

// 取得訂單資料
const order = computed(() => orderStore.getOrderById(route.params.id))

// 取得商品名稱
const getProductName = (productId) => {
  const products = {
    1: '法國波爾多紅酒 2018',
    2: '意大利基安蒂紅酒 2019',
    3: '西班牙里奧哈紅酒 2017',
    4: '法國勃艮第白酒 2020',
    5: '意大利白葡萄酒 2021',
    6: '德國雷司令白酒 2020',
    7: '獺祭 純米大吟釀 45',
    8: '久保田 千寿',
    9: '出羽桜 純米大吟釀',
    10: '八海山 特別本醸造'
  }
  return products[productId] || '未知商品'
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// 格式化數字
const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString()
}

// 獲取狀態標籤
const getStatusLabel = (status) => {
  const statusMap = {
    pending: '待處理',
    processing: '處理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 獲取狀態類型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'info'
  }
  return typeMap[status] || 'default'
}

// 獲取付款方式標籤
const getPaymentMethodLabel = (method) => {
  const methodMap = {
    online: '線上付款',
    cod: '貨到付款'
  }
  return methodMap[method] || method
}

// 初始化
onMounted(() => {
  if (!order.value) {
    ElMessage.error('找不到訂單')
    router.push({ name: 'order-list' })
    return
  }
})
</script>

<style lang="scss" scoped>
.order-detail {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-total {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--border-light);

    .label {
      font-size: 16px;
      margin-right: 12px;
    }

    .amount {
      font-size: 20px;
      font-weight: bold;
      color: var(--primary-color);
    }
  }

  .note {
    margin: 0;
    white-space: pre-wrap;
  }

  .mb-4 {
    margin-bottom: 16px;
  }

  .mt-4 {
    margin-top: 16px;
  }

  .w-100 {
    width: 100%;
  }

  .ml-2 {
    margin-left: 8px;
  }
}
</style> 