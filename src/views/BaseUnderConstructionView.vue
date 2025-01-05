<template>
  <div class="under-construction">
    <div class="page-header">
      <h2>{{ title }}</h2>
    </div>

    <el-card>
      <div class="construction-content">
        <el-icon class="construction-icon"><warning /></el-icon>
        <h3>功能開發中</h3>
        <p>此功能正在開發中，敬請期待...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Warning } from '@element-plus/icons-vue'

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.under-construction {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
    }
  }

  .construction-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
    text-align: center;

    .construction-icon {
      font-size: 48px;
      color: var(--el-color-warning);
      margin-bottom: 16px;
    }

    h3 {
      margin: 0 0 8px;
      font-size: 24px;
    }

    p {
      margin: 0;
      color: var(--el-text-color-secondary);
    }
  }
}
</style> 