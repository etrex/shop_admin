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
        
        <el-container class="content-wrapper">
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

          <el-footer height="50px">
            <the-footer />
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheSidebar from '@/components/layout/TheSidebar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { layout, backgroundColors } from '@/assets/styles/variables'

const route = useRoute()
const sidebarWidth = ref('240px')

// 設置 CSS 變數
onMounted(() => {
  document.documentElement.style.setProperty('--header-height', layout.headerHeight)
  document.documentElement.style.setProperty('--footer-height', layout.footerHeight)
  document.documentElement.style.setProperty('--background-base', backgroundColors.base)
})

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
    const name = path.charAt(0).toUpperCase() + path.slice(1)
    items.push({
      name: name.replace(/-/g, ' '),
      path: currentPath
    })
  })
  
  return items
})
</script>

<style>
.app-container {
  min-height: 100vh;
}

.main-container {
  min-height: calc(100vh - var(--header-height));
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--header-height));
}

.content-container {
  flex: 1;
  padding: 20px;
  background-color: var(--background-base);
  overflow-y: auto;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>