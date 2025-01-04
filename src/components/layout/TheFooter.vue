<template>
  <div class="footer">
    <div class="footer-left">
      <span class="version">版本 {{ version }}</span>
    </div>
    
    <div class="footer-right">
      <el-link type="primary" href="#" class="mr-4">使用手冊</el-link>
      <el-link type="primary" href="#" class="mr-4">技術支援</el-link>
      <el-link type="primary" href="#" class="mr-4">問題回報</el-link>
      <el-link type="primary" href="#">聯絡我們</el-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const version = ref('1.0.0')
</script>

<style>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  background-color: var(--background-white);
  border-top: 1px solid var(--border-light);
}

.version {
  font-size: 14px;
  color: var(--text-secondary);
}

.footer-right {
  display: flex;
  align-items: center;
}
</style> 