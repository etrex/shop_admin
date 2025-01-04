<template>
  <div class="app-container">
    <el-container>
      <el-header height="60px">
        <the-header />
      </el-header>
      
      <el-container class="main-container">
        <el-aside :width="sidebarWidth">
          <the-sidebar />
        </el-aside>
        
        <el-main class="content-container">
          <el-breadcrumb class="mb-4">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>

      <el-footer height="50px">
        <the-footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheSidebar from '@/components/layout/TheSidebar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

const route = useRoute()
const sidebarWidth = ref('240px')

// Generate breadcrumbs based on current route
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  const items = []
  let currentPath = ''
  
  // Add home
  items.push({
    name: '首頁',
    path: '/'
  })
  
  // Add other levels
  paths.forEach(path => {
    currentPath += `/${path}`
    items.push({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      path: currentPath
    })
  })
  
  return items
})
</script>

<style lang="scss" scoped>
.app-container {
  min-height: 100vh;
}

.main-container {
  min-height: calc(100vh - #{$header-height} - 50px);
}

.content-container {
  padding: 20px;
  background-color: $background-base;
}

// Transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>