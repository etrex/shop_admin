<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useOrderStore } from '@/stores/modules/order'
import { usePurchaseOrderStore } from '@/stores/modules/purchaseOrder'

const orderStore = useOrderStore()
const purchaseOrderStore = usePurchaseOrderStore()

onMounted(() => {
  // 初始化 mock 訂單
  orderStore.initializeMockOrders()
  // 初始化 mock 進貨單
  purchaseOrderStore.initializeMockPurchaseOrders()
})
</script>

<style>
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
  --text-primary: #303133;
  --text-regular: #606266;
  --text-secondary: #909399;
  --border-base: #dcdfe6;
  --border-light: #e4e7ed;
  --background-base: #f5f7fa;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-regular);
}

#app {
  height: 100vh;
}
</style> 