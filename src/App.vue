<template>
  <router-view />
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

useTheme()
</script>

<style>
:root {
  --primary-color: #409eff;
  --text-regular: #606266;
  --text-secondary: #909399;
  --border-light: #e4e7ed;
  --background-white: #ffffff;
  --background-base: #f5f7fa;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  height: 100%;
}

/* Global utility classes */
.mb-4 {
  margin-bottom: 16px;
}

.mr-4 {
  margin-right: 16px;
}

.ml-2 {
  margin-left: 8px;
}
</style> 