# 創建基本的商品列表視圖
<template>
  <div class="product-list">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>商品列表</h2>
        </div>
      </template>
      
      <!-- 暫時顯示開發中提示 -->
      <el-empty description="商品列表功能開發中">
        <el-button type="primary" @click="$router.push('/order')">返回訂單列表</el-button>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup>
// 暫時不需要任何邏輯
</script>

<style lang="scss" scoped>
.product-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    margin: 0;
  }
}
</style> 