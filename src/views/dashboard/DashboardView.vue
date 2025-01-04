<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- Quick Stats -->
      <el-col :span="6" v-for="stat in quickStats" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="stat-header">
              <span>{{ stat.title }}</span>
              <el-icon :class="stat.trend">
                <component :is="stat.trend === 'up' ? ArrowUp : ArrowDown" />
              </el-icon>
            </div>
          </template>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-change" :class="stat.trend">
              {{ stat.change }}%
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <!-- Task Summary -->
      <el-col :span="8">
        <el-card class="task-card">
          <template #header>
            <div class="card-header">
              <span>任務摘要</span>
              <el-button type="primary" text>查看全部</el-button>
            </div>
          </template>
          <el-progress
            v-for="task in taskSummary"
            :key="task.name"
            :percentage="task.percentage"
            :color="task.color"
            :status="task.status"
            class="task-progress"
          >
            <template #default="{ percentage }">
              <span class="task-label">{{ task.name }}</span>
              <span class="task-percentage">{{ percentage }}%</span>
            </template>
          </el-progress>
        </el-card>
      </el-col>

      <!-- Recent Activities -->
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近活動</span>
              <el-button type="primary" text>查看全部</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="activity in recentActivities"
              :key="activity.id"
              :timestamp="activity.time"
              :type="activity.type"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const quickStats = ref([
  {
    title: '今日訂單',
    value: '125',
    change: '15',
    trend: 'up'
  },
  {
    title: '待處理退貨',
    value: '8',
    change: '5',
    trend: 'down'
  },
  {
    title: '低庫存商品',
    value: '12',
    change: '20',
    trend: 'up'
  },
  {
    title: '本月營業額',
    value: '¥89,521',
    change: '12',
    trend: 'up'
  }
])

const taskSummary = ref([
  {
    name: '訂單處理',
    percentage: 80,
    color: '#67C23A',
    status: 'success'
  },
  {
    name: '庫存盤點',
    percentage: 45,
    color: '#E6A23C',
    status: 'warning'
  },
  {
    name: '採購審核',
    percentage: 90,
    color: '#409EFF',
    status: 'success'
  }
])

const recentActivities = ref([
  {
    id: 1,
    content: '李小明 處理了退貨申請 #12345',
    time: '10 分鐘前',
    type: 'primary'
  },
  {
    id: 2,
    content: '系統自動生成了庫存警告',
    time: '30 分鐘前',
    type: 'warning'
  },
  {
    id: 3,
    content: '張經理 批准了採購單 #98765',
    time: '1 小時前',
    type: 'success'
  },
  {
    id: 4,
    content: '系統完成了每日數據備份',
    time: '2 小時前',
    type: 'info'
  }
])
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-content {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: $text-primary;
  }

  .stat-change {
    font-size: 14px;
    
    &.up {
      color: $success-color;
    }
    
    &.down {
      color: $danger-color;
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-progress {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.task-label {
  margin-right: 12px;
  color: $text-regular;
}

.task-percentage {
  color: $text-secondary;
}

:deep(.el-timeline-item__node) {
  &.el-timeline-item__node--primary {
    background-color: $primary-color;
  }
  
  &.el-timeline-item__node--success {
    background-color: $success-color;
  }
  
  &.el-timeline-item__node--warning {
    background-color: $warning-color;
  }
  
  &.el-timeline-item__node--info {
    background-color: $info-color;
  }
}
</style> 