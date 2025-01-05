<template>
  <div class="order-list">
    <div class="page-header">
      <h2>我的訂單</h2>
      <el-button type="primary" @click="router.push({ name: 'order-create' })">
        建立新訂單
      </el-button>
    </div>

    <!-- 訂單列表 -->
    <el-table :data="orders" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="訂單編號" width="120" />
      <el-table-column label="建立時間" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="total" label="訂單金額" width="120">
        <template #default="{ row }">
          NT$ {{ formatNumber(row.total) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="訂單狀態" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="payment.method" label="付款方式" width="120">
        <template #default="{ row }">
          {{ getPaymentMethodLabel(row.payment.method) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewOrderDetail(row.id)">
            查看詳情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { useOrderStore } from '@/stores/modules/order'

const router = useRouter()
const userStore = useUserStore()
const orderStore = useOrderStore()

// 列表數據
const orders = computed(() => {
  const allOrders = orderStore.getAllOrders
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allOrders.slice(start, end)
})
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => orderStore.getAllOrders.length)

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Invalid Date'
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 格式化數字
const formatNumber = (num) => {
  return num.toLocaleString()
}

// 獲取狀態標籤
const getStatusLabel = (status) => {
  const statusMap = {
    pending: '待處理',
    confirmed: '已確認',
    processing: '處理中',
    shipped: '已出貨',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 獲取狀態類型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'primary',
    shipped: 'success',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 獲取付款方式標籤
const getPaymentMethodLabel = (method) => {
  const methodMap = {
    online: '線上付款',
    cod: '貨到付款'
  }
  return methodMap[method] || method
}

// 查看訂單詳情
const viewOrderDetail = (orderId) => {
  router.push({ name: 'order-detail', params: { id: orderId } })
}

// 處理頁碼變更
const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 處理每頁筆數變更
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

// 獲取訂單列表
const fetchOrders = async () => {
  loading.value = true
  try {
    // 不需要做任何事情，因為數據已經在 store 中了
    await new Promise(resolve => setTimeout(resolve, 100))
  } catch (error) {
    console.error('獲取訂單列表失敗：', error)
    ElMessage.error('獲取訂單列表失敗')
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchOrders()
})
</script>

<style lang="scss" scoped>
.order-list {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
    }
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style> 