<template>
  <div class="warehouse-record">
    <div class="page-header">
      <h2>倉庫出入庫紀錄</h2>
    </div>

    <div class="main-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <div class="filters">
              <el-radio-group v-model="recordType" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="in">入庫</el-radio-button>
                <el-radio-button label="out">出庫</el-radio-button>
              </el-radio-group>

              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                size="small"
                style="margin-left: 16px;"
              />
            </div>
          </div>
        </template>

        <el-table :data="filteredRecords" style="width: 100%">
          <el-table-column prop="id" label="紀錄編號" width="120" />
          <el-table-column label="類型" width="100">
            <template #default="{ row }">
              <el-tag :type="row.type === 'in' ? 'success' : 'warning'">
                {{ row.type === 'in' ? '入庫' : '出庫' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="時間" width="160">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="來源">
            <template #default="{ row }">
              <div>
                {{ row.sourceType === 'purchase_order' ? '進貨單' : '訂單' }}：{{ row.sourceId }}
              </div>
              <div class="source-info">
                {{ row.type === 'in' ? row.supplier?.name : row.customer?.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品">
            <template #default="{ row }">
              <el-tag 
                v-for="item in row.items" 
                :key="item.id"
                size="small"
                :type="row.type === 'in' ? 'success' : 'warning'"
                class="product-tag"
              >
                {{ item.name }} x {{ item.quantity }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" link @click="showDetail(row)">
                詳情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 詳情對話框 -->
    <el-dialog
      v-model="detailVisible"
      :title="selectedRecord?.type === 'in' ? '入庫詳情' : '出庫詳情'"
      width="600px"
    >
      <template v-if="selectedRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="紀錄編號">
            {{ selectedRecord.id }}
          </el-descriptions-item>
          <el-descriptions-item label="時間">
            {{ formatDate(selectedRecord.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="來源類型">
            {{ selectedRecord.sourceType === 'purchase_order' ? '進貨單' : '訂單' }}
          </el-descriptions-item>
          <el-descriptions-item label="來源編號">
            {{ selectedRecord.sourceId }}
          </el-descriptions-item>
          <el-descriptions-item :label="selectedRecord.type === 'in' ? '供應商' : '客戶'">
            {{ selectedRecord.type === 'in' ? selectedRecord.supplier?.name : selectedRecord.customer?.name }}
          </el-descriptions-item>
        </el-descriptions>

        <el-table :data="selectedRecord.items" style="width: 100%; margin-top: 16px">
          <el-table-column prop="name" label="商品名稱" />
          <el-table-column prop="quantity" label="數量" width="120" />
          <el-table-column prop="note" label="備註" />
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWarehouseStore } from '@/stores/modules/warehouse'

const warehouseStore = useWarehouseStore()
const recordType = ref('all')
const dateRange = ref(null)
const detailVisible = ref(false)
const selectedRecord = ref(null)

// 根據篩選條件獲取紀錄
const filteredRecords = computed(() => {
  let records = warehouseStore.getAllRecords

  // 根據類型篩選
  if (recordType.value !== 'all') {
    records = records.filter(record => record.type === recordType.value)
  }

  // 根據日期範圍篩選
  if (dateRange.value) {
    const [startDate, endDate] = dateRange.value
    records = records.filter(record => {
      const recordDate = new Date(record.createdAt)
      return recordDate >= startDate && recordDate <= endDate
    })
  }

  return records
})

// 顯示詳情
const showDetail = (record) => {
  selectedRecord.value = record
  detailVisible.value = true
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 在組件掛載時初始化 mock 數據
onMounted(() => {
  if (warehouseStore.getAllRecords.length === 0) {
    warehouseStore.initializeMockData()
  }
})
</script>

<style lang="scss" scoped>
.warehouse-record {
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
    padding: 8px;
    height: calc(100% - 40px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
  }

  .product-tag {
    margin-right: 4px;
    margin-bottom: 2px;
  }

  .source-info {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-top: 4px;
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