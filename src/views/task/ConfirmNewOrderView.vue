<template>
  <div class="confirm-new-order">
    <div class="page-header">
      <h2>確認新訂單</h2>
    </div>

    <div class="main-content">
      <!-- 左側：訂單列表 -->
      <div class="order-list">
        <el-card v-for="order in pendingOrders" 
          :key="order.id"
          :class="{ 'active': selectedOrder?.id === order.id }"
          @click="selectOrder(order)"
        >
          <div class="order-card-header">
            <span class="order-id">{{ order.id }}</span>
            <el-tag type="warning">待處理</el-tag>
          </div>
          
          <div class="order-info">
            <div class="customer-info">
              <p>{{ order.customer.name }}</p>
              <p>{{ order.customer.phone }}</p>
            </div>
            <div class="order-amount">
              NT$ {{ formatNumber(order.total) }}
            </div>
          </div>

          <div class="order-time">
            {{ formatDate(order.createdAt) }}
          </div>
        </el-card>
      </div>

      <!-- 右側：訂單詳情和溝通記錄 -->
      <div class="order-detail" v-if="selectedOrder">
        <el-card class="detail-section">
          <template #header>
            <div class="detail-header">
              <h3>訂單詳情</h3>
              <div class="actions">
                <el-button type="success" @click="showConfirmDialog">
                  確認訂單
                </el-button>
                <el-button type="danger" @click="showRejectDialog">
                  拒絕訂單
                </el-button>
              </div>
            </div>
          </template>

          <!-- 客戶資訊 -->
          <div class="customer-section">
            <h4>客戶資訊</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>姓名：</label>
                <span>{{ selectedOrder.customer.name }}</span>
              </div>
              <div class="info-item">
                <label>電話：</label>
                <span>{{ selectedOrder.customer.phone }}</span>
              </div>
              <div class="info-item">
                <label>地址：</label>
                <span>{{ selectedOrder.customer.address }}</span>
              </div>
            </div>
          </div>

          <!-- 商品清單 -->
          <div class="products-section">
            <h4>商品清單</h4>
            <el-table :data="selectedOrder.products" style="width: 100%">
              <el-table-column prop="name" label="商品名稱">
                <template #default="{ row }">
                  {{ row.name }}
                  <el-tag v-if="row.preorder" size="small" type="warning">預購</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="單價" width="120">
                <template #default="{ row }">
                  NT$ {{ formatNumber(row.price) }}
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="數量" width="100" />
              <el-table-column label="小計" width="120">
                <template #default="{ row }">
                  NT$ {{ formatNumber(row.price * row.quantity) }}
                </template>
              </el-table-column>
            </el-table>

            <div class="order-total">
              <span>訂單總計：</span>
              <span class="amount">NT$ {{ formatNumber(selectedOrder.total) }}</span>
            </div>
          </div>

          <!-- 備註 -->
          <div class="note-section" v-if="selectedOrder.note">
            <h4>訂單備註</h4>
            <p>{{ selectedOrder.note }}</p>
          </div>
        </el-card>

        <!-- 溝通記錄 -->
        <el-card class="communication-section">
          <template #header>
            <div class="communication-header">
              <h3>溝通記錄</h3>
              <el-button type="primary" @click="showAddNoteDialog">
                添加備註
              </el-button>
            </div>
          </template>

          <div class="communication-list">
            <div v-for="comm in communications" 
              :key="comm.id" 
              :class="['communication-item', comm.type]"
            >
              <div class="comm-header">
                <span class="comm-type">{{ getCommunicationType(comm.type) }}</span>
                <span class="comm-time">{{ formatDate(comm.createdAt) }}</span>
              </div>
              <div class="comm-content">{{ comm.content }}</div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 未選擇訂單時的提示 -->
      <div class="no-selection" v-else>
        <el-empty description="請選擇一個訂單" />
      </div>
    </div>

    <!-- 確認訂單對話框 -->
    <el-dialog
      v-model="confirmDialogVisible"
      title="確認訂單"
      width="500px"
    >
      <el-form ref="confirmForm" :model="confirmForm" label-width="100px">
        <el-form-item label="確認備註">
          <el-input
            v-model="confirmForm.note"
            type="textarea"
            rows="3"
            placeholder="請輸入確認備註（選填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmOrder">
            確認
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 拒絕訂單對話框 -->
    <el-dialog
      v-model="rejectDialogVisible"
      title="拒絕訂單"
      width="500px"
    >
      <el-form
        ref="rejectForm"
        :model="rejectForm"
        :rules="rejectRules"
        label-width="100px"
      >
        <el-form-item label="拒絕原因" prop="reason">
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
          <el-button type="danger" @click="handleRejectOrder">
            拒絕
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加備註對話框 -->
    <el-dialog
      v-model="addNoteDialogVisible"
      title="添加備註"
      width="500px"
    >
      <el-form
        ref="noteForm"
        :model="noteForm"
        :rules="noteRules"
        label-width="100px"
      >
        <el-form-item label="備註內容" prop="content">
          <el-input
            v-model="noteForm.content"
            type="textarea"
            rows="3"
            placeholder="請輸入備註內容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addNoteDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddNote">
            添加
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/modules/order'
import { ElMessage } from 'element-plus'

const orderStore = useOrderStore()

// 初始化 mock 訂單
orderStore.initializeMockOrders()

// 訂單相關
const pendingOrders = computed(() => orderStore.getPendingOrders)
const selectedOrder = ref(null)
const communications = computed(() => 
  selectedOrder.value 
    ? orderStore.getCommunications(selectedOrder.value.id)
    : []
)

// 對話框控制
const confirmDialogVisible = ref(false)
const rejectDialogVisible = ref(false)
const addNoteDialogVisible = ref(false)

// 表單數據
const confirmForm = ref({ note: '' })
const rejectForm = ref({ reason: '' })
const noteForm = ref({ content: '' })

// 表單驗證規則
const rejectRules = {
  reason: [
    { required: true, message: '請輸入拒絕原因', trigger: 'blur' }
  ]
}

const noteRules = {
  content: [
    { required: true, message: '請輸入備註內容', trigger: 'blur' }
  ]
}

// 選擇訂單
const selectOrder = (order) => {
  selectedOrder.value = order
}

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
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
}

// 格式化數字
const formatNumber = (num) => {
  return num.toLocaleString()
}

// 獲取溝通記錄類型標籤
const getCommunicationType = (type) => {
  const typeMap = {
    note: '客服備註',
    system: '系統記錄'
  }
  return typeMap[type] || type
}

// 顯示確認對話框
const showConfirmDialog = () => {
  if (!selectedOrder.value) return
  confirmForm.value.note = ''
  confirmDialogVisible.value = true
}

// 顯示拒絕對話框
const showRejectDialog = () => {
  if (!selectedOrder.value) return
  rejectForm.value.reason = ''
  rejectDialogVisible.value = true
}

// 顯示添加備註對話框
const showAddNoteDialog = () => {
  if (!selectedOrder.value) return
  noteForm.value.content = ''
  addNoteDialogVisible.value = true
}

// 處理確認訂單
const handleConfirmOrder = async () => {
  if (!selectedOrder.value) return
  
  const success = orderStore.confirmOrder(
    selectedOrder.value.id,
    confirmForm.value.note
  )
  
  if (success) {
    confirmDialogVisible.value = false
    selectedOrder.value = null
  }
}

// 處理拒絕訂單
const handleRejectOrder = async () => {
  if (!selectedOrder.value) return
  
  const success = orderStore.rejectOrder(
    selectedOrder.value.id,
    rejectForm.value.reason
  )
  
  if (success) {
    rejectDialogVisible.value = false
    selectedOrder.value = null
  }
}

// 處理添加備註
const handleAddNote = async () => {
  if (!selectedOrder.value) return
  
  const success = orderStore.addCommunication(
    selectedOrder.value.id,
    noteForm.value.content,
    'note'
  )
  
  if (success) {
    addNoteDialogVisible.value = false
    ElMessage.success('備註添加成功')
  }
}
</script>

<style lang="scss" scoped>
.confirm-new-order {
  .page-header {
    margin-bottom: 20px;
    h2 {
      margin: 0;
    }
  }

  .main-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 20px;
    height: calc(100vh - 120px);
  }

  .order-list {
    overflow-y: auto;
    padding-right: 4px;

    .el-card {
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateX(4px);
      }

      &.active {
        border-color: var(--el-color-primary);
      }
    }
  }

  .order-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .order-id {
      font-weight: bold;
    }
  }

  .order-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .customer-info {
      p {
        margin: 4px 0;
      }
    }

    .order-amount {
      font-weight: bold;
      color: var(--el-color-danger);
    }
  }

  .order-time {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  .order-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    padding-right: 4px;

    .detail-header {
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
  }

  .customer-section,
  .products-section,
  .note-section {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }
  }

  .info-grid {
    display: grid;
    gap: 12px;

    .info-item {
      label {
        color: var(--el-text-color-secondary);
        margin-right: 8px;
      }
    }
  }

  .order-total {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-lighter);

    .amount {
      font-size: 18px;
      font-weight: bold;
      color: var(--el-color-danger);
      margin-left: 8px;
    }
  }

  .communication-section {
    flex: 1;
    min-height: 300px;
    display: flex;
    flex-direction: column;

    .communication-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
      }
    }

    .communication-list {
      flex: 1;
      overflow-y: auto;
    }
  }

  .communication-item {
    margin-bottom: 16px;
    padding: 12px;
    border-radius: 4px;
    background: var(--el-bg-color-page);

    &.note {
      background: var(--el-color-primary-light-9);
    }

    &.system {
      background: var(--el-color-info-light-9);
    }

    .comm-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    .comm-content {
      white-space: pre-wrap;
    }
  }

  .no-selection {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: var(--el-bg-color-page);
    border-radius: 4px;
  }
}
</style> 