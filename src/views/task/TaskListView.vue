<template>
  <div class="task-list">
    <div class="page-header">
      <h2>任務列表</h2>
      <el-button type="primary" @click="router.push({ name: 'order-create' })">
        確認新訂單
      </el-button>
    </div>

    <!-- 任務列表 -->
    <el-table :data="pendingOrders" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="訂單編號" width="120" />
      <el-table-column prop="created_at" label="建立時間" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="customer.name" label="客戶姓名" width="120" />
      <el-table-column label="預購商品" width="100">
        <template #default="{ row }">
          <el-tag v-if="hasPreorderItems(row)" type="warning">是</el-tag>
          <el-tag v-else type="success">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="訂單金額" width="120">
        <template #default="{ row }">
          NT$ {{ formatNumber(row.total) }}
        </template>
      </el-table-column>
      <el-table-column prop="payment.method" label="付款方式" width="120">
        <template #default="{ row }">
          {{ getPaymentMethodLabel(row.payment.method) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button-group>
            <el-button 
              type="success" 
              :loading="updating === row.id"
              @click="confirmOrder(row)"
            >
              確認訂單
            </el-button>
            <el-button 
              type="danger" 
              :loading="updating === row.id"
              @click="rejectOrder(row)"
            >
              拒絕訂單
            </el-button>
          </el-button-group>
          <el-button type="primary" link @click="viewOrderDetail(row.id)" class="ml-2">
            查看詳情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 確認對話框 -->
    <el-dialog
      v-model="confirmDialogVisible"
      title="確認訂單"
      width="500px"
    >
      <el-form :model="confirmForm" label-width="100px">
        <el-form-item label="預計出貨日">
          <el-date-picker
            v-model="confirmForm.estimatedShipDate"
            type="date"
            placeholder="選擇日期"
            :disabled-date="disabledDate"
            class="w-100"
          />
        </el-form-item>
        <el-form-item label="備註">
          <el-input
            v-model="confirmForm.note"
            type="textarea"
            rows="3"
            placeholder="請輸入備註（選填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmOrder" :loading="updating">
            確認
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 拒絕對話框 -->
    <el-dialog
      v-model="rejectDialogVisible"
      title="拒絕訂單"
      width="500px"
    >
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="拒絕原因" required>
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            rows="3"
            placeholder="請輸入拒絕原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rejectDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleRejectOrder" :loading="updating">
            拒絕
          </el-button>
        </span>
      </template>
    </el-dialog>
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
const loading = ref(false)
const updating = ref(null)

// 只顯示待處理的訂單
const pendingOrders = computed(() => 
  orderStore.getAllOrders.filter(order => order.status === 'pending')
)

// 確認對話框
const confirmDialogVisible = ref(false)
const confirmForm = ref({
  orderId: null,
  estimatedShipDate: null,
  note: ''
})

// 拒絕對話框
const rejectDialogVisible = ref(false)
const rejectForm = ref({
  orderId: null,
  reason: ''
})

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

// 檢查是否有預購商品
const hasPreorderItems = (order) => {
  return order.products.some(product => product.preorder)
}

// 查看訂單詳情
const viewOrderDetail = (orderId) => {
  router.push({ name: 'order-detail', params: { id: orderId } })
}

// 確認訂單
const confirmOrder = (order) => {
  confirmForm.value = {
    orderId: order.id,
    estimatedShipDate: null,
    note: ''
  }
  confirmDialogVisible.value = true
}

// 處理確認訂單
const handleConfirmOrder = async () => {
  if (!confirmForm.value.estimatedShipDate) {
    ElMessage.warning('請選擇預計出貨日')
    return
  }

  try {
    updating.value = confirmForm.value.orderId
    await orderStore.updateOrderStatus(confirmForm.value.orderId, 'processing', {
      estimatedShipDate: confirmForm.value.estimatedShipDate,
      note: confirmForm.value.note
    })
    confirmDialogVisible.value = false
    ElMessage.success('訂單已確認')
  } finally {
    updating.value = null
  }
}

// 拒絕訂單
const rejectOrder = (order) => {
  rejectForm.value = {
    orderId: order.id,
    reason: ''
  }
  rejectDialogVisible.value = true
}

// 處理拒絕訂單
const handleRejectOrder = async () => {
  if (!rejectForm.value.reason) {
    ElMessage.warning('請輸入拒絕原因')
    return
  }

  try {
    updating.value = rejectForm.value.orderId
    await orderStore.updateOrderStatus(rejectForm.value.orderId, 'cancelled', {
      reason: rejectForm.value.reason
    })
    rejectDialogVisible.value = false
    ElMessage.success('訂單已拒絕')
  } finally {
    updating.value = null
  }
}

// 禁用的日期（今天之前的日期）
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 8.64e7 是一天的毫秒數
}

// 初始化
onMounted(() => {
  loading.value = true
  try {
    // 不需要做任何事情，因為數據已經在 store 中了
    loading.value = false
  } catch (error) {
    console.error('獲取訂單列表失敗：', error)
    ElMessage.error('獲取訂單列表失敗')
    loading.value = false
  }
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

  .ml-2 {
    margin-left: 8px;
  }

  .w-100 {
    width: 100%;
  }
}
</style> 