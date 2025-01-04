# Technical Specifications 技術規格說明

## Technology Stack 技術堆疊

### Frontend Framework
- **Vue 3**
  - 使用 Composition API 提供更好的程式碼組織和重用
  - 採用 Single File Components (SFC) 架構
  - `<script setup>` 語法糖，簡化組件撰寫

### State Management
- **Pinia**
  - 集中管理應用狀態
  - 使用 Composition API 風格的狀態管理
  - 純記憶體狀態管理，不做持久化
  - 內建 devtools 支援，方便除錯

### UI Framework
- **Element Plus**
  - 完整的企業級UI元件庫
  - 原生支援 Vue 3
  - 支援主題客製化
  - 內建中文支援
  - 完整的表單元件和資料展示元件

### Build Tools
- **Vite**
  - 原生支援 Vue 3
  - 快速的開發伺服器
  - 優化的建置流程
  - 模組熱更新

### Testing
- **Vitest** + **Vue Test Utils**
  - 單元測試
  - 元件測試
  - 整合測試

## Page Structure 頁面結構

### 1. Layout 布局
- **Global Layout 全域布局**
  - Top Bar 頂部欄 (`<el-header>`)
    - Role Switcher 角色切換器 (`<el-select>`)
    - User Info 使用者資訊 (`<el-dropdown>`)
    - Notifications 通知 (`<el-badge>`)
  - Side Menu 側邊選單 (`<el-menu>`)
    - Task List 任務列表
    - Quick Links 快速連結
  - Main Content Area 主要內容區 (`<el-main>`)
    - Breadcrumb 麵包屑 (`<el-breadcrumb>`)
    - Content 內容 (`<router-view>`)
  - Footer 頁尾 (`<el-footer>`)
    - System Version 系統版本
    - Support Links 支援連結

### 2. Pages 頁面

#### Dashboard 儀表板
- **Components 元件**
  - Task Summary Card 任務摘要卡片 (`<el-card>`)
    - Today's Tasks 今日任務
    - Pending Tasks 待處理任務
    - Completed Tasks 已完成任務
  - Quick Action Buttons 快速操作按鈕 (`<el-button-group>`)
    - New Order 新增訂單
    - Stock Check 庫存查詢
    - Procurement 採購作業
  - Status Overview 狀態總覽 (`<el-row>` + `<el-col>`)
    - Low Stock Alerts 低庫存警告 (`<el-alert>`)
    - Pending Orders 待處理訂單
    - Today's Deliveries 今日出貨
  - Performance Metrics 績效指標 (`<el-statistic>`)
    - Task Completion Rate 任務完成率
    - Order Processing Time 訂單處理時間
    - Stock Turnover Rate 庫存周轉率

#### Order Management 訂單管理
- **Components 元件**
  - Order List Table 訂單列表表格 (`<el-table>`)
    - Columns 欄位
      - Order ID 訂單編號
      - Customer 客戶
      - Status 狀態 (`<el-tag>`)
      - Payment 付款
      - Actions 操作 (`<el-button>`)
    - Filters 篩選器
      - Date Range 日期範圍 (`<el-date-picker>`)
      - Status 狀態 (`<el-select>`)
      - Payment Method 付款方式 (`<el-select>`)
  - Order Detail Drawer 訂單詳情抽屜 (`<el-drawer>`)
    - Order Info 訂單資訊
    - Items List 商品列表 (`<el-table>`)
    - Status Timeline 狀態時間軸 (`<el-timeline>`)
    - Action Buttons 操作按鈕 (`<el-button-group>`)
  - Batch Operation Bar 批次操作欄 (`<el-button-group>`)
    - Bulk Approve 批次核准
    - Bulk Process 批次處理
    - Export 匯出

#### Inventory Management 庫存管理
- **Components 元件**
  - Stock Overview Grid 庫存總覽網格 (`<el-row>` + `<el-col>`)
    - Stock Level Cards 庫存水平卡片 (`<el-card>`)
    - Warehouse Distribution 倉庫分布
    - Alert Indicators 警示指標 (`<el-alert>`)
  - Stock Movement Table 庫存異動表格 (`<el-table>`)
    - Transaction History 交易歷史
    - Filter Controls 篩選控制 (`<el-form>`)
    - Export Options 匯出選項 (`<el-dropdown>`)
  - Stock Transfer Form 庫存調撥表單 (`<el-form>`)
    - Source/Target Selection 來源/目標選擇 (`<el-select>`)
    - Quantity Input 數量輸入 (`<el-input-number>`)
    - Confirmation Dialog 確認對話框 (`<el-dialog>`)

#### Procurement Management 採購管理
- **Components 元件**
  - Purchase Order Creator 採購單建立器 (`<el-form>`)
    - Supplier Selector 供應商選擇 (`<el-select>`)
    - Item Selection Grid 品項選擇網格 (`<el-table>`)
    - Box Unit Calculator 箱數計算器 (`<el-input-number>`)
    - Cost Summary 成本摘要 (`<el-descriptions>`)
  - Order Status Board 訂單狀態看板 (`<el-tabs>`)
    - Pending Orders 待處理訂單
    - In Transit 運送中
    - Received 已收貨
  - Supplier Performance Dashboard 供應商績效儀表板
    - Delivery Time 送貨時間 (`<el-progress>`)
    - Order Fulfillment 訂單履行
    - Quality Metrics 品質指標

## Interactive Behaviors 互動行為

### 1. Role Switching 角色切換
- **Trigger**: Click on Role Switcher in Top Bar
- **Action**:
  1. Display role selection modal (`<el-dialog>`)
  2. Show current permissions (`<el-descriptions>`)
  3. Preview new role's dashboard
- **Result**:
  - Update UI based on role permissions
  - Refresh task list
  - Update available actions

### 2. Task Management 任務管理
- **Task List Interactions 任務列表互動**
  - Click: 展開任務詳情 (`v-show`)
  - Drag & Drop: 調整任務優先順序 (`v-draggable`)
  - Checkbox: 標記完成/未完成 (`<el-checkbox>`)
  - Status Update: 自動更新相關資料 (`watch`)
- **Task Filters 任務篩選**
  - By Status: 待處理/進行中/已完成 (`<el-radio-group>`)
  - By Priority: 高/中/低 (`<el-select>`)
  - By Due Date: 今日/本週/本月 (`<el-date-picker>`)
- **Task Actions 任務操作**
  - Assign: 指派給其他角色 (`<el-popover>`)
  - Share: 分享任務連結
  - Follow Up: 設定提醒 (`<el-time-picker>`)

### 3. Order Processing 訂單處理
- **Order Status Updates 訂單狀態更新**
  - CS Confirmation 客服確認
    - Trigger: 點擊確認按鈕 (`@click`)
    - Validation: 庫存檢查 (`async/await`)
    - Result: 更新訂單狀態 (`pinia action`)
  - Payment Verification 付款驗證
    - Auto-check: 線上付款 (`watch`)
    - Manual-check: 貨到付款 (`<el-form>`)
  - Fulfillment Process 履行流程
    - Stock Allocation 庫存分配
    - Picking List Generation 揀貨單產生
    - Shipping Label Creation 配送單產生

### 4. Inventory Control 庫存控制
- **Stock Level Monitoring 庫存水平監控**
  - Auto Alerts: 低於警戒值時通知 (`watch`)
  - Visual Indicators: 顏色編碼顯示狀態 (`computed`)
  - Trend Analysis: 顯示庫存變化趨勢
- **Stock Transfer 庫存調撥**
  - Source Selection: 來源倉庫選擇 (`v-model`)
  - Target Selection: 目標倉庫選擇 (`v-model`)
  - Quantity Validation: 數量確認 (`validator`)
  - Transfer Confirmation: 調撥確認 (`<el-dialog>`)

### 5. Procurement Operations 採購作業
- **Purchase Order Creation 採購單建立**
  - Item Selection: 商品選擇
    - Search by name/SKU (`<el-autocomplete>`)
    - Filter by supplier (`computed`)
    - Sort by various criteria (`v-sort`)
  - Quantity Input: 數量輸入
    - Box unit calculation (`computed`)
    - Minimum order validation (`validator`)
    - Cost optimization suggestions (`watch`)
  - Order Review: 訂單審核
    - Total cost calculation (`computed`)
    - Delivery time estimation
    - Supplier discount application (`watch`)

## State Management 狀態管理

### 1. Global State 全域狀態
- **User Context Store**
  ```javascript
  export const useUserStore = defineStore('user', () => {
    const currentRole = ref('customer')
    const permissions = ref([])
    const uiPreferences = ref({})
    
    return { currentRole, permissions, uiPreferences }
  })
  ```
- **System State Store**
  ```javascript
  export const useSystemStore = defineStore('system', () => {
    const loading = ref(false)
    const errors = ref([])
    const networkStatus = ref('online')
    
    return { loading, errors, networkStatus }
  })
  ```

### 2. Feature States 功能狀態
- **Order Store**
  ```javascript
  export const useOrderStore = defineStore('order', () => {
    const orderList = ref([])
    const orderDetails = ref({})
    const processingStatus = ref({})
    
    return { orderList, orderDetails, processingStatus }
  })
  ```
- **Inventory Store**
  ```javascript
  export const useInventoryStore = defineStore('inventory', () => {
    const stockLevels = ref({})
    const transactions = ref([])
    const alerts = ref([])
    
    return { stockLevels, transactions, alerts }
  })
  ```
- **Task Store**
  ```javascript
  export const useTaskStore = defineStore('task', () => {
    const taskList = ref([])
    const taskDetails = ref({})
    const progress = ref({})
    
    return { taskList, taskDetails, progress }
  })
  ```

### 3. Mock Data 模擬資料
- **Initial State**
  ```javascript
  export const useInitialState = () => {
    const resetToInitial = () => {
      // 重置所有 store 到初始狀態
    }
    const roleSpecificReset = (role) => {
      // 重置特定角色的資料
    }
    const partialReset = (module) => {
      // 重置特定模組的資料
    }
    
    return { resetToInitial, roleSpecificReset, partialReset }
  }
  ```

## Style Guide 風格指南

### 檔案命名規則
- Vue 元件: PascalCase (例: `OrderList.vue`)
- JavaScript 檔案: camelCase (例: `useOrderList.js`)
- 樣式檔案: kebab-case (例: `order-list.scss`)
- 常數檔案: camelCase (例: `orderStatus.js`)

### 目錄命名規則
- 全部使用 kebab-case
- 模組目錄使用單數形式
- 元件目錄使用複數形式

### 匯入順序
```javascript
// 1. Vue 相關
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 2. 元件匯入
import BaseButton from '@/components/base/BaseButton.vue'
import OrderList from './components/OrderList.vue'

// 3. 組合式函數
import { useOrderList } from './composables/useOrderList'

// 4. 常數和工具函數
import { ORDER_STATUS } from '@/constants'
import { formatDate } from '@/utils'
```

## 特別說明

### 1. 模組化設計
- 每個功能模組都是獨立的，包含自己的元件、組合式函數
- 模組間通過 Pinia store 進行狀態共享
- 共用元件放在根級的 `components` 目錄

### 2. 狀態管理
- 全域狀態放在根級的 `stores` 目錄
- 模組狀態放在 `stores/modules` 目錄
- 使用 Pinia 的組合式 API 風格

### 3. 路由管理
- 路由配置按模組拆分
- 使用路由懶加載優化首次載入速度
- 實作路由守衛處理權限控制

### 4. 模擬資料
- 初始資料放在 `mock/data` 目錄
- API 模擬放在 `mock/api` 目錄

---
*Note: This technical specification will be updated as development progresses.*
*備註：此技術規格說明將隨著開發進度更新。* 