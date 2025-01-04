<template>
  <div class="footer">
    <div class="footer-left">
      <span class="version">Version 1.0.0</span>
    </div>
    <div class="footer-right">
      <el-link type="primary" href="#" class="mr-4">使用說明</el-link>
      <el-link type="primary" href="#" class="mr-4">API 文件</el-link>
      <el-link type="primary" href="#">聯絡支援</el-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  background-color: $background-white;
  border-top: 1px solid $border-light;
  color: $text-secondary;
  font-size: 14px;
}

.version {
  color: $text-secondary;
}
</style> 