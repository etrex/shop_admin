<template>
  <div class="task-list">
    <div class="page-header">
      <h2>任務列表</h2>
    </div>

    <!-- 任務列表 -->
    <el-table :data="orders" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="訂單編號" width="120" />
      <el-table-column prop="created_at" label="建立時間" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="customer.name" label="客戶姓名" width="120" />
      <el-table-column prop="total" label="訂單金額" width="120">
        <template #default="{ row }">
          NT$ {{ formatNumber(row.total) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="訂單狀態" width="120">
        <template #default="{ row }">
          <el-select 
            v-model="row.status" 
            @change="handleStatusChange(row)"
            :disabled="updating === row.id"
          >
            <el-option
              v-for="status in availableStatuses"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="payment.method" label="付款方式" width="120">
        <template #default="{ row }">
          {{ getPaymentMethodLabel(row.payment.method) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useOrderStore } from '@/stores/modules/order'

const router = useRouter()
const orderStore = useOrderStore()

// 列表數據
const orders = computed(() => orderStore.getAllOrders)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => orders.value.length)
const updating = ref(null)

// 可用的訂單狀態
const availableStatuses = [
  { value: 'pending', label: '待處理' },
  { value: 'processing', label: '處理中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

// 格式化數字
const formatNumber = (num) => {
  return num.toLocaleString()
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

// 處理狀態變更
const handleStatusChange = async (order) => {
  try {
    updating.value = order.id
    await orderStore.updateOrderStatus(order.id, order.status)
  } finally {
    updating.value = null
  }
}

// 處理頁碼變更
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchOrders()
}

// 處理每頁筆數變更
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchOrders()
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
.task-list {
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